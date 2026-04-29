/**
 * Inventario de base legal GDPR (Art. 6) por categoría de dato.
 * Fuente de verdad para la política de privacidad (usuarios UE).
 */

export type GdprBasisEntry = {
  dato: string
  finalidad: string
  baseLegal: string
  retencion: string
}

export const GDPR_LEGAL_BASIS: GdprBasisEntry[] = [
  {
    dato: 'email',
    finalidad: 'prestación del servicio, comunicaciones transaccionales',
    baseLegal: 'contrato (Art. 6.1.b GDPR)',
    retencion: 'mientras la cuenta esté activa + 2 años',
  },
  {
    dato: 'IP y logs de acceso',
    finalidad: 'seguridad y prevención de fraude',
    baseLegal: 'interés legítimo (Art. 6.1.f GDPR)',
    retencion: '90 días',
  },
  {
    dato: 'cookies de analytics',
    finalidad: 'mejora del servicio y análisis de uso',
    baseLegal: 'consentimiento (Art. 6.1.a GDPR)',
    retencion: 'hasta revocación del consentimiento',
  },
  {
    dato: 'documentos subidos',
    finalidad: 'revisión de completitud solicitada por el usuario',
    baseLegal: 'contrato (Art. 6.1.b GDPR)',
    retencion: '90 días máximo → eliminación automática',
  },
]
