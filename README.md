# HazloAsíYa (hazloasiya.com)

Sitio en **español** para orientar a familias hispanas en EE. UU. en trámites (SNAP, Medicaid, ITIN, escuela, etc.) con cuestionario, plan paso a paso y contenido educativo (no asesoría legal ni gubernamental).

## Stack

| Pieza | Detalle |
|--------|---------|
| Framework | **Next.js 14** (App Router), `output: 'export'` |
| Deploy | **Cloudflare Pages** (salida `out/`; `wrangler.toml` → `name = "hazloasiya"`, Functions en `functions/api/`) |
| Pagos | **Square Hosted Checkout** (`POST /api/checkout` → `checkoutUrl`) |
| IA | **API de OpenAI (ChatGPT / GPT)** — `POST /api/eligibility` (`lib/ai-client.ts`: SDK `openai`, Responses + fallback Chat Completions; `OPENAI_MODEL`) |
| Datos | **Supabase** (opcional; webhook Square + usuario/plan) |
| Email marketing | **Mailchimp** (`POST /api/subscribe-email` → alta idempotente **PUT** a la audiencia) |
| Medición | **GA4** (`gtag` tras consentimiento): eventos personalizados en landings y resultado (ver abajo) |

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

Deploy manual a Pages (requiere [Wrangler](https://developers.cloudflare.com/workers/wrangler/) autenticado):

```bash
npm run build
npx wrangler pages deploy out
```

En CI o Git integrado con Cloudflare, el build suele ser el mismo comando; la salida debe ser **`out/`** (incluye Pagefind en `out/pagefind/`).

## API

### Cloudflare Pages (`functions/api/`)

En **producción** (Cloudflare Pages), `/api/*` lo atienden los Workers en `functions/api/`:

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/api/eligibility` | Plan / resultado del cuestionario (**OpenAI**); cuerpo `{ funnelId, formData }` o `{ funnelId, ...campos }` |
| POST | `/api/generate-result` | Alias de `/api/eligibility` (mismo cuerpo; compatibilidad) |
| POST | `/api/checkout` | Square Payment Links → `{ checkoutUrl }` |
| POST | `/api/square-webhook` | Pagos completados; Supabase si aplica |
| POST | `/api/subscribe-email` | Suscripción Mailchimp (PUT idempotente por MD5 del email; respuesta `{ ok: true }`) |

`wrangler.toml` declara el proyecto Pages (`name`), `pages_build_output_dir = "out"` y `nodejs_compat` para usar `node:crypto` (hash MD5 del subscriber) en `subscribe-email`.

### Next.js (`app/api/`)

En **`npm run dev`**, algunas rutas existen también en `app/api/` (misma firma HTTP). La de newsletter es **`app/api/subscribe-email/route.ts`** (`runtime: 'nodejs'`), misma lógica Mailchimp que la función de Cloudflare.

Prueba local del subscribe: `curl` contra el origen que sirva la ruta (dev: Next; prod: dominio en Cloudflare).

## Variables de entorno

Plantilla: **`.env.local.example`**. Resumen:

- **Públicas:** `NEXT_PUBLIC_APP_URL` (ej. `https://www.hazloasiya.com`), `NEXT_PUBLIC_API_BASE_URL` si el API no es el mismo origen, Supabase público, WhatsApp, claves `NEXT_PUBLIC_AFFILIATE_*` (Fase 1).
- **GA4 (consent-gate):** `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`. El script `gtag.js` **no** se inyecta en el HTML estático: solo tras aceptar analítica en el CookieBanner (Consent Mode v2: default `denied` en `layout`).
  - Eventos usados para embudo (vía `lib/gtag.ts`; sin `gtag` cargado no hacen nada):
    - **`cta_click`** — CTA final de `/{funnel}/` (`funnel`, `location`, `variant`, `device`).
    - **`result_view`** — carga de `/{funnel}/result/` (`funnel`, `source`, `device`); `source` distingue flujo desde landing/form vs directo/externo (`lib/result-view-source.ts`).
    - **`scroll_70`** — profundidad de scroll en la landing (`funnel`).
- **A/B upsell:** `NEXT_PUBLIC_AB_UPSELL_ACTIVE=false` por defecto; poner `true` cuando haya tráfico suficiente (ver `docs/ab-test-upsell.md`).
- **Mailchimp:** `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`; `MAILCHIMP_SERVER` (opcional si el API key ya termina en `-usXX`, p. ej. `-us21`).
- **OpenAI (ChatGPT API):** `OPENAI_API_KEY` y opcional `OPENAI_MODEL` (clave en [platform.openai.com](https://platform.openai.com/api-keys)). Usada en las rutas de elegibilidad/resultado (`functions/api/`), en `npm run monitor:regulations -- --with-ai` y en otras integraciones documentadas en `.env.local.example`.
- **Functions (otras):** `SQUARE_*`, `SUPABASE_*`.

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

## Datos regulatorios (límites SNAP, WIC, Medicaid, etc.)

- **Fuente única:** `src/data/program-limits.json` — cada entrada incluye `value`, `unit`, `lastVerified`, `validUntil` (ISO-8601) y `sourceUrl`.
- **Validación:** `src/schemas/limits.schema.ts` (Zod); consumo tipado en `lib/program-limits.ts` (prompts del cuestionario) y **VerificationBadge** (`components/VerificationBadge.tsx`) en landings para mostrar vigencia y enlace oficial.

## Scripts útiles

```bash
npm run lint                  # ESLint (`next/core-web-vitals`); también corre integrado en `next build`
npm run validate              # contenido / metadatos
npm run setup:mailchimp       # merge fields TRAMITE en la audiencia (requiere vars Mailchimp)
npm run verify                # comprobaciones locales (Mailchimp, merge fields, etc.)
npm run audit:data            # inventario de campos de formulario → regenerar JSON local
npm run audit:legal           # tras `npm run build`, escanea `out/` + reglas UPL heurísticas
npm run seo:validate:full     # validación contra export estático
npm run monitor:regulations   # vigencia + esquema Zod de program-limits.json
```

**Monitor regulatorio (`scripts/monitor-regulations.ts`):**

| Comando | Qué hace |
|--------|-----------|
| `npm run monitor:regulations` | Valida el JSON con Zod y comprueba fechas de vigencia (`validUntil`). |
| `npm run monitor:regulations -- --with-ai` | Además, descarga el HTML de cada `sourceUrl`, pide a OpenAI un número de referencia y lo compara con `value` (requiere `OPENAI_API_KEY`; modelo opcional `OPENAI_MONITOR_MODEL` o `OPENAI_MODEL`). |
| `npm run monitor:regulations -- --with-ai --strict` | Falla si hay discrepancias, errores de fetch/API, o si la IA no extrae número (`extractedValue: null`). |
| `npm run monitor:regulations -- --report-json ./monitor-regulatory-report.json` | Escribe un informe JSON; si hay fallo, también genera `*.issue.md` para revisar o pegar en un Issue. |

No sobreescribe `program-limits.json` automáticamente: ante fallos de red o de la API se mantienen los datos locales y el informe lista el problema.

## CI / GitHub Actions

- **`ci-seo.yml`:** build, auditoría estática, legal audit, job opcional `audit:data`.
- **`monitor-regulations.yml`:** cada **lunes** (cron) y manual (`workflow_dispatch`). Ejecuta el monitor; si existe el secret **`OPENAI_API_KEY`**, corre también `--with-ai --strict`. Si el monitor falla, el workflow intenta **abrir un Issue** o **comentar** uno abierto con la etiqueta `regulatory-monitor`. El token por defecto necesita permiso `issues: write` (ya declarado en el workflow).

## Estructura (resumen)

```
app/                       # Rutas App Router (incl. [funnel]/form, result, guías, legal, precios)
components/                # UI + legal/, monetization/, analytics/ (medición funnel)
src/data/program-limits.json
src/schemas/limits.schema.ts  # Zod para program-limits
lib/acroform/                # AcroForm: W-4, H1010, I-821D, I-765, W-7, I-9 (+ fallback visual)
public/forms/                # PDFs oficiales (irs.gov / uscis.gov); añade h1010.pdf desde Your Texas Benefits si aplica
data/
  funnels.ts               # Trámites, pasos, nextSteps
  funnel-landing.ts        # Copy hero / CTA por funnel (SEO vs conversión)
  funnel-internal-links.ts # Enlaces contextuales entre landings
  email-capture-copy.ts    # Textos del bloque de correo por funnel
functions/api/             # Workers Cloudflare
lib/
  gtag.ts                  # helper `gtagEvent` + `getAnalyticsDevice`
  result-steps.ts          # Sufijo de pasos / tensión documental en resultado
  result-trust-action.ts   # Tercera línea del bloque de confianza en /result
  result-view-source.ts    # Origen del visitante en resultado (GA4 `source`)
  static-backend.ts, site.ts, analytics-events.ts, …
types/gtag-global.ts       # Tipado `window.gtag`
docs/                      # módulos legales / monetización / inventario / deploy Cloudflare
scripts/                   # validate, audit-*, migrate-*, …
public/                    # estáticos, _redirects → copia a out/
wrangler.toml              # Proyecto Pages + `out/` + nodejs_compat
```

## Dominio y SEO

- Canónico: **`https://www.hazloasiya.com`** (`lib/site.ts`, `metadataBase` en `app/layout.tsx`). Apex redirige a `www` vía `_redirects` / Cloudflare.
- Tras el build: comprobar que no queden `pages.dev` ni `aggregateRating` falso en `out/` (`npm run audit:legal`).

## Licencia / propiedad

Código y contenido propiedad del proyecto HazloAsíYa salvo dependencias con sus propias licencias.
