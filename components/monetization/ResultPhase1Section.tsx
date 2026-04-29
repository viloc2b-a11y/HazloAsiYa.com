'use client'

import { useEffect, useRef } from 'react'
import UpsellButton from '@/components/monetization/UpsellButton'
import EmailCapture from '@/components/monetization/EmailCapture'
import type { Phase1ProductKey } from '@/lib/payment-products'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics-events'
import { UPSELL_COPY_EXPERIMENT_ID, useAbVariant } from '@/hooks/useAbVariant'

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
 * A/B copy revisión express: `NEXT_PUBLIC_AB_UPSELL_ACTIVE=true` + ver `docs/ab-test-upsell.md`.
 */
export default function ResultPhase1Section({ funnelId, tramiteLabel, eligible, missingCount }: Props) {
  const { variant, assignmentReady } = useAbVariant(UPSELL_COPY_EXPERIMENT_ID)
  const upsellShownRef = useRef(false)

  useEffect(() => {
    if (!eligible) return
    trackFunnelEvent(FUNNEL_EVENTS.RESULT_ELIGIBLE, { funnel: funnelId })
  }, [eligible, funnelId])

  useEffect(() => {
    if (!eligible || !assignmentReady || upsellShownRef.current) return
    upsellShownRef.current = true
    trackFunnelEvent(FUNNEL_EVENTS.UPSELL_SHOWN, {
      variant,
      experiment: UPSELL_COPY_EXPERIMENT_ID,
      tramite: funnelId,
      placement: 'result_phase1',
    })
  }, [eligible, assignmentReady, variant, funnelId])

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
            <UpsellButton productKey={kit} placement="result_kit_primary" funnelId={funnelId} />
            <p className="text-sm text-gray-600 pt-2 border-t border-cream">
              O pide una revisión express de tu paquete documental antes de enviar:
            </p>
            <UpsellButton
              productKey="revisionExpress"
              placement="result_express_secondary"
              funnelId={funnelId}
              variant={variant}
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
              variant={variant}
            />
          </>
        )}
      </div>
    </div>
  )
}
