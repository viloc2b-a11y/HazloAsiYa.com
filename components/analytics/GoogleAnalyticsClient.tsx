'use client'

import { useEffect, useRef } from 'react'
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Tras cargar gtag.js + config en layout (send_page_view: false), aquí solo:
 * - Consent Mode v2 update (granted/denied) según CookieBanner
 * - Primer page_view manual cuando analyticsAllowed (misma sesión, sin recargar)
 */
export default function GoogleAnalyticsClient() {
  const { analyticsAllowed, marketingAllowed } = useAnalyticsConsent()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const pageViewSentRef = useRef(false)

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return
    const gtag = window.gtag
    if (typeof gtag !== 'function') return

    const adState = marketingAllowed ? 'granted' : 'denied'

    if (!analyticsAllowed) {
      pageViewSentRef.current = false
      gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
      return
    }

    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: adState,
      ad_user_data: adState,
      ad_personalization: adState,
    })

    if (!pageViewSentRef.current) {
      gtag('event', 'page_view')
      pageViewSentRef.current = true
    }
  }, [analyticsAllowed, marketingAllowed, measurementId])

  return null
}
