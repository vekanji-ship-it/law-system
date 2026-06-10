import { createClient } from '../../lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import DashboardClient from '../../components/DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 查詢此用戶是否有有效授權
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const { data: license } = await admin
    .from('licenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  const isPaid = !!license
  const plan = license?.plan || null
  const expiresAt = license?.expires_at || null

  return <DashboardClient user={user} isPaid={isPaid} plan={plan} expiresAt={expiresAt} />
}
