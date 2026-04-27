import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendLeadNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, zip, funnel } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('leads').insert({
      name, phone, zip, funnel,
      user_id: user?.id || null,
    })

    await supabase.from('events').insert({
      user_id: user?.id || null,
      event:   'lead_submitted',
      funnel,
      data:    { name, zip },
    })

    // Notify team
    await sendLeadNotification({ name, phone, zip, funnel }).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Lead error:', err)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
