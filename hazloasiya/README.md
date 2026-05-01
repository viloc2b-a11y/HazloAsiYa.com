# HazloAsíYa — Setup Guide

## Tu Stack Actual

| Servicio | Estado | Valor |
|---|---|---|
| Supabase URL | ✅ Configurado | https://rlopqzcsmgpgcacyvhcv.supabase.co |
| Supabase Keys | ✅ Configurado | en .env.local |
| Email | ✅ Configurado | hazloasiya@gmail.com |
| WhatsApp | ✅ Configurado | 346 876 1439 |
| Square | ⏳ Pendiente | developer.squareup.com |
| OpenAI (ChatGPT) | ⏳ Pendiente | platform.openai.com |
| Dominio | ⏳ Pendiente | hazloasiya.com |

---

## Stack
- Next.js 14 (App Router)
- Supabase (Auth + PostgreSQL)  
- Square (Payments)
- ChatGPT API (AI results)
- Cloudflare Pages (Deploy)

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys (see below)
npm run dev
```

---

## Services to Configure

### 1. Supabase (Free)
1. Create project at supabase.com
2. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run
3. Go to Settings → API → copy URL and anon key
4. Enable Google OAuth in Authentication → Providers → Google

### 2. Square (Payments)
1. Create account at developer.squareup.com
2. Get:
   - SQUARE_ACCESS_TOKEN
   - SQUARE_LOCATION_ID
3. Create a webhook subscription pointing to:
   - `https://<your-domain>/api/square-webhook` (si usas Pages Functions)
   - o `https://hazloasiya-api.vilomendez.workers.dev/api/square-webhook` (si usas tu Worker)
4. Copy the webhook signature key:
   - SQUARE_WEBHOOK_SIGNATURE_KEY

### 3. OpenAI (ChatGPT)
1. platform.openai.com → API keys → Create key → OPENAI_API_KEY

### 4. WhatsApp Business
1. Create WhatsApp Business account
2. Get your number (e.g. 13465550000)
3. Set NEXT_PUBLIC_WHATSAPP_NUMBER=13465550000

---

## Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Build
npm run build

# Deploy
npx wrangler pages deploy .next
```

Or connect GitHub repo directly in Cloudflare Pages dashboard.

**Build settings:**
- Framework preset: Next.js
- Build command: `npm run build`
- Build output: `.next`

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Square (Payments)
SQUARE_ACCESS_TOKEN=EAAA...
SQUARE_LOCATION_ID=...
SQUARE_WEBHOOK_SIGNATURE_KEY=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (ChatGPT)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://www.hazloasiya.com
NEXT_PUBLIC_API_BASE_URL=https://hazloasiya-api.vilomendez.workers.dev
NEXT_PUBLIC_WHATSAPP_NUMBER=13465550000
```

---

## Revenue Projections

| Tier | Price | Target Conv | Monthly (at 5% of demand) |
|------|-------|-------------|---------------------------|
| Guide per funnel | $19 | 3% | $46,550 |
| Annual access | $49 | 1% | $22,050 |
| Assisted review | $89 | 0.3% | $11,880 |
| **Total** | — | — | **~$80K/mo** |

---

## Project Structure

```
hazloasiya/
├── app/
│   ├── page.tsx              # Home
│   ├── [funnel]/
│   │   ├── page.tsx          # Funnel landing
│   │   ├── form/page.tsx     # Wizard
│   │   └── result/page.tsx   # Gated results
│   ├── dashboard/page.tsx    # User dashboard
│   ├── api/                  # Backend routes
│   ├── terms/ + privacy/     # Legal
│   └── sitemap.ts
├── components/               # Reusable UI
├── lib/                      # Service clients
├── data/funnels.ts           # All 16 funnels
└── supabase-schema.sql       # DB schema
```

---

## Tier Gating Logic

| User | What they see |
|------|--------------|
| Anonymous | Eligibility + 2 items + 1 step → register CTA |
| Free registered | Full lists + 3 steps + basic PDF |
| $19 guide | All steps + examples + pro PDF |
| $49 annual | All 16 funnels unlocked |
| $89 assisted | Everything + human review + WhatsApp |
