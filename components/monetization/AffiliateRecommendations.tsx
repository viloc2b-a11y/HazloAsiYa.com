'use client'

import { usePathname } from 'next/navigation'
import { affiliatesForPath } from '@/lib/affiliates'
import AffiliateCard from '@/components/monetization/AffiliateCard'

/**
 * Muestra solo afiliados cuya lista `pages` coincide con la ruta actual.
 */
export default function AffiliateRecommendations() {
  const pathname = usePathname() || '/'
  const list = affiliatesForPath(pathname)
  if (list.length === 0) return null

  return (
    <section className="space-y-4" aria-label="Ofertas de socios comerciales">
      <div className="text-xs font-bold tracking-widest uppercase text-gray-400">Herramientas que otras familias usan</div>
      <div className="grid gap-4 sm:grid-cols-1">
        {list.map((a) => (
          <AffiliateCard key={a.slug} affiliate={a} />
        ))}
      </div>
    </section>
  )
}
