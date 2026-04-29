'use client'

import { useEffect, useState } from 'react'

/** Estados miembros UE + Islandia, Liechtenstein, Noruega (EEE) para fines de consentimiento reforzado. */
const EU_EEA = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
])

export type UseIsEUReturn = { isEU: boolean; country: string | null; ready: boolean }

/**
 * Detecta si el visitante probablemente está en UE/EEE.
 * 1) Cookie `haya_cf_country=XX` (si la inyecta un Worker/edge).
 * 2) Respuesta texto de `/cdn-cgi/trace` en Cloudflare (loc=XX).
 * 3) Sin señal: no asumir UE (isEU false).
 */
export function useIsEU(): UseIsEUReturn {
  const [state, setState] = useState<UseIsEUReturn>({ isEU: false, country: null, ready: false })

  useEffect(() => {
    let cancelled = false

    const fromCookie = (): string | null => {
      if (typeof document === 'undefined') return null
      const m = document.cookie.match(/(?:^|;\s*)haya_cf_country=([A-Za-z]{2})/)
      return m ? m[1].toUpperCase() : null
    }

    const applyCountry = (code: string | null) => {
      if (cancelled || !code) {
        setState({ isEU: false, country: code, ready: true })
        return
      }
      const upper = code.toUpperCase()
      setState({ isEU: EU_EEA.has(upper), country: upper, ready: true })
    }

    const cookieCode = fromCookie()
    if (cookieCode) {
      applyCountry(cookieCode)
      return () => {
        cancelled = true
      }
    }

    fetch('/cdn-cgi/trace', { cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : ''))
      .then((text) => {
        const m = text.match(/loc=([A-Za-z]{2})\b/)
        applyCountry(m ? m[1] : null)
      })
      .catch(() => applyCountry(null))

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
