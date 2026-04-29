/**
 * Afiliados Fase 1 — solo enlaces reales antes de producción (FTC § 5).
 * Configura NEXT_PUBLIC_AFFILIATE_* en Cloudflare Pages / .env.local.
 */

export type VerifiedAffiliate = {
  slug: 'banco-itin' | 'remesas' | 'prepago'
  name: string
  description: string
  /** URL con parámetros de afiliado; si vacío, la tarjeta no enlaza (solo texto). */
  url: string
  commission: 'CPA'
  pages: string[]
  disclosure: true
}

function pub(name: string, fallback = ''): string {
  if (typeof process === 'undefined') return fallback
  const v = process.env[name]
  return typeof v === 'string' && v.trim() ? v.trim() : fallback
}

export const AFFILIATES: VerifiedAffiliate[] = [
  {
    slug: 'banco-itin',
    name: 'Banco recomendado para cuentas con ITIN',
    description: 'Opciones para abrir cuenta con ITIN (sin SSN en muchos casos). Compara comisiones y requisitos en el sitio del banco.',
    url: pub('NEXT_PUBLIC_AFFILIATE_BANCO_ITIN', ''),
    commission: 'CPA',
    pages: ['/itin/', '/itin/houston/', '/taxes/'],
    disclosure: true,
  },
  {
    slug: 'remesas',
    name: 'Envío de dinero recomendado',
    description: 'Servicio para enviar dinero a México y Centroamérica; revisa tipo de cambio y comisiones antes de enviar.',
    url: pub('NEXT_PUBLIC_AFFILIATE_REMESAS', ''),
    commission: 'CPA',
    pages: ['/itin/', '/bank/'],
    disclosure: true,
  },
  {
    slug: 'prepago',
    name: 'Tarjeta prepago sin SSN',
    description: 'Tarjeta de débito prepago orientada a quienes aún no tienen historial de crédito en EE. UU.; lee términos y cargos.',
    url: pub('NEXT_PUBLIC_AFFILIATE_PREPAGO', ''),
    commission: 'CPA',
    pages: ['/bank/', '/snap/'],
    disclosure: true,
  },
]

export function affiliatesForPath(pathname: string): VerifiedAffiliate[] {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`
  return AFFILIATES.filter((a) => a.pages.some((prefix) => p === prefix || p.startsWith(prefix)))
}
