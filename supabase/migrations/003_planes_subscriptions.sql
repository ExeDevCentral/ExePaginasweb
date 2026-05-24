-- Catálogo de planes (alineado con /tienda)
CREATE TABLE IF NOT EXISTS public.planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  precio NUMERIC,
  caracteristicas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.planes (slug, nombre, precio, caracteristicas) VALUES
  ('mantenimiento-basico', 'Abono Básico', 10, 'Landing · SSL · Hosting Vercel'),
  ('mantenimiento-avanzado', 'Abono Avanzado', 25, 'Sistemas · Reservas · BD · Backups'),
  ('mantenimiento-premium', 'Abono Premium', 50, 'Edge prioritario · 2h dev · Account Manager')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  caracteristicas = EXCLUDED.caracteristicas;

-- Slug en pagos para saber qué compró cada cliente
ALTER TABLE public.pagos ADD COLUMN IF NOT EXISTS plan_slug TEXT;

-- Suscripciones: el cliente ve solo las suyas
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes leen sus suscripciones" ON public.suscripciones;
CREATE POLICY "Clientes leen sus suscripciones"
  ON public.suscripciones FOR SELECT
  TO authenticated
  USING (
    cliente_id IN (
      SELECT id FROM public.clientes WHERE email = (auth.jwt() ->> 'email')
    )
  );
