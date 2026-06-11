'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase-client'

export default function CheckoutPage() {
  const [formData, setFormData] = useState(null)
  const [formUrl, setFormUrl] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function initCheckout() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, userId: user.id })
        })
        const data = await res.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setFormUrl(data.url)
        setFormData(data.params)
      } catch (e) {
        setError('建立訂單失敗，請稍後再試')
      }
    }
    initCheckout()
  }, [])

  // 當 formData 準備好，自動提交表單
  useEffect(() => {
    if (formData && formUrl) {
      document.getElementById('ecpay-form')?.submit()
    }
  }, [formData, formUrl])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf8f3' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>訂單建立失敗</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
          <a href="/dashboard" style={{ color: '#0f1f3d', fontWeight: 700 }}>← 返回首頁</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1f3d' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>正在前往付款頁面...</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>請稍候，即將跳轉至綠界安全付款</p>

        {/* 隱藏的綠界表單，自動提交 */}
        {formData && (
          <form id="ecpay-form" method="POST" action={formUrl} style={{ display: 'none' }}>
            {Object.entries(formData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        )}
      </div>
    </div>
  )
}
