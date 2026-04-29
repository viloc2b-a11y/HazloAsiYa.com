'use client'

import { useLayoutEffect, useState } from 'react'

/** ID del experimento de copy del CTA "revisión express" (debe coincidir con GA4). */
export const UPSELL_COPY_EXPERIMENT_ID = 'upsell-copy-v1' as const

function experimentActive(): boolean {
  return process.env.NEXT_PUBLIC_AB_UPSELL_ACTIVE === 'true'
}

export type AbVariantState = {
  variant: 'A' | 'B'
  /** `true` tras leer/asignar en `localStorage` (evita `upsell_shown` con variante equivocada). */
  assignmentReady: boolean
}

/**
 * Asignación A/B 50/50 persistida en `localStorage` bajo `haz_ab_${experimentId}`.
 * - Si `NEXT_PUBLIC_AB_UPSELL_ACTIVE !== 'true'`: siempre variante `'A'`; la clave **no** se crea.
 * - Con flag `true`, la clave solo se escribe en la primera visita que activa el experimento.
 */
export function useAbVariant(experimentId: string): AbVariantState {
  const [state, setState] = useState<AbVariantState>({
    variant: 'A',
    assignmentReady: false,
  })

  useLayoutEffect(() => {
    if (!experimentActive()) {
      setState({ variant: 'A', assignmentReady: true })
      return
    }
    try {
      const key = `haz_ab_${experimentId}`
      const stored = localStorage.getItem(key)
      if (stored === 'A' || stored === 'B') {
        setState({ variant: stored, assignmentReady: true })
        return
      }
      const assigned = Math.random() < 0.5 ? 'A' : 'B'
      localStorage.setItem(key, assigned)
      setState({ variant: assigned, assignmentReady: true })
    } catch {
      setState({ variant: 'A', assignmentReady: true })
    }
  }, [experimentId])

  return state
}
