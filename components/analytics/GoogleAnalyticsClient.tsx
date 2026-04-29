'use client'

import { useEffect } from 'react'
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    __hayaGa4Loaded?: boolean
  }
}

/**
 * Carga gtag.js y configura GA4 solo cuando analyticsAllowed.
 * Requiere Script beforeInteractive en layout que define dataLayer + gtag + consent default denied.
 */
export default function GoogleAnalyticsClient() {
  const { analyticsAllowed, marketingAllowed } = useAnalyticsConsent()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return
    const gtag = window.gtag
    if (typeof gtag !== 'function') return

    const adGranted = marketingAllowed ? 'granted' : 'denied'

    if (!analyticsAllowed) {
      if (window.__hayaGa4Loaded) {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        })
      }
      return
    }

    const applyConsentUpdate = () => {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: adGranted,
        ad_user_data: adGranted,
        ad_personalization: adGranted,
      })
    }

    if (window.__hayaGa4Loaded) {
      applyConsentUpdate()
      return
    }

    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    s.onload = () => {
      window.__hayaGa4Loaded = true
      gtag('js', new Date())
      applyConsentUpdate()
      gtag('config', measurementId, {
        send_page_view: true,
        anonymize_ip: true,
      })
    }
    document.head.appendChild(s)
  }, [analyticsAllowed, marketingAllowed, measurementId])

  return null
}
