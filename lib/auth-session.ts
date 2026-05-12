/**
 * Keeps `haya_user` (localStorage) in sync with Supabase Auth for the static-export app.
 *
 * Checkout, dashboard, and Topbar read `haya_user` via static-backend. After email/password
 * login through Supabase, `authSupabase` does not write that key — we mirror the session here.
 * After a magic-link redirect, `getSession()` hydrates the same shape so checkout keeps working.
 */
import type { StaticUser } from '@/lib/static-backend'
import { getStoredUser, setStoredUser } from '@/lib/static-backend'
import type { SupabaseUser } from '@/lib/supabase-backend'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export const HAYA_AUTH_CHANGED = 'haya-auth-changed'

export function emitAuthChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(HAYA_AUTH_CHANGED))
}

/** Persist Supabase Auth user into `haya_user` (same shape as authStatic). */
export function persistAfterSupabaseAuth(user: SupabaseUser) {
  if (typeof window === 'undefined') return
  const existing = getStoredUser()
  const email = user.email.trim().toLowerCase()
  const merged: StaticUser = {
    id: user.id,
    email,
    name: user.name || existing?.name || email.split('@')[0],
    plan: user.plan || existing?.plan || 'free',
    purchasedAt: user.purchasedAt ?? existing?.purchasedAt,
  }
  setStoredUser(merged)
  emitAuthChanged()
}

/**
 * If Supabase is configured and the browser has a session (password session or magic link),
 * copy it into `haya_user` so existing flows (Square checkout, dashboard) see the user.
 */
export async function hydrateLocalUserFromSupabase(): Promise<boolean> {
  if (typeof window === 'undefined' || !isSupabaseConfigured()) return false
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const {
      data: { session },
      error: sessErr,
    } = await supabase.auth.getSession()
    if (sessErr || !session?.user?.email) return false

    const uid = session.user.id
    const email = session.user.email.trim().toLowerCase()
    const meta = session.user.user_metadata as { name?: string } | undefined
    let name = meta?.name || email.split('@')[0]
    let plan = 'free'

    const { data: profile, error: profErr } = await supabase
      .from('users')
      .select('name, plan')
      .eq('id', uid)
      .maybeSingle()

    if (!profErr && profile) {
      if (typeof profile.name === 'string' && profile.name.trim()) name = profile.name
      if (typeof profile.plan === 'string' && profile.plan) plan = profile.plan
    }

    const existing = getStoredUser()
    const merged: StaticUser = {
      id: uid,
      email,
      name: name || email.split('@')[0],
      plan: plan || existing?.plan || 'free',
      purchasedAt: existing?.purchasedAt,
    }
    setStoredUser(merged)
    emitAuthChanged()
    return true
  } catch {
    return false
  }
}

/** Sign out Supabase (if any) and clear `haya_user`. */
export async function logoutClient(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      await createClient().auth.signOut()
    } catch {
      /* ignore */
    }
  }
  setStoredUser(null)
  emitAuthChanged()
}
