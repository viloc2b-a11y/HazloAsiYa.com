/**
 * /alianza/reporte/[slug]/ — Server wrapper for partner monthly impact report
 * Exports generateStaticParams so this dynamic route works with `output: export`.
 * The actual UI is in ReporteClient.tsx ('use client').
 */
import ReporteClient from './ReporteClient'

// Known pilot partners — add new slugs here as partners join
const PARTNER_SLUGS = [
  'iglesia-bethel-houston',
  'clinica-salud-san-antonio',
  'centro-esperanza-dallas',
]

export function generateStaticParams() {
  return PARTNER_SLUGS.map((slug) => ({ slug }))
}

// Allow unknown slugs to render (they'll load dynamically on the client)
export const dynamicParams = true

export default function ReportePage() {
  return <ReporteClient />
}
