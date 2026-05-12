'use client'

import { useEffect } from 'react'
import { hydrateLocalUserFromSupabase } from '@/lib/auth-session'

/** Runs once on app load: mirrors Supabase session → `haya_user` when applicable (e.g. magic link). */
export default function AuthHydrator() {
  useEffect(() => {
    void hydrateLocalUserFromSupabase()
  }, [])
  return null
}
