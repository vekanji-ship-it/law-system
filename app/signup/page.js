'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase-client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` } })
    if (error) {
      setError(error.message === 'User already registered' ? '此信箱已註冊，請直接登入' : '註冊失敗，請再試一次')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ color: '#c9973a', fontWeight: 900, fontSize: '24px' }}>🏡 Kmoji</Link>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px', fontSize: '14px' }}>地政X經紀同根生</p>
        </div>

        <div className="card" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>驗證信已寄出！</h2>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
                請前往 <strong>{email}</strong> 收取驗證信，點擊連結後即可登入使用。
              </p>
              <Link href="/login" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>前往登入</Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>免費註冊</h2>
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>基本案例永久免費，隨時可升級付費版</p>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#dc2626', fontSize: '14px' }}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>電子郵件</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>密碼（至少8位）</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength="8" required />
                </div>
                <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%', fontSize: '15px', padding: '13px' }}>
                  {loading ? '建立帳號中...' : '🚀 免費建立帳號'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
                已有帳號？ <Link href="/login" style={{ color: '#0f1f3d', fontWeight: 700 }}>登入</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
