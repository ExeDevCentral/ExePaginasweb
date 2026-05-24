-- Políticas para que usuarios autenticados gestionen su propio registro en clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios leen su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios leen su propio cliente"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Usuarios crean su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios crean su propio cliente"
  ON public.clientes FOR INSERT
  TO authenticated
  WITH CHECK (email = (auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Usuarios actualizan su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios actualizan su propio cliente"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
