import Link from 'next/link'
import type { FunnelId } from '@/data/funnels'
import { isValidFunnelId } from '@/data/funnels'
import { getVerificationMetaForFunnel } from '@/lib/program-limits'

type Props = {
  /** Identificador del trámite (mismo que ruta / snap, medicaid, …). */
  programId: string
  className?: string
}

function formatEsDate(iso: string): string {
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
 * Muestra vigencia y enlace a la fuente oficial según `src/data/program-limits.json`.
 * No renderiza nada si el trámite no tiene filas en el JSON.
 */
export default function VerificationBadge({ programId, className = '' }: Props) {
  if (!isValidFunnelId(programId)) return null
  const meta = getVerificationMetaForFunnel(programId as FunnelId)
  if (!meta) return null

  return (
    <p
      className={`text-xs text-gray-600 leading-relaxed ${className}`.trim()}
      data-regulatory-verification="true"
    >
      <span className="font-medium text-navy/80">Verificado:</span>{' '}
      {formatEsDate(meta.lastVerified)}.{' '}
      <span className="font-medium text-navy/80">Vigente hasta:</span>{' '}
      {formatEsDate(meta.validUntil)}.{' '}
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
