import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { generateLicenseKey, getExpiryDate } from '../../../../lib/license'

// 驗證 LemonSqueezy Webhook 簽名
function verifySignature(body, signature) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('hex')
  return digest === signature
}

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('x-signature')

  // 驗證請求確實來自 LemonSqueezy
  if (!verifySignature(body, signature)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = JSON.parse(body)
  const eventName = payload.meta?.event_name

  // 只處理訂單完成事件
  if (eventName !== 'order_created' && eventName !== 'subscription_created') {
    return new Response('OK', { status: 200 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 取得購買資訊
  const orderData = payload.data?.attributes
  const email = orderData?.user_email || orderData?.customer_email
  const productName = orderData?.first_order_item?.product_name || ''
  const plan = productName.includes('年') ? 'yearly' : 'monthly'
  const orderId = payload.data?.id?.toString()

  if (!email) {
    return new Response('No email', { status: 400 })
  }

  // 產生唯一授權碼
  let licenseKey = generateLicenseKey()

  // 確保不重複
  let attempts = 0
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('licenses')
      .select('id')
      .eq('license_key', licenseKey)
      .single()
    if (!existing) break
    licenseKey = generateLicenseKey()
    attempts++
  }

  // 寫入資料庫
  const { error } = await supabase.from('licenses').insert({
    license_key: licenseKey,
    plan: plan,
    is_active: true,
    email: email,
    expires_at: getExpiryDate(plan),
    lemonsqueezy_order_id: orderId,
  })

  if (error) {
    console.error('DB insert error:', error)
    return new Response('DB Error', { status: 500 })
  }

  // 發送授權碼到用戶信箱（透過 Supabase Edge Function 或直接用 SMTP）
  // 這裡先 log，你可以後續加入寄信功能
  console.log(`✅ License created: ${licenseKey} for ${email}`)

  return new Response('OK', { status: 200 })
}
