/** Origen del visitante en /[funnel]/result — para segmentar en GA4. */
export type ResultViewSource = 'funnel_landing' | 'direct' | 'external' | 'internal'

/**
 * Inferido desde document.referrer: flujo normal landing/form → result vs entrada directa u otra página del sitio.
 */
export function getResultViewSource(funnelId: string): ResultViewSource {
  if (typeof window === 'undefined') return 'direct'
  const ref = document.referrer
  if (!ref) return 'direct'
  try {
    const u = new URL(ref)
    if (u.origin !== window.location.origin) return 'external'
    const path = u.pathname.replace(/\/$/, '') || '/'
    const base = `/${funnelId}`
    if (path === base || path === `${base}/form`) return 'funnel_landing'
    return 'internal'
  } catch {
    return 'direct'
  }
}
