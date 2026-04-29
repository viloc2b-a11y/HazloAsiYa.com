/**
 * Eventos de embudo — GA4 solo si hay consent de analytics (CookieBanner).
 */

import { canLoadAnalytics } from '@/lib/cookie-consent'

export const FUNNEL_EVENTS = {
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  RESULT_ELIGIBLE: 'result_eligible',
  UPSELL_SHOWN: 'upsell_shown',
  UPSELL_CLICK: 'upsell_click',
  CHECKOUT_START: 'checkout_start',
  CHECKOUT_COMPLETE: 'checkout_complete',
  EMAIL_CAPTURE: 'email_capture',
  AFFILIATE_CLICK: 'affiliate_click',
} as const

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackFunnelEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!canLoadAnalytics()) return
  try {
    window.gtag?.('event', eventName, params ?? {})
  } catch {
    /* ignore */
  }
}
