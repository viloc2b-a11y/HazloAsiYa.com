// ─────────────────────────────────────────────────────────────
// HazloAsíYa — PDF Form Types
// Stack: Next.js 14 App Router · Supabase · Square · OpenAI
// ─────────────────────────────────────────────────────────────

export type PdfFormId =
  | 'i821d' | 'i765' | 'w7'                    // Tier 1: DACA / ITIN
  | 'h1010' | 'w4'  | 'i9'                    // Tier 2: SNAP Texas / W-4 / Empleo
  | 'saws1' | 'cfes2337' | 'cawic100'          // Tier 2: SNAP/Medicaid/WIC California + Florida
  | 'ldss2921' | 'nywic'                        // Tier 2: SNAP/Medicaid/WIC Nueva York
  | 'dl14a' | 'matricula' | 'escuela'          // Tier 3: ID / Consulado / Escuela

export type PdfTier = 1 | 2 | 3

export interface PdfFormMeta {
  id: PdfFormId
  tier: PdfTier
  slug: string
  title: string
  subtitle: string
  description: string
  icon: string
  agency: string
  formCode: string
  price: number // USD cents for PDF paywall tier (catálogo PDF; no es el addon Square `revisionExpress`)
  freeSteps: number  // cuántos pasos puede ver sin pagar
  totalSteps: number
  tags: string[]
  who: string
  docs: DocRequirement[]
}

export interface DocRequirement {
  id: string
  label: string
  required: boolean
  category: 'identity' | 'address' | 'income' | 'nationality' | 'health' | 'other'
  note?: string
}

export interface PdfStep {
  id: string
  title: string
  description?: string
  fields: PdfField[]
  gated?: boolean  // true = requiere pago
}

export interface PdfField {
  id: string
  label: string
  labelEs?: string
  type: 'text' | 'date' | 'select' | 'radio' | 'checkbox' | 'tel' | 'number' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  hint?: string
  formRef?: string  // ref al campo oficial del formulario
  maxLength?: number
  validate?: 'ssn' | 'zip' | 'date' | 'curp'
}

export interface PdfSession {
  formId: PdfFormId
  userId?: string
  sessionId: string
  data: Record<string, unknown>
  currentStep: number
  paid: boolean
  createdAt: string
  updatedAt: string
}

export interface GeneratePdfRequest {
  formId: PdfFormId
  sessionId: string
  data: Record<string, unknown>
}

export interface GeneratePdfResponse {
  success: boolean
  downloadUrl?: string
  error?: string
  requiresPayment?: boolean
  paymentUrl?: string
}

export interface PdfAssistRequest {
  formId: PdfFormId
  fieldId: string
  question: string
  context?: Record<string, unknown>
  lang?: 'es' | 'en'
}

export interface PdfAssistResponse {
  answer: string
  tip?: string
  warning?: string
}

// ── Catálogo completo de formularios ──────────────────────────

export const PDF_CATALOG: PdfFormMeta[] = [
  // TIER 1
  {
    id: 'i821d',
    tier: 1,
    slug: 'daca',
    title: 'Solicitud DACA',
    subtitle: 'Deferred Action for Childhood Arrivals',
    description: 'Prepara tu Formulario I-821D para solicitar o renovar DACA.',
    icon: '🛡️',
    agency: 'USCIS',
    formCode: 'I-821D',
    price: 1900,
    freeSteps: 2,
    totalSteps: 6,
    tags: ['DACA', 'USCIS', 'inmigración'],
    who: 'Personas que llegaron a EE.UU. antes de los 16 años y cumplen los requisitos',
    docs: [
      { id: 'passport', label: 'Pasaporte o documento de viaje extranjero', required: true, category: 'identity' },
      { id: 'entry', label: 'Prueba de entrada a EE.UU. antes de 16 años', required: true, category: 'identity' },
      { id: 'residence', label: 'Prueba de residencia continua desde el 15/06/2007', required: true, category: 'address' },
      { id: 'school', label: 'Diploma o expediente escolar (si aplica)', required: false, category: 'other' },
    ],
  },
  {
    id: 'i765',
    tier: 1,
    slug: 'ead',
    title: 'Permiso de Trabajo EAD',
    subtitle: 'Employment Authorization Document',
    description: 'Solicita o renueva tu tarjeta de autorización de empleo I-765.',
    icon: '💼',
    agency: 'USCIS',
    formCode: 'I-765',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['EAD', 'trabajo', 'USCIS'],
    who: 'Solicitantes de DACA y otros con estatus calificado',
    docs: [
      { id: 'id', label: 'Identificación con foto', required: true, category: 'identity' },
      { id: 'i94', label: 'I-94 o prueba de entrada', required: false, category: 'identity' },
    ],
  },
  {
    id: 'w7',
    tier: 1,
    slug: 'itin',
    title: 'Número ITIN',
    subtitle: 'Individual Taxpayer Identification Number',
    description: 'Solicita tu ITIN (W-7) para pagar impuestos sin Social Security Number.',
    icon: '🔢',
    agency: 'IRS',
    formCode: 'W-7',
    price: 1900,
    freeSteps: 2,
    totalSteps: 4,
    tags: ['ITIN', 'impuestos', 'IRS', 'taxes'],
    who: 'Personas sin SSN que necesitan declarar impuestos federales',
    docs: [
      { id: 'passport', label: 'Pasaporte extranjero (original o copia certificada)', required: true, category: 'identity' },
      { id: 'return', label: 'Declaración de impuestos (si aplica)', required: false, category: 'other' },
    ],
  },
  // TIER 2
  {
    id: 'h1010',
    tier: 2,
    slug: 'snap',
    title: 'Solicitud SNAP',
    subtitle: 'Cupones de Comida · Texas HHSC',
    description: 'Prepara tu solicitud H1010 para SNAP, Medicaid, CHIP y TANF en Texas.',
    icon: '🛒',
    agency: 'Texas HHSC',
    formCode: 'H1010',
    price: 1900,
    freeSteps: 2,
    totalSteps: 6,
    tags: ['SNAP', 'comida', 'Texas', 'beneficios', 'Medicaid', 'CHIP'],
    who: 'Familias de bajos ingresos residentes en Texas',
    docs: [
      { id: 'id', label: 'Identificación con foto', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en Texas', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (si tienes)', required: false, category: 'income' },
    ],
  },
  {
    id: 'w4',
    tier: 2,
    slug: 'w4',
    title: 'W-4 Retención de Impuestos',
    subtitle: 'Employee\'s Withholding Certificate',
    description: 'Llena tu W-4 2026 para que tu empleador retenga la cantidad correcta de impuestos.',
    icon: '📋',
    agency: 'IRS',
    formCode: 'W-4 2026',
    price: 1900,
    freeSteps: 2,
    totalSteps: 4,
    tags: ['W-4', 'impuestos', 'nómina', 'empleo'],
    who: 'Todo empleado nuevo — se entrega al empleador, no al IRS',
    docs: [
      { id: 'ssn', label: 'Social Security Number', required: true, category: 'identity' },
    ],
  },
  {
    id: 'i9',
    tier: 2,
    slug: 'i9',
    title: 'I-9 Verificación de Empleo',
    subtitle: 'Employment Eligibility Verification',
    description: 'Prepara la Sección 1 del I-9 para tu primer día de trabajo en EE.UU.',
    icon: '✅',
    agency: 'USCIS',
    formCode: 'I-9',
    price: 1900,
    freeSteps: 2,
    totalSteps: 4,
    tags: ['I-9', 'empleo', 'trabajo', 'USCIS'],
    who: 'Todo empleado nuevo — ciudadanos y no ciudadanos',
    docs: [
      { id: 'lista_a', label: 'Lista A: Un documento (pasaporte, Green Card, EAD)', required: false, category: 'identity' },
      { id: 'lista_bc', label: 'Lista B + C: ID + Social Security Card', required: false, category: 'identity' },
    ],
  },
  // TIER 2 — California
  {
    id: 'saws1',
    tier: 2,
    slug: 'calfresh-california',
    title: 'CalFresh / Medi-Cal California',
    subtitle: 'SAWS-1 — California Dept. of Social Services',
    description: 'Prepara tu solicitud oficial SAWS-1 de California para CalFresh (SNAP), Medi-Cal y CalWORKs. El PDF se rellena con tus datos y está listo para entregar en tu condado.',
    icon: '🏄',
    agency: 'California CDSS',
    formCode: 'SAWS-1',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['CalFresh', 'Medi-Cal', 'California', 'SNAP', 'beneficios', 'CDSS'],
    who: 'Familias de bajos ingresos residentes en California',
    docs: [
      { id: 'id', label: 'Identificación con foto', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en California', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (si tienes)', required: false, category: 'income' },
    ],
  },
  // TIER 2 — Florida
  {
    id: 'cfes2337',
    tier: 2,
    slug: 'access-florida',
    title: 'ACCESS Florida — SNAP / Medicaid',
    subtitle: 'CF-ES 2337 — Florida Dept. of Children and Families',
    description: 'Prepara tu solicitud CF-ES 2337 de Florida para Food Assistance (SNAP), Medicaid y TCA. El documento se genera con tus datos y está listo para subir a myaccess.myflfamilies.com.',
    icon: '🌴',
    agency: 'Florida DCF',
    formCode: 'CF-ES 2337',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['SNAP', 'Medicaid', 'Florida', 'ACCESS', 'beneficios', 'DCF'],
    who: 'Familias de bajos ingresos residentes en Florida',
    docs: [
      { id: 'id', label: 'Identificación con foto', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en Florida', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (si tienes)', required: false, category: 'income' },
    ],
  },
  {
    id: 'cawic100',
    tier: 2,
    slug: 'wic-california',
    title: 'WIC California — Solicitud de Beneficios',
    subtitle: 'CA-WIC 100 — California Dept. of Public Health (CDPH)',
    description: 'Prepara tu solicitud WIC de California con todos tus datos. El documento se genera listo para llevar a tu cita en la agencia WIC local. Incluye CalFresh, Medi-Cal y CalWORKs si aplica.',
    icon: '🥑',
    agency: 'CDPH — California WIC',
    formCode: 'CA-WIC 100',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['WIC', 'California', 'alimentos', 'embarazada', 'infante', 'CDPH', 'CalFresh'],
    who: 'Embarazadas, madres lactando, infantes y niños hasta 5 años en California',
    docs: [
      { id: 'id', label: 'Identificación con foto (pasaporte, Green Card, Matrícula Consular)', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en California', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (talones de pago, carta de empleador)', required: false, category: 'income' },
      { id: 'pregnancy', label: 'Confirmación de embarazo del médico (si estás embarazada)', required: false, category: 'health' },
      { id: 'birth', label: 'Acta de nacimiento del niño/infante (si aplica)', required: false, category: 'identity' },
    ],
  },
  // TIER 2 — Nueva York
  {
    id: 'ldss2921',
    tier: 2,
    slug: 'snap-nueva-york',
    title: 'SNAP / Medicaid Nueva York',
    subtitle: 'LDSS-2921 — New York Office of Temporary & Disability Assistance',
    description: 'Prepara tu solicitud oficial LDSS-2921 de Nueva York para SNAP, Medicaid, Family Assistance y Safety Net. El documento se genera con tus datos y está listo para subir a mybenefits.ny.gov o llevar a tu HRA/DSS local.',
    icon: '🗽',
    agency: 'NY OTDA / HRA',
    formCode: 'LDSS-2921',
    price: 2900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['SNAP', 'Medicaid', 'Nueva York', 'beneficios', 'OTDA', 'HRA', 'DSS'],
    who: 'Familias de bajos ingresos residentes en Nueva York',
    docs: [
      { id: 'id', label: 'Identificación con foto (pasaporte, Green Card, IDNYC)', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en Nueva York', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (talones de pago, carta de empleador)', required: false, category: 'income' },
      { id: 'ssn', label: 'Social Security Number o prueba de solicitud (si aplica)', required: false, category: 'identity' },
    ],
  },
  {
    id: 'nywic',
    tier: 2,
    slug: 'wic-nueva-york',
    title: 'WIC Nueva York — Solicitud de Beneficios',
    subtitle: 'NY WIC — New York State Dept. of Health',
    description: 'Prepara tu solicitud WIC de Nueva York con todos tus datos. El documento se genera listo para llevar a tu cita en la agencia WIC local o llamar al 1-800-522-5006.',
    icon: '🍎',
    agency: 'NY DOH — WIC Program',
    formCode: 'NY WIC Application',
    price: 2900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['WIC', 'Nueva York', 'alimentos', 'embarazada', 'infante', 'DOH'],
    who: 'Embarazadas, madres lactando, infantes y niños hasta 5 años en Nueva York',
    docs: [
      { id: 'id', label: 'Identificación con foto (pasaporte, Green Card, IDNYC)', required: true, category: 'identity' },
      { id: 'address', label: 'Comprobante de domicilio en Nueva York', required: true, category: 'address' },
      { id: 'income', label: 'Comprobante de ingresos (si tienes)', required: false, category: 'income' },
      { id: 'pregnancy', label: 'Confirmación de embarazo del médico (si estás embarazada)', required: false, category: 'health' },
      { id: 'birth', label: 'Acta de nacimiento del niño/infante (si aplica)', required: false, category: 'identity' },
    ],
  },
  // TIER 3
  {
    id: 'dl14a',
    tier: 3,
    slug: 'texas-id',
    title: 'Texas ID / Licencia de Conducir',
    subtitle: 'Driver License or Identification Card',
    description: 'Genera tu DL-14A pre-llenado para llevar listo a tu cita en el DPS de Texas.',
    icon: '🪪',
    agency: 'Texas DPS',
    formCode: 'DL-14A (Rev. 8/2025)',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['licencia', 'ID', 'Texas', 'DPS', 'identificación'],
    who: 'Adultos 17+ años residentes en Texas',
    docs: [
      { id: 'identity', label: 'Categoría 1 — Prueba de identidad (pasaporte, Green Card, EAD)', required: true, category: 'identity' },
      { id: 'ssn', label: 'Categoría 2 — Social Security Card original', required: true, category: 'identity' },
      { id: 'res1', label: 'Categoría 3 — 2 pruebas de residencia en Texas', required: true, category: 'address' },
    ],
  },
  {
    id: 'matricula',
    tier: 3,
    slug: 'matricula-consular',
    title: 'Matrícula Consular Mexicana',
    subtitle: 'Consulado General de México en Houston',
    description: 'Prepara tu expediente y checklist para sacar la matrícula consular en Houston.',
    icon: '🇲🇽',
    agency: 'SRE / Consulado México',
    formCode: 'MCAS',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['matrícula', 'consulado', 'México', 'Houston', 'identidad'],
    who: 'Mexicanos residentes en el área Houston–Katy–The Woodlands',
    docs: [
      { id: 'nac', label: 'Doc 1 — Nacionalidad: Acta de nacimiento o pasaporte mexicano', required: true, category: 'nationality' },
      { id: 'id', label: 'Doc 2 — Identidad: INE/IFE o licencia', required: true, category: 'identity' },
      { id: 'addr', label: 'Doc 3 — Domicilio en EE.UU. (recibo de servicios, máx. 3 meses)', required: true, category: 'address' },
    ],
  },
  {
    id: 'escuela',
    tier: 3,
    slug: 'inscripcion-escolar',
    title: 'Inscripción Escolar en Texas',
    subtitle: 'Student Enrollment Packet · TEA',
    description: 'Genera el paquete completo de inscripción escolar para HISD, KISD, CFISD y más.',
    icon: '🎓',
    agency: 'TEA / Distrito Escolar',
    formCode: 'TEA 2026–2027',
    price: 1900,
    freeSteps: 2,
    totalSteps: 5,
    tags: ['escuela', 'inscripción', 'HISD', 'KISD', 'educación', 'Texas'],
    who: 'Familias inscribiendo hijos en escuela pública de Texas (Plyler v. Doe)',
    docs: [
      { id: 'birth', label: 'Acta de nacimiento del estudiante (cualquier país)', required: true, category: 'identity' },
      { id: 'vaccines', label: 'Registro de vacunas', required: true, category: 'health' },
      { id: 'address', label: 'Comprobante de domicilio del guardián', required: true, category: 'address' },
    ],
  },
]

export function getFormMeta(id: PdfFormId): PdfFormMeta | undefined {
  return PDF_CATALOG.find(f => f.id === id)
}

export function getFormBySlug(slug: string): PdfFormMeta | undefined {
  return PDF_CATALOG.find(f => f.slug === slug)
}

export function getFormsByTier(tier: PdfTier): PdfFormMeta[] {
  return PDF_CATALOG.filter(f => f.tier === tier)
}

/**
 * Devuelve el formulario oficial recomendado para un funnel + estado.
 * Usado en la página de resultado para enlazar directamente al wizard del formulario.
 */
export function getRecommendedFormForFunnel(
  funnelId: string,
  stateOfResidence?: string,
): PdfFormMeta | undefined {
  const state = (stateOfResidence ?? '').toLowerCase()
  const isCA = state.includes('california') || state === 'ca'
  const isFL = state.includes('florida') || state === 'fl'

  const map: Record<string, PdfFormId> = {
    // SNAP
    snap_ca: 'saws1',
    snap_fl: 'cfes2337',
    snap_tx: 'h1010',
    snap_default: 'h1010',
    // Medicaid
    medicaid_ca: 'saws1',
    medicaid_fl: 'cfes2337',
    medicaid_tx: 'h1010',
    medicaid_default: 'h1010',
    // WIC
    wic_ca: 'cawic100',
    wic_fl: 'cfes2337',
    wic_tx: 'cawic100',
    wic_ny: 'nywic',
    wic_default: 'cawic100',
    // Nueva York SNAP/Medicaid
    snap_ny: 'ldss2921',
    medicaid_ny: 'ldss2921',
    // DACA / Inmigración
    daca_default: 'i821d',
    // ITIN
    itin_default: 'w7',
    // Impuestos
    taxes_default: 'w4',
    // ID Texas
    id_default: 'dl14a',
    // Matrícula
    matricula_default: 'matricula',
    // Escuela
    escuela_default: 'escuela',
  }

  const isNY = state.includes('new york') || state.includes('nueva york') || state === 'ny'
  const suffix = isCA ? 'ca' : isFL ? 'fl' : isNY ? 'ny' : 'tx'
  const key = `${funnelId}_${suffix}` in map
    ? `${funnelId}_${suffix}`
    : `${funnelId}_default`

  const formId = map[key]
  if (!formId) return undefined
  return getFormMeta(formId)
}
