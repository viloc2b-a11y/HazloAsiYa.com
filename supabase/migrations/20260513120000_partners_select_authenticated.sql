-- Allow logged-in Supabase clients (`authenticated`) to read active partners,
-- not only `anon` (dashboard uses the user JWT, not the anon role).

DROP POLICY IF EXISTS "public_read_active_partners" ON public.partners;

CREATE POLICY "public_read_active_partners"
  ON public.partners FOR SELECT
  TO anon, authenticated USING (active = true);
