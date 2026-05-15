import type { FunnelId } from '@/data/funnels'
import { FUNNEL_ORDER, isValidFunnelId } from '@/data/funnels'
import { HAZLO_CANONICAL_ORIGIN, normalizeHazloOrigin } from '@/lib/canonical-origin'

function resolveRawSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') ?? ''
  /** `next build` no debe emitir canonicals a localhost aunque `.env.local` sea de desarrollo. */
  if (process.env.NODE_ENV === 'production') {
    if (!fromEnv || /localhost|127\.0\.0\.1/i.test(fromEnv)) {
      return HAZLO_CANONICAL_ORIGIN
    }
  }
  return fromEnv || HAZLO_CANONICAL_ORIGIN
}

/**
 * Host canónico del sitio (`https://hazloasiya.com` en producción; `www` se normaliza al apex).
 * Si `NEXT_PUBLIC_APP_URL` trae `www` o `http`, `normalizeHazloOrigin` unifica el origen.
 */
export const SITE_ORIGIN = normalizeHazloOrigin(resolveRawSiteOrigin())

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
