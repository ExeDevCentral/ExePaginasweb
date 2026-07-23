-- 024_add_clientes_updated_at.sql
-- Remote clientes table was missing updated_at column.
-- The set_updated_at trigger exists but the column didn't,
-- causing "record new has no field updated_at" on ON CONFLICT DO UPDATE.

ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Also ensure the handle_updated_at trigger exists on clientes
-- (in case it was dropped during migration drift)
DROP TRIGGER IF EXISTS set_updated_at ON public.clientes;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
