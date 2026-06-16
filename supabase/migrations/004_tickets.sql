-- 004_tickets.sql: Soporte al cliente (Tickets) y Notificaciones in-app

-- 1. Tabla de Tickets de Soporte
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL, -- Preservamos histórico contable/soporte
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'general', -- 'general', 'tecnico', 'facturacion', 'ventas'
  prioridad TEXT NOT NULL DEFAULT 'normal', -- 'baja', 'normal', 'alta', 'urgente'
  estado TEXT NOT NULL DEFAULT 'abierto', -- 'abierto', 'en_progreso', 'resuelto', 'cerrado'
  plan_slug TEXT REFERENCES public.planes(slug) ON DELETE SET NULL, -- Plan activo al generar el ticket
  asignado_a UUID, -- Se asignará una FK a la tabla employees en la migración de booking
  respuesta_resolucion TEXT, -- Explicación del cierre/resolución del caso
  fecha_cierre TIMESTAMPTZ, -- Fecha exacta de cierre del caso
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_cliente ON public.tickets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON public.tickets(estado);

-- 3. Trigger para mantener updated_at en tickets
DROP TRIGGER IF EXISTS set_updated_at ON public.tickets;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. RLS para tickets (Lectura y creación propia)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes ven sus tickets" ON public.tickets;
CREATE POLICY "Clientes ven sus tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());

DROP POLICY IF EXISTS "Clientes crean tickets" ON public.tickets;
CREATE POLICY "Clientes crean tickets"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (cliente_id = auth.uid());

-- 5. Tabla de Notificaciones in-app
CREATE TABLE IF NOT EXISTS public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE, -- Alerta directa al cliente
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  leida BOOLEAN NOT NULL DEFAULT false,
  ref_ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL, -- Asociación opcional con ticket
  enlace_url TEXT, -- Enlace interactivo en la app
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Índice de rendimiento para notificaciones
CREATE INDEX IF NOT EXISTS idx_notificaciones_cliente ON public.notificaciones(cliente_id);

-- 7. RLS para notificaciones (Lectura, marcado como leída y creación propia)
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clientes ven sus notificaciones" ON public.notificaciones;
CREATE POLICY "Clientes ven sus notificaciones"
  ON public.notificaciones FOR SELECT
  TO authenticated
  USING (cliente_id = auth.uid());

DROP POLICY IF EXISTS "Clientes marcan notificaciones leidas" ON public.notificaciones;
CREATE POLICY "Clientes marcan notificaciones leidas"
  ON public.notificaciones FOR UPDATE
  TO authenticated
  USING (cliente_id = auth.uid());

DROP POLICY IF EXISTS "Clientes crean notificaciones propias" ON public.notificaciones;
CREATE POLICY "Clientes crean notificaciones propias"
  ON public.notificaciones FOR INSERT
  TO authenticated
  WITH CHECK (cliente_id = auth.uid());
