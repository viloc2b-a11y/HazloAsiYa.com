/**
 * System prompts y esquemas de cuestionario por trámite (FY2026 orientativo).
 * Los funnelId deben coincidir con `FunnelId` en data/funnels.ts.
 */
import type { FunnelId } from '../data/funnels'
import type { QuestionnaireField } from '../types/ai'

export const STANDARD_DISCLAIMER =
  'Este resultado es una estimación orientativa. La elegibilidad real la determina la agencia oficial según tu documentación completa. Verifica en la fuente oficial antes de enviar tu solicitud.'

/** Descripción del JSON de salida para inyectar en cada system prompt. */
export const OUTPUT_SCHEMA = `
OUTPUT (solo JSON válido, sin markdown ni texto fuera del objeto):
{
  "eligibility": "likely" | "possible" | "unlikely",
  "summary": "máximo 2 oraciones en español simple",
  "missing_documents": ["strings"],
  "steps": ["máximo 6 pasos accionables"],
  "common_errors": ["máximo 4"],
  "official_links": ["solo URLs oficiales"],
  "disclaimer": "${STANDARD_DISCLAIMER.replace(/"/g, '\\"')}"
}

Reglas globales:
- Español simple (grado 6–8). Sin asesoría legal ni garantías. Sin inventar datos del usuario.
- Sin mencionar precios ni planes de HazloAsíYa.
- Campo faltante o ambiguo en el input → eligibility "possible".
- Para ingresos vs límite: <80% límite likely; 80–100% possible; >100% unlikely (salvo reglas del programa).
- Estatus: citizen/permanent_resident → mayoría de programas; daca → ITIN/taxes/TX ID sí; SNAP federal/Medicaid estándar TX no; undocumented → emergencias/ITIN/escuela (Plyler); hijos ciudadanos sí SNAP/Medicaid/WIC; unknown → possible.
- disclaimer debe ser exactamente el texto fijo indicado arriba.
`.trim()

const SNAP_LIMITS =
  'Límites SNAP Texas FY2026 ingreso bruto mensual: 1p $1,580 | 2p $2,137 | 3p $2,694 | 4p $3,250 | 5p $3,807 | 6p $4,364 | 7p $4,921 | 8p $5,478 | +1 persona +$557.'

const WIC_LIMITS =
  'Límites WIC Texas FY2026 (185% FPL bruto mensual): 1p $2,248 | 2p $3,041 | 3p $3,834 | 4p $4,628 | 5p $5,421 | 6p $6,214 | +1 +$793.'

function p(body: string): string {
  return `${body.trim()}\n\n${OUTPUT_SCHEMA}`
}

export const SYSTEM_PROMPTS: Record<FunnelId, string> = {
  snap: p(`Eres el asistente de HazloAsíYa para SNAP Texas. Analiza el input y devuelve JSON válido.

${SNAP_LIMITS}
Elegibilidad por ingreso: <80% del límite likely; 80–100% possible; >límite unlikely. Campo faltante → possible. Sin documentos → listar en missing_documents, no usar unlikely solo por eso.
Documentos típicos: ID con foto, comprobante domicilio TX, comprobante ingresos, SSN o ITIN si aplica, datos de todos en el hogar.
Pasos TX: YourTexasBenefits.com cuenta → solicitud en línea → subir o llevar documentos → entrevista HHSC si la piden → revisar estado en portal/app.
Errores comunes: fotos borrosas; no reportar ingresos de todos; no contestar HHSC; olvidar firmar/fechar.
Enlaces: https://www.yourtexasbenefits.com https://www.hhs.texas.gov/services/food/snap-food-benefits https://www.fns.usda.gov/snap
Migración: sin papeles puede aplicar para hijos ciudadanos → possible; DACA en Texas generalmente no califica SNAP federal → unlikely salvo hijos ciudadanos.`),

  medicaid: p(`Eres el asistente de HazloAsíYa para Medicaid y CHIP en Texas.

REGLA CRÍTICA: Texas NO expandió Medicaid del ACA. Adulto sin hijos dependientes menores → unlikely; incluir en steps explorar Marketplace https://www.healthcare.gov
CHIP niños hasta ~201% FPL (referencia familia 3 ~$4,121/mes bruto). Embarazadas hasta ~198% FPL (~$4,060/mes f3). Padres/cuidadores con hijos: reglas MUY restrictivas (~$369/mes f3 referencia). Adultos 65+ o discapacidad: evaluar bajo SSI/SSA → possible.
Documentos: ID adultos, domicilio TX, ingresos, actas niños, documentación embarazo si aplica.
Apply: YourTexasBenefits.com (Medicaid/CHIP junto con otros beneficios).
Enlaces: https://www.yourtexasbenefits.com https://www.hhs.texas.gov/services/health/medicaid-chip https://www.healthcare.gov`),

  wic: p(`Eres el asistente de HazloAsíYa para WIC Texas. Programa nutrición embarazo/postparto/lactancia/bebé hasta 12m/niño 1–5 años.

${WIC_LIMITS}
Grupos: embarazada; postparto hasta 6m (12m si lacta); bebé 0–12m; niño hasta 5 años. Adultos sin niño o niño >5 → no aplica.
Documentos: ID, domicilio TX, ingresos, prueba categoría (acta, carta embarazo, etc.).
Apply: 1-800-942-3678 o clínica en texaswic.org
Enlaces: https://www.dshs.texas.gov/wic https://texaswic.org https://www.fns.usda.gov/wic`),

  twc: p(`Eres el asistente de HazloAsíYa para desempleo TWC Texas.
Requiere SSN y autorización legal de trabajo → sin SSN unlikely. Despido sin causa + base de salarios/semanas: likely si cumple. Renuncia voluntaria sin causa justificada unlikely. Reducción involuntaria possible. Base period: típicamente primeros 4 de últimos 5 trimestres (orientativo).
Errores: no reportar otros ingresos; no buscar trabajo activamente; no responder TWC; renuncia sin documentar causa.
Enlaces: https://www.twc.texas.gov/jobseekers/unemployment-benefits-services https://ui.texasworkforce.org`),

  itin: p(`Eres el asistente de HazloAsíYa para ITIN (W-7, IRS).
Si califica para SSN → no debe pedir ITIN → unlikely para ITIN. ITIN es quien no califica a SSN y necesita ID fiscal.
likely: ingresos US sin SSN; dependiente/cónyuge de residente con requisitos. unclear → possible.
Documentos: pasaporte vigente puede bastar solo; sin pasaporte: acta + ID + visa/I-94; prueba de razón del ITIN.
Circular 230: HazloAsíYa no es Acceptance Agent ni preparador certificado. Incluir en steps programa VITA: https://www.irs.gov/individuals/find-a-location-for-free-tax-prep
ITIN puede vencer por no usar 3 años o reglas IRS — orientar a verificar en IRS.
Enlaces: https://www.irs.gov/itin https://www.irs.gov/individuals/how-do-i-apply-for-an-itin`),

  taxes: p(`Eres el asistente de HazloAsíYa para impuestos IRS EE.UU.
likely: SSN o ITIN vigente con ingresos que deban declararse. ITIN vencido → possible (renovar). Sin SSN/ITIN con ingresos → possible (ITIN primero). Sin ingresos US → evaluar si aún debe declarar.
Si ingreso total < $67,000 → recomendar VITA gratis; incluir en official_links find-a-location-for-free-tax-prep.
Circular 230: no preparación ni asesoría fiscal; steps con VITA o CPA/EA.
Errores: omitir 1099; no reclamar créditos; ITIN vencido sin renovar; no guardar copia.
Enlaces: https://www.irs.gov https://www.irs.gov/individuals/find-a-location-for-free-tax-prep https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit`),

  escuela: p(`Eres el asistente de HazloAsíYa para inscripción escolar Texas.
Plyler v. Doe: escuelas públicas deben inscribir residentes del área sin importar estatus; no exigir SSN ni pruebas migratorias como condición.
likely si vive en el distrito TX. unlikely si no reside en Texas.
McKinney-Vento: vivienda temporal/inestable → steps deben mencionar derechos (inscripción inmediata, liaison del distrito) y guía federal.
Documentos alternativos si faltan: pasaporte/consular; domicilio con carta+ID; vacunas condicionales ~30 días.
Enlaces: https://tea.texas.gov https://www2.ed.gov/programs/homeless/guidance.pdf`),

  iep: p(`Eres el asistente de HazloAsíYa para IEP (IDEA).
Derechos: evaluación gratuita en plazo tras solicitud por escrito; reunión de equipo; LRE.
Si distrito negó evaluación → possible; steps: solicitud por escrito, respuesta escrita, TEA.
likely si niño en escuela TX y padres piden evaluación formal por escrito.
Enlaces: https://tea.texas.gov/academics/special-student-populations/special-education https://sites.ed.gov/idea`),

  prek: p(`Eres el asistente de HazloAsíYa para Pre-K público Texas.
Elegible si cumple AL MENOS UNO: inglés limitado; elegibilidad SNAP/Medicaid/Head Start; vivienda inestable; foster; hijo militar activo/veterano. Ninguno → unlikely para gratuito; mencionar Pre-K de pago en algunos distritos.
Enlaces: https://tea.texas.gov/academics/early-childhood-education/pre-kindergarten`),

  id: p(`Eres el asistente de HazloAsíYa para Texas ID/licencia DPS.
likely: ciudadano o LPR; DACA con EAD vigente; visa trabajo vigente; TPS vigente. Sin estatus legal → unlikely para DL estándar.
REAL ID/STAR: prueba ciudadanía o estatus legal. Primera vez: prueba identidad/legal, SSN o carta SSA no-elegibilidad, 2 domicilios TX. Cita en línea DPS.
Enlaces: https://www.dps.texas.gov/section/driver-license https://www.dps.texas.gov/DriverLicense/ApplyforLicense.htm`),

  matricula: p(`Eres el asistente de HazloAsíYa para matrícula consular.
La emite el consulado del país; HazloAsíYa no tramita. likely para nacional residente en US con documentos consulares.
Ejemplo México: cita consulado; INE/pasaporte, acta, domicilio US, fotos.
Enlaces: https://consulmex.sre.gob.mx https://consulmex.sre.gob.mx/houston`),

  bank: p(`Eres el asistente de HazloAsíYa para abrir cuenta bancaria US.
likely: con SSN o ITIN. possible: matrícula consular sin SSN/ITIN en algunos bancos. unlikely: sin ID válido.
Opciones informativas (verificar local): bancos tradicionales, credit unions, apps; CFPB/FDIC para derechos. Sin afiliación comercial salvo enlace activo declarado.
Enlaces: https://www.consumerfinance.gov https://www.fdic.gov/resources/consumers/banks-without-borders`),

  daca: p(`Eres el asistente de HazloAsíYa para orientación DACA.
DACA bajo litigación; reglas cambian. SIEMPRE steps con abogado u organización acreditada DOJ antes de enviar a USCIS.
Primera solicitud: llegada antes 15-jun-2007; edad <16 al llegar; residencia continua; sin crimen grave — si no cumple unlikely. Si cumple requisitos → nunca "likely", máximo "possible" (USCIS decide).
Renovación: EAD vigente o vencido <1 año likely; >1 año possible.
Formularios I-821D + I-765; tarifas actuales en uscis.gov.
Enlaces: https://www.uscis.gov/daca https://www.justice.gov/eoir/list-recognized-organizations-and-accredited-representatives`),

  rent: p(`Eres el asistente de HazloAsíYa para ayuda con renta Texas.
Programas: ERA/HAF locales, Section 8 (esperas), programas municipales/condado.
<80% AMI área → likely orientativo; aviso desalojo → prioridad likely; sin docs renta → possible.
Referencia Houston 2026 (orientativa): AMI ~115k/año f4; 80% ~92k; usar como guía no exacta.
Desalojo urgente: incluir Texas RioGrande Legal Aid 1-888-988-9996.
Enlaces: https://www.tdhca.state.tx.us https://www.hud.gov/states/texas/renting https://211texas.org`),

  utilities: p(`Eres el asistente de HazloAsíYa para ayuda servicios (luz/gas/agua) Texas.
LIHEAP/TDHCA y agencias locales. <150% FPL likely; 150–200% possible; aviso de corte → prioridad likely. Temporadas de apertura varían por condado.
Enlaces: https://www.tdhca.state.tx.us/community-affairs/weatherization https://www.benefits.gov/benefit/622 https://211texas.org`),

  jobs: p(`Eres el asistente de HazloAsíYa para búsqueda de empleo Texas.
Trabajo formal: ciudadano/LPR likely; EAD vigente (DACA/TPS/etc.) likely; sin autorización unlikely para empleo formal (ITIN cuenta propia posible en algunos casos).
Recursos: WorkInTexas.com, Workforce Solutions, ESL local.
Errores: I-9 no listo; EAD vencido; no preparar documentación.
Enlaces: https://www.workintexas.com https://www.twc.texas.gov/jobseekers/find-workforce-solutions-office`),
}

export const QUESTIONNAIRE_FIELDS: Record<FunnelId, QuestionnaireField[]> = {
  snap: [
    { id: 'household_size', label: '¿Cuántas personas viven en tu hogar?', type: 'number', hint: 'Incluye a todos: niños, adultos, tú mismo', required: true },
    { id: 'monthly_income_gross', label: '¿Cuánto gana tu hogar al mes antes de impuestos?', type: 'currency', hint: 'Suma el ingreso de todos los adultos del hogar', required: true },
    { id: 'has_children', label: '¿Hay niños menores de 18 años en tu hogar?', type: 'boolean', required: false },
    { id: 'immigration_status', label: '¿Cuál es tu estatus migratorio?', type: 'enum', options: ['ciudadano/residente', 'DACA', 'permiso de trabajo', 'sin documentos', 'prefiero no decir'], required: false },
    { id: 'documents_available', label: '¿Cuáles documentos ya tienes?', type: 'multiselect', options: ['ID con foto', 'comprobante de domicilio', 'comprobante de ingresos', 'SSN o ITIN', 'info del hogar', 'gastos mensuales'], required: false },
    { id: 'monthly_expenses_rent', label: 'Gasto mensual renta', type: 'currency', required: false },
    { id: 'monthly_expenses_utilities', label: 'Gasto mensual servicios', type: 'currency', required: false },
    { id: 'monthly_expenses_childcare', label: 'Gasto mensual cuidado infantil', type: 'currency', required: false },
    { id: 'monthly_expenses_medical', label: 'Gasto mensual médico', type: 'currency', required: false },
  ],
  medicaid: [
    { id: 'applicant_category', label: '¿Para quién es el Medicaid?', type: 'enum', options: ['embarazada', 'niño (CHIP)', 'adulto con hijos menores', 'adulto mayor 65+', 'persona con discapacidad', 'adulto sin hijos'], required: true },
    { id: 'household_size', label: '¿Cuántas personas viven en tu hogar?', type: 'number', required: false },
    { id: 'monthly_income_gross', label: 'Ingreso bruto mensual del hogar', type: 'currency', required: false },
    { id: 'children_ages', label: '¿Qué edades tienen los niños? (lista separada por comas)', type: 'text', hint: 'CHIP cubre hasta los 18 años', required: false },
    { id: 'pregnancy_weeks', label: '¿Cuántas semanas de embarazo? (si aplica)', type: 'number', required: false },
    { id: 'has_disability_certification', label: '¿Tienes certificación de discapacidad?', type: 'boolean', required: false },
    { id: 'immigration_status', label: '¿Cuál es tu estatus migratorio?', type: 'enum', options: ['ciudadano/residente', 'DACA', 'permiso', 'sin documentos', 'prefiero no decir'], required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['ID adultos', 'comprobante domicilio TX', 'comprobante ingresos', 'actas de nacimiento niños', 'documentación embarazo'], required: false },
  ],
  wic: [
    { id: 'wic_category', label: '¿Para quién es el WIC?', type: 'enum', options: ['embarazada', 'madre postparto (hasta 6 meses)', 'madre lactando (hasta 12 meses)', 'bebé (hasta 12 meses)', 'niño (1–5 años)'], required: true },
    { id: 'child_age_months', label: 'Edad del niño en meses (si aplica)', type: 'number', required: false },
    { id: 'household_size', label: '¿Cuántas personas viven en tu hogar?', type: 'number', required: false },
    { id: 'monthly_income_gross', label: 'Ingreso bruto mensual del hogar', type: 'currency', required: false },
    { id: 'texas_resident', label: '¿Vives en Texas actualmente?', type: 'boolean', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['ID con foto', 'comprobante domicilio TX', 'comprobante ingresos', 'documentación embarazo/parto', 'acta nacimiento del bebé o niño'], required: false },
  ],
  twc: [
    { id: 'employment_status', label: '¿Por qué dejaste de trabajar?', type: 'enum', options: ['me despidieron sin causa', 'redujeron mis horas', 'renuncié por causa justificada', 'renuncié voluntariamente', 'empresa cerró', 'otro'], required: true },
    { id: 'weeks_worked_last_18mo', label: 'Semanas trabajadas en los últimos 18 meses', type: 'number', hint: 'Suma todos tus empleos', required: false },
    { id: 'wages_last_18mo', label: 'Total ganado en últimos 18 meses', type: 'currency', required: false },
    { id: 'has_ssn', label: '¿Tienes SSN?', type: 'boolean', hint: 'Requerido para TWC', required: false },
    { id: 'authorized_to_work', label: '¿Autorización legal para trabajar en EE.UU.?', type: 'boolean', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['SSN', 'ID con foto', 'historial de empleos', 'carta de despido o separación', 'últimos talones de cheque'], required: false },
  ],
  itin: [
    { id: 'reason_for_itin', label: '¿Por qué necesitas el ITIN?', type: 'enum', options: ['declarar impuestos como no-residente', 'declarar impuestos con ingresos en EE.UU.', 'ser reclamado como dependiente', 'ser cónyuge de residente/ciudadano', 'abrir cuenta bancaria / otros'], required: true },
    { id: 'has_ssn', label: '¿Tienes o calificas para SSN?', type: 'boolean', hint: 'Si calificas para SSN, debes usarlo en vez del ITIN', required: false },
    { id: 'has_us_income', label: '¿Tienes ingresos en EE.UU. que declarar?', type: 'boolean', required: false },
    { id: 'itin_status', label: '¿Tienes ITIN actualmente?', type: 'enum', options: ['no tengo', 'tengo pero venció', 'tengo y está vigente', 'no sé'], required: false },
    { id: 'has_passport', label: '¿Tienes pasaporte vigente?', type: 'boolean', hint: 'Documento más aceptado para W-7', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['pasaporte vigente', 'ID consular / matrícula', 'acta de nacimiento', 'visa / I-94', 'comprobante de ingresos en EE.UU.', 'declaración de impuestos del año pasado'], required: false },
  ],
  taxes: [
    { id: 'tax_year', label: '¿Para qué año fiscal declaras?', type: 'number', required: false },
    { id: 'taxpayer_id', label: '¿Con qué número declaras?', type: 'enum', options: ['SSN', 'ITIN vigente', 'ITIN vencido o sin ITIN', 'no sé'], required: true },
    { id: 'income_sources', label: '¿De dónde vienen tus ingresos?', type: 'multiselect', options: ['empleo con W-2', 'trabajo independiente/1099', 'negocio propio', 'renta de propiedades', 'inversiones', 'sin ingresos en EE.UU.'], required: false },
    { id: 'filing_status', label: '¿Cómo vas a declarar?', type: 'enum', options: ['soltero', 'casado declarando juntos', 'casado declarando por separado', 'jefe de familia', 'no sé'], required: false },
    { id: 'has_dependents', label: '¿Tienes dependientes?', type: 'boolean', required: false },
    { id: 'vita_eligible', label: '¿Tu ingreso total fue menor a $67,000 en el año?', type: 'boolean', hint: 'VITA gratuito', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['W-2 de empleadores', '1099 de clientes o bancos', 'SSN o ITIN', 'comprobante de gastos deducibles', 'declaración del año pasado', 'ID con foto'], required: false },
  ],
  escuela: [
    { id: 'child_age', label: '¿Cuántos años tiene el niño o niña?', type: 'number', hint: 'Texas: Kinder ~5, Pre-K ~4', required: true },
    { id: 'texas_district', label: '¿Ciudad o condado?', type: 'text', hint: 'Distrito según domicilio', required: false },
    { id: 'enrollment_type', label: '¿Primera vez en EE.UU. o cambio de escuela?', type: 'enum', options: ['primera vez en EE.UU.', 'viene de otra escuela de TX', 'viene de otra escuela fuera de TX', 'regresa después de ausencia'], required: false },
    { id: 'special_needs', label: '¿Necesidades de educación especial (IEP)?', type: 'boolean', required: false },
    { id: 'housing_situation', label: '¿Situación de vivienda?', type: 'enum', options: ['vivienda estable', 'viviendo con familiares/amigos', 'situación temporal o inestable', 'prefiero no decir'], required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['comprobante de domicilio en el distrito', 'ID del padre/tutor', 'acta de nacimiento del niño', 'registro de vacunas', 'expediente escolar anterior', 'ninguno de los anteriores'], required: false },
  ],
  iep: [
    { id: 'child_age', label: 'Edad del niño', type: 'number', required: true },
    { id: 'child_enrolled_in_texas_school', label: '¿Inscrito en escuela de Texas?', type: 'boolean', required: false },
    { id: 'current_iep_status', label: 'Situación IEP', type: 'enum', options: ['sin IEP, quiero evaluar', 'tiene IEP, quiero revisar', 'tiene IEP de otro estado', 'el distrito negó la evaluación'], required: false },
    { id: 'disability_type', label: 'Áreas (opcional)', type: 'multiselect', options: ['aprendizaje', 'habla/lenguaje', 'autismo', 'física/motora', 'emocional/conductual', 'otra', 'no sé'], required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['evaluaciones previas', 'IEP anterior', 'cartas del médico o especialista', 'historial académico'], required: false },
  ],
  prek: [
    { id: 'child_age', label: 'Edad del niño', type: 'number', hint: 'Pre-K público gratuito típico a los 4 años', required: true },
    { id: 'child_qualifies_reason', label: '¿Cumple algún requisito?', type: 'multiselect', options: ['inglés limitado o no habla inglés', 'familia con ingresos bajos (SNAP/Medicaid/WIC)', 'sin hogar o vivienda inestable', 'en el sistema de cuidado tutelar (foster care)', 'hijo de militar activo o veterano', 'ninguno de los anteriores'], required: false },
    { id: 'texas_district', label: 'Distrito o ciudad', type: 'text', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['acta de nacimiento', 'comprobante domicilio', 'comprobante de elegibilidad (SNAP, Medicaid, etc.)', 'ID del padre/tutor'], required: false },
  ],
  id: [
    { id: 'id_type_needed', label: '¿Qué necesitas?', type: 'enum', options: ['ID estatal (sin conducir)', 'licencia de conducir', 'renovación de ID', 'renovación de licencia', 'Real ID / STAR'], required: true },
    { id: 'is_first_time', label: '¿Primera vez con ID en Texas?', type: 'boolean', required: false },
    { id: 'has_texas_residence', label: '¿Resides en Texas?', type: 'boolean', required: false },
    { id: 'immigration_document', label: 'Documento migratorio', type: 'enum', options: ['ciudadano (acta + pasaporte)', 'residente permanente (green card)', 'DACA (EAD vigente)', 'visa de trabajo (H, L, O, etc.)', 'TPS', 'otro permiso', 'ninguno'], required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['prueba de ciudadanía o residencia legal', 'SSN o carta de no-elegibilidad del SSA', 'dos comprobantes de domicilio en TX', 'documento migratorio vigente'], required: false },
  ],
  matricula: [
    { id: 'nationality', label: '¿Nacionalidad?', type: 'text', hint: 'Consulado de tu país', required: false },
    { id: 'has_mexican_id', label: '¿Identificación oficial mexicana (INE, pasaporte)?', type: 'boolean', required: false },
    { id: 'has_proof_of_us_residence', label: '¿Comprobante de residencia en EE.UU.?', type: 'boolean', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['INE o credencial mexicana', 'pasaporte del país de origen', 'acta de nacimiento', 'comprobante de domicilio en EE.UU.', 'fotos tamaño pasaporte'], required: false },
  ],
  bank: [
    { id: 'has_ssn', label: '¿Tienes SSN?', type: 'boolean', required: false },
    { id: 'has_itin', label: '¿Tienes ITIN?', type: 'boolean', required: false },
    { id: 'has_id', label: 'Identificación', type: 'enum', options: ['ID Texas', 'licencia TX', 'pasaporte vigente', 'matrícula consular', 'ninguno'], required: false },
    { id: 'bank_type_preferred', label: 'Tipo de cuenta preferido', type: 'enum', options: ['banco tradicional', 'banco digital / app', 'credit union', 'no sé, recomiéndame'], required: false },
    { id: 'purpose', label: 'Objetivos', type: 'multiselect', options: ['recibir cheques de trabajo', 'enviar remesas', 'ahorrar dinero', 'construir historial crediticio', 'tener cuenta para ITIN / taxes'], required: false },
  ],
  daca: [
    { id: 'daca_action', label: '¿Qué necesitas?', type: 'enum', options: ['primera solicitud', 'renovación', 'advance parole', 'perdí mi DACA', 'no sé mi situación'], required: true },
    { id: 'arrived_before_june_2007', label: '¿Llegaste antes del 15 de junio de 2007?', type: 'boolean', required: false },
    { id: 'age_at_arrival', label: '¿Edad al llegar a EE.UU.?', type: 'number', hint: 'DACA: antes de cumplir 16', required: false },
    { id: 'current_ead_expiry', label: 'Vencimiento EAD actual (si renueva)', type: 'date', required: false },
    { id: 'has_criminal_record', label: '¿Antecedentes penales o tráfico graves?', type: 'boolean', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['pasaporte o matrícula', 'prueba de llegada antes de 2007', 'diplomas o transcripciones escolares', 'I-821D e I-765 anteriores (si renueva)', 'EAD actual'], required: false },
  ],
  rent: [
    { id: 'rent_situation', label: 'Situación de renta', type: 'enum', options: ['atrasado en pagos', 'recibí aviso de desalojo', 'anticipo de renta futura', 'busco subsidio permanente'], required: true },
    { id: 'household_size', label: 'Personas en el hogar', type: 'number', required: false },
    { id: 'monthly_income', label: 'Ingreso mensual del hogar', type: 'currency', required: false },
    { id: 'monthly_rent', label: 'Renta mensual', type: 'currency', required: false },
    { id: 'has_lease', label: '¿Tienes contrato de arrendamiento?', type: 'boolean', required: false },
    { id: 'has_eviction_notice', label: '¿Aviso de desalojo?', type: 'boolean', required: false },
    { id: 'county', label: 'Condado en Texas', type: 'text', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['contrato de renta vigente', 'comprobante de ingresos', 'aviso de desalojo (si aplica)', 'ID con foto', 'comprobante de atraso en pagos'], required: false },
  ],
  utilities: [
    { id: 'utility_type', label: 'Servicios', type: 'multiselect', options: ['electricidad', 'gas', 'agua', 'internet'], required: false },
    { id: 'household_size', label: 'Personas en el hogar', type: 'number', required: false },
    { id: 'monthly_income', label: 'Ingreso mensual', type: 'currency', required: false },
    { id: 'has_elderly_or_disabled', label: '¿Mayor o persona con discapacidad en el hogar?', type: 'boolean', required: false },
    { id: 'utility_shutoff_notice', label: '¿Aviso de corte de servicio?', type: 'boolean', required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['ID con foto', 'comprobante de domicilio', 'comprobante de ingresos', 'factura de servicios reciente', 'aviso de corte (si aplica)'], required: false },
  ],
  jobs: [
    { id: 'work_authorization', label: 'Autorización de trabajo', type: 'enum', options: ['ciudadano/residente', 'EAD/permiso de trabajo vigente', 'DACA', 'visa de trabajo', 'sin autorización actual'], required: true },
    { id: 'job_search_status', label: 'Situación laboral', type: 'enum', options: ['busco primer empleo en EE.UU.', 'cambio de empleo', 'desempleado buscando trabajo', 'quiero trabajo adicional'], required: false },
    { id: 'skills_or_industry', label: 'Área o industria', type: 'text', required: false },
    { id: 'has_ssn', label: '¿Tienes SSN?', type: 'boolean', required: false },
    { id: 'english_level', label: 'Nivel de inglés', type: 'enum', options: ['ninguno', 'básico', 'intermedio', 'fluido'], required: false },
    { id: 'documents_available', label: 'Documentos disponibles', type: 'multiselect', options: ['SSN', 'EAD o permiso de trabajo', 'ID con foto', 'resume / CV', 'diplomas o certificaciones'], required: false },
  ],
}

const GENERIC_PROMPT = p(`Eres el asistente de HazloAsíYa para trámites en Texas y EE.UU. Usa solo datos del usuario; si faltan, eligibility "possible". Incluye enlaces oficiales verificables.`)

export function getSystemPrompt(funnelId: string): string {
  if (funnelId in SYSTEM_PROMPTS) return SYSTEM_PROMPTS[funnelId as FunnelId]
  return GENERIC_PROMPT
}

export function getQuestionnaireFields(funnelId: string): QuestionnaireField[] {
  if (funnelId in QUESTIONNAIRE_FIELDS) return QUESTIONNAIRE_FIELDS[funnelId as FunnelId]
  return []
}
