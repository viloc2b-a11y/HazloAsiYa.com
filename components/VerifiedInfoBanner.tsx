import Link from 'next/link'
import type { ReactNode } from 'react'

function formatEsUtc(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleDateString('es-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

type Props = {
  officialUrl: string
  officialLinkText?: string
  /** Texto corto legacy si no hay fechas ISO (p. ej. "Abril 2026") */
  displayPeriod?: string
  /** Si vienen ambas, sustituyen `displayPeriod` (datos desde program-limits / editorial). */
  lastVerifiedIso?: string
  validUntilIso?: string
  children?: ReactNode
}

export default function VerifiedInfoBanner({
  officialUrl,
  officialLinkText = 'Verificar en fuente oficial',
  displayPeriod = 'Abril 2026',
  lastVerifiedIso,
  validUntilIso,
  children,
}: Props) {
  const dated =
    lastVerifiedIso &&
    validUntilIso &&
    `Verificado: ${formatEsUtc(lastVerifiedIso)} · Vigente hasta: ${formatEsUtc(validUntilIso)}`

  return (
    <aside className="rounded-xl border border-green/40 bg-emerald-50/80 px-4 py-3 text-sm text-navy">
      <p className="font-medium leading-relaxed">
        <span className="text-navy">{dated ?? `Información verificada: ${displayPeriod}`}</span>
        <span className="text-gray-400 mx-1">|</span>
        <Link
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green font-semibold underline underline-offset-2"
        >
          {officialLinkText} →
        </Link>
      </p>
      {children}
    </aside>
  )
}
