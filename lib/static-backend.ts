import type { CheckoutProductId } from '@/lib/payment-products'
import { trackFunnelEvent } from '@/lib/analytics-events'

export type StaticUser = { id: string; email: string; name?: string; plan?: string }

export function getStoredUser(): StaticUser | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem('haya_user')
  if (!raw) return null
  try { return JSON.parse(raw) as StaticUser } catch { return null }
}

export function setStoredUser(user: StaticUser | null) {
  if (typeof window === 'undefined') return
  if (!user) window.localStorage.removeItem('haya_user')
  else window.localStorage.setItem('haya_user', JSON.stringify(user))
}

export async function trackEvent(args: { event: string; funnel?: string; data?: unknown }) {
  const extra =
    args.data && typeof args.data === 'object' && !Array.isArray(args.data)
      ? (args.data as Record<string, unknown>)
      : {}
  trackFunnelEvent(args.event, { funnel: args.funnel, ...extra })
  console.log('trackEvent (static)', args)
}

export async function authStatic(args: { action: 'login' | 'signup' | 'logout'; email?: string; password?: string; name?: string }) {
  if (args.action === 'logout') {
    setStoredUser(null)
    return { ok: true as const }
  }
  if (!args.email) return { ok: false as const, error: 'Email requerido' }
  const id = `local_${Math.random().toString(16).slice(2)}`
  const user: StaticUser = {
    id,
    email: args.email,
    name: args.name || args.email.split('@')[0],
    plan: 'free',
  }
  setStoredUser(user)
  return { ok: true as const, user }
}

function guestIdFromEmail(email: string): string {
  const em = email.trim().toLowerCase()
  let h = 0
  for (let i = 0; i < em.length; i++) h = (h * 31 + em.charCodeAt(i)) | 0
  return `guest_${Math.abs(h).toString(36)}`
}

export async function checkoutStatic(args: {
  productId: CheckoutProductId
  funnelId?: string
  /** Si no hay sesión, permite pagar como invitado con correo (recibo Square). */
  userEmail?: string
}) {
  let user = getStoredUser()
  if (!user && args.userEmail?.trim()) {
    const email = args.userEmail.trim()
    user = { id: guestIdFromEmail(email), email, plan: 'free' }
  }
  if (!user) return { ok: false as const, error: 'Introduce tu correo o inicia sesión para continuar al pago' }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  const url = base ? `${base}/api/checkout` : '/api/checkout'

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: args.productId,
      userId: user.id,
      userEmail: user.email,
      funnelId: args.funnelId,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { ok: false as const, error: data?.error || 'No se pudo iniciar el pago' }

  // Square hosted checkout URL
  if (data?.checkoutUrl) {
    try {
      sessionStorage.setItem(
        'haya_pending_checkout',
        JSON.stringify({ productId: args.productId, funnelId: args.funnelId || '' }),
      )
    } catch {
      /* ignore */
    }
    window.location.href = data.checkoutUrl
    return { ok: true as const, redirected: true as const }
  }

  return { ok: false as const, error: 'Respuesta inválida del checkout' }
}

export async function submitLeadStatic(args: { name: string; phone: string; zip?: string; funnel: string }) {
  console.log('lead (static)', args)
  return { ok: true as const }
}

export type DemoResult = ReturnType<typeof generateResultStatic>

export async function generateResultClient(args: {
  funnelId: string
  formData: Record<string, unknown>
}): Promise<DemoResult> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')
  const url = base ? `${base}/api/generate-result` : '/api/generate-result'

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
    /* fall through */
  }

  return generateResultStatic(args)
}

export function generateResultStatic(args: { funnelId: string; formData: Record<string, unknown> }) {
  const { funnelId } = args
  return {
    eligible: true,
    headline: `Hazlo así: tu plan para ${funnelId} está listo`,
    subheadline: 'Resultado demo (modo estático) basado en tus respuestas',
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

