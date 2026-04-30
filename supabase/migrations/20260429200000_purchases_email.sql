-- Email del comprador en checkout Square (duplica metadata para consultas en Supabase).
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN public.purchases.email IS 'Correo pasado al Payment Link (payment_note / checkout)';
