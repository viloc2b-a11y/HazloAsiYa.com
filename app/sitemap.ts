import { MetadataRoute } from 'next'
import { FUNNEL_ORDER } from '@/data/funnels'
import { getPublishedGuideSlugs } from '@/lib/guides-fs'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/site'

const GEO_PATHS = ['/snap/texas/', '/medicaid/texas/', '/itin/houston/', '/id/texas/'] as const

/** Fecha de última modificación al construir el sitio (export estático). */
const LASTMOD = new Date()

/**
 * Rutas excluidas del sitemap (equivalente a excludedRoutes en Astro):
 * /form/**, /result/**, /api/** — no son páginas índice y/o no deben indexarse.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const funnelPages = FUNNEL_ORDER.map(id => ({
    url: absoluteUrl(`/${id}`),
    lastModified: LASTMOD,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const geoPages = GEO_PATHS.map(path => ({
    url: absoluteUrl(path),
    lastModified: LASTMOD,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const guiaHub = {
    url: absoluteUrl('/guias'),
    lastModified: LASTMOD,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }

  const guiaPages = getPublishedGuideSlugs().map((slug) => ({
    url: absoluteUrl(`/guias/${slug}`),
    lastModified: LASTMOD,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const legalExtras = [
    { url: absoluteUrl('/precios/'), lastModified: LASTMOD, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: absoluteUrl('/mis-datos/'), lastModified: LASTMOD, changeFrequency: 'yearly' as const, priority: 0.25 },
    { url: absoluteUrl('/no-vender-mis-datos/'), lastModified: LASTMOD, changeFrequency: 'yearly' as const, priority: 0.25 },
  ]

  return [
    { url: `${SITE_ORIGIN}/`, lastModified: LASTMOD, changeFrequency: 'daily' as const, priority: 1 },
    { url: absoluteUrl('/terms/'), lastModified: LASTMOD, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: absoluteUrl('/privacy/'), lastModified: LASTMOD, changeFrequency: 'yearly' as const, priority: 0.3 },
    ...legalExtras,
    {
      url: absoluteUrl('/sobre-nosotros'),
      lastModified: LASTMOD,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    guiaHub,
    ...guiaPages,
    ...funnelPages,
    ...geoPages,
  ]
}
