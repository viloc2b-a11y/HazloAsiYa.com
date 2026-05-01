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

/** Funnel landing pages that should use dedicated OG images. */
export const MONEY_PAGE_OG_SLUGS = [
  'snap',
  'medicaid',
  'itin',
  'escuela',
  'wic',
  'taxes',
  'rent',
  'utilities',
] as const

export type MoneyPageOgSlug = (typeof MONEY_PAGE_OG_SLUGS)[number]

export function isMoneyPageOgSlug(id: string): id is MoneyPageOgSlug {
  return (MONEY_PAGE_OG_SLUGS as readonly string[]).includes(id)
}
