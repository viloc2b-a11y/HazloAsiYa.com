'use client'

import { useState } from 'react'
import { DISCLAIMER_COPPA } from '@/lib/legal-texts'

type Props = {
  childDataExpected: boolean
  onAdultConfirmed: () => void
  children: React.ReactNode
}

/**
 * COPPA: verificación de adulto responsable antes de formularios con datos de menores.
 */
export default function AgeGate({ childDataExpected, onAdultConfirmed, children }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  if (!childDataExpected || confirmed) {
    return <>{children}</>
  }

  if (blocked) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 text-navy text-sm leading-relaxed">
          <p className="font-serif text-xl mb-3">Necesitamos un adulto</p>
          <p>{DISCLAIMER_COPPA}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="rounded-2xl border border-navy/15 bg-white p-6 shadow-sm">
        <p className="font-semibold text-navy mb-4">¿Eres el padre, madre o tutor de este menor?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 btn-primary py-3"
            onClick={() => {
              setConfirmed(true)
              onAdultConfirmed()
            }}
          >
            Sí, soy adulto responsable
          </button>
          <button
            type="button"
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-gray-300"
            onClick={() => setBlocked(true)}
          >
            No
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">{DISCLAIMER_COPPA}</p>
      </div>
    </div>
  )
}
