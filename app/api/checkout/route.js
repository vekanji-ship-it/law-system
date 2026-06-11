import crypto from 'crypto'

const MERCHANT_ID = process.env.ECPAY_MERCHANT_ID
const HASH_KEY = process.env.ECPAY_HASH_KEY
const HASH_IV = process.env.ECPAY_HASH_IV
const IS_TEST = process.env.ECPAY_TEST === 'true'

const ECPAY_URL = IS_TEST
  ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5'
  : 'https://payment.ecpay.com.tw/Cashier/AioCheckout/V5'

function generateCheckMacValue(params) {
  const sorted = Object.keys(params).sort()
    .reduce((obj, key) => { obj[key] = params[key]; return obj }, {})

  let str = `HashKey=${HASH_KEY}`
  for (const [key, val] of Object.entries(sorted)) {
    str += `&${key}=${val}`
  }
  str += `&HashIV=${HASH_IV}`

  str = encodeURIComponent(str).toLowerCase()
    .replace(/%20/g, '+').replace(/%21/g, '!').replace(/%28/g, '(')
    .replace(/%29/g, ')').replace(/%2a/g, '*').replace(/%2d/g, '-')
    .replace(/%2e/g, '.').replace(/%5f/g, '_')

  return crypto.createHash('sha256').update(str).digest('hex').toUpperCase()
}

export async function POST(request) {
  try {
    const { email, userId } = await request.json()

    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const tradeDate = `${now.getFullYear()}/${pad(now.getMonth()+1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const tradeNo = `KM${Date.now()}`
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    const params = {
      MerchantID: MERCHANT_ID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: '799',
      TradeDesc: '地政X經紀同根生月費版',
      ItemName: '地政X經紀同根生 月費版 x1',
      ReturnURL: `${siteUrl}/api/ecpay-callback`,
      OrderResultURL: `${siteUrl}/dashboard?payment=success`,
      ChoosePayment: 'Credit',
      EncryptType: '1',
      // 定期定額設定
      PeriodAmount: '799',
      PeriodType: 'Month',
      Frequency: '1',
      ExecTimes: '99',
      PeriodReturnURL: `${siteUrl}/api/ecpay-callback`,
      // 傳遞用戶資料
      CustomField1: userId || '',
      CustomField2: email || '',
    }

    params.CheckMacValue = generateCheckMacValue(params)

    return Response.json({ url: ECPAY_URL, params })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json({ error: '建立訂單失敗' }, { status: 500 })
  }
}
