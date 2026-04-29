'use client'

import Link from 'next/link'
import Disclosure from '@/components/legal/Disclosure'

type Month = number

function monthRange(m: Month): { itin: boolean; snapMed: boolean; escuela: boolean } {
  return {
    itin: m >= 1 && m <= 4,
    snapMed: m >= 8 && m <= 9,
    escuela: m >= 3 && m <= 6,
  }
}

type Props = { funnelId: string }

/**
 * Cursos estacionales por época — sin contadores de urgencia falsos.
 */
export default function SeasonalCourseBanner({ funnelId }: Props) {
  const m = new Date().getMonth() + 1
  const r = monthRange(m as Month)

  let title: string | null = null
  let desc: string | null = null
  let href = '/precios/'

  if ((funnelId === 'itin' || funnelId === 'taxes') && r.itin) {
    title = 'Curso estacional: ITIN 2026 — W-7 paso a paso'
    desc = 'Disponible ene–abr. Contenido de pago aparte de la membresía.'
  } else if ((funnelId === 'snap' || funnelId === 'medicaid') && r.snapMed) {
    title = 'Curso estacional: Renovación SNAP / Medicaid'
    desc = 'Disponible ago–sep. Revisa requisitos oficiales antes de aplicar.'
  } else if (funnelId === 'escuela' && r.escuela) {
    title = 'Curso estacional: Inscripción escolar Texas'
    desc = 'Disponible mar–jun. Orientación educativa; verifica en tu distrito.'
  }

  if (!title) return null

  return (
    <div className="max-w-4xl mx-auto px-4 pb-6">
      <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
        <Disclosure variant="paid-service" />
        <p className="font-serif text-lg text-navy mt-3">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{desc}</p>
        <Link href={href} className="inline-block mt-3 text-green font-semibold underline text-sm">
          Ver planes y precios →
        </Link>
      </div>
    </div>
  )
}
