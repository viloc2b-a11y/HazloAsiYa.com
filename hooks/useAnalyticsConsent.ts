'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CONSENT_EVENT,
  STORAGE_EU,
  STORAGE_US,
  readConsent,
} from '@/lib/cookie-consent'

export type AnalyticsConsentState = {
  analyticsAllowed: boolean
  marketingAllowed: boolean
}

function computeConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') {
    return { analyticsAllowed: false, marketingAllowed: false }
  }
  const c = readConsent()
  if (!c) return { analyticsAllowed: false, marketingAllowed: false }
  return {
    analyticsAllowed: c.value.analytics === true,
    marketingAllowed: c.value.marketing === true,
  }
}

/**
 * Estado de consent para analytics/marketing. SSR: siempre false.
 * Escucha storage (otras pestañas), haya-consent-updated y consentUpdated.
 */
export function useAnalyticsConsent(): AnalyticsConsentState {
  const [state, setState] = useState<AnalyticsConsentState>(() => computeConsent())

  const sync = useCallback(() => {
    setState(computeConsent())
  }, [])

  useEffect(() => {
    sync()
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_US || e.key === STORAGE_EU) sync()
    }
    const onConsent = () => sync()
    window.addEventListener('storage', onStorage)
    window.addEventListener(CONSENT_EVENT, onConsent)
    window.addEventListener('consentUpdated', onConsent)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CONSENT_EVENT, onConsent)
      window.removeEventListener('consentUpdated', onConsent)
    }
  }, [sync])

  return state
}
