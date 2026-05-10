-- ============================================================
-- Migration: partner tracking columns
-- Date: 2026-05-09
-- Purpose: Track partner referrals, organization types, and
--          city/state for the Alianza HazloAsíYa program.
--          These columns feed the monthly impact report and
--          identify high-performing partners.
-- ============================================================

-- 1. Add partner tracking columns to purchases table
--    (records revenue attributed to each partner)
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS partner_slug        text,
  ADD COLUMN IF NOT EXISTS referral_source     text,
  ADD COLUMN IF NOT EXISTS organization_type   text,
  ADD COLUMN IF NOT EXISTS referral_city       text,
  ADD COLUMN IF NOT EXISTS referral_state      text;

-- Index for fast partner-level reporting
CREATE INDEX IF NOT EXISTS idx_purchases_partner_slug
  ON public.purchases(partner_slug)
  WHERE partner_slug IS NOT NULL;

-- 2. Create partners table to register Alianza members
CREATE TABLE IF NOT EXISTS public.partners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,          -- e.g. "iglesia-bethel-houston"
  name              text NOT NULL,                 -- "Iglesia Bethel Houston"
  organization_type text,                          -- "iglesia" | "clinica" | "nonprofit" | ...
  city              text,
  state             text,
  contact_email     text,
  tier              text DEFAULT 'basica',         -- "basica" | "impacto" | "estrategica"
  revenue_share_pct integer DEFAULT 10,            -- 10 | 15 | 20
  active            boolean DEFAULT true,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Index for slug lookups (used on every referral hit)
CREATE INDEX IF NOT EXISTS idx_partners_slug
  ON public.partners(slug);

-- 3. Create partner_events table for funnel analytics
--    (tracks every family that enters via a partner link)
CREATE TABLE IF NOT EXISTS public.partner_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_slug    text NOT NULL REFERENCES public.partners(slug) ON DELETE CASCADE,
  event_type      text NOT NULL,  -- "visit" | "funnel_start" | "funnel_complete" | "purchase"
  funnel_id       text,           -- "snap" | "medicaid" | "wic" | "itin" | ...
  state_slug      text,           -- "texas" | "california" | ...
  session_id      text,
  user_id         uuid,
  purchase_id     uuid,
  metadata        jsonb,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_events_slug
  ON public.partner_events(partner_slug);

CREATE INDEX IF NOT EXISTS idx_partner_events_created
  ON public.partner_events(created_at DESC);

-- 4. Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by backend functions)
CREATE POLICY "service_role_all_partners"
  ON public.partners FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_partner_events"
  ON public.partner_events FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Public read for partner slug validation (needed on landing pages)
CREATE POLICY "public_read_active_partners"
  ON public.partners FOR SELECT
  TO anon USING (active = true);
