-- Catálogo de planes (alineado con /tienda)
CREATE TABLE IF NOT EXISTS public.planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  precio NUMERIC,
  caracteristicas TEXT,
  intervalo_meses INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.planes (slug, nombre, precio, caracteristicas, intervalo_meses) VALUES
  ('mantenimiento-basico', 'Abono Básico', 10, 'Landing · SSL · Hosting Vercel', 1),
  ('mantenimiento-avanzado', 'Abono Avanzado', 25, 'Sistemas · Reservas · BD · Backups', 1),
  ('mantenimiento-premium', 'Abono Premium', 50, 'Edge prioritario · 2h dev · Account Manager', 1),
  ('mantenimiento-basico-anual', 'Abono Básico Anual', 100, 'Landing · SSL · Hosting Vercel (Ahorro 2 meses)', 12)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  caracteristicas = EXCLUDED.caracteristicas,
  intervalo_meses = EXCLUDED.intervalo_meses;

-- Slug en pagos para saber qué compró cada cliente
ALTER TABLE public.pagos ADD COLUMN IF NOT EXISTS plan_slug TEXT;

-- Tabla de Suscripciones (Faltaba la creación)
CREATE TABLE IF NOT EXISTS public.suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL REFERENCES public.planes(slug),
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'vencida')),
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para suscripciones
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.suscripciones
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Suscripciones: el cliente ve solo las suyas
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes leen sus suscripciones" ON public.suscripciones;
CREATE POLICY "Clientes leen sus suscripciones"
  ON public.suscripciones FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());
