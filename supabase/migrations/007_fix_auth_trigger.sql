-- 007_fix_auth_trigger.sql: Reemplazar el trigger handle_new_user para resolver conflicto de IDs y claves foráneas en Google OAuth / PKCE

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
    -- Comportamiento normal si no hay conflicto de email
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
    ON CONFLICT (email) DO UPDATE SET
      nombre = COALESCE(EXCLUDED.nombre, public.clientes.nombre),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.clientes.avatar_url);
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
