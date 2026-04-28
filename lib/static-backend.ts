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

export async function checkoutStatic(args: {
  productId: 'main' | 'annual' | 'assisted'
  funnelId?: string
}) {
  const user = getStoredUser()
  if (!user) return { ok: false as const, error: 'Inicia sesión para continuar' }

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

