-- 015_fix_tickets_policy.sql: Unifica SELECT de tickets para cliente propio + admin
-- Reemplaza la policy de 004_tickets.sql que solo permitía cliente_id = auth.uid()

DROP POLICY IF EXISTS "Clientes ven sus tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins leen todos los tickets" ON public.tickets;

CREATE POLICY "tickets_select"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (
    cliente_id = auth.uid()
    OR public.is_admin()
  );
