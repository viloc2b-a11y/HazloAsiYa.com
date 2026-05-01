export type AnalyticsDevice = 'mobile' | 'desktop'

export function getAnalyticsDevice(): AnalyticsDevice {
  if (typeof navigator === 'undefined') return 'desktop'
  return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
}

export function gtagEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', eventName, params)
}
