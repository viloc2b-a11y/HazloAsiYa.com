import type { FunnelId } from './funnels'

/**
 * Intención SEO (metadata / Open Graph). No usar como H1 del hero: aquí van keywords y SERP.
 * @see docs/seo-bloques-y-prompts.md — prompt bloque META
 */
export const FUNNEL_SEO: Partial<
  Record<FunnelId, { title: string; description: string; ogTitle?: string }>
> = {
  snap: {
    title: 'Cómo solicitar SNAP en español — TX, CA, FL, NY | HazloAsíYa',
    description:
      '¿Calificas para SNAP? Guía completa: documentos, límites de ingresos 2026 y cómo aplicar sin errores en Texas, California, Florida o Nueva York. Evaluación gratis.',
    ogTitle: 'Cómo solicitar SNAP en español — 4 estados',
  },
  medicaid: {
    title: 'Medicaid en español — TX, CA, FL, NY | HazloAsíYa',
    description:
      'Descubre si calificas para Medicaid o CHIP: requisitos, grupos elegibles y cómo completar la solicitud en español. Disponible en Texas, California, Florida y Nueva York.',
    ogTitle: 'Medicaid y CHIP en español — 4 estados',
  },
  itin: {
    title: 'ITIN en español: qué es y formulario W-7 | HazloAsíYa',
    description:
      'Aprende qué es el ITIN, para qué sirve y cómo solicitarlo con el formulario W-7. Guía paso a paso en español. Evaluación gratuita.',
    ogTitle: 'ITIN en español: guía y formulario W-7',
  },
  wic: {
    title: 'WIC en Texas en español: requisitos y cita | HazloAsíYa',
    description:
      'WIC en Texas: quién califica, documentos para la cita y cómo usar texaswic.org. Orientación en español. Evaluación gratis.',
    ogTitle: 'WIC en Texas en español',
  },
  escuela: {
    title: 'Inscripción escolar Texas en español | HazloAsíYa',
    description:
      'Documentos y pasos para inscribir a tu hijo en escuela pública en Texas: ISD, vacunas y Home Language Survey. Gratis.',
    ogTitle: 'Inscripción escolar en Texas',
  },
  daca: {
    title: 'Renovar DACA: formularios USCIS en español | HazloAsíYa',
    description:
      'Renueva DACA con orientación sobre I-821D e I-765, plazos y USCIS. Contenido educativo en español. No es asesoría legal.',
    ogTitle: 'Renovar DACA — orientación USCIS',
  },
  taxes: {
    title: 'Impuestos IRS en español: ITIN y VITA | HazloAsíYa',
    description:
      'Declara impuestos en español: documentos, ITIN, créditos y VITA gratis. Orientación educativa, no preparación oficial.',
    ogTitle: 'Impuestos en español — IRS y VITA',
  },
  rent: {
    title: 'Ayuda para renta en Texas en español | HazloAsíYa',
    description:
      'Orientación sobre alquiler, HUD y ayuda para pagar renta en Texas. Listas de espera y enlaces oficiales.',
    ogTitle: 'Ayuda para renta en Texas',
  },
}

/**
 * Intención conversión (hero). Español muy simple; usuario inseguro / miedo a equivocarse.
 * Límites §1: titular ≤10 palabras, subtítulo ≤18, CTA hero ≤6 (español).
 * @see docs/seo-bloques-y-prompts.md — prompt bloque HERO
 */
/** Campos de conversión §3f (tarjeta central) y §3g (cierre). @see docs/seo-bloques-y-prompts.md */
export type FunnelHeroFields = {
  headline: string
  subhead: string
  ctaHero?: string
  ctaCard?: string
  ctaCardEyebrow?: string
  ctaCardTitle?: string
  ctaCardLead?: string
  ctaCloseLead?: string
  ctaCloseButton?: string
  /** Una línea: qué ve el usuario en cuanto termina (§3g). */
  ctaCloseImmediate?: string
  /** Micro-copy anti-dudas bajo el botón. */
  ctaCloseReassurance?: string
}

export const FUNNEL_HERO: Partial<Record<FunnelId, FunnelHeroFields>> = {
  snap: {
    headline: 'SNAP: lista de papeles y pasos para tu estado',
    subhead:
      'Sales con la lista exacta que te van a pedir en tu caso, sin adivinar. Tras el cuestionario ves en pantalla qué traer, qué te falta y qué errores devuelven la solicitud.',
    ctaHero: 'Ver mi lista SNAP gratis →',
    ctaCard: 'Obtener mi checklist SNAP →',
    ctaCardEyebrow: 'En ~5 min · $0',
    ctaCardTitle: 'Recibes una lista concreta: documentos, orden y qué no enviar',
    ctaCardLead:
      'Respondes sobre tu hogar y estado, y salen los ítems que la agencia suele pedir en tu caso, numerados para imprimir o llevar al teléfono.',
    ctaCloseLead:
      'La mayoría de retrasos pasa por una lista vieja o incompleta. Si eso ocurre, te piden corregir y volver, y el proceso puede moverse semanas. Tómalo ahora y revisa tu carpeta con la versión correcta antes de enviar o ir en persona.',
    ctaCloseButton: 'Ver mi lista SNAP correcta ahora (gratis) →',
    ctaCloseImmediate:
      'Al terminar ves en pantalla tu lista exacta (documentos + orden) para este trámite.',
    ctaCloseReassurance:
      'Gratis · sin tarjeta · tú envías la solicitud oficial a la agencia de tu estado. Si algo no aplica a tu hogar, lo ves antes de gastar tiempo en fila. Si te falta algo, la tarjeta no se activa hasta corregirlo. Te toma menos de 5 minutos y sales con la lista lista para usar hoy.',
  },
  medicaid: {
    headline: 'Medicaid / CHIP: grupo probable de tu hogar según tu estado',
    subhead:
      'Sales con la lista exacta que te van a pedir en tu caso, sin adivinar: hipótesis clara (niño, embarazo, padre, etc.) y los documentos para el portal de tu estado.',
    ctaHero: 'Ver mi grupo y papeles →',
    ctaCard: 'Obtener lista para Medicaid →',
    ctaCardEyebrow: 'Sin cuenta · gratis',
    ctaCardTitle: 'Recibes qué categoría revisar y qué documentos subir primero',
    ctaCardLead:
      'El cuestionario mapea tu hogar a las reglas de tu estado y arma la carpeta antes del portal oficial.',
    ctaCloseLead:
      'La mayoría de retrasos pasa por usar una lista vieja o incompleta. Si eso ocurre, te piden corregir y volver, y el proceso puede moverse semanas. Tómalo ahora y revisa tu carpeta con la versión correcta antes de enviar o ir en persona.',
    ctaCloseButton: 'Ver mi lista Medicaid correcta ahora (gratis) →',
    ctaCloseImmediate:
      'Al terminar ves en pantalla tu lista exacta (documentos + orden) para este trámite.',
    ctaCloseReassurance:
      'Gratis para empezar · sin tarjeta · la agencia de tu estado decide la elegibilidad; esto solo te prepara el paquete y el orden. Si no respondes a tiempo, el caso puede cerrarse y tocar empezar de nuevo. Te toma menos de 5 minutos y sales con la lista lista para usar hoy.',
  },
  itin: {
    headline: 'ITIN: ID aceptada y orden del sobre W-7',
    subhead:
      'Sales con la lista exacta que te van a pedir en tu caso, sin adivinar. Tras el cuestionario sabes si conviene correo o Acceptance Agent y qué copias mandar para no devolución.',
    ctaHero: 'Ver mi lista W-7 →',
    ctaCard: 'Ver orden del sobre →',
    ctaCardEyebrow: 'No somos IRS ni AA',
    ctaCardTitle: 'Recibes checklist de ID + anexos según tu situación fiscal',
    ctaCardLead:
      'Respondes y ves qué documento de identidad encaja con tu país/caso y qué va delante del W-7 según instrucciones vigentes.',
    ctaCloseLead:
      'La mayoría de retrasos pasa por usar una lista vieja o incompleta. Si eso ocurre, te piden corregir y volver, y el proceso puede moverse semanas. Tómalo ahora y revisa tu carpeta con la versión correcta antes de enviar o ir en persona.',
    ctaCloseButton: 'Ver mi lista ITIN correcta ahora (gratis) →',
    ctaCloseImmediate:
      'Al terminar ves en pantalla tu lista exacta (documentos + orden) para este trámite.',
    ctaCloseReassurance:
      'No somos IRS ni Acceptance Agent · $0 para armar el plan · tú envías el paquete; nosotros no lo mandamos por ti. Si el paquete va incompleto, el IRS lo devuelve y el proceso se alarga semanas. Te toma menos de 5 minutos y sales con la lista lista para usar hoy.',
  },
  wic: {
    headline: 'WIC: carpeta lista antes de la cita clínica',
    subhead:
      'Sales con lista de IDs, ingresos y vacunas típicos para la clínica WIC de tu estado.',
    ctaHero: 'Ver qué llevar a WIC →',
    ctaCard: 'Imprimir lista de cita →',
    ctaCardEyebrow: 'Embarazo o niño ≤5 años',
    ctaCardTitle: 'Recibes qué meter en la mochila el día de la cita',
    ctaCardLead:
      'El cuestionario pregunta por embarazo, niños e ingresos y devuelve ítems concretos (talón, recibo, cartilla, etc.).',
    ctaCloseLead:
      'Si te quedas solo con la guía general, suele faltar “¿qué llevo yo con mis hijos?”. El cuestionario ajusta la mochila al número de menores y a lo que tu clínica suele pedir.',
    ctaCloseButton: 'Listo para mi cita WIC — $0 →',
    ctaCloseImmediate:
      'Al cerrar ves la lista de cita en pantalla (IDs, ingresos, cartilla). Imprímela o guárdala en el celular para el día.',
    ctaCloseReassurance:
      'Gratis · sin tarjeta · la clínica WIC decide elegibilidad; esto reduce idas en vano por un papel que faltaba.',
  },
  escuela: {
    headline: 'Cómo inscribir a tu hijo en la escuela pública de Texas',
    subhead:
      'Lista priorizada: acta, domicilio en el distrito, vacunas e identificación del tutor — lo que más suelen pedir los ISD antes de aceptar la inscripción.',
    ctaHero: 'Ver lista por grado →',
    ctaCard: 'Obtener checklist escuela →',
    ctaCardEyebrow: 'K-12 público',
    ctaCardTitle: 'Recibes qué fotocopiar y en qué orden subir al portal del distrito',
    ctaCardLead:
      'Indicas ciudad, hijos y grado aproximado; devolvemos documentos y avisos comunes (HLS, custodia, vacunas).',
    ctaCloseLead:
      'El distrito no espera: si te falta un papel, pierdes tiempo en el portal. Aquí marcas pendientes según tu hogar antes de subir archivos que luego rechazan.',
    ctaCloseButton: 'Ver pendientes de inscripción — gratis →',
    ctaCloseImmediate:
      'Sales con “qué fotocopiar primero” y alertas típicas (custodia, HLS, vacunas). Aplica hoy al portal de tu ISD.',
    ctaCloseReassurance:
      'Gratis · sin tarjeta · no sustituimos al distrito: tú entregas en su portal o ventanilla.',
  },
  daca: {
    headline: 'Renovar DACA: I-821D e I-765 en orden para el sobre',
    subhead:
      'Sales con lista de pruebas, tarifas a verificar en uscis.gov y aviso si tu caso pide abogado.',
    ctaHero: 'Ver lista de renovación →',
    ctaCard: 'Armar sobre USCIS →',
    ctaCardEyebrow: 'Educación, no abogado',
    ctaCardTitle: 'Recibes lista numerada: formularios, pruebas y copias al día',
    ctaCardLead:
      'Respondes sobre tu último EAD, domicilio y cambios; el flujo ordena I-821D, I-765 y evidencias habituales.',
    ctaCloseLead:
      'Un sobre mal armado puede costarte meses sin EAD. El cuestionario alinea respuestas con el orden de copias y envío que suelen pedir las instrucciones vigentes — sin sustituir abogado si tu caso es delicado.',
    ctaCloseButton: 'Revisar mi sobre antes de USPS — gratis →',
    ctaCloseImmediate:
      'Obtienes lista numerada (formularios + pruebas) para contrastar con tu copia física antes de pagar envío.',
    ctaCloseReassurance:
      'Educación, no bufete · $0 para este paso · USCIS decide; si hubo arresto o viaje raro, consulta abogado antes de enviar.',
  },
  taxes: {
    headline: 'Declaración IRS: comprobantes listos y multas evitadas',
    subhead:
      'Sales con lista de W-2/1099, ITIN/SSN y créditos que revisar antes de VITA o preparador.',
    ctaHero: 'Ver mis comprobantes →',
    ctaCard: 'Generar lista fiscal →',
    ctaCardEyebrow: 'No preparación oficial',
    ctaCardTitle: 'Recibes inventario de formularios y casillas que suelen confundir',
    ctaCardLead:
      'Marcas ingresos, dependientes y banco; devolvemos qué archivos juntar y qué llevar si calificas a VITA.',
    ctaCloseLead:
      'VITA y preparadores odian cuando llegas sin W-2 o sin ITIN vigente. Esta pasada te deja una sola hoja de “qué traer” para no perder la cita o el reembolso.',
    ctaCloseButton: 'Generar mi hoja “qué traer” — $0 →',
    ctaCloseImmediate:
      'En pantalla queda tu inventario (ingresos, IDs, créditos a revisar). Úsalo hoy para pedir duplicados que faltan.',
    ctaCloseReassurance:
      'No somos el IRS ni preparador · gratis para organizarte · tú firmas la declaración oficial.',
  },
  rent: {
    headline: 'Renta atrasada: primer trámite según tu ciudad y PHA',
    subhead:
      'Sales con ruta: lista de espera local, HUD y señales de estafa que cortar de raíz.',
    ctaHero: 'Ver mi ruta de ayuda →',
    ctaCard: 'Obtener plan PHA/local →',
    ctaCardEyebrow: 'Texas / HUD',
    ctaCardTitle: 'Recibes 3–5 pasos concretos: dónde aplicar y qué documento pedir',
    ctaCardLead:
      'Indicas ciudad, mora e ingresos aproximados; priorizamos PHA, emergencias y defensa si hay aviso de desalojo.',
    ctaCloseLead:
      'Cuando el alquiler aprieta, perderse en páginas genéricas cuesta semanas. El cuestionario te deja un orden de llamadas y documentos según tu ciudad — antes de pagar a un estafador por “cupo”.',
    ctaCloseButton: 'Obtener mi orden de llamadas — gratis →',
    ctaCloseImmediate:
      'Terminas con pasos concretos en pantalla (PHA, emergencia, defensa). Empiezas la primera llamada hoy con lista en mano.',
    ctaCloseReassurance:
      'Gratis · sin tarjeta · no garantizamos voucher: te organiza para trámites oficiales y evitar pagos dudosos.',
  },
}

/** Hero resuelto para la plantilla del funnel (§1 + §3f + §3g). */
export type FunnelHeroResolved = {
  headline: string
  subhead: string
  ctaHero: string
  ctaCard: string
  ctaCardEyebrow: string
  ctaCardTitle: string
  ctaCardLead: string
  ctaCloseLead: string
  ctaCloseButton: string
  ctaCloseImmediate: string
  ctaCloseReassurance: string
}

type FunnelDefaults = { action: string; desc: string; icon: string }

const DEFAULT_CARD = {
  eyebrow: 'Empieza ahora',
  title: 'Responde 5 preguntas — recibe tu plan exacto',
  lead: 'En 5 minutos sabes qué tienes, qué te falta y los primeros pasos de este trámite. Sin tarjeta.',
} as const

const DEFAULT_CLOSE = {
  immediate:
    'En cuanto terminas, el plan sale en pantalla: qué hacer primero, qué juntar y qué sobra por aclarar.',
  reassurance:
    '$0 para empezar · sin tarjeta · sin obligación de comprar nada · no enviamos el trámite por ti: tú lo presentas ante la agencia oficial.',
} as const

const CTA_REASSURANCE_CLOSER = ' Si lo revisas ahora, evitas que te pidan volver después.'

export function getFunnelHeroCopy(id: FunnelId, defaults: FunnelDefaults): FunnelHeroResolved {
  const h = FUNNEL_HERO[id]
  const cardRaw = h?.ctaCard?.replace(/^\s+/, '') ?? ''
  const ctaCard = cardRaw
    ? `${defaults.icon} ${cardRaw}`
    : `${defaults.icon} Resolver mi trámite →`

  const closeLead =
    h?.ctaCloseLead ??
    `Ya leíste la guía: el cuestionario baja ${defaults.desc.slice(0, 70).replace(/\.$/, '')} a una lista que puedes usar hoy. Sin costo para empezar.`
  const closeButton = h?.ctaCloseButton ?? 'Abrir el cuestionario gratis →'
  const closeImmediate = h?.ctaCloseImmediate ?? DEFAULT_CLOSE.immediate
  const closeReassurance =
    (h?.ctaCloseReassurance ?? DEFAULT_CLOSE.reassurance) + CTA_REASSURANCE_CLOSER

  if (h) {
    return {
      headline: h.headline,
      subhead: h.subhead,
      ctaHero: h.ctaHero ?? 'Hazlo ahora →',
      ctaCard,
      ctaCardEyebrow: h.ctaCardEyebrow ?? DEFAULT_CARD.eyebrow,
      ctaCardTitle: h.ctaCardTitle ?? DEFAULT_CARD.title,
      ctaCardLead: h.ctaCardLead ?? DEFAULT_CARD.lead,
      ctaCloseLead: closeLead,
      ctaCloseButton: closeButton,
      ctaCloseImmediate: closeImmediate,
      ctaCloseReassurance: closeReassurance,
    }
  }
  return {
    headline: defaults.action,
    subhead: defaults.desc,
    ctaHero: 'Hazlo ahora →',
    ctaCard,
    ctaCardEyebrow: DEFAULT_CARD.eyebrow,
    ctaCardTitle: DEFAULT_CARD.title,
    ctaCardLead: DEFAULT_CARD.lead,
    ctaCloseLead: closeLead,
    ctaCloseButton: closeButton,
    ctaCloseImmediate: closeImmediate,
    ctaCloseReassurance: closeReassurance,
  }
}

/** Metadata SEO para generateMetadata: entrada explícita o fallback nombre + descripción del funnel. */
export function getFunnelSeoMeta(
  id: FunnelId,
  fallbackName: string,
  fallbackDesc: string,
): { title: string; description: string; ogTitle?: string } {
  const s = FUNNEL_SEO[id]
  if (s) return s
  return {
    title: `${fallbackName} | HazloAsíYa`,
    description: fallbackDesc.slice(0, 155),
  }
}
