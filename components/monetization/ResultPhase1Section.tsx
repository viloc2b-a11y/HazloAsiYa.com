'use client'

import { useEffect } from 'react'
import UpsellButton from '@/components/monetization/UpsellButton'
import EmailCapture from '@/components/monetization/EmailCapture'
import type { Phase1ProductKey } from '@/lib/payment-products'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'

type Props = {
  funnelId: string
  tramiteLabel: string
  eligible: boolean
  missingCount: number
}

function pickPrimaryKit(funnelId: string, highConfidence: boolean): Phase1ProductKey | null {
  if (!highConfidence) return null
  if (funnelId === 'snap') return 'kitSnap'
  if (funnelId === 'itin') return 'kitItin'
  return null
}

/**
 * Monetización Fase 1 solo tras resultado: sin upsell en resultados negativos ni antes del valor.
 */
export default function ResultPhase1Section({ funnelId, tramiteLabel, eligible, missingCount }: Props) {
  useEffect(() => {
    if (!eligible) return
    trackFunnelEvent(FUNNEL_EVENTS.RESULT_ELIGIBLE, { funnel: funnelId })
    trackFunnelEvent(FUNNEL_EVENTS.UPSELL_SHOWN, { funnel: funnelId })
  }, [eligible, funnelId])

  if (!eligible) return null

  const highConfidence = missingCount <= 2
  const kit = pickPrimaryKit(funnelId, highConfidence)

  return (
    <div className="space-y-6 pt-2">
      <EmailCapture funnelId={funnelId} tramiteLabel={tramiteLabel} />

      <div className="rounded-2xl border border-green/25 bg-green/5 p-6 space-y-4">
        <h2 className="font-serif text-xl text-navy">¿Quieres ir más seguro?</h2>
        {kit ? (
          <>
            <p className="text-sm text-gray-700 leading-relaxed">
              Descarga la guía completa con documentos y pasos orientativos para tu caso.
            </p>
            <UpsellButton
              productKey={kit}
              placement="result_kit_primary"
              funnelId={funnelId}
            />
            <p className="text-sm text-gray-600 pt-2 border-t border-cream">
              O pide una revisión express de tu paquete documental antes de enviar:
            </p>
            <UpsellButton
              productKey="revisionExpress"
              placement="result_express_secondary"
              funnelId={funnelId}
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 leading-relaxed">
              Revisa que tengas todo en orden antes de enviar tu solicitud a la agencia.
            </p>
            <UpsellButton
              productKey="revisionExpress"
              placement="result_express"
              funnelId={funnelId}
              supportText="Una segunda mirada educativa sobre tu checklist puede evitar retrabajo."
            />
          </>
        )}
      </div>
    </div>
  )
}
