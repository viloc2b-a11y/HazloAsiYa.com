'use client'

import { useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'haz_ab_upsell'
export const AB_UPSELL_EXPERIMENT_ID = 'upsell-copy-v1' as const

function experimentActive(): boolean {
  return process.env.NEXT_PUBLIC_AB_UPSELL_ACTIVE === 'true'
}

/**
 * Variante A/B para copy del upsell "revisión express".
 * Si NEXT_PUBLIC_AB_UPSELL_ACTIVE !== 'true', siempre 'A' (sin experimento).
 */
export function useAbVariant(): { variant: 'A' | 'B'; experimentId: typeof AB_UPSELL_EXPERIMENT_ID } {
  const [variant, setVariant] = useState<'A' | 'B'>('A')

  useLayoutEffect(() => {
    if (!experimentActive()) {
      setVariant('A')
      return
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === 'A' || raw === 'B') {
        setVariant(raw)
        return
      }
      const v = Math.random() < 0.5 ? 'A' : 'B'
      localStorage.setItem(STORAGE_KEY, v)
      setVariant(v)
    } catch {
      setVariant('A')
    }
  }, [])

  return { variant, experimentId: AB_UPSELL_EXPERIMENT_ID }
}
