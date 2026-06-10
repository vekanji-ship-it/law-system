// 產生格式：KM-XXXX-XXXX-XXXX（英文大寫+數字）
export function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 去掉容易混淆的 O/0, I/1
  const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `KM-${segment()}-${segment()}-${segment()}`
}

// 計算到期日
export function getExpiryDate(plan) {
  const now = new Date()
  if (plan === 'yearly') {
    now.setFullYear(now.getFullYear() + 1)
  } else {
    now.setMonth(now.getMonth() + 1)
  }
  return now.toISOString()
}

// 驗證授權碼格式
export function isValidKeyFormat(key) {
  return /^KM-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)
}
