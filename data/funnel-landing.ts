import type { FunnelId } from './funnels'

/**
 * Intención SEO (metadata / Open Graph). No usar como H1 del hero: aquí van keywords y SERP.
 * @see docs/seo-bloques-y-prompts.md — prompt bloque META
 */
export const FUNNEL_SEO: Partial<
  Record<FunnelId, { title: string; description: string; ogTitle?: string }>
> = {
  snap: {
    title: 'Cómo solicitar SNAP en Texas en español | HazloAsíYa',
    description:
      '¿Calificas para SNAP? Guía completa: documentos, límites de ingresos Texas 2026 y cómo aplicar sin errores. Evaluación gratis.',
    ogTitle: 'Cómo solicitar SNAP en Texas en español',
  },
  medicaid: {
    title: 'Medicaid en Texas: CHIP, familias y embarazo | HazloAsíYa',
    description:
      'Descubre si calificas para Medicaid o CHIP en Texas: requisitos, grupos elegibles y cómo completar la solicitud en español. Evaluación gratis.',
    ogTitle: 'Medicaid y CHIP en Texas en español',
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
}

export const FUNNEL_HERO: Partial<Record<FunnelId, FunnelHeroFields>> = {
  snap: {
    headline: 'Tu plan claro para SNAP en Texas, sin adivinar',
    subhead:
      'Te guiamos: reglas, papeles y envío para que no te devuelvan la solicitud.',
    ctaHero: 'Empezar evaluación gratis →',
    ctaCard: 'Ver mi plan SNAP →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Tu lista SNAP antes de entrar a HHSC',
    ctaCardLead:
      'Cinco preguntas y ves qué papeles juntar, en qué orden aplicar y qué errores evitar. Sin tarjeta.',
    ctaCloseLead:
      'Ya viste límites y documentos: el formulario arma tu checklist personalizado para Texas en minutos.',
    ctaCloseButton: 'Armar mi plan SNAP →',
  },
  medicaid: {
    headline: 'Medicaid o CHIP: ver si tu familia califica',
    subhead:
      'En Texas las reglas son distintas; alineamos tu hogar con lo que HHSC pide antes del portal.',
    ctaHero: 'Evaluar mi caso gratis →',
    ctaCard: 'Preparar mi solicitud →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Ordena Medicaid/CHIP antes de YourTexasBenefits',
    ctaCardLead:
      'Te decimos qué grupo suele aplicar a tu hogar y qué pruebas preparar. Evaluación gratuita.',
    ctaCloseLead:
      'Si ya leíste quién califica en Texas, el cuestionario te deja lista la solicitud sin adivinar.',
    ctaCloseButton: 'Preparar mi solicitud →',
  },
  itin: {
    headline: 'ITIN y W-7: menos errores, menos espera',
    subhead:
      'Qué ID pide el IRS y en qué orden enviar. No somos Acceptance Agent ni preparador.',
    ctaHero: 'Armar mi paquete W-7 →',
    ctaCard: 'Siguiente: mi checklist ITIN →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Checklist W-7 sin enviar ID equivocada',
    ctaCardLead:
      'Repasamos tu situación y la documentación que el IRS acepta para tu caso. Gratis.',
    ctaCloseLead:
      'Cuando ya sabes qué es el ITIN, el formulario te arma el paquete y el orden de envío.',
    ctaCloseButton: 'Armar mi paquete W-7 →',
  },
  wic: {
    headline: 'WIC: ver si calificas y qué llevar',
    subhead:
      'Embarazo y niños hasta 5 años: qué piden y cómo pedir cita en Texas.',
    ctaHero: 'Preparar mi cita WIC →',
    ctaCard: 'Organizar documentos WIC →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Lista para tu cita WIC en Texas',
    ctaCardLead:
      'Sabrás qué llevar al proveedor y qué preguntar si falta un papel. Sin costo.',
    ctaCloseLead:
      'Después de leer requisitos y pasos, organiza tu carpeta con el cuestionario en minutos.',
    ctaCloseButton: 'Organizar documentos WIC →',
  },
  escuela: {
    headline: 'Escuela: papeles listos para tu distrito',
    subhead:
      'Vacunas, domicilio y acta: lista según lo que tu ISD en Texas suele pedir.',
    ctaHero: 'Listar mis documentos →',
    ctaCard: 'Ir al checklist escuela →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Checklist según tu distrito (Texas)',
    ctaCardLead:
      'Te orientamos en vacunas, domicilio y acta según lo que casi siempre pide un ISD.',
    ctaCloseLead:
      'Si ya revisaste documentos y pasos, el formulario prioriza lo que te falta para inscribir.',
    ctaCloseButton: 'Ir al checklist escuela →',
  },
  daca: {
    headline: 'Renovar DACA: formularios y plazos claros',
    subhead:
      'I-821D e I-765: ordenamos tu paquete. Caso raro: abogado o USCIS debe revisar.',
    ctaHero: 'Revisar mi renovación →',
    ctaCard: 'Preparar envío USCIS →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Paquete I-821D + I-765 en orden',
    ctaCardLead:
      'Repasamos plazos, tarifas y pruebas habituales. No sustituimos abogado en casos difíciles.',
    ctaCloseLead:
      'Cuando ya viste formularios y documentos, el cuestionario alinea tu lista antes del sobre.',
    ctaCloseButton: 'Preparar envío USCIS →',
  },
  taxes: {
    headline: 'Impuestos: qué formularios y qué evitar',
    subhead:
      'Qué juntar, qué casillas confunden y dónde hay ayuda gratis (VITA) si aplica.',
    ctaHero: 'Armar mi declaración →',
    ctaCard: 'Mi plan de impuestos →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Qué juntar antes de declarar',
    ctaCardLead:
      'W-2, 1099, ITIN y créditos: ves qué aplica a ti y qué llevar a VITA si calificas.',
    ctaCloseLead:
      'Tras leer la guía, el formulario te ordena comprobantes y próximos pasos sin pagar preparador.',
    ctaCloseButton: 'Mi plan de impuestos →',
  },
  rent: {
    headline: 'Renta difícil: opciones reales en Texas',
    subhead:
      'Esperas, HUD y ayuda local: por dónde empezar sin pagar a intermediarios dudosos.',
    ctaHero: 'Ver opciones de renta →',
    ctaCard: 'Mi plan de vivienda →',
    ctaCardEyebrow: 'Empieza ahora',
    ctaCardTitle: 'Por dónde buscar ayuda sin estafas',
    ctaCardLead:
      'Listas PHA, HUD y recursos locales: priorizamos según tu ciudad y situación.',
    ctaCloseLead:
      'Si ya viste programas y riesgos, el cuestionario te da un plan concreto para tu área.',
    ctaCloseButton: 'Mi plan de vivienda →',
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
}

type FunnelDefaults = { action: string; desc: string; icon: string }

const DEFAULT_CARD = {
  eyebrow: 'Empieza ahora',
  title: 'Responde 5 preguntas — recibe tu plan exacto',
  lead: 'En 5 minutos sabes qué tienes, qué te falta y los primeros pasos de este trámite. Sin tarjeta.',
} as const

export function getFunnelHeroCopy(id: FunnelId, defaults: FunnelDefaults): FunnelHeroResolved {
  const h = FUNNEL_HERO[id]
  const cardRaw = h?.ctaCard?.replace(/^\s+/, '') ?? ''
  const ctaCard = cardRaw
    ? `${defaults.icon} ${cardRaw}`
    : `${defaults.icon} Resolver mi trámite →`

  const closeLead =
    h?.ctaCloseLead ??
    `Cuando ya repasaste la guía, el cuestionario ordena ${defaults.desc.slice(0, 80).replace(/\.$/, '')} en una lista personalizada. Gratis.`
  const closeButton = h?.ctaCloseButton ?? 'Ir al formulario gratis →'

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
