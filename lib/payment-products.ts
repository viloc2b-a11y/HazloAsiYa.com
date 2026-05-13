/**
 * Productos Fase 1 — checkout Square (Payment Links vía Worker /api/checkout).
 * Precios: data/checkout-prices.json (misma fuente que functions/api/checkout.ts).
 * Textos orientativos para publicación; revisar con abogado antes de producción.
 */

import checkoutPricesData from '@/data/checkout-prices.json'
import { usdFromCents } from '@/lib/pricing'

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
      'Revisamos que tu paquete de documentos esté completo según los requisitos publicados por la agencia. Respuesta orientativa en 24–48 horas hábiles.',
    disclaimer:
      'Revisión de completitud documental con base en fuentes oficiales. No es asesoría legal ni garantía de aprobación por la agencia. HazloAsíYa no es agencia gubernamental ni bufete de abogados.',
    ctaLabel: `Revisar mi paquete antes de enviar — ${usdFromCents(phase1Prices.revisionExpress.priceCents)}`,
  },
  kitSnap: {
    key: 'kitSnap',
    name: 'Kit SNAP — Checklist y pasos oficiales',
    priceCents: phase1Prices.kitSnap.priceCents,
    shortDescription:
      'Checklist de documentos, pasos en orden e instrucciones de entrega para tu solicitud SNAP según el estado donde vives.',
    disclaimer:
      'Recurso educativo. No sustituye los formularios oficiales de la agencia ni la orientación de un profesional si tu caso es complejo.',
    ctaLabel: `Obtener Kit SNAP — ${usdFromCents(phase1Prices.kitSnap.priceCents)}`,
  },
  kitItin: {
    key: 'kitItin',
    name: 'Kit ITIN — Guía W-7 paso a paso',
    priceCents: phase1Prices.kitItin.priceCents,
    shortDescription:
      'Orientación sobre el formulario W-7, lista de documentos que el IRS suele aceptar y errores frecuentes a evitar.',
    disclaimer:
      'Recurso educativo. HazloAsíYa no es Acceptance Agent del IRS ni preparador de impuestos certificado. Para preparación gratuita, considera VITA (irs.gov/vita).',
    ctaLabel: `Obtener Kit ITIN — ${usdFromCents(phase1Prices.kitItin.priceCents)}`,
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
