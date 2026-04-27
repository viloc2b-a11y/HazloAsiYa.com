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

export async function checkoutStatic(args: { productId: 'main' | 'annual' | 'assisted' }) {
  const user = getStoredUser()
  if (!user) return { ok: false as const, error: 'Inicia sesión para continuar' }
  const plan = args.productId === 'annual' ? 'annual' : args.productId === 'assisted' ? 'assisted' : 'paid_guide'
  const updated = { ...user, plan }
  setStoredUser(updated)
  return { ok: true as const, user: updated }
}

export async function submitLeadStatic(args: { name: string; phone: string; zip?: string; funnel: string }) {
  console.log('lead (static)', args)
  return { ok: true as const }
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

