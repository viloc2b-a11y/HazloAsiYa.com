import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Client — HazloAsíYa
 * Soporta formato legacy (eyJ...) y nuevo formato (sb_publishable_...) de Supabase 2025.
 * Variables de entorno:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  OR  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 */
function requirePublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Support both legacy (ANON_KEY) and new (PUBLISHABLE_KEY) env var names
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !anonKey) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
    )
  }
  return { url, anonKey }
}

export const createClient = () => {
  const { url, anonKey } = requirePublicSupabaseEnv()
  return createBrowserClient(url, anonKey)
}

/**
 * isSupabaseConfigured — detecta si Supabase está disponible en el entorno actual.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(url && key && url.includes('supabase.co'))
}
