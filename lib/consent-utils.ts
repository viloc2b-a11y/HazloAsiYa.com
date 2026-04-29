/**
 * Consentimiento analytics / marketing — una sola fuente de verdad.
 * La lógica vive en readConsent() (cookie-consent); aquí solo helpers y el hook.
 */

import { readConsent } from '@/lib/cookie-consent'

/** Uso síncrono fuera de React (p. ej. trackFunnelEvent). SSR: siempre false. */
export function isAnalyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false
  const c = readConsent()
  if (!c) return false
  return c.value.analytics === true
}

export function isMarketingAllowed(): boolean {
  if (typeof window === 'undefined') return false
  const c = readConsent()
  if (!c) return false
  return c.value.marketing === true
}
