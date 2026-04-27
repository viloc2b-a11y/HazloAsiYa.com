# HazloAsíYa — Setup Guide

## Tu Stack Actual

| Servicio | Estado | Valor |
|---|---|---|
| Supabase URL | ✅ Configurado | https://rlopqzcsmgpgcacyvhcv.supabase.co |
| Supabase Keys | ✅ Configurado | en .env.local |
| Email | ✅ Configurado | hazloasiya@gmail.com |
| WhatsApp | ✅ Configurado | 346 876 1439 |
| Stripe | ⏳ Pendiente | stripe.com/register |
| Resend | ⏳ Pendiente | resend.com |
| OpenAI (ChatGPT) | ⏳ Pendiente | platform.openai.com |
| Dominio | ⏳ Pendiente | hazloasiya.com |

---

## Stack
- Next.js 14 (App Router)
- Supabase (Auth + PostgreSQL)  
- Stripe (Payments)
- Resend (Email)
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

### 2. Stripe
1. Create account at stripe.com
2. Dashboard → Developers → API Keys → copy publishable and secret keys
3. Create 3 products in Stripe:
   - "Guía Completa" → $19 one-time → copy Price ID → STRIPE_PRICE_MAIN
   - "Acceso Anual" → $49 one-time → copy Price ID → STRIPE_PRICE_ANNUAL  
   - "Revisión Asistida" → $89 one-time → copy Price ID → STRIPE_PRICE_ASSISTED
4. Webhooks → Add endpoint → URL: https://yourdomain.com/api/stripe-webhook
   - Events: payment_intent.succeeded
   - Copy signing secret → STRIPE_WEBHOOK_SECRET

### 3. Resend (Free up to 3K/mo)
1. Create account at resend.com
2. Add domain (hazloasiya.com) and verify DNS
3. API Keys → Create key → RESEND_API_KEY
4. Update RESEND_FROM_EMAIL to match your verified domain

### 4. OpenAI (ChatGPT)
1. platform.openai.com → API keys → Create key → OPENAI_API_KEY

### 5. WhatsApp Business
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

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MAIN=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_ASSISTED=price_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hola@hazloasiya.com

# OpenAI (ChatGPT)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://hazloasiya.com
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
