-- HazloAsíYa — Supabase Schema (baseline para instalación nueva)
-- Ejecutar en el SQL Editor de Supabase.
-- Proyectos ya existentes: usa también `supabase-migration-v2.sql` y
-- `supabase/migrations/*.sql` en orden; esas piezas son idempotentes.

-- ─── USERS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text UNIQUE NOT NULL,
  name            text,
  plan            text DEFAULT 'free' CHECK (plan IN (
    'free','paid_guide','annual','assisted','revisionExpress','kitSnap','kitItin'
  )),
  plan_expires_at timestamptz,
  purchased_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON public.users FOR INSERT WITH CHECK (true);

-- ─── LEADS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES public.users(id),
  name       text NOT NULL,
  phone      text NOT NULL,
  zip        text,
  funnel     text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT WITH CHECK (true);

-- ─── PURCHASES ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.purchases (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid REFERENCES public.users(id),
  product_id              text NOT NULL,
  funnel                  text,
  amount                  integer NOT NULL,
  stripe_payment_intent   text UNIQUE,
  square_payment_id       text UNIQUE,
  email                   text,
  partner_slug            text,
  referral_source         text,
  organization_type       text,
  referral_city           text,
  referral_state          text,
  created_at              timestamptz DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert purchases"
  ON public.purchases FOR INSERT WITH CHECK (true);

-- ─── DOCUMENTS ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES public.users(id),
  funnel     text NOT NULL,
  form_data  jsonb,
  result     jsonb,
  pdf_url    text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ─── EVENTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid,
  event      text NOT NULL,
  funnel     text,
  data       jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
  ON public.events FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT USING (auth.uid() = user_id);

-- ─── PARTNERS (Alianza) ───────────────────────
CREATE TABLE IF NOT EXISTS public.partners (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  name                text NOT NULL,
  organization_type   text,
  city                text,
  state               text,
  contact_email       text,
  tier                text DEFAULT 'basica',
  revenue_share_pct   integer DEFAULT 10,
  active              boolean DEFAULT true,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_partners" ON public.partners;
DROP POLICY IF EXISTS "public_read_active_partners" ON public.partners;

CREATE POLICY "service_role_all_partners"
  ON public.partners FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "public_read_active_partners"
  ON public.partners FOR SELECT
  TO anon, authenticated USING (active = true);

-- ─── PARTNER_EVENTS ───────────────────────────
CREATE TABLE IF NOT EXISTS public.partner_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_slug    text NOT NULL REFERENCES public.partners(slug) ON DELETE CASCADE,
  event_type      text NOT NULL,
  funnel_id       text,
  state_slug      text,
  session_id      text,
  user_id         uuid,
  purchase_id     uuid,
  metadata        jsonb,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_partner_events" ON public.partner_events;

CREATE POLICY "service_role_all_partner_events"
  ON public.partner_events FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ─── INDEXES ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_created           ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_funnel            ON public.leads(funnel);
CREATE INDEX IF NOT EXISTS idx_purchases_user          ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email         ON public.purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_email_funnel  ON public.purchases(email, funnel)
  WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_partner_slug  ON public.purchases(partner_slug)
  WHERE partner_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_user          ON public.documents(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_user             ON public.events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event            ON public.events(event);
CREATE INDEX IF NOT EXISTS idx_partners_slug           ON public.partners(slug);
CREATE INDEX IF NOT EXISTS idx_partner_events_slug     ON public.partner_events(partner_slug);
CREATE INDEX IF NOT EXISTS idx_partner_events_created  ON public.partner_events(created_at DESC);

-- ─── TRIGGER: auto-create user on signup ──────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
