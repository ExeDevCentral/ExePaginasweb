-- Tickets de soporte (panel de clientes)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  asunto TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'general',
  prioridad TEXT NOT NULL DEFAULT 'normal',
  estado TEXT NOT NULL DEFAULT 'abierto',
  plan_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_cliente ON public.tickets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON public.tickets(estado);

-- Trigger para tickets
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

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

-- Notificaciones in-app (Pulse del servicio)
CREATE TABLE IF NOT EXISTS public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info',
  leida BOOLEAN NOT NULL DEFAULT false,
  ref_ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_cliente ON public.notificaciones(cliente_id);

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

-- El insert de notificaciones lo hace el cliente al crear ticket (mismo check)
DROP POLICY IF EXISTS "Clientes crean notificaciones propias" ON public.notificaciones;
CREATE POLICY "Clientes crean notificaciones propias"
  ON public.notificaciones FOR INSERT
  TO authenticated
  WITH CHECK (cliente_id = auth.uid());
