/**
 * Fuente única de verdad para cifras regulatorias mostradas en prompts y UI.
 * Datos: `src/data/program-limits.json` (validado con Zod al cargar).
 */
import type { FunnelId } from '../data/funnels'
import rawLimits from '../src/data/program-limits.json'
import {
  programLimitsFileSchema,
  type ProgramLimitEntry,
  type ProgramLimitsFile,
} from '../src/schemas/limits.schema'

export const programLimits: ProgramLimitsFile = programLimitsFileSchema.parse(rawLimits)

export type { ProgramLimitEntry, ProgramLimitsFile }

function v(key: string): number {
  const e = programLimits[key]
  return e?.value ?? NaN
}

/** Texto embebido en el system prompt de SNAP. */
export function snapTexasGrossMonthlyPromptLine(): string {
  const inc = v('snap_texas_each_additional_person_usd')
  return (
    'Límites SNAP Texas FY2026 ingreso bruto mensual: ' +
    `1p $${v('snap_texas_gross_monthly_1p')} | 2p $${v('snap_texas_gross_monthly_2p')} | 3p $${v('snap_texas_gross_monthly_3p')} | 4p $${v('snap_texas_gross_monthly_4p')} | ` +
    `5p $${v('snap_texas_gross_monthly_5p')} | 6p $${v('snap_texas_gross_monthly_6p')} | 7p $${v('snap_texas_gross_monthly_7p')} | 8p $${v('snap_texas_gross_monthly_8p')} | ` +
    `+1 persona +$${inc}.`
  )
}

/** Texto embebido en el system prompt de WIC (185% FPL Texas). */
export function wicTexas185fplPromptLine(): string {
  const inc = v('wic_texas_each_additional_person_usd')
  return (
    'Límites WIC Texas FY2026 (185% FPL, ingreso bruto mensual): ' +
    `1p $${v('wic_texas_185fpl_monthly_1p')} | 2p $${v('wic_texas_185fpl_monthly_2p')} | 3p $${v('wic_texas_185fpl_monthly_3p')} | 4p $${v('wic_texas_185fpl_monthly_4p')} | ` +
    `5p $${v('wic_texas_185fpl_monthly_5p')} | 6p $${v('wic_texas_185fpl_monthly_6p')} | +1 +$${inc}.`
  )
}

/** Referencias Medicaid/CHIP Texas (orientativas; reglas reales en HHSC). */
export function medicaidTexasIncomeRefsPromptLine(): string {
  const chip = v('medicaid_chip_family3_monthly_201fpl_usd')
  const preg = v('medicaid_pregnant_family3_monthly_198fpl_usd')
  const parent = v('medicaid_parent_caretaker_family3_monthly_usd')
  return (
    `CHIP niños hasta ~201% FPL (referencia familia de 3 ~$${chip}/mes bruto). ` +
    `Embarazadas hasta ~198% FPL (~$${preg}/mes f3). ` +
    `Padres/cuidadores con hijos: reglas MUY restrictivas (~$${parent}/mes f3 referencia).`
  )
}

export function taxesVitaIncomeMaxPromptFragment(): string {
  const n = v('taxes_vita_income_max_usd')
  return `Si ingreso total < $${n.toLocaleString('en-US')} → recomendar VITA gratis`
}

export function rentHoustonAmiRefsPromptLine(): string {
  const ami = v('rent_houston_ami_family4_annual_ref_usd')
  const p80 = v('rent_houston_80pct_ami_family4_annual_ref_usd')
  return (
    `Referencia Houston 2026 (orientativa): AMI familia de 4 ~$${ami.toLocaleString('en-US')}/año; ` +
    `80% AMI ~$${p80.toLocaleString('en-US')}/año; usar como guía no exacta.`
  )
}

export function utilitiesLiheapFplPromptLine(): string {
  const low = v('utilities_liheap_fpl_threshold_low_pct')
  const high = v('utilities_liheap_fpl_threshold_high_pct')
  return `LIHEAP orientativo: ingresos < ${low}% FPL likely; ${low}–${high}% FPL possible; aviso de corte → prioridad likely.`
}

const FUNNEL_LIMIT_KEY_PREFIX: Partial<Record<FunnelId, string>> = {
  snap: 'snap_texas_',
  wic: 'wic_texas_',
  medicaid: 'medicaid_',
  taxes: 'taxes_',
  rent: 'rent_',
  utilities: 'utilities_',
  itin: 'itin_',
  escuela: 'escuela_',
  daca: 'daca_',
}

export type VerificationMeta = {
  lastVerified: string
  validUntil: string
  sourceUrl: string
}

/** Agrega metadatos de verificación para todos los registros cuyo id empieza por el prefijo del trámite. */
export function getVerificationMetaForFunnel(funnelId: FunnelId): VerificationMeta | null {
  const prefix = FUNNEL_LIMIT_KEY_PREFIX[funnelId]
  if (!prefix) return null
  const keys = Object.keys(programLimits).filter(k => k.startsWith(prefix))
  if (keys.length === 0) return null

  let lastVerified = ''
  let validUntil = '9999-12-31T23:59:59.999Z'
  let sourceUrl = ''
  for (const k of keys) {
    const e = programLimits[k]
    if (e.lastVerified > lastVerified) lastVerified = e.lastVerified
    if (e.validUntil < validUntil) validUntil = e.validUntil
    sourceUrl = e.sourceUrl
  }
  return { lastVerified, validUntil, sourceUrl }
}

/** Una fila concreta (p. ej. para tests o enlaces granulares). */
export function getProgramLimitEntry(programLimitId: string): ProgramLimitEntry | null {
  const e = programLimits[programLimitId]
  return e ?? null
}

/** Metadatos de una sola fila del JSON (p. ej. badge granular por clave de registro). */
export function getRegistryVerificationDisplay(registryKey: string): VerificationMeta | null {
  const e = programLimits[registryKey]
  if (!e) return null
  return {
    lastVerified: e.lastVerified,
    validUntil: e.validUntil,
    sourceUrl: e.sourceUrl,
  }
}
