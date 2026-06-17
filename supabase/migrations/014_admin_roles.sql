-- 014_admin_roles.sql: Sistema de roles escalable (reemplaza emails hardcodeados)
-- Migración: ejecutar en orden después de 013_leads.sql

-- 1. Tabla de roles de usuario
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: solo admins pueden leer user_roles
CREATE POLICY "Admins read user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN ('exemetal@hotmail.com', 'echevarria270@gmail.com')
  );

-- Política: el usuario puede leer su propio rol
CREATE POLICY "Users read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Función helper actualizada que consulta la tabla en lugar de emails hardcodeados
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Insertar admins iniciales (seed)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
WHERE email IN ('exemetal@hotmail.com', 'echevarria270@gmail.com')
  AND id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
