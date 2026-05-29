-- Migración 005: Infraestructura para sistemas de reservas y negocios (Plan Avanzado)

-- 1. TABLA DE NEGOCIOS (Tenants)
CREATE TABLE IF NOT EXISTS public.negocios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dueno_id UUID REFERENCES public.clientes(id), -- Vinculado al catálogo de clientes
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. TABLA DE EMPLEADOS / RECURSOS
CREATE TABLE IF NOT EXISTS public.empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negocio_id UUID NOT NULL REFERENCES public.negocios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE SERVICIOS
CREATE TABLE IF NOT EXISTS public.servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negocio_id UUID NOT NULL REFERENCES public.negocios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    duracion_minutos INT NOT NULL,
    precio DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TABLA DE RESERVAS (Reservations)
CREATE TABLE IF NOT EXISTS public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    negocio_id UUID NOT NULL REFERENCES public.negocios(id) ON DELETE CASCADE,
    empleado_id UUID NOT NULL REFERENCES public.empleados(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES public.servicios(id) ON DELETE CASCADE,
    inicio_at TIMESTAMPTZ NOT NULL,
    fin_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    cliente_nombre TEXT NOT NULL,
    cliente_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (inicio_at < fin_at)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Política: El dueño del negocio (cliente) puede ver su propio negocio
CREATE POLICY "Clientes ven sus propios negocios"
  ON public.negocios FOR ALL
  TO authenticated
  USING (dueno_id = auth.uid());

CREATE POLICY "Dueños gestionan sus empleados"
  ON public.empleados FOR ALL
  TO authenticated
  USING (negocio_id IN (SELECT id FROM public.negocios WHERE dueno_id = auth.uid()));

CREATE POLICY "Dueños gestionan sus servicios"
  ON public.servicios FOR ALL
  TO authenticated
  USING (negocio_id IN (SELECT id FROM public.negocios WHERE dueno_id = auth.uid()));

CREATE POLICY "Dueños gestionan sus reservas"
  ON public.reservas FOR ALL
  TO authenticated
  USING (negocio_id IN (SELECT id FROM public.negocios WHERE dueno_id = auth.uid()));