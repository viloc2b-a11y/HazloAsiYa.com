# Módulo 12 — Monetización Fase 1 (add-on al prompt v2.0)

**Estado en repo:** implementado con **Square** como procesador de pagos (alineado con `functions/api/checkout.ts` y README). El texto original del módulo citaba Stripe; en HazloAsíYa el checkout alojado es **Square Payment Links**.

## Alcance Fase 1 (sí entra)

| Elemento | Implementación |
|----------|----------------|
| Revisión express (precio en `data/checkout-prices.json`) | `revisionExpress` en `lib/payment-products.ts` + `UpsellButton` en resultado del cuestionario |
| Kit SNAP ($9) | `kitSnap` |
| Kit ITIN ($14) | `kitItin` |
| Afiliados contextuales (3) | `lib/affiliates.ts` + `AffiliateCard` + `AffiliateRecommendations` |
| Email capture post-cuestionario | `EmailCapture` + `functions/api/subscribe-email.ts` (ConvertKit o Brevo) |
| Analytics embudo | `lib/analytics-events.ts` + consent GA4 vía `canLoadAnalytics()` |

## Fuera de alcance (según roadmap)

- Suscripción premium mes 3+
- Webinars / cursos grabados mes 4+ (banner estacional ya existe)
- White-label / marketplace

## Orden semana 1 (operativo)

1. Square: precios en dashboard coherente con `PRODUCT_PRICE_CENTS` en `functions/api/checkout.ts` (12_00, 9_00, 14_00 centavos).
2. Variables Cloudflare: `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `NEXT_PUBLIC_APP_URL` (éxito/cancel sin localhost ni pages.dev).
3. Post-resultado: upsell solo si `eligible === true`; kits si `missingItems.length <= 2` y trámite `snap` o `itin`.
4. Newsletter: `EMAIL_PROVIDER`, `CONVERTKIT_*` o `BREVO_*`.
5. Afiliados: `NEXT_PUBLIC_AFFILIATE_*` con URLs reales antes de publicar.

## Textos para publicar (revisar con abogado)

### Revisión Express — precio único (`data/checkout-prices.json` → Square)

- **Nombre comercial:** Revisión Express  
- **Descripción:** Revisamos que tu documentación esté completa según los requisitos publicados por la agencia. Respuesta orientativa en 24–48 horas hábiles.  
- **Disclaimer:** Este servicio es revisión de completitud documental según fuentes oficiales; no es asesoría legal ni fiscal ni garantía de aprobación por parte de la agencia.  
- **CTA:** Texto A/B en `UpsellButton`; el monto sale de `lib/pricing` (`PRICE_REVISION_EXPRESS`).  

### Kit SNAP — $9

- **Nombre:** Kit SNAP — Lista de documentos y pasos  
- **Descripción:** PDF descargable con checklist de documentos, pasos en orden y ejemplos orientativos para preparar tu solicitud en Texas (contenido educativo).  
- **Disclaimer:** Recurso educativo empaquetado. No sustituye la lectura de los formularios oficiales ni la orientación de un profesional si tu caso es complejo.  
- **CTA:** Descargar Kit SNAP — $9  

### Kit ITIN — $14

- **Nombre:** Kit ITIN — Guía W-7 paso a paso  
- **Descripción:** PDF con orientación sobre el formulario W-7, lista de documentos que el IRS suele aceptar y errores frecuentes a evitar (contenido educativo).  
- **Disclaimer:** Recurso educativo. HazloAsíYa no es Acceptance Agent del IRS ni preparador de impuestos certificado. Para preparación gratuita, considera VITA (irs.gov/vita).  
- **CTA:** Descargar Kit ITIN — $14  

### Pagos

- Los pagos se procesan con **Square** (checkout alojado). En privacidad y términos del sitio ya se indica Square como procesador.

### Email (CAN-SPAM / buenas prácticas)

- Copy incentivo: «Recibe avisos cuando cambien los requisitos de [trámite] y nuevas guías gratuitas.»  
- Pie de formulario: «Sin spam. Solo actualizaciones relevantes. Puedes cancelar en cualquier momento con un clic.»  
- Checkbox obligatorio con mención a consentimiento y cancelación.

### Afiliados

- Etiqueta **#ad** + `Disclosure` variante `affiliate` antes del enlace.  
- Enlaces: `rel="nofollow sponsored noopener noreferrer"`.  
- Sin URL pública: la tarjeta muestra aviso de configuración pendiente (no usar en producción).

## Archivos clave

- `lib/payment-products.ts` — definición y textos Fase 1  
- `components/monetization/UpsellButton.tsx`  
- `components/monetization/EmailCapture.tsx`  
- `components/monetization/ResultPhase1Section.tsx`  
- `components/monetization/AffiliateCard.tsx` / `AffiliateRecommendations.tsx`  
- `lib/affiliates.ts`  
- `lib/analytics-events.ts`  
- `functions/api/checkout.ts` — precios Fase 1  
- `functions/api/subscribe-email.ts`  

## Checklist pre-activación

- [ ] Square en producción con montos correctos  
- [ ] `NEXT_PUBLIC_APP_URL` = `https://www.hazloasiya.com`  
- [ ] Redirect post-pago a `/{funnel}/result/?paid=1`  
- [ ] Disclosure visible en upsells y afiliados  
- [ ] Newsletter probado (suscriptor + tag/campo trámite)  
- [ ] `npm run audit:legal` sin FAIL  
- [ ] URLs de afiliado reales  

---

*HazloAsíYa · Módulo 12 · Add-on v2.0 · Abril 2026*
