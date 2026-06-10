'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase-client'
import DashboardClient from '../../components/DashboardClient'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)
      const { data: license } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()
      setIsPaid(!!license)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      height:'100vh',background:'#0f1f3d',color:'white',fontSize:'18px'}}>
      載入中...
    </div>
  )
  if (!user) return null
  return <DashboardClient user={user} isPaid={isPaid} plan={null} expiresAt={null} />
}
