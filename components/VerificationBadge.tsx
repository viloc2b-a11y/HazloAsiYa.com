import Link from 'next/link'
import type { MoneyPageOgSlug } from '@/lib/site'
import { isMoneyPageOgSlug } from '@/lib/site'
import { getMoneyPageVerificationDisplay } from '@/lib/money-page-sources'
import {
  getRegistryVerificationDisplay,
  getVerificationMetaForFunnel,
} from '@/lib/program-limits'
import { isValidFunnelId, type FunnelId } from '@/data/funnels'

type Props = {
  /**
   * Slug de trámite (`snap`, `medicaid`, …) cuando no usas `registryKey`.
   * Si hay datos en `program-limits.json` para ese trámite, se muestran fechas agregadas.
   */
  programId: string
  /**
   * Clave exacta en `src/data/program-limits.json` (p. ej. `snap_texas_gross_monthly_1p`).
   * Si se define, tiene prioridad sobre `programId`.
   */
  registryKey?: string
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

function BadgeBody({
  meta,
  className,
}: {
  meta: { lastVerified: string; validUntil: string; sourceUrl: string }
  className: string
}) {
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

/**
 * Transparencia regulatoria: fechas y enlace desde `src/data/program-limits.json`
 * (y respaldo editorial en landings money si no hay prefijo en JSON).
 */
export default function VerificationBadge({ programId, registryKey, className = '' }: Props) {
  if (registryKey) {
    const meta = getRegistryVerificationDisplay(registryKey)
    if (!meta) return null
    return <BadgeBody meta={meta} className={className} />
  }

  if (isValidFunnelId(programId)) {
    const meta = getVerificationMetaForFunnel(programId as FunnelId)
    if (meta) return <BadgeBody meta={meta} className={className} />
  }

  if (isMoneyPageOgSlug(programId)) {
    const meta = getMoneyPageVerificationDisplay(programId as MoneyPageOgSlug)
    return <BadgeBody meta={meta} className={className} />
  }

  return null
}
