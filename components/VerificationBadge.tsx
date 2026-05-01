import Link from 'next/link'
import type { MoneyPageOgSlug } from '@/lib/site'
import { isMoneyPageOgSlug } from '@/lib/site'
import { getMoneyPageVerificationDisplay } from '@/lib/money-page-sources'

type Props = {
  /** Slug del trámite (solo landings money muestran badge con datos). */
  programId: string
  className?: string
}

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

/**
 * Fechas y enlace oficial alineados con `src/data/program-limits.json` o respaldo editorial.
 */
export default function VerificationBadge({ programId, className = '' }: Props) {
  if (!isMoneyPageOgSlug(programId)) return null

  const meta = getMoneyPageVerificationDisplay(programId as MoneyPageOgSlug)

  return (
    <p
      className={`text-xs text-gray-600 leading-relaxed ${className}`.trim()}
      data-regulatory-verification="true"
    >
      <span className="font-medium text-navy/80">Verificado:</span> {formatEsUtc(meta.lastVerified)}.{' '}
      <span className="font-medium text-navy/80">Vigente hasta:</span> {formatEsUtc(meta.validUntil)}.{' '}
      <Link
        href={meta.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green font-semibold underline underline-offset-2"
      >
        Fuente oficial →
      </Link>
    </p>
  )
}
