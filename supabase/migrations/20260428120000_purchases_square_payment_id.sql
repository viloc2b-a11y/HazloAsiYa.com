-- Square: ID de pago en columna dedicada (stripe_payment_intent queda solo para legado Stripe).
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS square_payment_id text UNIQUE;

COMMENT ON COLUMN public.purchases.square_payment_id IS 'ID de pago Square (webhook payment.id)';
COMMENT ON COLUMN public.purchases.stripe_payment_intent IS 'Legado: Payment Intent de Stripe; no usar para Square';
