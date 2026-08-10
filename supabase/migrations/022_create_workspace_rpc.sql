-- 022_create_workspace_rpc.sql
-- SECURITY DEFINER RPC to create a tenant workspace in one transaction.
-- Bypasses RLS so it works even when clientes row doesn't exist yet
-- (e.g. users created before the auth.users trigger was added).

CREATE OR REPLACE FUNCTION public.create_workspace(
  p_slug TEXT,
  p_nombre TEXT,
  p_dueno_id UUID,
  p_estado TEXT DEFAULT 'trial',
  p_trial_ends_at TIMESTAMPTZ DEFAULT NULL,
  p_settings JSONB DEFAULT '{}',
  p_cliente_nombre TEXT DEFAULT NULL,
  p_cliente_email TEXT DEFAULT NULL,
  p_create_groups BOOLEAN DEFAULT true,
  p_work_groups JSONB DEFAULT '[{"nombre":"Soporte","descripcion":"Atención a clientes y resolución de tickets","color":"#6366f1","icono":"shield"},{"nombre":"Desarrollo","descripcion":"Construcción y despliegue de funcionalidades","color":"#ec4899","icono":"code"}]'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant_id UUID;
  v_group RECORD;
  v_result JSONB;
BEGIN
  -- 1. Ensure clientes row exists (upsert)
  -- NOTE: remote table uses 'full_name' column (not 'nombre')
  INSERT INTO public.clientes (id, full_name, email)
  VALUES (p_dueno_id, p_cliente_nombre, p_cliente_email)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.clientes.full_name),
    email = COALESCE(EXCLUDED.email, public.clientes.email);

  -- 2. Create tenant
  INSERT INTO public.tenants (slug, nombre, dueno_id, estado, trial_ends_at, settings)
  VALUES (p_slug, p_nombre, p_dueno_id, p_estado, p_trial_ends_at, p_settings)
  RETURNING id INTO v_tenant_id;

  -- 3. Create work groups if requested
  IF p_create_groups THEN
    FOR v_group IN SELECT * FROM jsonb_to_recordset(p_work_groups) AS x(nombre TEXT, descripcion TEXT, color TEXT, icono TEXT)
    LOOP
      INSERT INTO public.work_groups (tenant_id, nombre, descripcion, color, icono)
      VALUES (v_tenant_id, v_group.nombre, v_group.descripcion, v_group.color, v_group.icono)
      ON CONFLICT (tenant_id, nombre) DO NOTHING;
    END LOOP;
  END IF;

  -- 4. Register current user as Work Member (Owner)
  INSERT INTO public.work_members (tenant_id, user_id, email, nombre, rol, activo, ultimaconexion_at)
  VALUES (v_tenant_id, p_dueno_id, p_cliente_email, COALESCE(p_cliente_nombre, 'Owner'), 'owner', true, now());

  -- 5. Return the created tenant as JSON
  SELECT jsonb_build_object(
    'id', t.id,
    'slug', t.slug,
    'nombre', t.nombre,
    'plan_id', t.plan_id,
    'dueno_id', t.dueno_id,
    'estado', t.estado,
    'trial_ends_at', t.trial_ends_at,
    'settings', t.settings,
    'created_at', t.created_at,
    'updated_at', t.updated_at
  ) INTO v_result
  FROM public.tenants t WHERE t.id = v_tenant_id;

  RETURN v_result;
END;
$$;
