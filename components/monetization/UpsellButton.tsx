'use client'

import { useState } from 'react'
import Disclosure from '@/components/legal/Disclosure'
import { PHASE1_PRODUCTS, type Phase1ProductKey } from '@/lib/payment-products'
import { checkoutStatic, getStoredUser } from '@/lib/static-backend'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'
import { getStoredAttribution } from '@/lib/partner-tracking'
import { UPSELL_COPY_EXPERIMENT_ID } from '@/hooks/useAbVariant'

const REVISION_EXPRESS_CTA = {
  A: 'Obtener revisión express — $12',
  B: 'Revisar mis documentos antes de enviar — $12',
} as const

type Props = {
  productKey: Phase1ProductKey
  placement: string
  funnelId: string
  /** Texto de apoyo encima del CTA (FTC: claro, sin urgencia). */
  supportText?: string
  /** Solo revisión express entra en el A/B; kits omiten o usan 'A'. */
  variant?: 'A' | 'B'
}

export default function UpsellButton({
  productKey,
  placement,
  funnelId,
  supportText,
  variant,
}: Props) {
  const p = PHASE1_PRODUCTS[productKey]
  const v = variant ?? 'A'
  const ctaLabel =
    productKey === 'revisionExpress' ? REVISION_EXPRESS_CTA[v] : p.ctaLabel

  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const user = typeof window !== 'undefined' ? getStoredUser() : null
  const needEmail = !user?.email

  const handleClick = async () => {
    if (needEmail && !email.trim()) {
      alert('Introduce tu correo para continuar al pago con Square.')
      return
    }
    trackFunnelEvent(FUNNEL_EVENTS.UPSELL_CLICK, {
      variant: v,
      experiment: UPSELL_COPY_EXPERIMENT_ID,
      product: productKey,
      placement,
      funnel: funnelId,
      tramite: funnelId,
    })
    trackFunnelEvent(FUNNEL_EVENTS.CHECKOUT_START, {
      variant: v,
      experiment: UPSELL_COPY_EXPERIMENT_ID,
      product: productKey,
      funnel: funnelId,
    })
    setBusy(true)
    const res = await checkoutStatic({
      productId: productKey,
      funnelId,
      userEmail: user?.email ?? email.trim(),
      partnerSlug: getStoredAttribution()?.partner_slug ?? null,
    })
    setBusy(false)
    if (!res.ok) alert(res.error)
  }

  return (
    <div
      className="rounded-2xl border border-cream bg-white p-5 space-y-3"
      data-track="upsell"
      data-product={productKey}
      data-placement={placement}
      data-ab-variant={v}
    >
      <Disclosure variant="paid-service" />
      {supportText && <p className="text-sm text-gray-700 leading-relaxed">{supportText}</p>}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        {needEmail && (
          <div className="flex-1">
            <label className="block text-xs font-semibold text-navy mb-1">Correo (recibo Square)</label>
            <input
              type="email"
              name="upsell_email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              placeholder="tu@correo.com"
            />
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className="btn-primary px-6 py-3 text-sm whitespace-nowrap shrink-0 disabled:opacity-60"
        >
          {busy ? 'Abriendo checkout…' : ctaLabel}
        </button>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{p.disclaimer}</p>
      <p className="text-xs text-gray-400">Pago procesado de forma segura por Square (hosted checkout).</p>
    </div>
  )
}
