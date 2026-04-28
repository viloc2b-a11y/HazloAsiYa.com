# HazloAsiYa.com

Website en español para ayudar a familias hispanas en EE.UU. a completar trámites (SNAP, Medicaid, ID, etc.) con un plan paso‑a‑paso generado por IA.

## Stack (actual)
- **Next.js 14** (App Router) con `output: 'export'`
- **Cloudflare Pages Functions** para backend en `functions/api/*`
- **Square Hosted Checkout** para pagos (la app **no** captura tarjeta/expiración/CVV)
- **OpenAI API** para generar el resultado (`/api/generate-result`)
- **Supabase** (si está configurado) para datos/webhook y plan del usuario

## Quick start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Backend API (Cloudflare Pages Functions)

Endpoints (no están en `app/api`):
- `POST /api/generate-result` → OpenAI → retorna JSON con el plan
- `POST /api/checkout` → Square → retorna `{ checkoutUrl }` y redirige a Square Hosted Checkout desde el cliente
- `POST /api/square-webhook` → webhook de Square (firma) + actualización en Supabase (si aplica)

> Para probar los endpoints localmente, usa **Wrangler Pages** (Pages Functions). En producción, Cloudflare Pages enruta automáticamente `/api/*` a `functions/api/*`.

## Environment variables

Ver `.env.local.example`. Variables clave:

```env
# Public / Next
NEXT_PUBLIC_APP_URL=https://hazloasiya.com
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=

# Cloudflare Pages Functions
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini

SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
SQUARE_WEBHOOK_SIGNATURE_KEY=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Payments (Square)
- El cliente llama `POST /api/checkout` y obtiene `checkoutUrl`.
- El navegador redirige al **Square Hosted Checkout**.
- La app **no** muestra ni recolecta campos de tarjeta.
