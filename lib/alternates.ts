import type { Metadata } from 'next'
import { absoluteUrl, withTrailingSlash } from '@/lib/site'

/**
 * Canonical relativo (con trailing slash) + hreflang es-US y x-default (absolutas, sin query).
 * Uso: combinar con metadataBase en root layout.
 */
export function alternatesForPath(path: string): NonNullable<Metadata['alternates']> {
  const normalized =
    !path || path === '/'
      ? '/'
      : withTrailingSlash(path.startsWith('/') ? path : `/${path}`)
  const abs = absoluteUrl(normalized)
  return {
    canonical: normalized,
    languages: {
      'es-US': abs,
      'x-default': abs,
    },
  }
}
