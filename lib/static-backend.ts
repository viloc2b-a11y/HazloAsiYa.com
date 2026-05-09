/**
 * static-backend.ts
 * Capa de abstracción del backend para el cliente estático.
 *
 * ARQUITECTURA:
 * - Hoy: localStorage + Cloudflare Functions (Square, Mailchimp, OpenAI).
 * - Futuro: reemplazar authStatic() y checkoutStatic() con llamadas a Supabase
 *   sin cambiar los componentes que consumen estas funciones.
 *
 * FIX #2: ID de usuario determinístico por email (no aleatorio) para que
 *   el mismo usuario tenga el mismo ID en distintos dispositivos/sesiones.
 * FIX #3: Persistencia robusta post-pago: guardar el plan en localStorage
 *   inmediatamente antes de redirigir a Square, y recuperarlo en el retorno.
 */

import type { CheckoutProductId } from '@/lib/payment-products'
import { trackFunnelEvent } from '@/lib/analytics-events'

export type StaticUser = {
  id: string
  email: string
  name?: string
  /** 'free' | 'main' | 'annual' | 'assisted' | 'revisionExpress' | 'kitSnap' | 'kitItin' */
  plan?: string
  /** Timestamp ISO de la última compra */
  purchasedAt?: string
}

// ── Storage helpers ────────────────────────────────────────────────────────────

const USER_KEY = 'haya_user'
const PENDING_KEY = 'haya_pending_checkout'
const PLAN_BACKUP_KEY = 'haya_plan_backup'

export function getStoredUser(): StaticUser | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StaticUser
  } catch {
    return null
  }
}

export function setStoredUser(user: StaticUser | null) {
  if (typeof window === 'undefined') return
  if (!user) {
    window.localStorage.removeItem(USER_KEY)
  } else {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

/**
 * FIX #2: ID determinístico basado en el email (djb2 hash).
 * Garantiza que el mismo email siempre produce el mismo userId,
 * independientemente del dispositivo o sesión.
 */
function deterministicId(email: string): string {
  const em = email.trim().toLowerCase()
  let h = 5381
  for (let i = 0; i < em.length; i++) {
    h = ((h << 5) + h) ^ em.charCodeAt(i)
    h = h >>> 0 // unsigned 32-bit
  }
  return `u_${h.toString(36)}`
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export async function authStatic(args: {
  action: 'login' | 'signup' | 'logout'
  email?: string
  password?: string
  name?: string
}) {
  if (args.action === 'logout') {
    setStoredUser(null)
    return { ok: true as const }
  }

  if (!args.email?.trim()) return { ok: false as const, error: 'Email requerido' }

  const email = args.email.trim().toLowerCase()

  // FIX #2: ID determinístico — mismo email = mismo ID siempre
  const id = deterministicId(email)

  // Si ya existe un usuario con ese email, preservar su plan
  const existing = getStoredUser()
  const plan = existing?.email?.toLowerCase() === email ? (existing.plan ?? 'free') : 'free'

  const user: StaticUser = {
    id,
    email,
    name: args.name || existing?.name || email.split('@')[0],
    plan,
    purchasedAt: existing?.purchasedAt,
  }

  setStoredUser(user)
  return { ok: true as const, user }
}

// ── Checkout ───────────────────────────────────────────────────────────────────

export async function checkoutStatic(args: {
  productId: CheckoutProductId
  funnelId?: string
  /** Correo obligatorio para Square. Si hay sesión, se usa la del usuario. */
  userEmail?: string
  /** Ruta de retorno tras pago (debe empezar por `/`). */
  returnPath?: string
}) {
  let user = getStoredUser()

  if (!user && args.userEmail?.trim()) {
    const email = args.userEmail.trim().toLowerCase()
    // FIX #2: ID determinístico para usuarios guest también
    user = { id: deterministicId(email), email, plan: 'free' }
    setStoredUser(user)
  }

  if (!user) {
    return {
      ok: false as const,
      error: 'Introduce tu correo o inicia sesión para continuar al pago',
    }
  }

  const email = user.email?.trim()
  if (!email) return { ok: false as const, error: 'Se requiere un correo electrónico para el pago' }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  const url = base ? `${base}/api/checkout` : '/api/checkout'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: args.productId,
      userId: user.id,
      email,
      funnelId: args.funnelId,
      returnPath: args.returnPath,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false as const, error: data?.error || 'No se pudo iniciar el pago' }

  if (data?.checkoutUrl) {
    // FIX #3: Guardar el plan pendiente en AMBOS storages antes de redirigir.
    // Si el usuario cierra la pestaña y vuelve, el plan se recupera igualmente.
    const pending = {
      productId: args.productId,
      funnelId: args.funnelId || '',
      userId: user.id,
      email,
      initiatedAt: new Date().toISOString(),
    }
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    } catch { /* ignore */ }
    try {
      // Backup en localStorage por si sessionStorage se pierde
      localStorage.setItem(PLAN_BACKUP_KEY, JSON.stringify(pending))
    } catch { /* ignore */ }

    window.location.href = data.checkoutUrl
    return { ok: true as const, redirected: true as const }
  }

  return { ok: false as const, error: 'Respuesta inválida del checkout' }
}

/**
 * FIX #3: Recuperar y aplicar el plan después del retorno de Square.
 * Llamar en el useEffect de la página de resultado cuando ?paid=1.
 * Busca en sessionStorage primero, luego en localStorage como fallback.
 */
export function applyPendingPlan(): { applied: boolean; productId?: string } {
  if (typeof window === 'undefined') return { applied: false }

  let pending: { productId?: string; funnelId?: string; userId?: string; email?: string } | null = null

  // Intentar sessionStorage primero
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (raw) pending = JSON.parse(raw)
  } catch { /* ignore */ }

  // Fallback a localStorage si sessionStorage estaba vacío
  if (!pending) {
    try {
      const raw = localStorage.getItem(PLAN_BACKUP_KEY)
      if (raw) {
        const backup = JSON.parse(raw)
        // Solo usar el backup si es reciente (menos de 2 horas)
        const age = Date.now() - new Date(backup.initiatedAt || 0).getTime()
        if (age < 2 * 60 * 60 * 1000) pending = backup
      }
    } catch { /* ignore */ }
  }

  if (!pending?.productId) return { applied: false }

  // Aplicar el plan al usuario actual
  const user = getStoredUser()
  if (user) {
    user.plan = productIdToPlan(pending.productId)
    user.purchasedAt = new Date().toISOString()
    setStoredUser(user)
  }

  // Limpiar ambos storages
  try { sessionStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
  try { localStorage.removeItem(PLAN_BACKUP_KEY) } catch { /* ignore */ }

  return { applied: true, productId: pending.productId }
}

export function productIdToPlan(productId: string): string {
  const map: Record<string, string> = {
    main: 'main',
    annual: 'annual',
    assisted: 'assisted',
    revisionExpress: 'revisionExpress',
    kitSnap: 'kitSnap',
    kitItin: 'kitItin',
  }
  return map[productId] ?? productId
}

// ── Events ─────────────────────────────────────────────────────────────────────

export async function trackEvent(args: { event: string; funnel?: string; data?: unknown }) {
  const extra =
    args.data && typeof args.data === 'object' && !Array.isArray(args.data)
      ? (args.data as Record<string, unknown>)
      : {}
  trackFunnelEvent(args.event, { funnel: args.funnel, ...extra })
}

// ── Lead capture ───────────────────────────────────────────────────────────────

/**
 * Envía un lead al endpoint de Mailchimp vía /api/subscribe-email.
 * Si el endpoint no está disponible, guarda en localStorage como fallback.
 */
export async function submitLeadStatic(args: {
  name: string
  phone: string
  zip?: string
  funnel: string
  email?: string
}) {
  // Si hay email, intentar suscribir a Mailchimp
  if (args.email?.trim()) {
    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
      const url = base ? `${base}/api/subscribe-email` : '/api/subscribe-email'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: args.email.trim(),
          name: args.name,
          funnel: args.funnel,
          source: 'lead_capture',
        }),
      })
      if (res.ok) {
        trackFunnelEvent('lead_submitted', { funnel: args.funnel, source: 'mailchimp' })
        return { ok: true as const }
      }
    } catch { /* fallback */ }
  }

  // Fallback: guardar en localStorage para procesar después
  try {
    const leads = JSON.parse(localStorage.getItem('haya_leads') || '[]')
    leads.push({ ...args, submittedAt: new Date().toISOString() })
    localStorage.setItem('haya_leads', JSON.stringify(leads.slice(-50))) // max 50
    trackFunnelEvent('lead_submitted', { funnel: args.funnel, source: 'local_fallback' })
  } catch { /* ignore */ }

  return { ok: true as const }
}

// ── AI Result ──────────────────────────────────────────────────────────────────

export type DemoResult = ReturnType<typeof generateResultStatic>

export async function generateResultClient(args: {
  funnelId: string
  formData: Record<string, unknown>
}): Promise<DemoResult> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  const path = '/api/eligibility'
  const url = base ? `${base}${path}` : path

  const formStrings: Record<string, string> = {}
  for (const [k, v] of Object.entries(args.formData)) {
    if (v !== undefined && v !== null) formStrings[k] = String(v)
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ funnelId: args.funnelId, formData: formStrings }),
    })
    if (res.ok) {
      const data = (await res.json()) as DemoResult
      if (data?.headline && Array.isArray(data.steps)) return data
    }
  } catch {
    /* fall through to static result */
  }

  return generateResultStatic(args)
}

export function generateResultStatic(args: { funnelId: string; formData: Record<string, unknown> }) {
  const { funnelId } = args
  return {
    eligible: true,
    headline: `Hazlo así: tu plan para ${funnelId} está listo`,
    subheadline: 'Resultado basado en tus respuestas',
    haveItems: ['Tu información básica', 'Tu dirección', 'Tu correo electrónico'],
    missingItems: ['Identificación válida', 'Comprobante de domicilio', 'Comprobante de ingresos'],
    steps: [
      'Reúne identificación, domicilio e ingresos.',
      'Revisa los requisitos oficiales del estado/condado.',
      'Completa el formulario principal del trámite.',
      'Adjunta documentos en el orden indicado.',
      'Entrega la solicitud y guarda tu confirmación.',
      'Da seguimiento semanal y responde a cualquier carta.',
    ],
  }
}
