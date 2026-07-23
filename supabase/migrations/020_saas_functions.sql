-- 020_saas_functions.sql: RPC functions for SaaS operations
-- Audit logging, invoice generation, tenant lifecycle, SLA tracking

-- ============================================================================
-- 1. AUDIT LOG FUNCTION (call from app or triggers)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.log_audit(
  p_tenant_id UUID,
  p_action TEXT,
  p_entity TEXT,
  p_entity_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_log (
    tenant_id, user_id, action, entity, entity_id,
    old_data, new_data, ip_address, user_agent
  ) VALUES (
    p_tenant_id,
    auth.uid(),
    p_action,
    p_entity,
    p_entity_id,
    p_old_data,
    p_new_data,
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 2. GENERATE INVOICE NUMBER
-- Auto-increments per tenant + tipo
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_invoice_number(
  p_tenant_id UUID,
  p_tipo TEXT DEFAULT 'B'
)
RETURNS TEXT AS $$
DECLARE
  v_prefijo TEXT;
  v_secuencial INT;
  v_numero TEXT;
BEGIN
  -- Get or create sequence
  INSERT INTO public.invoice_sequences (tenant_id, tipo, prefijo, secuencial)
  VALUES (p_tenant_id, p_tipo, p_tipo || '-', 1)
  ON CONFLICT (tenant_id, tipo, prefijo) DO NOTHING;

  -- Increment and return
  UPDATE public.invoice_sequences
  SET secuencial = secuencial + 1
  WHERE tenant_id = p_tenant_id AND tipo = p_tipo
  RETURNING secuencial, prefijo INTO v_secuencial, v_prefijo;

  v_numero := p_tipo || '-' || LPAD(v_secuencial::TEXT, 8, '0');
  RETURN v_numero;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 3. CREATE INVOICE FROM PAYMENT
-- Called by webhook or payment confirmation
-- ============================================================================
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
  -- Get payment details
  SELECT * INTO v_pago FROM public.pagos WHERE id = p_pago_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment not found: %', p_pago_id;
  END IF;

  v_cliente_id := COALESCE(v_pago.cliente_id,
    (SELECT dueno_id FROM public.tenants WHERE id = p_tenant_id)
  );

  -- Determine invoice type based on amount
  IF v_pago.monto >= 100000 THEN
    v_tipo := 'A';
  ELSE
    v_tipo := 'B';
  END IF;

  -- Generate number
  v_numero := public.generate_invoice_number(p_tenant_id, v_tipo);

  -- Create invoice
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

  -- Log audit
  PERFORM public.log_audit(
    p_tenant_id, 'create', 'invoice', v_invoice_id,
    NULL,
    jsonb_build_object('numero', v_numero, 'total', v_pago.monto * 1.21)
  );

  RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 4. CHECK SLA COMPLIANCE
-- Returns tickets that are breaching or about to breach SLA
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_sla_breaches(p_tenant_id UUID)
RETURNS TABLE (
  ticket_id UUID,
  asunto TEXT,
  prioridad TEXT,
  created_at TIMESTAMPTZ,
  minutos_transcurridos BIGINT,
  tiempo_limite_minutos INT,
  estado_sla TEXT -- 'ok', 'warning', 'breach'
) AS $$
DECLARE
  v_sla RECORD;
BEGIN
  -- Get SLA for tenant
  SELECT * INTO v_sla
  FROM public.sla_contracts
  WHERE tenant_id = p_tenant_id AND activo = true
  ORDER BY
    CASE nivel
      WHEN 'enterprise' THEN 4
      WHEN 'premium' THEN 3
      WHEN 'avanzado' THEN 2
      ELSE 1
    END DESC
  LIMIT 1;

  IF NOT FOUND THEN
    -- Default SLA: 48h response
    v_sla.tiempo_respuesta_minutos := 2880;
  END IF;

  RETURN QUERY
  SELECT
    t.id,
    t.asunto,
    t.prioridad,
    t.created_at,
    EXTRACT(EPOCH FROM (now() - t.created_at)) / 60,
    v_sla.tiempo_respuesta_minutos,
    CASE
      WHEN EXTRACT(EPOCH FROM (now() - t.created_at)) / 60 > v_sla.tiempo_respuesta_minutos THEN 'breach'
      WHEN EXTRACT(EPOCH FROM (now() - t.created_at)) / 60 > v_sla.tiempo_respuesta_minutos * 0.8 THEN 'warning'
      ELSE 'ok'
    END
  FROM public.tickets t
  WHERE t.cliente_id = (SELECT dueno_id FROM public.tenants WHERE id = p_tenant_id)
    AND t.estado IN ('abierto', 'en_progreso')
    AND t.fecha_cierre IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 5. AUTO-ASSIGN TICKET
-- Assigns a ticket to the least busy member in the appropriate work group
-- ============================================================================
CREATE OR REPLACE FUNCTION public.auto_assign_ticket(
  p_ticket_id UUID,
  p_categoria TEXT DEFAULT 'general'
)
RETURNS UUID AS $$
DECLARE
  v_tenant_id UUID;
  v_member_id UUID;
  v_ticket RECORD;
BEGIN
  -- Get ticket
  SELECT * INTO v_ticket FROM public.tickets WHERE id = p_ticket_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  -- Find tenant for this client
  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE dueno_id = v_ticket.cliente_id
  LIMIT 1;

  IF v_tenant_id IS NULL THEN RETURN NULL; END IF;

  -- Find least busy active member in the tenant (excluding owner)
  SELECT wm.id INTO v_member_id
  FROM public.work_members wm
  WHERE wm.tenant_id = v_tenant_id
    AND wm.activo = true
    AND wm.rol IN ('admin', 'member')
    AND wm.user_id != v_ticket.cliente_id
  ORDER BY (
    SELECT COUNT(*) FROM public.tickets t
    WHERE t.asignado_a = wm.id
      AND t.estado IN ('abierto', 'en_progreso')
  ) ASC
  LIMIT 1;

  IF v_member_id IS NOT NULL THEN
    UPDATE public.tickets
    SET asignado_a = v_member_id,
        estado = 'en_progreso'
    WHERE id = p_ticket_id;
  END IF;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 6. PROCESS RENEWAL
-- Called by a scheduled job to process upcoming renewals
-- ============================================================================
CREATE OR REPLACE FUNCTION public.process_pending_renewals()
RETURNS INT AS $$
DECLARE
  v_count INT := 0;
  v_renewal RECORD;
BEGIN
  FOR v_renewal IN
    SELECT rs.*, ts.tenant_id, ts.service_id, sc.nombre as service_name
    FROM public.renewal_schedule rs
    JOIN public.tenant_services ts ON ts.id = rs.tenant_service_id
    JOIN public.service_catalog sc ON sc.id = ts.service_id
    WHERE rs.estado = 'pendiente'
      AND rs.fecha_renovacion <= now()
      AND rs.intentos < rs.max_intentos
  LOOP
    -- Mark as processing
    UPDATE public.renewal_schedule
    SET estado = 'procesando', intentos = intentos + 1
    WHERE id = v_renewal.id;

    -- Here you would call the payment gateway (PayPal/MercadoPago)
    -- For now, we just log it
    PERFORM public.log_audit(
      v_renewal.tenant_id,
      'renewal_attempt',
      'tenant_service',
      v_renewal.tenant_service_id,
      NULL,
      jsonb_build_object(
        'renewal_id', v_renewal.id,
        'monto', v_renewal.monto_esperado,
        'service', v_renewal.service_name
      )
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 7. GET TENANT DASHBOARD STATS
-- Returns aggregated stats for a tenant's dashboard
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_tenant_stats(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_members', (SELECT COUNT(*) FROM public.work_members WHERE tenant_id = p_tenant_id AND activo = true),
    'total_groups', (SELECT COUNT(*) FROM public.work_groups WHERE tenant_id = p_tenant_id AND activo = true),
    'active_services', (SELECT COUNT(*) FROM public.tenant_services WHERE tenant_id = p_tenant_id AND estado = 'activo'),
    'open_tickets', (
      SELECT COUNT(*) FROM public.tickets t
      WHERE t.cliente_id = (SELECT dueno_id FROM public.tenants WHERE id = p_tenant_id)
        AND t.estado IN ('abierto', 'en_progreso')
    ),
    'sla_breaches', (
      SELECT COUNT(*) FROM public.check_sla_breaches(p_tenant_id)
      WHERE estado_sla = 'breach'
    ),
    'pending_invoices', (
      SELECT COUNT(*) FROM public.invoices
      WHERE tenant_id = p_tenant_id AND estado IN ('borrador', 'emitida', 'vencida')
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(total), 0) FROM public.invoices
      WHERE tenant_id = p_tenant_id AND estado = 'pagada'
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 8. UPDATE USER ROLES to include staff/work_member
-- ============================================================================
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_role_check;

ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_role_check
  CHECK (role IN ('admin', 'client', 'staff', 'work_member'));
