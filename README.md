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
| Email marketing | **ConvertKit** o **Brevo** (`POST /api/subscribe-email`) |

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

## API (Cloudflare Pages Functions)

Rutas bajo `functions/api/` (no `app/api`):

| Método | Ruta | Uso |
|--------|------|-----|
| POST | `/api/generate-result` | Plan / resultado del cuestionario (OpenAI) |
| POST | `/api/checkout` | Square Payment Links → `{ checkoutUrl }` |
| POST | `/api/square-webhook` | Pagos completados; Supabase si aplica |
| POST | `/api/subscribe-email` | Alta a lista (ConvertKit / Brevo) |

En local, prueba con **Wrangler** / entorno Pages; en producción Cloudflare enruta `/api/*` a estas funciones.

## Variables de entorno

Plantilla: **`.env.local.example`**. Resumen:

- **Públicas:** `NEXT_PUBLIC_APP_URL` (ej. `https://www.hazloasiya.com`), `NEXT_PUBLIC_API_BASE_URL` si el API no es el mismo origen, Supabase público, WhatsApp, claves `NEXT_PUBLIC_AFFILIATE_*` (Fase 1).
- **Functions:** `OPENAI_*`, `SQUARE_*`, `SUPABASE_*`, newsletter (`EMAIL_PROVIDER`, `CONVERTKIT_*` o `BREVO_*`).

Nunca subas **`.env.local`** (contiene secretos).

## Pagos (Square)

- Productos legacy en checkout: guía única, anual, asistida (precios en `functions/api/checkout.ts`).
- **Monetización Fase 1:** revisión express ($12), kit SNAP ($9), kit ITIN ($14) — mismos precios en código y en Square.
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
