import { MetadataRoute } from 'next'
import { FUNNEL_ORDER } from '@/data/funnels'
import { getPublishedGuideSlugs } from '@/lib/guides-fs'
import { SITE_ORIGIN, absoluteUrl } from '@/lib/site'

const GEO_PATHS = [
  // Texas
  '/snap/texas/',
  '/medicaid/texas/',
  '/itin/houston/',
  '/id/texas/',
  '/wic/texas/',
  '/escuela/houston/',
  // California
  '/snap/california/',
  '/medicaid/california/',
  '/wic/california/',
  // Florida
  '/snap/florida/',
  '/medicaid/florida/',
  '/wic/florida/',
  // Nueva York
  '/snap/new-york/',
  '/medicaid/new-york/',
  '/wic/new-york/',
] as const

const CITY_PATHS = [
  '/ciudades/houston/',
  '/ciudades/dallas/',
  '/ciudades/san-antonio/',
  '/ciudades/los-angeles/',
  '/ciudades/miami/',
  '/ciudades/nueva-york/',
] as const

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

  const cityPages = CITY_PATHS.map(path => ({
    url: absoluteUrl(path),
    lastModified: LASTMOD,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
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

  const b2bPage = {
    url: absoluteUrl('/para-organizaciones/'),
    lastModified: LASTMOD,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }

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
    ...cityPages,
    b2bPage,
  ]
}
