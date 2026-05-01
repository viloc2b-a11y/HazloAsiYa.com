/**
 * URLs oficiales y metadatos de verificación para landings "money" (OG dedicado).
 */
import type { FunnelId } from '@/data/funnels'
import { REGULATORY_META } from '@/lib/regulatory-meta'
import type { MoneyPageOgSlug } from '@/lib/site'
import { getVerificationMetaForFunnel } from '@/lib/program-limits'

export const MONEY_PAGE_OFFICIAL_URL: Record<MoneyPageOgSlug, string> = {
  snap: 'https://www.hhs.texas.gov/services/food/snap-food-benefits',
  medicaid: 'https://www.hhs.texas.gov/services/health/medicaid-chip',
  itin: 'https://www.irs.gov/itin',
  escuela: 'https://tea.texas.gov/',
  wic: 'https://www.dshs.texas.gov/wic',
  taxes: 'https://www.irs.gov/',
  rent: 'https://www.hud.gov/states/texas/renting',
  utilities: 'https://www.tdhca.state.tx.us/community-affairs/weatherization',
  daca: 'https://www.uscis.gov/humanitarian/consideration-deferred-action-childhood-arrivals-daca',
}

export type MoneyPageVerification = {
  lastVerified: string
  validUntil: string
  sourceUrl: string
}

/** Siempre devuelve fechas + enlace para landings money (JSON o respaldo editorial). */
export function getMoneyPageVerificationDisplay(slug: MoneyPageOgSlug): MoneyPageVerification {
  const fromJson = getVerificationMetaForFunnel(slug as FunnelId)
  if (fromJson) {
    return { ...fromJson, sourceUrl: fromJson.sourceUrl || MONEY_PAGE_OFFICIAL_URL[slug] }
  }
  return {
    lastVerified: `${REGULATORY_META.lastVerified}T12:00:00.000Z`,
    validUntil: `${REGULATORY_META.dataValidUntil}T23:59:59.999Z`,
    sourceUrl: MONEY_PAGE_OFFICIAL_URL[slug],
  }
}
