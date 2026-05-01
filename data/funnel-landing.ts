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
 * Intención conversión (hero). Español claro, sin espejar el title SEO.
 * Límites orientativos: titular ~12 palabras, subtítulo ~20 (ver prompts por bloque).
 * @see docs/seo-bloques-y-prompts.md — prompt bloque HERO
 */
export const FUNNEL_HERO: Partial<
  Record<
    FunnelId,
    {
      headline: string
      subhead: string
      ctaHero?: string
      ctaCard?: string
    }
  >
> = {
  snap: {
    headline: 'Tu plan claro para SNAP en Texas, sin adivinar',
    subhead:
      'Te decimos si encajas en las reglas, qué papeles juntar y cómo mandar la solicitud para que no te la regresen.',
    ctaHero: 'Empezar evaluación gratis →',
    ctaCard: 'Ver mi plan SNAP →',
  },
  medicaid: {
    headline: 'Medicaid o CHIP: ver si aplica tu familia y cómo aplicar',
    subhead:
      'Te orientamos según tu hogar y ingresos; en Texas las reglas son distintas al resto del país — lo dejamos claro antes de que entres al portal.',
    ctaHero: 'Evaluar mi caso gratis →',
    ctaCard: 'Preparar mi solicitud →',
  },
  itin: {
    headline: 'ITIN y W-7: menos errores y menos meses de espera',
    subhead:
      'Reunimos la identificación que el IRS suele aceptar y el orden de envío. No sustituimos a un Acceptance Agent ni a un preparador.',
    ctaHero: 'Armar mi paquete W-7 →',
    ctaCard: 'Siguiente: mi checklist ITIN →',
  },
  wic: {
    headline: 'WIC: ver si calificas y qué llevar a la cita',
    subhead:
      'Embarazo, bebés y niños hasta 5 años: te decimos qué suelen pedir y cómo pedir hora en Texas sin ir en vano.',
    ctaHero: 'Preparar mi cita WIC →',
    ctaCard: 'Organizar documentos WIC →',
  },
  escuela: {
    headline: 'Inscripción escolar: papeles listos para tu distrito',
    subhead:
      'Vacunas, domicilio y acta: armamos la lista según lo que piden las escuelas públicas en Texas antes de que vayas al ISD.',
    ctaHero: 'Listar mis documentos →',
    ctaCard: 'Ir al checklist escuela →',
  },
  daca: {
    headline: 'Renovar DACA: formularios y plazos sin adivinar',
    subhead:
      'I-821D e I-765 cambian de versión; te ayudamos a ordenar tu paquete. Si tu caso es delicado, USCIS o un abogado debe revisarlo.',
    ctaHero: 'Revisar mi renovación →',
    ctaCard: 'Preparar envío USCIS →',
  },
  taxes: {
    headline: 'Declarar impuestos: qué formularios y qué evitar',
    subhead:
      'Sin sermones: qué juntar, qué casillas suelen confundir y dónde buscar ayuda gratis (VITA) si calificas.',
    ctaHero: 'Armar mi declaración →',
    ctaCard: 'Mi plan de impuestos →',
  },
  rent: {
    headline: 'Renta atrasada o cara: opciones reales en Texas',
    subhead:
      'Listas de espera, HUD y programas locales: te decimos por dónde empezar y qué no pagar a terceros dudosos.',
    ctaHero: 'Ver opciones de renta →',
    ctaCard: 'Mi plan de vivienda →',
  },
}

type FunnelDefaults = { action: string; desc: string; icon: string }

export function getFunnelHeroCopy(
  id: FunnelId,
  defaults: FunnelDefaults,
): { headline: string; subhead: string; ctaHero: string; ctaCard: string } {
  const h = FUNNEL_HERO[id]
  if (h) {
    return {
      headline: h.headline,
      subhead: h.subhead,
      ctaHero: h.ctaHero ?? 'Hazlo ahora →',
      ctaCard: h.ctaCard
        ? `${defaults.icon} ${h.ctaCard.replace(/^\s+/, '')}`
        : `${defaults.icon} Resolver mi trámite →`,
    }
  }
  return {
    headline: defaults.action,
    subhead: defaults.desc,
    ctaHero: 'Hazlo ahora →',
    ctaCard: `${defaults.icon} Resolver mi trámite →`,
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
