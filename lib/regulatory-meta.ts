import type { Metadata } from 'next'
import type { MoneyPageOgSlug } from '@/lib/site'

/** Valores alineados con content/guides y auditoría SEO. */
export const REGULATORY_META = {
  lastVerified: '2026-04-28',
  dataValidUntil: '2026-12-31',
} as const

export function regulatoryMetadataOther(regulatorySource: string): NonNullable<Metadata['other']> {
  return {
    'last-verified': REGULATORY_META.lastVerified,
    'data-valid-until': REGULATORY_META.dataValidUntil,
    'regulatory-source': regulatorySource,
  }
}

/** Fuente resumida por trámite (money pages). */
export const MONEY_PAGE_REGULATORY_SOURCE: Record<MoneyPageOgSlug, string> = {
  snap: 'USDA FNS / HHSC Texas',
  medicaid: 'HHSC Texas / CMS',
  itin: 'IRS',
  escuela: 'TEA / US Department of Education',
  wic: 'USDA FNS / HHSC Texas',
  taxes: 'IRS',
  rent: 'HUD / Texas',
  utilities: 'HHS LIHEAP / Texas',
  daca: 'USCIS',
  id: 'Texas DPS',
  twc: 'Texas Workforce Commission',
  iep: 'TEA / IDEA',
  prek: 'TEA Texas Prekindergarten',
  jobs: 'Texas Workforce Commission / WorkInTexas',
  bank: 'FDIC',
  matricula: 'US Department of State (embajada)',
}
