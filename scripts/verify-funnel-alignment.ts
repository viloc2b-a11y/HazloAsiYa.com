/**
 * Comprueba que FUNNEL_ORDER, FUNNELS, fuentes regulatorias, URLs money y program-limits
 * cubren exactamente el mismo conjunto de trámites.
 *
 *   npx tsx scripts/verify-funnel-alignment.ts
 */
import { FUNNEL_ORDER, FUNNELS, type FunnelId } from '../data/funnels'
import { getVerificationMetaForFunnel } from '../lib/program-limits'
import { MONEY_PAGE_OFFICIAL_URL } from '../lib/money-page-sources'
import { MONEY_PAGE_REGULATORY_SOURCE } from '../lib/regulatory-meta'

function main() {
  const funnelKeys = Object.keys(FUNNELS) as FunnelId[]
  const orderSet = new Set<string>(FUNNEL_ORDER)
  const keySet = new Set(funnelKeys)

  if (FUNNEL_ORDER.length !== funnelKeys.length) {
    throw new Error(
      `FUNNEL_ORDER length ${FUNNEL_ORDER.length} !== FUNNELS keys ${funnelKeys.length}`,
    )
  }

  for (const k of funnelKeys) {
    if (!orderSet.has(k)) {
      throw new Error(`FunnelId "${k}" en FUNNELS pero no en FUNNEL_ORDER`)
    }
  }
  for (const k of FUNNEL_ORDER) {
    if (!keySet.has(k)) {
      throw new Error(`FUNNEL_ORDER tiene "${k}" que no está en FUNNELS`)
    }
  }

  for (const id of funnelKeys) {
    if (!(id in MONEY_PAGE_REGULATORY_SOURCE)) {
      throw new Error(`MONEY_PAGE_REGULATORY_SOURCE falta: ${id}`)
    }
    if (!(id in MONEY_PAGE_OFFICIAL_URL)) {
      throw new Error(`MONEY_PAGE_OFFICIAL_URL falta: ${id}`)
    }
    if (!getVerificationMetaForFunnel(id)) {
      throw new Error(`program-limits / prefijo falta para funnel: ${id}`)
    }
  }

  console.log(
    `OK: ${funnelKeys.length} trámites alineados (FUNNEL_ORDER, regulatorio, URLs, program-limits).`,
  )
}

main()
