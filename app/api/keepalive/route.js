import { createAdminClient } from '../../../lib/supabase-server'

export async function GET() {
  try {
    const supabase = createAdminClient()
    await supabase.from('licenses').select('id').limit(1)
    return Response.json({ ok: true, time: new Date().toISOString() })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
