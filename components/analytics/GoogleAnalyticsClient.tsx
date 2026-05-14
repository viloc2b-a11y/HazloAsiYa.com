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
 * Tras cargar gtag.js + config en layout (send_page_view: false, lazyOnload), aquí:
 * - Espera a que `gtag` exista (el script puede llegar después del primer paint).
 * - Consent Mode v2 update (granted/denied) según CookieBanner
 * - Primer page_view manual cuando analyticsAllowed (misma sesión, sin recargar)
 */
export default function GoogleAnalyticsClient() {
  const { analyticsAllowed, marketingAllowed } = useAnalyticsConsent()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const pageViewSentRef = useRef(false)

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return

    let cancelled = false
    let pollId: ReturnType<typeof setInterval> | undefined
    let giveUpId: ReturnType<typeof setTimeout> | undefined

    const apply = () => {
      if (cancelled) return true
      const gtag = window.gtag
      if (typeof gtag !== 'function') return false

      const adState = marketingAllowed ? 'granted' : 'denied'

      if (!analyticsAllowed) {
        pageViewSentRef.current = false
        gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        })
        return true
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
      return true
    }

    if (apply()) return () => { cancelled = true }

    pollId = setInterval(() => {
      if (apply() && pollId) {
        clearInterval(pollId)
        pollId = undefined
        if (giveUpId) {
          clearTimeout(giveUpId)
          giveUpId = undefined
        }
      }
    }, 120)

    giveUpId = setTimeout(() => {
      if (pollId) clearInterval(pollId)
      pollId = undefined
    }, 25_000)

    return () => {
      cancelled = true
      if (pollId) clearInterval(pollId)
      if (giveUpId) clearTimeout(giveUpId)
    }
  }, [analyticsAllowed, marketingAllowed, measurementId])

  return null
}
