import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { action, email, password, name } = await req.json()
  const supabase = await createClient()

  if (action === 'signup') {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    if (data.user) {
      // Create user profile
      const admin = createAdminClient()
      await admin.from('users').insert({
        id:    data.user.id,
        email: data.user.email,
        name:  name || email.split('@')[0],
        plan:  'free',
      })

      // Send welcome email
      await sendWelcomeEmail({ to: email, name: name || email.split('@')[0] }).catch(console.error)
    }
    return NextResponse.json({ user: data.user })
  }

  if (action === 'login') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ user: data.user })
  }

  if (action === 'logout') {
    await supabase.auth.signOut()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
