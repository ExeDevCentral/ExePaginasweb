-- Catálogo de clientes (debe existir ANTES de pagos/suscripciones/tickets)

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT,
  email TEXT UNIQUE,
  telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para updated_at en clientes
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- FUNCIÓN para crear el perfil de cliente automáticamente al registrarse en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.clientes (id, email, nombre)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Nuevo Usuario')
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- TRIGGER para activar la función anterior
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas: cliente solo puede leer/insertar/actualizar su propio registro por email
DROP POLICY IF EXISTS "Usuarios leen su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios leen su propio cliente"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Usuarios crean su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios crean su propio cliente"
  ON public.clientes FOR INSERT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Usuarios actualizan su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios actualizan su propio cliente"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (id = auth.uid());
