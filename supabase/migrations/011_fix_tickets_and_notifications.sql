-- 011_fix_tickets_and_notifications.sql
-- Arregla el sistema de tickets para que:
--   1. is_admin() use auth.email() en lugar de auth.jwt() que puede estar vacío en OAuth
--   2. Las políticas RLS permitan que un cliente con cliente.id = auth.uid() cree tickets
--   3. Un trigger en el servidor cree la notificación automáticamente (robusto, sin depender del frontend)
--   4. Los admins puedan leer/escribir todo sin restricción

-- ══════════════════════════════════════════════════════════════
-- 1. Arreglar is_admin() — usar auth.email() que es confiable
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(auth.email(), '') IN ('exemetal@hotmail.com', 'echevarria270@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ══════════════════════════════════════════════════════════════
-- 2. Reconstruir políticas RLS de tickets (evita conflictos)
-- ══════════════════════════════════════════════════════════════

-- 2a. DROP de todas las políticas anteriores
DROP POLICY IF EXISTS "Clientes ven sus tickets"            ON public.tickets;
DROP POLICY IF EXISTS "Clientes crean tickets"             ON public.tickets;
DROP POLICY IF EXISTS "Admins leen todos los tickets"      ON public.tickets;
DROP POLICY IF EXISTS "Admins gestionan todos los tickets" ON public.tickets;

-- 2b. SELECT: cada cliente ve los suyos; admins ven todos
CREATE POLICY "tickets_select"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (
    cliente_id = auth.uid()
    OR public.is_admin()
  );

-- 2c. INSERT: el cliente solo puede insertar con su propio uid como cliente_id
CREATE POLICY "tickets_insert"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    cliente_id = auth.uid()
    OR public.is_admin()
  );

-- 2d. UPDATE: solo admins pueden cambiar estado, respuesta, etc.
CREATE POLICY "tickets_update"
  ON public.tickets FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- 3. Reconstruir políticas RLS de notificaciones
-- ══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Clientes ven sus notificaciones"        ON public.notificaciones;
DROP POLICY IF EXISTS "Clientes marcan notificaciones leidas"  ON public.notificaciones;
DROP POLICY IF EXISTS "Clientes crean notificaciones propias"  ON public.notificaciones;
DROP POLICY IF EXISTS "Admins leen todas las notificaciones"   ON public.notificaciones;
DROP POLICY IF EXISTS "Admins gestionan todas las notificaciones" ON public.notificaciones;

-- SELECT: cliente ve las suyas; admin ve todas
CREATE POLICY "notificaciones_select"
  ON public.notificaciones FOR SELECT
  TO authenticated
  USING (
    cliente_id = auth.uid()
    OR public.is_admin()
  );

-- INSERT: el sistema server-side (trigger SECURITY DEFINER) puede insertar sin RLS.
-- Desde el frontend se permite si cliente_id = auth.uid()
CREATE POLICY "notificaciones_insert"
  ON public.notificaciones FOR INSERT
  TO authenticated
  WITH CHECK (
    cliente_id = auth.uid()
    OR public.is_admin()
  );

-- UPDATE: para marcar como leída (cliente) o gestionar (admin)
CREATE POLICY "notificaciones_update"
  ON public.notificaciones FOR UPDATE
  TO authenticated
  USING (
    cliente_id = auth.uid()
    OR public.is_admin()
  );

-- ══════════════════════════════════════════════════════════════
-- 4. Trigger en el servidor: al crear un ticket, generar
--    automáticamente la notificación para el cliente.
--    Esto es SECURITY DEFINER, así que bypasea RLS y es fiable.
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_ticket_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar notificación para el cliente (SECURITY DEFINER bypasa RLS)
  INSERT INTO public.notificaciones (
    cliente_id,
    titulo,
    mensaje,
    tipo,
    ref_ticket_id
  ) VALUES (
    NEW.cliente_id,
    'Ticket recibido ✅',
    'Tu solicitud "' || NEW.asunto || '" fue registrada. Te respondemos según tu plan.',
    'ticket',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Registrar el trigger (DROP IF EXISTS para idempotencia)
DROP TRIGGER IF EXISTS on_ticket_created ON public.tickets;
CREATE TRIGGER on_ticket_created
  AFTER INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_ticket_created();

-- ══════════════════════════════════════════════════════════════
-- 5. Trigger: cuando admin resuelve un ticket, notificar al cliente
-- ══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_ticket_resolved()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo disparar cuando cambia a estado 'resuelto'
  IF NEW.estado = 'resuelto' AND (OLD.estado IS DISTINCT FROM 'resuelto') THEN
    INSERT INTO public.notificaciones (
      cliente_id,
      titulo,
      mensaje,
      tipo,
      ref_ticket_id
    ) VALUES (
      NEW.cliente_id,
      'Ticket resuelto 🎉',
      CASE
        WHEN NEW.respuesta_resolucion IS NOT NULL AND NEW.respuesta_resolucion <> ''
        THEN 'Tu ticket "' || NEW.asunto || '" fue resuelto: ' || NEW.respuesta_resolucion
        ELSE 'Tu ticket "' || NEW.asunto || '" fue marcado como resuelto.'
      END,
      'success',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_ticket_resolved ON public.tickets;
CREATE TRIGGER on_ticket_resolved
  AFTER UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_ticket_resolved();

-- ══════════════════════════════════════════════════════════════
-- 6. Asegurar que el cliente_id en tickets corresponde a auth.uid()
--    (diagnóstico: si hay clientes con id != auth.uid(), esto los detecta)
--    NOTA: Esta query NO modifica datos, solo informa.
--    Ejecutar en la consola SQL de Supabase si querés verificar:
--    SELECT c.id as cliente_id, c.email, au.id as auth_id
--    FROM public.clientes c
--    LEFT JOIN auth.users au ON au.email = c.email
--    WHERE c.id <> au.id;
-- ══════════════════════════════════════════════════════════════
