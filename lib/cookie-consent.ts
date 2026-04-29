/**
 * Persistencia de consentimiento cookies (TDPSA / GDPR).
 * Los scripts de analytics deben leer getConsent() antes de cargarse.
 */

export const STORAGE_US = 'haz_cookie_consent'
export const STORAGE_EU = 'haz_gdpr_consent'

export type ConsentUS = {
  essential: true
  analytics: boolean
  marketing: boolean
  savedAt: string
}

export type ConsentEU = {
  necessary: true
  analytics: boolean
  marketing: boolean
  savedAt: string
}

export const CONSENT_EVENT = 'haya-consent-updated'

export function dispatchConsentUpdated() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CONSENT_EVENT))
  window.dispatchEvent(new Event('consentUpdated'))
}

export function readConsent():
  | { mode: 'us'; value: ConsentUS }
  | { mode: 'eu'; value: ConsentEU }
  | null {
  if (typeof window === 'undefined') return null
  try {
    const eu = localStorage.getItem(STORAGE_EU)
    if (eu) {
      const v = JSON.parse(eu) as ConsentEU
      if (v && v.necessary === true) return { mode: 'eu', value: v }
    }
    const us = localStorage.getItem(STORAGE_US)
    if (us) {
      const v = JSON.parse(us) as ConsentUS
      if (v && v.essential === true) return { mode: 'us', value: v }
    }
  } catch {
    /* ignore */
  }
  return null
}

/** Analytics (GA4, etc.) solo si consent explícito. */
export function canLoadAnalytics(): boolean {
  const c = readConsent()
  if (!c) return false
  return c.value.analytics === true
}

export function canLoadMarketing(): boolean {
  const c = readConsent()
  if (!c) return false
  return c.value.marketing === true
}
