# HazloAsíYa (hazloasiya.com)

Sitio en **español** para orientar a familias hispanas en EE. UU. en trámites (SNAP, Medicaid, ITIN, escuela, etc.) con cuestionario, plan paso a paso y contenido educativo (no asesoría legal ni gubernamental).

## Stack

| Pieza | Detalle |
|--------|---------|
| Framework | **Next.js 14** (App Router), `output: 'export'` |
| Deploy | **Cloudflare Pages** (salida `out/`) |
| Pagos | **Square Hosted Checkout** (`POST /api/checkout` → `checkoutUrl`) |
| IA | **OpenAI** (`POST /api/generate-result`) |
| Datos | **Supabase** (opcional; webhook Square + usuario/plan) |
| Email marketing | **Mailchimp** (`POST /api/subscribe-email` → alta idempotente **PUT** a la audiencia) |

## Inicio rápido

```bash
cd HazloAsiYa.com   # si clonas el monorepo, entra a esta carpeta
npm install
cp .env.local.example .env.local
npm run dev
```

Build estático + índice de búsqueda (Pagefind):

```bash
npm run build
```

## API

### Cloudflare Pages (`functions/api/`)

En **producción** (Cloudflare Pages), `/api/*` lo atienden los Workers en `functions/api/`:

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/api/generate-result` | Plan / resultado del cuestionario (OpenAI) |
| POST | `/api/checkout` | Square Payment Links → `{ checkoutUrl }` |
| POST | `/api/square-webhook` | Pagos completados; Supabase si aplica |
| POST | `/api/subscribe-email` | Suscripción Mailchimp (PUT idempotente por MD5 del email; respuesta `{ ok: true }`) |

`wrangler.toml` declara `nodejs_compat` para usar `node:crypto` (hash MD5 del subscriber) en `subscribe-email`.

### Next.js (`app/api/`)

En **`npm run dev`**, algunas rutas existen también en `app/api/` (misma firma HTTP). La de newsletter es **`app/api/subscribe-email/route.ts`** (`runtime: 'nodejs'`), misma lógica Mailchimp que la función de Cloudflare.

Prueba local del subscribe: `curl` contra el origen que sirva la ruta (dev: Next; prod: dominio en Cloudflare).

## Variables de entorno

Plantilla: **`.env.local.example`**. Resumen:

- **Públicas:** `NEXT_PUBLIC_APP_URL` (ej. `https://www.hazloasiya.com`), `NEXT_PUBLIC_API_BASE_URL` si el API no es el mismo origen, Supabase público, WhatsApp, claves `NEXT_PUBLIC_AFFILIATE_*` (Fase 1).
- **GA4 (consent-gate):** `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`. El script `gtag.js` **no** se inyecta en el HTML estático: solo tras aceptar analítica en el CookieBanner (Consent Mode v2: default `denied` en `layout`).
- **A/B upsell:** `NEXT_PUBLIC_AB_UPSELL_ACTIVE=false` por defecto; poner `true` cuando haya tráfico suficiente (ver `docs/ab-test-upsell.md`).
- **Mailchimp:** `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`; `MAILCHIMP_SERVER` (opcional si el API key ya termina en `-usXX`, p. ej. `-us21`).
- **Functions:** `OPENAI_*`, `SQUARE_*`, `SUPABASE_*`.

Nunca subas **`.env.local`** (contiene secretos).

## Pagos (Square)

- Productos legacy en checkout: guía única, anual, asistida — precios y etiquetas en **`data/checkout-prices.json`** (leídos por `functions/api/checkout.ts` y `lib/payment-products.ts`).
- **Monetización Fase 1:** revisión express, kit SNAP, kit ITIN — mismos montos en JSON, UI y Square.
- El cliente **no** captura datos de tarjeta; solo redirige al checkout alojado de Square.

## Cumplimiento y documentación

- Textos legales centralizados en `lib/legal-texts.ts`; política en `app/privacy/`, términos en `app/terms/`.
- GDPR / cookies: `components/legal/CookieBanner.tsx`, `lib/cookie-consent.ts`.
- Derechos de datos: `app/mis-datos/`, California: `app/no-vender-mis-datos/`.
- Add-on monetización Fase 1: **`docs/modulo-12-monetizacion-fase1.md`**.
- Inventario interno: `docs/data-processing-register.md`, plantilla `docs/data-inventory-template.md`.

## Scripts útiles

```bash
npm run lint
npm run validate              # contenido / metadatos
npm run setup:mailchimp       # merge fields TRAMITE en la audiencia (requiere vars Mailchimp)
npm run verify                # comprobaciones locales (Mailchimp, merge fields, etc.)
npm run audit:data            # inventario de campos de formulario → regenerar JSON local
npm run audit:legal           # tras `npm run build`, escanea `out/` + reglas UPL heurísticas
npm run seo:validate:full     # validación contra export estático
```

CI: `.github/workflows/ci-seo.yml` (build, auditoría estática, legal audit, job opcional `audit:data`).

## Estructura (resumen)

```
app/                  # Rutas App Router (incl. [funnel]/form, result, guías, legal, precios)
components/           # UI + legal/, monetization/
data/funnels.ts       # Trámites y orden
functions/api/        # Workers Cloudflare
lib/                  # site, static-backend, payment-products, affiliates, analytics-events, …
docs/                 # módulos legales / monetización / inventario
scripts/              # validate, audit-*, migrate-*, …
public/               # estáticos, _redirects → copia a out/
```

## Dominio y SEO

- Canónico: **`https://www.hazloasiya.com`** (`lib/site.ts`, `metadataBase` en `app/layout.tsx`).
- Tras el build: comprobar que no queden `pages.dev` ni `aggregateRating` falso en `out/` (`npm run audit:legal`).

## Licencia / propiedad

Código y contenido propiedad del proyecto HazloAsíYa salvo dependencias con sus propias licencias.
