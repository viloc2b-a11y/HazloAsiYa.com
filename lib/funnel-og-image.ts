import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_OG = '/images/og/default-og.jpg' as const

/**
 * Ruta pública de OG para un funnel: `{slug}-og.jpg` si existe en `public/images/og/`,
 * si no `default-og.jpg` (evaluado en build / servidor Node).
 */
export function resolvedFunnelOgImageUrl(slug: string): string {
  const file = path.join(process.cwd(), 'public', 'images', 'og', `${slug}-og.jpg`)
  if (fs.existsSync(file)) {
    return `/images/og/${slug}-og.jpg`
  }
  return DEFAULT_OG
}
