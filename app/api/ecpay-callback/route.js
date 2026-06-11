import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { generateLicenseKey, getExpiryDate } from '../../../lib/license'

const HASH_KEY = process.env.ECPAY_HASH_KEY
const HASH_IV = process.env.ECPAY_HASH_IV

function verifyCheckMacValue(params) {
  const { CheckMacValue, ...rest } = params

  const sorted = Object.keys(rest).sort()
    .reduce((obj, key) => { obj[key] = rest[key]; return obj }, {})

  let str = `HashKey=${HASH_KEY}`
  for (const [key, val] of Object.entries(sorted)) {
    str += `&${key}=${val}`
  }
  str += `&HashIV=${HASH_IV}`

  str = encodeURIComponent(str).toLowerCase()
    .replace(/%20/g, '+').replace(/%21/g, '!').replace(/%28/g, '(')
    .replace(/%29/g, ')').replace(/%2a/g, '*').replace(/%2d/g, '-')
    .replace(/%2e/g, '.').replace(/%5f/g, '_')

  const computed = crypto.createHash('sha256').update(str).digest('hex').toUpperCase()
  return computed === CheckMacValue
}

export async function POST(request) {
  try {
    const body = await request.text()
    const params = Object.fromEntries(new URLSearchParams(body))

    // 驗證簽章
    if (!verifyCheckMacValue(params)) {
      console.error('ECPay signature verification failed')
      return new Response('0|ErrorMessage', { status: 200 })
    }

    const { RtnCode, CustomField1: userId, CustomField2: email, MerchantTradeNo } = params

    // RtnCode 1 = 付款成功, 800 = 定期定額授權成功
    if (RtnCode !== '1' && RtnCode !== '800') {
      console.log('Payment not successful, RtnCode:', RtnCode)
      return new Response('1|OK', { status: 200 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 檢查是否已有此訂單的授權碼（避免重複）
    const { data: existing } = await supabase
      .from('licenses')
      .select('id')
      .eq('lemonsqueezy_order_id', MerchantTradeNo)
      .maybeSingle()

    if (!existing) {
      // 產生授權碼
      const licenseKey = generateLicenseKey()

      await supabase.from('licenses').insert({
        user_id: userId || null,
        license_key: licenseKey,
        plan: 'monthly',
        is_active: true,
        email: email || null,
        expires_at: getExpiryDate('monthly'),
        lemonsqueezy_order_id: MerchantTradeNo,
      })

      console.log(`✅ License created: ${licenseKey} for ${email}`)
    } else {
      // 定期扣款成功，更新到期日
      await supabase.from('licenses')
        .update({ expires_at: getExpiryDate('monthly'), is_active: true })
        .eq('lemonsqueezy_order_id', MerchantTradeNo)

      console.log(`✅ License renewed for order: ${MerchantTradeNo}`)
    }

    return new Response('1|OK', { status: 200 })
  } catch (error) {
    console.error('Callback error:', error)
    return new Response('0|ErrorMessage', { status: 200 })
  }
}
