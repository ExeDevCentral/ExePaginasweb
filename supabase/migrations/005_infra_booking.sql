-- 005_infra_booking.sql: Sistemas de reservas, negocios y turnos (Plan Avanzado)

-- =========================================================================
-- 1. TABLA DE NEGOCIOS (Businesses / Tenants)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dueno_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE, -- Vinculado al catálogo de clientes
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    avatar_url TEXT, -- Logo o imagen del negocio
    direccion TEXT, -- Dirección física
    ciudad TEXT, -- Ciudad de operación
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- 2. TABLA DE EMPLEADOS / RECURSOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE, -- Negocio al que pertenece
    nombre TEXT NOT NULL,
    email TEXT,
    telefono TEXT, -- Teléfono de contacto del empleado
    avatar_url TEXT, -- Foto de perfil del empleado
    activo BOOLEAN DEFAULT true, -- Empleado disponible para recibir reservas
    especialidad TEXT, -- Especialidad o cargo del recurso
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_business_id ON public.employees(business_id);

-- Enlazar ahora la Foreign Key en tickets.asignado_a hacia employees (ahora que existe la tabla)
ALTER TABLE public.tickets
  DROP CONSTRAINT IF EXISTS fk_tickets_asignado_a;
ALTER TABLE public.tickets
  ADD CONSTRAINT fk_tickets_asignado_a
  FOREIGN KEY (asignado_a) REFERENCES public.employees(id)
  ON DELETE SET NULL;

-- =========================================================================
-- 3. TABLA DE SERVICIOS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT, -- Detalles adicionales del servicio
    duracion_minutos INT NOT NULL, -- Duración estimada en minutos
    precio DECIMAL(10,2), -- Precio del servicio
    activo BOOLEAN DEFAULT true, -- Permite retirar temporalmente el servicio
    imagen_url TEXT, -- Imagen ilustrativa del servicio
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);

-- =========================================================================
-- 4. TABLA DE HORARIOS DE TRABAJO (Schedules)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0 = Domingo, 6 = Sábado
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (hora_inicio < hora_fin)
);

CREATE INDEX IF NOT EXISTS idx_schedules_employee_id ON public.schedules(employee_id);

-- =========================================================================
-- 5. TABLA DE RESERVAS (Reservations)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL, -- Asignado si tiene cuenta
    cliente_nombre TEXT NOT NULL, -- Nombre de contacto
    cliente_email TEXT NOT NULL, -- Email de contacto
    cliente_telefono TEXT, -- Teléfono de contacto
    inicio_at TIMESTAMPTZ NOT NULL,
    fin_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notas TEXT, -- Comentarios adicionales
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (inicio_at < fin_at)
);

CREATE INDEX IF NOT EXISTS idx_reservations_business_date ON public.reservations(business_id, inicio_at);
CREATE INDEX IF NOT EXISTS idx_reservations_employee_date ON public.reservations(employee_id, inicio_at);

-- =========================================================================
-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 7. POLÍTICAS DE SEGURIDAD (RLS POLICIES)
-- =========================================================================

-- POLÍTICAS PARA: businesses (Dueño gestiona, lectura libre o del dueño)
DROP POLICY IF EXISTS "Dueño gestiona sus negocios" ON public.businesses;
CREATE POLICY "Dueño gestiona sus negocios"
  ON public.businesses FOR ALL
  TO authenticated
  USING (dueno_id = auth.uid())
  WITH CHECK (dueno_id = auth.uid());

DROP POLICY IF EXISTS "Lectura pública de negocios" ON public.businesses;
CREATE POLICY "Lectura pública de negocios"
  ON public.businesses FOR SELECT
  TO anon, authenticated
  USING (true);

-- POLÍTICAS PARA: employees (Dueño del negocio gestiona, lectura pública para reservar)
DROP POLICY IF EXISTS "Dueño gestiona los empleados de su negocio" ON public.employees;
CREATE POLICY "Dueño gestiona los empleados de su negocio"
  ON public.employees FOR ALL
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()));

DROP POLICY IF EXISTS "Lectura pública de empleados" ON public.employees;
CREATE POLICY "Lectura pública de empleados"
  ON public.employees FOR SELECT
  TO anon, authenticated
  USING (activo = true);

-- POLÍTICAS PARA: services (Dueño del negocio gestiona, lectura pública para reservar)
DROP POLICY IF EXISTS "Dueño gestiona los servicios de su negocio" ON public.services;
CREATE POLICY "Dueño gestiona los servicios de su negocio"
  ON public.services FOR ALL
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()));

DROP POLICY IF EXISTS "Lectura pública de servicios" ON public.services;
CREATE POLICY "Lectura pública de servicios"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (activo = true);

-- POLÍTICAS PARA: schedules (Dueño del negocio gestiona, lectura pública para disponibilidad)
DROP POLICY IF EXISTS "Dueño gestiona los horarios de sus empleados" ON public.schedules;
CREATE POLICY "Dueño gestiona los horarios de sus empleados"
  ON public.schedules FOR ALL
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()));

DROP POLICY IF EXISTS "Lectura pública de horarios" ON public.schedules;
CREATE POLICY "Lectura pública de horarios"
  ON public.schedules FOR SELECT
  TO anon, authenticated
  USING (true);

-- POLÍTICAS PARA: reservations (Dueño del negocio gestiona todo, cliente lee/crea lo suyo)
DROP POLICY IF EXISTS "Dueño gestiona las reservas de su negocio" ON public.reservations;
CREATE POLICY "Dueño gestiona las reservas de su negocio"
  ON public.reservations FOR ALL
  TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE dueno_id = auth.uid()));

DROP POLICY IF EXISTS "Clientes ven sus propias reservas" ON public.reservations;
CREATE POLICY "Clientes ven sus propias reservas"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());

DROP POLICY IF EXISTS "Público crea reservas" ON public.reservations;
CREATE POLICY "Público crea reservas"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true); -- Permitimos reservas anónimas (invitado) o de usuarios logueados