/**
 * supabase-backend.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Capa de abstracción Supabase para HazloAsíYa.
 *
 * CÓMO ACTIVAR:
 * 1. Crea un proyecto en supabase.com
 * 2. Ejecuta supabase-schema.sql en el SQL Editor de Supabase
 * 3. Configura en Cloudflare Pages (Settings → Environment Variables):
 *      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *      SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 4. En lib/static-backend.ts, reemplaza las funciones con las de este archivo.
 *
 * ARQUITECTURA:
 * - authSupabase()    → reemplaza authStatic()
 * - checkoutSupabase() → usa checkoutStatic() pero guarda en Supabase post-pago
 * - submitLeadSupabase() → reemplaza submitLeadStatic()
 * - saveDocumentSupabase() → guarda resultados del wizard en Supabase
 *
 * SEGURIDAD:
 * - Row Level Security (RLS) activado en todas las tablas
 * - Service role key SOLO en Cloudflare Functions (server-side)
 * - Anon key en el cliente (solo lectura de datos propios)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ── Tipos ──────────────────────────────────────────────────────────────────

export type SupabaseUser = {
  id: string
  email: string
  name?: string
  plan?: string
  purchasedAt?: string
}

export type SupabaseLead = {
  name: string
  phone: string
  zip?: string
  funnel: string
  email?: string
  userId?: string
}

export type SupabaseDocument = {
  userId?: string
  funnel: string
  formData: Record<string, unknown>
  result: Record<string, unknown>
}

// ── Detección de Supabase disponible ──────────────────────────────────────

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Support both legacy (ANON_KEY) and new (PUBLISHABLE_KEY) env var names
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(url && key && url.includes('supabase.co'))
}

/** Helper to get the anon/publishable key regardless of env var name */
function getAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  )
}

// ── Auth ───────────────────────────────────────────────────────────────────

/**
 * Autenticación con Supabase Auth (email + password).
 * Reemplaza authStatic() cuando Supabase esté configurado.
 *
 * ACTIVAR: En static-backend.ts, importar y usar esta función.
 *
 * @example
 * import { authSupabase, isSupabaseConfigured } from '@/lib/supabase-backend'
 * import { authStatic } from '@/lib/static-backend'
 *
 * export async function auth(args) {
 *   if (isSupabaseConfigured()) return authSupabase(args)
 *   return authStatic(args)
 * }
 */
export async function authSupabase(args: {
  action: 'login' | 'signup' | 'logout'
  email?: string
  password?: string
  name?: string
}): Promise<{ ok: boolean; user?: SupabaseUser; error?: string }> {
  // Importación dinámica para evitar errores en builds sin Supabase configurado
  let createClient: typeof import('@supabase/supabase-js').createClient
  try {
    const mod = await import('@supabase/supabase-js')
    createClient = mod.createClient
  } catch {
    return { ok: false, error: 'Supabase no está instalado. Ejecuta: npm install @supabase/supabase-js' }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = getAnonKey()
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  if (args.action === 'logout') {
    await supabase.auth.signOut()
    return { ok: true }
  }

  if (!args.email?.trim()) return { ok: false, error: 'Email requerido' }
  if (!args.password?.trim()) return { ok: false, error: 'Contraseña requerida' }

  if (args.action === 'signup') {
    const { data, error } = await supabase.auth.signUp({
      email: args.email.trim(),
      password: args.password.trim(),
      options: {
        data: { name: args.name || args.email.split('@')[0] },
      },
    })
    if (error) return { ok: false, error: error.message }
    if (!data.user) return { ok: false, error: 'No se pudo crear la cuenta' }

    return {
      ok: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: args.name || data.user.email!.split('@')[0],
        plan: 'free',
      },
    }
  }

  // Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: args.email.trim(),
    password: args.password.trim(),
  })
  if (error) return { ok: false, error: 'Email o contraseña incorrectos' }
  if (!data.user) return { ok: false, error: 'No se pudo iniciar sesión' }

  // Obtener plan del usuario desde la tabla public.users
  const { data: profile } = await supabase
    .from('users')
    .select('name, plan, plan_expires_at')
    .eq('id', data.user.id)
    .single()

  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || data.user.email!.split('@')[0],
      plan: profile?.plan || 'free',
    },
  }
}

// ── Lead capture ───────────────────────────────────────────────────────────

/**
 * Guarda un lead en Supabase (tabla public.leads).
 * Reemplaza submitLeadStatic() cuando Supabase esté configurado.
 */
export async function submitLeadSupabase(args: SupabaseLead): Promise<{ ok: boolean; error?: string }> {
  let createClient: typeof import('@supabase/supabase-js').createClient
  try {
    const mod = await import('@supabase/supabase-js')
    createClient = mod.createClient
  } catch {
    return { ok: false, error: 'Supabase no disponible' }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { error } = await supabase.from('leads').insert({
    name: args.name,
    phone: args.phone,
    zip: args.zip || null,
    funnel: args.funnel,
    user_id: args.userId || null,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// ── Guardar documento/resultado ────────────────────────────────────────────

/**
 * Guarda el resultado del wizard en Supabase (tabla public.documents).
 * Permite que el usuario acceda a su historial de trámites.
 */
export async function saveDocumentSupabase(args: SupabaseDocument): Promise<{ ok: boolean; id?: string; error?: string }> {
  let createClient: typeof import('@supabase/supabase-js').createClient
  try {
    const mod = await import('@supabase/supabase-js')
    createClient = mod.createClient
  } catch {
    return { ok: false, error: 'Supabase no disponible' }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: args.userId || null,
      funnel: args.funnel,
      form_data: args.formData,
      result: args.result,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, id: data?.id }
}

// ── Verificar compra ───────────────────────────────────────────────────────

/**
 * Verifica si un usuario tiene una compra activa para un funnel.
 * Usado en la página de resultado para desbloquear el PDF completo.
 */
export async function checkPurchaseSupabase(args: {
  email: string
  funnel?: string
}): Promise<{ paid: boolean; productId?: string }> {
  let createClient: typeof import('@supabase/supabase-js').createClient
  try {
    const mod = await import('@supabase/supabase-js')
    createClient = mod.createClient
  } catch {
    return { paid: false }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Buscar usuario por email
  const { data: user } = await supabase
    .from('users')
    .select('id, plan')
    .eq('email', args.email.toLowerCase())
    .single()

  if (!user) return { paid: false }
  if (user.plan && user.plan !== 'free') return { paid: true, productId: user.plan }

  // Verificar en tabla de compras
  let query = supabase
    .from('purchases')
    .select('product_id')
    .eq('user_id', user.id)

  if (args.funnel) {
    query = query.eq('funnel', args.funnel)
  }

  const { data: purchases } = await query.limit(1)
  if (purchases && purchases.length > 0) {
    return { paid: true, productId: purchases[0].product_id }
  }

  return { paid: false }
}

// ── Schema SQL actualizado ─────────────────────────────────────────────────

/**
 * SCHEMA ACTUALIZADO para Supabase.
 * Ejecutar en el SQL Editor de Supabase DESPUÉS del supabase-schema.sql base.
 *
 * Cambios:
 * 1. Agrega columna 'email' a la tabla purchases para búsquedas sin auth
 * 2. Agrega columna 'purchased_at' a users
 * 3. Agrega índice por email en purchases para el webhook de Square
 *
 * SQL:
 * ALTER TABLE public.users ADD COLUMN IF NOT EXISTS purchased_at timestamptz;
 * ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS email text;
 * CREATE INDEX IF NOT EXISTS idx_purchases_email ON public.purchases(email);
 * CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
 *
 * WEBHOOK DE SQUARE:
 * El webhook en functions/api/square-webhook.ts debe:
 * 1. Parsear el payment.note para extraer userId, productId, email
 * 2. Insertar en public.purchases
 * 3. Actualizar public.users SET plan = productId WHERE id = userId
 */
export const SUPABASE_MIGRATION_SQL = `
-- Migración: mejoras para integración Square + búsqueda por email
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS purchased_at timestamptz;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS email text;
CREATE INDEX IF NOT EXISTS idx_purchases_email ON public.purchases(email);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Ampliar CHECK constraint de plan para incluir productos Fase 1
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE public.users ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('free','paid_guide','annual','assisted','revisionExpress','kitSnap','kitItin'));
`
