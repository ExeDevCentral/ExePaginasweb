-- 000_clientes.sql: Catálogo de clientes con integración Supabase Auth / Google OAuth

-- 1. Función genérica para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Creación de la tabla clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Alineado con auth.users
  nombre TEXT,
  email TEXT UNIQUE,
  telefono TEXT,
  avatar_url TEXT,
  direccion TEXT,
  ciudad TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Trigger para mantener updated_at en clientes
DROP TRIGGER IF EXISTS set_updated_at ON public.clientes;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  old_id UUID;
BEGIN
  -- 1. Verificar si ya existe un cliente con este email
  SELECT id INTO old_id FROM public.clientes WHERE email = new.email;

  IF old_id IS NOT NULL AND old_id <> new.id THEN
    -- 2. Modificar el email del registro viejo temporalmente para liberar la restricción UNIQUE
    UPDATE public.clientes 
    SET email = email || '.old_' || substr(md5(random()::text), 1, 8) 
    WHERE id = old_id;

    -- 3. Insertar el nuevo cliente con el ID correcto de auth
    INSERT INTO public.clientes (id, email, nombre, avatar_url)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'name', 
        'Nuevo Usuario'
      ),
      new.raw_user_meta_data->>'avatar_url'
    );

    -- 4. Migrar todas las referencias al nuevo cliente para evitar violaciones de FK
    UPDATE public.pagos SET cliente_id = new.id WHERE cliente_id = old_id;
    UPDATE public.suscripciones SET cliente_id = new.id WHERE cliente_id = old_id;
    UPDATE public.tickets SET cliente_id = new.id WHERE cliente_id = old_id;
    UPDATE public.notificaciones SET cliente_id = new.id WHERE cliente_id = old_id;
    UPDATE public.businesses SET dueno_id = new.id WHERE dueno_id = old_id;
    UPDATE public.reservations SET cliente_id = new.id WHERE cliente_id = old_id;

    -- 5. Eliminar el registro viejo ya sin dependencias
    DELETE FROM public.clientes WHERE id = old_id;

  ELSE
    -- Comportamiento normal si no hay conflicto de email.
    -- Importante: idempotente para evitar fallos por duplicados.
    INSERT INTO public.clientes (id, email, nombre, avatar_url)
    VALUES (
      new.id,
      new.email,
      COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        'Nuevo Usuario'
      ),
      new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      nombre = COALESCE(EXCLUDED.nombre, public.clientes.nombre),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.clientes.avatar_url)
    WHERE public.clientes.id = EXCLUDED.id
    ;

    -- Si el conflicto fue por email (y no por id) también actualizamos nombre/avatar.
    -- (Esto cubre casos raros de sincronización).
    UPDATE public.clientes
    SET
      nombre = COALESCE(COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Nuevo Usuario'), public.clientes.nombre),
      avatar_url = COALESCE(new.raw_user_meta_data->>'avatar_url', public.clientes.avatar_url)
    WHERE public.clientes.email = new.email;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. TRIGGER para activar el perfil automático
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Habilitar RLS (Row Level Security)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 7. Políticas de Seguridad RLS
DROP POLICY IF EXISTS "Usuarios leen su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios leen su propio cliente"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Usuarios crean su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios crean su propio cliente"
  ON public.clientes FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Usuarios actualizan su propio cliente" ON public.clientes;
CREATE POLICY "Usuarios actualizan su propio cliente"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (id = auth.uid());
