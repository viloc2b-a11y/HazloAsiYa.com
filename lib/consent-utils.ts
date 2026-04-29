/**
 * Helpers síncronos de consentimiento (misma lógica que cookie-consent).
 * Usar isAnalyticsAllowed en código que no puede usar el hook.
 */

export { canLoadAnalytics as isAnalyticsAllowed, canLoadMarketing as isMarketingAllowed } from '@/lib/cookie-consent'
