/**
 * Motor de reglas multi-estado para HazloAsíYa.
 *
 * Fuente única de verdad para:
 * - Límites de ingresos por estado y programa
 * - Portales oficiales de aplicación
 * - Teléfonos de ayuda en español
 * - Formularios oficiales por estado
 * - Instrucciones de entrega localizadas
 *
 * Para agregar un nuevo estado:
 * 1. Agregar la entrada en STATE_RULES con el código de estado (ej. 'NY', 'AZ')
 * 2. Agregar los programas que aplican con sus datos
 * 3. El motor de IA en ai-prompts.ts ya usa getStateRules() automáticamente
 *
 * @see docs/adding-new-state.md
 */

export type SupportedState = 'TX' | 'CA' | 'FL' | string

export type ProgramKey = 'snap' | 'medicaid' | 'wic' | 'chip' | 'tanf' | 'liheap'

export interface IncomeLimit {
  /** Tamaño del hogar */
  householdSize: number
  /** Ingreso mensual máximo bruto en dólares */
  grossMonthlyUsd: number
  /** Ingreso mensual máximo neto en dólares (si aplica) */
  netMonthlyUsd?: number
}

export interface ProgramRules {
  programName: string
  /** Nombre local del programa en el estado */
  localName: string
  /** Agencia administradora */
  agency: string
  /** Portal oficial de aplicación */
  applicationPortal: string
  /** Teléfono de ayuda en español */
  spanishHelpline: string
  /** Límites de ingreso (FY 2024-2025) */
  incomeLimits: IncomeLimit[]
  /** Formulario oficial de solicitud */
  officialFormId?: string
  /** Instrucciones de entrega */
  deliveryInstructions: string
  /** Notas especiales del estado */
  stateNotes?: string[]
  /** URL del formulario oficial para descarga */
  formDownloadUrl?: string
}

export interface StateRules {
  stateCode: SupportedState
  stateName: string
  /** Nombre del portal principal de beneficios */
  benefitsPortal: string
  programs: Partial<Record<ProgramKey, ProgramRules>>
}

// ─── TEXAS ────────────────────────────────────────────────────────────────────

const TEXAS: StateRules = {
  stateCode: 'TX',
  stateName: 'Texas',
  benefitsPortal: 'YourTexasBenefits.com',
  programs: {
    snap: {
      programName: 'SNAP',
      localName: 'SNAP (Supplemental Nutrition Assistance Program)',
      agency: 'Texas HHSC (Health and Human Services Commission)',
      applicationPortal: 'https://yourtexasbenefits.com',
      spanishHelpline: '2-1-1 (marcando 2 para español)',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1580, netMonthlyUsd: 1215 },
        { householdSize: 2, grossMonthlyUsd: 2137, netMonthlyUsd: 1644 },
        { householdSize: 3, grossMonthlyUsd: 2694, netMonthlyUsd: 2072 },
        { householdSize: 4, grossMonthlyUsd: 3250, netMonthlyUsd: 2500 },
        { householdSize: 5, grossMonthlyUsd: 3807, netMonthlyUsd: 2929 },
        { householdSize: 6, grossMonthlyUsd: 4364, netMonthlyUsd: 3357 },
      ],
      officialFormId: 'h1010',
      deliveryInstructions:
        'Lleva el formulario H1010 a tu oficina local de Texas HHSC o súbelo en YourTexasBenefits.com. También puedes enviarlo por correo a tu condado. Llama al 2-1-1 para ubicar la oficina más cercana.',
      stateNotes: [
        'Texas no requiere número de Seguro Social para todos los miembros del hogar — los ciudadanos deben proporcionarlo, los no ciudadanos pueden aplicar para los miembros elegibles.',
        'El proceso de entrevista puede hacerse por teléfono.',
        'SNAP en Texas se llama simplemente "SNAP" — no tiene nombre local diferente.',
      ],
      formDownloadUrl: 'https://www.hhs.texas.gov/laws-regulations/forms/h-forms/h1010-texas-works-application-benefits',
    },
    medicaid: {
      programName: 'Medicaid',
      localName: 'Medicaid Texas',
      agency: 'Texas HHSC',
      applicationPortal: 'https://yourtexasbenefits.com',
      spanishHelpline: '2-1-1 (marcando 2 para español)',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1732 }, // Solo para grupos elegibles (embarazadas, niños, adultos con hijos)
        { householdSize: 2, grossMonthlyUsd: 2342 },
        { householdSize: 3, grossMonthlyUsd: 2952 },
        { householdSize: 4, grossMonthlyUsd: 3562 },
      ],
      officialFormId: 'h1010',
      deliveryInstructions:
        'Aplica en YourTexasBenefits.com o lleva el formulario H1010 a tu oficina HHSC local. Llama al 2-1-1 para asistencia.',
      stateNotes: [
        '⚠️ Texas NO adoptó la expansión Medicaid del ACA. Los adultos sin hijos dependientes menores generalmente NO califican.',
        'Los grupos que sí pueden calificar: embarazadas, niños menores de 19 años, adultos con hijos dependientes menores de 18 años, personas mayores de 65 años, personas con discapacidad.',
        'CHIP cubre a niños que no califican para Medicaid pero cuyos ingresos familiares son hasta el 201% del FPL.',
      ],
    },
    wic: {
      programName: 'WIC',
      localName: 'WIC Texas (Texas WIC Program)',
      agency: 'Texas DSHS (Department of State Health Services)',
      applicationPortal: 'https://www.texaswic.org',
      spanishHelpline: '1-800-942-3678',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 2248 },
        { householdSize: 2, grossMonthlyUsd: 3041 },
        { householdSize: 3, grossMonthlyUsd: 3834 },
        { householdSize: 4, grossMonthlyUsd: 4628 },
        { householdSize: 5, grossMonthlyUsd: 5421 },
      ],
      deliveryInstructions:
        'Llama al 1-800-942-3678 para encontrar tu clínica WIC local en Texas. La cita es en persona — lleva identificación y documentos del bebé o embarazo.',
      stateNotes: [
        'WIC en Texas cubre: mujeres embarazadas, madres lactantes hasta 1 año postparto, madres no lactantes hasta 6 meses postparto, bebés hasta 1 año, niños de 1 a 5 años.',
        'No se requiere estatus migratorio para aplicar — WIC es un programa federal.',
        'Las tarjetas WIC de Texas se llaman Texas WIC EBT Card.',
      ],
    },
  },
}

// ─── CALIFORNIA ───────────────────────────────────────────────────────────────

const CALIFORNIA: StateRules = {
  stateCode: 'CA',
  stateName: 'California',
  benefitsPortal: 'BenefitsCal.com',
  programs: {
    snap: {
      programName: 'SNAP',
      localName: 'CalFresh',
      agency: 'CDSS (California Department of Social Services) / Condado local',
      applicationPortal: 'https://benefitscal.com',
      spanishHelpline: '1-877-847-3663 (CDSS en español)',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1580, netMonthlyUsd: 1215 },
        { householdSize: 2, grossMonthlyUsd: 2137, netMonthlyUsd: 1644 },
        { householdSize: 3, grossMonthlyUsd: 2694, netMonthlyUsd: 2072 },
        { householdSize: 4, grossMonthlyUsd: 3250, netMonthlyUsd: 2500 },
        { householdSize: 5, grossMonthlyUsd: 3807, netMonthlyUsd: 2929 },
        { householdSize: 6, grossMonthlyUsd: 4364, netMonthlyUsd: 3357 },
      ],
      officialFormId: 'saws1',
      deliveryInstructions:
        'Lleva el formulario SAWS-1 a tu oficina del condado (County Social Services) o súbelo en BenefitsCal.com. También puedes llamar al 1-877-847-3663 para asistencia en español.',
      stateNotes: [
        'En California, SNAP se llama CalFresh.',
        'California tiene CalFresh Expedited Service (CFES) para hogares en emergencia — pueden recibir beneficios en 3 días.',
        'Los inmigrantes con estatus legal pueden calificar para CalFresh en California (California tiene reglas más amplias que el estándar federal).',
        'Si recibes Medi-Cal, puedes calificar automáticamente para CalFresh — aplica en BenefitsCal.com.',
      ],
      formDownloadUrl: 'https://www.cdss.ca.gov/cdssweb/entres/forms/English/SAWS1.pdf',
    },
    medicaid: {
      programName: 'Medicaid',
      localName: 'Medi-Cal',
      agency: 'DHCS (California Department of Health Care Services)',
      applicationPortal: 'https://benefitscal.com',
      spanishHelpline: '1-800-541-5555 (Medi-Cal en español)',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1732 },
        { householdSize: 2, grossMonthlyUsd: 2342 },
        { householdSize: 3, grossMonthlyUsd: 2952 },
        { householdSize: 4, grossMonthlyUsd: 3562 },
        { householdSize: 5, grossMonthlyUsd: 4172 },
      ],
      officialFormId: 'saws1',
      deliveryInstructions:
        'Aplica en BenefitsCal.com o lleva el formulario SAWS-1 a tu oficina del condado. Llama al 1-800-541-5555 para ayuda en español.',
      stateNotes: [
        'California adoptó la expansión Medicaid del ACA — la mayoría de adultos con ingresos bajos pueden calificar.',
        'En California, Medicaid se llama Medi-Cal.',
        'Desde 2024, Medi-Cal cubre a todos los adultos sin importar estatus migratorio (Medi-Cal for All).',
        'El formulario SAWS-1 sirve para CalFresh, Medi-Cal y CalWORKs al mismo tiempo.',
      ],
    },
    wic: {
      programName: 'WIC',
      localName: 'WIC California',
      agency: 'CDPH (California Department of Public Health)',
      applicationPortal: 'https://www.cdph.ca.gov/Programs/CFH/DWICSN',
      spanishHelpline: '1-800-852-5770',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 2248 },
        { householdSize: 2, grossMonthlyUsd: 3041 },
        { householdSize: 3, grossMonthlyUsd: 3834 },
        { householdSize: 4, grossMonthlyUsd: 4628 },
        { householdSize: 5, grossMonthlyUsd: 5421 },
      ],
      officialFormId: 'cawic100',
      deliveryInstructions:
        'Llama al 1-800-852-5770 para encontrar tu agencia WIC local en California. La cita es en persona. También puedes buscar en BenefitsCal.com o MyBenefitsCalWIN.org.',
      stateNotes: [
        'California WIC no tiene un formulario PDF de solicitud descargable — la aplicación se hace en persona o en línea.',
        'El documento generado por HazloAsíYa es un resumen pre-llenado para llevar a la cita y reducir el tiempo de espera.',
        'WIC California cubre: mujeres embarazadas, madres lactantes, madres no lactantes hasta 6 meses, bebés hasta 1 año, niños de 1 a 5 años.',
        'No se requiere estatus migratorio para WIC — es un programa federal.',
      ],
    },
  },
}

// ─── FLORIDA ──────────────────────────────────────────────────────────────────

const FLORIDA: StateRules = {
  stateCode: 'FL',
  stateName: 'Florida',
  benefitsPortal: 'myACCESS.myflfamilies.com',
  programs: {
    snap: {
      programName: 'SNAP',
      localName: 'Food Assistance (ACCESS Florida)',
      agency: 'DCF (Florida Department of Children and Families)',
      applicationPortal: 'https://myaccess.myflfamilies.com',
      spanishHelpline: '1-866-762-2237 (ACCESS Florida en español)',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1580, netMonthlyUsd: 1215 },
        { householdSize: 2, grossMonthlyUsd: 2137, netMonthlyUsd: 1644 },
        { householdSize: 3, grossMonthlyUsd: 2694, netMonthlyUsd: 2072 },
        { householdSize: 4, grossMonthlyUsd: 3250, netMonthlyUsd: 2500 },
        { householdSize: 5, grossMonthlyUsd: 3807, netMonthlyUsd: 2929 },
      ],
      officialFormId: 'cfes2337',
      deliveryInstructions:
        'Aplica en myACCESS.myflfamilies.com o lleva el formulario CF-ES 2337 a tu Family Resource Center local. Llama al 1-866-762-2237 para ayuda en español.',
      stateNotes: [
        'En Florida, SNAP se llama "Food Assistance" dentro del sistema ACCESS Florida.',
        'El formulario CF-ES 2337 cubre Food Assistance, Medicaid y TCA (Temporary Cash Assistance) al mismo tiempo.',
        'Florida tiene un sistema de entrevista telefónica para SNAP — no siempre es necesario ir en persona.',
      ],
      formDownloadUrl: 'https://www.myflfamilies.com/service-programs/access/docs/cf-es2337.pdf',
    },
    medicaid: {
      programName: 'Medicaid',
      localName: 'Florida Medicaid',
      agency: 'AHCA (Agency for Health Care Administration) / DCF',
      applicationPortal: 'https://myaccess.myflfamilies.com',
      spanishHelpline: '1-866-762-2237',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 1732 },
        { householdSize: 2, grossMonthlyUsd: 2342 },
        { householdSize: 3, grossMonthlyUsd: 2952 },
        { householdSize: 4, grossMonthlyUsd: 3562 },
      ],
      officialFormId: 'cfes2337',
      deliveryInstructions:
        'Aplica en myACCESS.myflfamilies.com o lleva el formulario CF-ES 2337 a tu Family Resource Center. Llama al 1-866-762-2237.',
      stateNotes: [
        'Florida NO adoptó la expansión Medicaid del ACA. Los adultos sin hijos dependientes generalmente no califican.',
        'Los grupos elegibles en Florida: embarazadas, niños, adultos con hijos dependientes, personas mayores, personas con discapacidad.',
        'CHIP en Florida se llama Florida KidCare.',
      ],
    },
    wic: {
      programName: 'WIC',
      localName: 'Florida WIC',
      agency: 'Florida Department of Health',
      applicationPortal: 'https://www.floridahealth.gov/programs-and-services/wic/',
      spanishHelpline: '1-800-342-3556',
      incomeLimits: [
        { householdSize: 1, grossMonthlyUsd: 2248 },
        { householdSize: 2, grossMonthlyUsd: 3041 },
        { householdSize: 3, grossMonthlyUsd: 3834 },
        { householdSize: 4, grossMonthlyUsd: 4628 },
        { householdSize: 5, grossMonthlyUsd: 5421 },
      ],
      deliveryInstructions:
        'Llama al 1-800-342-3556 o visita floridahealth.gov para encontrar tu clínica WIC local en Florida. La cita es en persona.',
      stateNotes: [
        'Florida WIC cubre los mismos grupos que el programa federal: embarazadas, madres lactantes, bebés hasta 1 año, niños de 1 a 5 años.',
        'No se requiere estatus migratorio para WIC.',
        'Florida WIC usa tarjetas eWIC para compras en supermercados participantes.',
      ],
    },
  },
}

// ─── ÍNDICE GLOBAL ────────────────────────────────────────────────────────────

export const STATE_RULES: Record<string, StateRules> = {
  TX: TEXAS,
  CA: CALIFORNIA,
  FL: FLORIDA,
}

/**
 * Obtiene las reglas de un estado por código.
 * Retorna Texas como fallback si el estado no está soportado.
 */
export function getStateRules(stateCode: string): StateRules {
  return STATE_RULES[stateCode.toUpperCase()] ?? TEXAS
}

/**
 * Obtiene las reglas de un programa específico para un estado.
 */
export function getProgramRules(stateCode: string, program: ProgramKey): ProgramRules | null {
  const state = getStateRules(stateCode)
  return state.programs[program] ?? null
}

/**
 * Genera el texto de límites de ingreso para usar en prompts de IA.
 * Formato: "1 persona: $1,580/mes | 2 personas: $2,137/mes | ..."
 */
export function formatIncomeLimitsForPrompt(limits: IncomeLimit[]): string {
  return limits
    .slice(0, 5)
    .map(l => `${l.householdSize} persona${l.householdSize > 1 ? 's' : ''}: $${l.grossMonthlyUsd.toLocaleString()}/mes`)
    .join(' | ')
}

/**
 * Obtiene el formulario oficial recomendado para un funnel + estado.
 * Alias conveniente para usar en componentes.
 */
export function getOfficialFormId(funnelId: string, stateCode: string): string | null {
  const programMap: Record<string, ProgramKey> = {
    snap: 'snap',
    medicaid: 'medicaid',
    wic: 'wic',
    calfresh: 'snap',
    'food-assistance': 'snap',
    'medi-cal': 'medicaid',
  }
  const program = programMap[funnelId.toLowerCase()]
  if (!program) return null
  return getProgramRules(stateCode, program)?.officialFormId ?? null
}

/**
 * Lista de estados soportados con sus nombres para mostrar en UI.
 */
export const SUPPORTED_STATES: Array<{ code: string; name: string; portal: string }> = [
  { code: 'TX', name: 'Texas', portal: 'YourTexasBenefits.com' },
  { code: 'CA', name: 'California', portal: 'BenefitsCal.com' },
  { code: 'FL', name: 'Florida', portal: 'myACCESS.myflfamilies.com' },
]

/**
 * Verifica si un estado está completamente soportado con formularios y reglas.
 */
export function isStateFullySupported(stateCode: string): boolean {
  return stateCode.toUpperCase() in STATE_RULES
}
