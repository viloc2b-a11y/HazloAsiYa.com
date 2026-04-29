# Verificación manual: GA4 + Google Consent Mode v2

Stack: Next.js 14 (export estático) + `CookieBanner` + scripts en `app/layout.tsx`.

## Requisito

`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` en build (Cloudflare Pages / `.env.local`).

## Pasos (Chrome, ventana de incógnito)

1. Abre el sitio sin haber visitado antes (sin `localStorage` de consent).
2. **DevTools → Network** → filtra por `google-analytics` o `collect` o `gtag`.
3. **Antes de aceptar cookies**
   - Puede aparecer la descarga de `gtag/js` (motor).
   - **No** deberían enviarse peticiones a `google-analytics.com/g/collect` (ni hits de medición) hasta otorgar analítica.
   - En **Console** (sustituye `G-XXX` por tu ID):

     ```js
     gtag('get', 'G-XXX', 'analytics_storage', console.log)
     ```

     Debe indicar estado **denied** (o equivalente) antes del consent.

4. Pulsa **Aceptar todo** (o activa analítica en modo UE) en el banner.
5. **Después de aceptar**
   - Debe aparecer al menos una petición tipo **`g/collect`** asociada al evento (p. ej. `page_view`).
   - Mismo comando `gtag('get', ...)` debe reflejar **granted** para `analytics_storage`.

## Fallo típico

Si **`g/collect`** aparece **antes** de aceptar cookies, el Consent Mode no está aplicado en el orden correcto o hay otro snippet de GA/Meta sin gate. Revisa:

- `app/layout.tsx`: inline `gtag('consent', 'default', { analytics_storage: 'denied', ... })` **antes** de `gtag('config', …)` y con `send_page_view: false`.
- `components/analytics/GoogleAnalyticsClient.tsx`: solo actualiza consent y envía `page_view` cuando `useAnalyticsConsent()` indica analítica permitida.

## Otros píxeles

Si añades **Meta Pixel**, **TikTok**, etc., deben usar la misma lógica de consent (no cargar el script hasta marketing/analytics según tu política).
