-- ═══════════════════════════════════════════════════════════════
-- HazloAsíYa — Migración v2 (ejecutar DESPUÉS de supabase-schema.sql)
-- SQL Editor de Supabase: https://supabase.com/dashboard → SQL Editor
-- Es idempotente: se puede correr múltiples veces sin daño.
-- ═══════════════════════════════════════════════════════════════

-- 1. Columna purchased_at en users (para saber cuándo compró)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS purchased_at timestamptz;

-- 2. Columna email en purchases (para búsquedas sin auth desde el webhook de Square)
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS email text;

-- 3. Índices para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_purchases_email ON public.purchases(email);
CREATE INDEX IF NOT EXISTS idx_users_email     ON public.users(email);

-- 4. Ampliar CHECK constraint de plan para incluir productos Fase 1
--    (revisionExpress, kitSnap, kitItin)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE public.users ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('free','paid_guide','annual','assisted','revisionExpress','kitSnap','kitItin'));

-- 5. Verificación rápida — debe devolver las 5 tablas del proyecto
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users','leads','purchases','documents','events')
ORDER BY table_name;
