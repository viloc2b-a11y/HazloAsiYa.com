'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useIsEU } from '@/hooks/useIsEU'
import {
  STORAGE_US,
  STORAGE_EU,
  dispatchConsentUpdated,
  readConsent,
} from '@/lib/cookie-consent'

/**
 * Banner dual: modo Texas/EE.UU. (TDPSA) vs UE (GDPR Art. 7).
 * No cargar GA4 / Meta Pixel hasta consentimiento (implementar listeners con canLoadAnalytics).
 */
export default function CookieBanner() {
  const { isEU, ready } = useIsEU()
  const [visible, setVisible] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (readConsent()) {
      setVisible(false)
      return
    }
    setVisible(true)
  }, [ready])

  const saveUS = (analyticsOn: boolean, marketingOn: boolean) => {
    const payload = {
      essential: true as const,
      analytics: analyticsOn,
      marketing: marketingOn,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_US, JSON.stringify(payload))
    localStorage.removeItem(STORAGE_EU)
    dispatchConsentUpdated()
    setVisible(false)
  }

  const saveEU = (analyticsOn: boolean, marketingOn: boolean) => {
    const payload = {
      necessary: true as const,
      analytics: analyticsOn,
      marketing: marketingOn,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_EU, JSON.stringify(payload))
    localStorage.removeItem(STORAGE_US)
    dispatchConsentUpdated()
    setVisible(false)
  }

  const rejectAll = () => {
    if (isEU) saveEU(false, false)
    else saveUS(false, false)
  }

  const acceptAll = () => {
    if (isEU) saveEU(true, true)
    else saveUS(true, true)
  }

  const saveEssentialsOnly = () => {
    if (isEU) saveEU(false, false)
    else saveUS(false, false)
  }

  const saveCustom = () => {
    if (isEU) saveEU(analytics, marketing)
    else saveUS(analytics, marketing)
  }

  if (!visible || !ready) return null

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-live="polite"
    >
      <div className="max-w-3xl mx-auto pointer-events-auto rounded-2xl border border-navy/15 bg-white shadow-xl shadow-navy/10 p-5 md:p-6">
        <h2 id="cookie-banner-title" className="font-serif text-lg text-navy mb-2">
          {isEU ? 'Cookies y privacidad (UE)' : 'Cookies y tu privacidad'}
        </h2>

        {isEU ? (
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed mb-4">
            <p>
              Usamos cookies <strong>necesarias</strong> para el funcionamiento del sitio (base legal: interés legítimo
              / ejecución del servicio). Las cookies de <strong>analítica</strong> y <strong>marketing</strong> solo se
              activan con tu <strong>consentimiento</strong> (GDPR Art. 6.1.a), sin casillas pre-marcadas.
            </p>
            <p>
              Responsable: HazloAsíYa (contacto:{' '}
              <a href="mailto:privacidad@hazloasiya.com" className="text-green font-semibold underline">
                privacidad@hazloasiya.com
              </a>
              ). Puedes revocar el consentimiento en cualquier momento borrando las cookies del sitio o contactándonos.
            </p>
            <div className="flex flex-col gap-2 pt-2 border-t border-cream">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked disabled className="accent-green" />
                <span>Necesarias (siempre activas)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="accent-green"
                />
                <span>Analítica (medición de uso)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="accent-green"
                />
                <span>Marketing (publicidad/medición de campañas)</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-700 space-y-2 leading-relaxed mb-4">
            <p>
              Usamos cookies esenciales para que el sitio funcione. Las cookies de analítica y marketing son{' '}
              <strong>opcionales</strong> y no las activamos hasta que las aceptes (TDPSA / buenas prácticas FTC).
            </p>
            <p>
              Más información:{' '}
              <Link href="/privacy/" className="text-green font-semibold underline">
                Política de privacidad
              </Link>
              .
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {isEU && (
            <>
              <button
                type="button"
                onClick={rejectAll}
                className="order-1 sm:order-none px-4 py-2.5 rounded-xl border-2 border-navy/30 font-semibold text-navy hover:bg-cream"
              >
                Rechazar todo
              </button>
              <button
                type="button"
                onClick={saveCustom}
                className="px-4 py-2.5 rounded-xl border-2 border-green text-green font-semibold hover:bg-green/5"
              >
                Guardar selección
              </button>
            </>
          )}
          <button
            type="button"
            onClick={saveEssentialsOnly}
            className="px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-gray-300"
          >
            {isEU ? 'Solo necesarias' : 'Solo esenciales'}
          </button>
          {!isEU && (
            <>
              <button
                type="button"
                onClick={() => saveUS(true, true)}
                className="px-4 py-2.5 rounded-xl btn-primary font-semibold"
              >
                Aceptar todo
              </button>
            </>
          )}
          {isEU && (
            <button type="button" onClick={acceptAll} className="px-4 py-2.5 rounded-xl btn-primary font-semibold">
              Aceptar todo
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
