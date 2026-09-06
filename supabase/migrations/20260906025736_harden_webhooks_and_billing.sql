-- 027_harden_webhooks_and_billing.sql
-- Durable webhook claims, payment idempotency and privileged RPC boundaries.

ALTER TABLE public.webhook_events
  ADD COLUMN IF NOT EXISTS provider_event_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'processed',
  ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_error TEXT;

ALTER TABLE public.webhook_events
  DROP CONSTRAINT IF EXISTS webhook_events_status_check;

ALTER TABLE public.webhook_events
  ADD CONSTRAINT webhook_events_status_check
  CHECK (status IN ('processing', 'processed', 'failed'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_provider_event_unique
  ON public.webhook_events(provider, provider_event_id)
  WHERE provider_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_webhook_events_status_claimed
  ON public.webhook_events(status, claimed_at);

ALTER TABLE public.pagos
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pagos_paypal_order_unique
  ON public.pagos(paypal_order_id)
  WHERE provider = 'paypal' AND paypal_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pagos_paypal_capture_unique
  ON public.pagos(paypal_capture_id)
  WHERE provider = 'paypal' AND paypal_capture_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pagos_provider_idempotency_unique
  ON public.pagos(provider, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_pago_unique
  ON public.invoices(pago_id)
  WHERE pago_id IS NOT NULL;

ALTER FUNCTION public.user_belongs_to_tenant(UUID) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.user_belongs_to_tenant(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_belongs_to_tenant(UUID) TO authenticated, service_role;

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
  p_work_groups JSONB DEFAULT '[{"nombre":"Soporte","descripcion":"Atencion a clientes y resolucion de tickets","color":"#6366f1","icono":"shield"},{"nombre":"Desarrollo","descripcion":"Construccion y despliegue de funcionalidades","color":"#ec4899","icono":"code"}]'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant_id UUID;
  v_group RECORD;
  v_groups JSONB;
  v_result JSONB;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_dueno_id THEN
    RAISE EXCEPTION 'Workspace owner must match the authenticated user';
  END IF;

  IF jsonb_typeof(p_work_groups) = 'string' THEN
    v_groups := p_work_groups::text::jsonb;
  ELSE
    v_groups := p_work_groups;
  END IF;

  INSERT INTO public.clientes (id, full_name, email)
  VALUES (p_dueno_id, p_cliente_nombre, p_cliente_email)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.clientes.full_name),
    email = COALESCE(EXCLUDED.email, public.clientes.email);

  INSERT INTO public.tenants (slug, nombre, dueno_id, estado, trial_ends_at, settings)
  VALUES (p_slug, p_nombre, p_dueno_id, p_estado, p_trial_ends_at, p_settings)
  RETURNING id INTO v_tenant_id;

  IF p_create_groups AND jsonb_typeof(v_groups) = 'array' AND jsonb_array_length(v_groups) > 0 THEN
    FOR v_group IN
      SELECT * FROM jsonb_to_recordset(v_groups)
      AS x(nombre TEXT, descripcion TEXT, color TEXT, icono TEXT)
    LOOP
      INSERT INTO public.work_groups (tenant_id, nombre, descripcion, color, icono)
      VALUES (v_tenant_id, v_group.nombre, v_group.descripcion, v_group.color, v_group.icono)
      ON CONFLICT (tenant_id, nombre) DO NOTHING;
    END LOOP;
  END IF;

  INSERT INTO public.work_members (tenant_id, user_id, email, nombre, rol, activo, ultimaconexion_at)
  VALUES (v_tenant_id, p_dueno_id, p_cliente_email, COALESCE(p_cliente_nombre, 'Owner'), 'owner', true, now());

  SELECT jsonb_build_object(
    'id', t.id, 'slug', t.slug, 'nombre', t.nombre,
    'plan_id', t.plan_id, 'dueno_id', t.dueno_id,
    'estado', t.estado, 'trial_ends_at', t.trial_ends_at,
    'settings', t.settings, 'created_at', t.created_at, 'updated_at', t.updated_at
  ) INTO v_result
  FROM public.tenants t WHERE t.id = v_tenant_id;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_workspace(
  TEXT, TEXT, UUID, TEXT, TIMESTAMPTZ, JSONB, TEXT, TEXT, BOOLEAN, JSONB
) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(
  TEXT, TEXT, UUID, TEXT, TIMESTAMPTZ, JSONB, TEXT, TEXT, BOOLEAN, JSONB
) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.create_invoice_from_payment(
  p_pago_id UUID,
  p_tenant_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_pago RECORD;
  v_cliente_id UUID;
  v_invoice_id UUID;
  v_numero TEXT;
  v_tipo TEXT := 'B';
BEGIN
  SELECT * INTO v_pago FROM public.pagos WHERE id = p_pago_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found: %', p_pago_id;
  END IF;

  v_cliente_id := v_pago.cliente_id;
  IF v_cliente_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.tenants
    WHERE id = p_tenant_id AND dueno_id = v_cliente_id
  ) THEN
    RAISE EXCEPTION 'Payment does not belong to tenant: %', p_tenant_id;
  END IF;

  SELECT id INTO v_invoice_id
  FROM public.invoices
  WHERE pago_id = p_pago_id
  LIMIT 1;

  IF v_invoice_id IS NOT NULL THEN
    RETURN v_invoice_id;
  END IF;

  IF v_pago.monto >= 100000 THEN
    v_tipo := 'A';
  END IF;

  v_numero := public.generate_invoice_number(p_tenant_id, v_tipo);

  INSERT INTO public.invoices (
    tenant_id, cliente_id, numero, tipo, estado,
    subtotal, iva, total, moneda,
    concepto, fecha_pago, pago_id, metadata
  ) VALUES (
    p_tenant_id, v_cliente_id, v_numero, v_tipo, 'pagada',
    v_pago.monto, v_pago.monto * 0.21, v_pago.monto * 1.21, v_pago.moneda,
    COALESCE(v_pago.plan_nombre, 'Servicio') || ' - ' || TO_CHAR(now(), 'MM/YYYY'),
    v_pago.fecha_aprobacion, p_pago_id,
    jsonb_build_object('paypal_order_id', v_pago.paypal_order_id, 'provider', v_pago.provider)
  ) RETURNING id INTO v_invoice_id;

  PERFORM public.log_audit(
    p_tenant_id, 'create', 'invoice', v_invoice_id,
    NULL,
    jsonb_build_object('numero', v_numero, 'total', v_pago.monto * 1.21)
  );

  RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.create_invoice_from_payment(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_invoice_from_payment(UUID, UUID) TO service_role;
