-- 003_planes_subscriptions.sql: Catálogo de planes y suscripciones de clientes

-- 1. Tabla de Catálogo de Planes
CREATE TABLE IF NOT EXISTS public.planes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  precio NUMERIC,
  caracteristicas TEXT[] NOT NULL DEFAULT '{}', -- Array de strings para mostrar de forma interactiva
  intervalo_meses INT DEFAULT 1, -- Frecuencia de cobro mensual/anual
  activo BOOLEAN DEFAULT true, -- Permite retirar planes de la venta
  moneda TEXT DEFAULT 'ARS', -- 'ARS' o 'USD'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Inserción / Actualización de planes semilla
INSERT INTO public.planes (slug, nombre, precio, caracteristicas, intervalo_meses, activo, moneda) VALUES
  (
    'mantenimiento-basico', 
    'Abono Básico', 
    25000, 
    ARRAY['Landing', 'SSL', 'Hosting Vercel'], 
    1, 
    true, 
    'ARS'
  ),
  (
    'mantenimiento-avanzado', 
    'Abono Avanzado', 
    50000, 
    ARRAY['Sistemas', 'Reservas', 'BD', 'Backups'], 
    1, 
    true, 
    'ARS'
  ),
  (
    'mantenimiento-premium', 
    'Abono Premium', 
    150000, 
    ARRAY['Edge prioritario', '2h dev', 'Account Manager'], 
    1, 
    true, 
    'ARS'
  )
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio,
  caracteristicas = EXCLUDED.caracteristicas,
  intervalo_meses = EXCLUDED.intervalo_meses,
  activo = EXCLUDED.activo,
  moneda = EXCLUDED.moneda;

-- 3. RLS para catálogo de planes (Público de lectura)
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Planes son públicos" ON public.planes;
CREATE POLICY "Planes son públicos"
  ON public.planes FOR SELECT
  TO anon, authenticated
  USING (activo = true);

-- 4. Agregar constreñimiento de FK en la tabla pagos (ahora que existe planes)
ALTER TABLE public.pagos 
  DROP CONSTRAINT IF EXISTS fk_pagos_plan_slug;
ALTER TABLE public.pagos
  ADD CONSTRAINT fk_pagos_plan_slug 
  FOREIGN KEY (plan_slug) REFERENCES public.planes(slug) 
  ON DELETE SET NULL;

-- 5. Tabla de Suscripciones
CREATE TABLE IF NOT EXISTS public.suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL, -- Conservamos historial contable al borrar clientes
  plan_slug TEXT NOT NULL REFERENCES public.planes(slug),
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'vencida')),
  gateway_subscription_id TEXT, -- ID de suscripción en Mercado Pago o Stripe
  cancelada_en TIMESTAMPTZ, -- Fecha exacta de solicitud de cancelación
  detalles JSONB, -- Registro completo de metadatos o log del gateway
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ, -- Fecha de vencimiento
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Trigger para mantener updated_at en suscripciones
DROP TRIGGER IF EXISTS set_updated_at ON public.suscripciones;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.suscripciones
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. RLS para suscripciones (Lectura propia)
ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes leen sus suscripciones" ON public.suscripciones;
CREATE POLICY "Clientes leen sus suscripciones"
  ON public.suscripciones FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());
