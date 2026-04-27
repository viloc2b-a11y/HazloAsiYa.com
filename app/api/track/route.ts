import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { event, funnel, data } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('events').insert({
      user_id: user?.id || null,
      event,
      funnel:  funnel || null,
      data:    data || {},
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
