'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { isValidKeyFormat } from '../../lib/license'

export default function ActivatePage() {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleActivate = async (e) => {
    e.preventDefault()
    const trimmedKey = key.trim().toUpperCase()
    if (!isValidKeyFormat(trimmedKey)) {
      setError('授權碼格式不正確，格式應為 KM-XXXX-XXXX-XXXX')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // 查詢授權碼
    const { data: license, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', trimmedKey)
      .single()

    if (fetchError || !license) {
      setError('授權碼無效，請確認碼是否正確')
      setLoading(false)
      return
    }

    if (!license.is_active) {
      setError('此授權碼已停用或已過期')
      setLoading(false)
      return
    }

    if (license.user_id && license.user_id !== user.id) {
      setError('此授權碼已被其他帳號使用')
      setLoading(false)
      return
    }

    // 綁定授權碼到此用戶
    const { error: updateError } = await supabase
      .from('licenses')
      .update({ user_id: user.id })
      .eq('license_key', trimmedKey)

    if (updateError) {
      setError('啟用失敗，請稍後再試')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/dashboard" style={{ color: '#0f1f3d', fontWeight: 900, fontSize: '20px' }}>🏡 Kmoji</Link>
        </div>

        <div className="card" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a', marginBottom: '12px' }}>授權啟用成功！</h2>
              <p style={{ color: '#64748b' }}>正在前往完整內容，請稍候...</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>🔑 輸入授權碼</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>
                付費完成後，我們會將授權碼寄送至您的電子信箱。輸入後即可解鎖完整內容。
              </p>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '14px' }}>⚠️ {error}</div>
              )}

              <form onSubmit={handleActivate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>授權碼（格式：KM-XXXX-XXXX-XXXX）</label>
                  <input
                    type="text"
                    value={key}
                    onChange={e => setKey(e.target.value.toUpperCase())}
                    placeholder="KM-XXXX-XXXX-XXXX"
                    style={{ fontFamily: 'monospace', fontSize: '18px', letterSpacing: '2px', textAlign: 'center' }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%', fontSize: '15px', padding: '13px' }}>
                  {loading ? '驗證中...' : '🔓 啟用授權碼'}
                </button>
              </form>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>
                💡 <strong>如何取得授權碼？</strong><br />
                選擇付費方案後，完成付款，授權碼會自動寄送至您的信箱。沒收到？請聯繫客服。
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <Link href="/dashboard" style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>回到首頁</Link>
                <a href="mailto:support@kmoji.com" style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>聯繫客服</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
