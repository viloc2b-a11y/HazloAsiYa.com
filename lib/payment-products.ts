/**
 * Productos Fase 1 — checkout Square (Payment Links vía Worker /api/checkout).
 * Precios: data/checkout-prices.json (misma fuente que functions/api/checkout.ts).
 * Textos orientativos para publicación; revisar con abogado antes de producción.
 */

import checkoutPricesData from '@/data/checkout-prices.json'

const phase1Prices = checkoutPricesData.products

export type Phase1ProductKey = 'revisionExpress' | 'kitSnap' | 'kitItin'

export type PaymentProductDef = {
  key: Phase1ProductKey
  name: string
  /** Precio en centavos USD (debe coincidir con Square checkout en Worker). */
  priceCents: number
  /** Texto comercial corto (landing, resultados). */
  shortDescription: string
  /** Disclaimer obligatorio junto al CTA (FTC / UPL). */
  disclaimer: string
  /** Texto del botón aprobado (único permitido para este producto). */
  ctaLabel: string
}

export const PHASE1_PRODUCTS: Record<Phase1ProductKey, PaymentProductDef> = {
  revisionExpress: {
    key: 'revisionExpress',
    name: 'Revisión Express',
    priceCents: phase1Prices.revisionExpress.priceCents,
    shortDescription:
      'Revisamos que tu documentación esté completa según los requisitos publicados por la agencia. Respuesta orientativa en 24–48 horas hábiles.',
    disclaimer:
      'Este servicio es revisión de completitud documental según fuentes oficiales; no es asesoría legal ni fiscal ni garantía de aprobación por parte de la agencia.',
    ctaLabel: 'Obtener revisión express — $12',
  },
  kitSnap: {
    key: 'kitSnap',
    name: 'Kit SNAP — Lista de documentos y pasos',
    priceCents: phase1Prices.kitSnap.priceCents,
    shortDescription:
      'PDF descargable con checklist de documentos, pasos en orden y ejemplos orientativos para preparar tu solicitud en Texas (contenido educativo).',
    disclaimer:
      'Recurso educativo empaquetado. No sustituye la lectura de los formularios oficiales ni la orientación de un profesional si tu caso es complejo.',
    ctaLabel: 'Descargar Kit SNAP — $9',
  },
  kitItin: {
    key: 'kitItin',
    name: 'Kit ITIN — Guía W-7 paso a paso',
    priceCents: phase1Prices.kitItin.priceCents,
    shortDescription:
      'PDF con orientación sobre el formulario W-7, lista de documentos que el IRS suele aceptar y errores frecuentes a evitar (contenido educativo).',
    disclaimer:
      'Recurso educativo. HazloAsíYa no es Acceptance Agent del IRS ni preparador de impuestos certificado. Para preparación gratuita, considera VITA (irs.gov/vita).',
    ctaLabel: 'Descargar Kit ITIN — $14',
  },
}

/** Claves que el Worker /api/checkout acepta (legado + Fase 1). */
export type CheckoutProductId =
  | 'main'
  | 'annual'
  | 'assisted'
  | Phase1ProductKey

export function getPhase1Product(key: Phase1ProductKey): PaymentProductDef {
  return PHASE1_PRODUCTS[key]
}
