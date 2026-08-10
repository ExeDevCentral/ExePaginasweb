-- 010_admin_policies.sql: Habilitar acceso de lectura y gestión global a los administradores

-- 1. Helper function para verificar si el usuario es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') IN ('exemetal@hotmail.com', 'echevarria270@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Políticas para public.clientes
DROP POLICY IF EXISTS "Admins leen todos los clientes" ON public.clientes;
CREATE POLICY "Admins leen todos los clientes"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins actualizan todos los clientes" ON public.clientes;
CREATE POLICY "Admins actualizan todos los clientes"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Políticas para public.suscripciones
DROP POLICY IF EXISTS "Admins leen todas las suscripciones" ON public.suscripciones;
CREATE POLICY "Admins leen todas las suscripciones"
  ON public.suscripciones FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins gestionan todas las suscripciones" ON public.suscripciones;
CREATE POLICY "Admins gestionan todas las suscripciones"
  ON public.suscripciones FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Políticas para public.pagos
DROP POLICY IF EXISTS "Admins leen todos los pagos" ON public.pagos;
CREATE POLICY "Admins leen todos los pagos"
  ON public.pagos FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins gestionan todos los pagos" ON public.pagos;
CREATE POLICY "Admins gestionan todos los pagos"
  ON public.pagos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Políticas para public.tickets
DROP POLICY IF EXISTS "Admins leen todos los tickets" ON public.tickets;
CREATE POLICY "Admins leen todos los tickets"
  ON public.tickets FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins gestionan todos los tickets" ON public.tickets;
CREATE POLICY "Admins gestionan todos los tickets"
  ON public.tickets FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Políticas para public.notificaciones
DROP POLICY IF EXISTS "Admins leen todas las notificaciones" ON public.notificaciones;
CREATE POLICY "Admins leen todas las notificaciones"
  ON public.notificaciones FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins gestionan todas las notificaciones" ON public.notificaciones;
CREATE POLICY "Admins gestionan todas las notificaciones"
  ON public.notificaciones FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
