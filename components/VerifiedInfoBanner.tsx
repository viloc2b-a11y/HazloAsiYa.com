import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  officialUrl: string
  /** Texto del enlace (por defecto: Verificar en fuente oficial) */
  officialLinkText?: string
  /** Ej. "Abril 2026" */
  displayPeriod?: string
  /** Contenido adicional (p. ej. caja USDA en SNAP Texas) */
  children?: ReactNode
}

export default function VerifiedInfoBanner({
  officialUrl,
  officialLinkText = 'Verificar en fuente oficial',
  displayPeriod = 'Abril 2026',
  children,
}: Props) {
  return (
    <aside className="rounded-xl border border-green/40 bg-emerald-50/80 px-4 py-3 text-sm text-navy">
      <p className="font-medium leading-relaxed">
        <span className="text-navy">Información verificada: {displayPeriod}</span>
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
