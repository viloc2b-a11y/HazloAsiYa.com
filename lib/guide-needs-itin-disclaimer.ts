/** Detecta guías cuyo tema es ITIN / impuestos / W-7 (Circular 230 / disclaimer fiscal). */
export function guideNeedsItinDisclaimer(slug: string, relatedTramites: string[]): boolean {
  const s = slug.toLowerCase()
  if (/(^|-)(itin|w-7|w7|impuesto|tax|irs)(-|$)/.test(s) || /\b(itin|w-7|w7|impuesto)\b/.test(s)) {
    return true
  }
  const ids = relatedTramites.map((t) => t.toLowerCase())
  if (ids.includes('itin') || ids.includes('taxes')) return true
  return false
}
