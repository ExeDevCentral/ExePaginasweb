-- ========================================
-- ExeSistemasWEB — Seed completo
-- ========================================

-- 1. Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Planes
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
  ('mantenimiento-premium', 'Abono Premium', 50, 'Edge prioritario · 2h dev · Account Manager', 1)
ON CONFLICT (slug) DO NOTHING;

-- 3. Pagos
CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id),
  monto NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'ARS',
  estado TEXT DEFAULT 'pendiente',
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  plan_nombre TEXT,
  plan_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Suscripciones
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

-- 5. RLS — acceden según email (no auth.uid, porque clientes.id es UUID random)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clientes leen sus datos" ON public.clientes;
CREATE POLICY "Clientes leen sus datos"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clientes ven sus pagos" ON public.pagos;
CREATE POLICY "Clientes ven sus pagos"
  ON public.pagos FOR SELECT
  TO authenticated
  USING (cliente_id IN (
    SELECT id FROM public.clientes WHERE email = auth.jwt() ->> 'email'
  ));

ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clientes ven sus suscripciones" ON public.suscripciones;
CREATE POLICY "Clientes ven sus suscripciones"
  ON public.suscripciones FOR SELECT
  TO authenticated
  USING (cliente_id IN (
    SELECT id FROM public.clientes WHERE email = auth.jwt() ->> 'email'
  ));

-- 6. Indices
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes(email);
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_id ON public.pagos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_mp_payment_id ON public.pagos(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_cliente_id ON public.suscripciones(cliente_id);
