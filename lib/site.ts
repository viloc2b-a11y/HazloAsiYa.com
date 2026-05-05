import type { FunnelId } from '@/data/funnels'
import { FUNNEL_ORDER, isValidFunnelId } from '@/data/funnels'

/** Canonical production host (www). Use NEXT_PUBLIC_APP_URL in deploy env — default avoids apex/pages.dev en sitemap/robots. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://www.hazloasiya.com'
).replace(/\/$/, '')

export function withTrailingSlash(path: string): string {
  if (!path || path === '/') return '/'
  const p = path.startsWith('/') ? path : `/${path}`
  return p.endsWith('/') ? p : `${p}/`
}

export function absoluteUrl(path: string): string {
  const tail = withTrailingSlash(path)
  if (tail === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${tail}`
}

/**
 * Mismo conjunto y orden que `FUNNEL_ORDER` en `data/funnels.ts` (landings con fuente oficial + OG).
 */
export const MONEY_PAGE_OG_SLUGS: readonly FunnelId[] = FUNNEL_ORDER

export type MoneyPageOgSlug = FunnelId

export function isMoneyPageOgSlug(id: string): id is MoneyPageOgSlug {
  return isValidFunnelId(id)
}
