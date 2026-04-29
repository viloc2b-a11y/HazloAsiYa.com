'use client'

import Disclosure from '@/components/legal/Disclosure'
import type { VerifiedAffiliate } from '@/lib/affiliates'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'

type Props = {
  affiliate: VerifiedAffiliate
}

export default function AffiliateCard({ affiliate }: Props) {
  const href = affiliate.url?.trim()
  const disabled = !href

  const onClick = () => {
    if (disabled) return
    trackFunnelEvent(FUNNEL_EVENTS.AFFILIATE_CLICK, { slug: affiliate.slug })
  }

  return (
    <div className="rounded-2xl border border-cream bg-white p-5 space-y-3" data-affiliate={affiliate.slug}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Publicidad</span>
        <span className="text-xs font-mono text-gray-400">#ad</span>
      </div>
      <Disclosure variant="affiliate" />
      <h3 className="font-semibold text-navy text-sm">{affiliate.name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{affiliate.description}</p>
      {disabled ? (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Enlace de afiliado pendiente de configuración. No uses esta tarjeta en producción hasta definir{' '}
          <code className="text-[10px]">NEXT_PUBLIC_AFFILIATE_*</code> en el entorno.
        </p>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={onClick}
          className="inline-flex items-center gap-2 text-green font-semibold text-sm underline underline-offset-2 hover:text-navy"
        >
          Ver opciones y requisitos en el sitio del proveedor →
        </a>
      )}
    </div>
  )
}
