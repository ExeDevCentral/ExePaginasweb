-- 018_saas_core.sql: Core SaaS schema — Tenants, Work Groups, SLA, Invoices, Audit
-- This migration transforms the project from a marketing site with checkout
-- into a real multi-tenant SaaS platform.

-- ============================================================================
-- 1. TENANTS (Multi-tenant foundation)
-- Each cliente can have one or more tenants (businesses).
-- The tenant is the isolation boundary for all SaaS data.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  plan_id UUID REFERENCES public.planes(id) ON DELETE SET NULL,
  dueno_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido', 'cancelado', 'trial')),
  trial_ends_at TIMESTAMPTZ,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenants_dueno ON public.tenants(dueno_id);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_estado ON public.tenants(estado);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 2. WORK GROUPS (Teams / Departments within a tenant)
-- A tenant can have multiple work groups (e.g., "Soporte", "Desarrollo", "Ventas")
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.work_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color TEXT DEFAULT '#6366f1',
  icono TEXT DEFAULT 'users',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, nombre)
);

CREATE INDEX IF NOT EXISTS idx_work_groups_tenant ON public.work_groups(tenant_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.work_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 3. WORK MEMBERS (Employees/Contractors assigned to work groups)
-- Extends the existing employees table with SaaS role assignments.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.work_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  work_group_id UUID REFERENCES public.work_groups(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'member' CHECK (rol IN ('owner', 'admin', 'member', 'viewer')),
  avatar_url TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  ultimaconexion_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_work_members_tenant ON public.work_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_work_members_group ON public.work_members(work_group_id);
CREATE INDEX IF NOT EXISTS idx_work_members_user ON public.work_members(user_id);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.work_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 4. SERVICES (What the SaaS sells — plans, add-ons, professional services)
-- This is the product catalog. Each plan maps to one or more services.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL DEFAULT 'plan' CHECK (tipo IN ('plan', 'addon', 'professional', 'one_time')),
  precio_base NUMERIC NOT NULL DEFAULT 0,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  intervalo TEXT DEFAULT 'monthly' CHECK (intervalo IN ('one_time', 'monthly', 'quarterly', 'annual')),
  activo BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_catalog_slug ON public.service_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_service_catalog_tipo ON public.service_catalog(tipo);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.service_catalog
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. TENANT SERVICES (Which services a tenant has subscribed to)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tenant_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.service_catalog(id) ON DELETE RESTRICT,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'cancelado', 'vencido')),
  precio_actual NUMERIC NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_services_tenant ON public.tenant_services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_services_service ON public.tenant_services(service_id);
CREATE INDEX IF NOT EXISTS idx_tenant_services_estado ON public.tenant_services(estado);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tenant_services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. SLA CONTRACTS (Service Level Agreements per tenant)
-- Defines response times, resolution times, and escalation rules.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sla_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  nivel TEXT NOT NULL DEFAULT 'basico' CHECK (nivel IN ('basico', 'avanzado', 'premium', 'enterprise')),
  tiempo_respuesta_minutos INT NOT NULL DEFAULT 2880, -- 48h default
  tiempo_resolucion_minutos INT NOT NULL DEFAULT 10080, -- 7 days default
  horas_por_mes INT DEFAULT 0, -- Dev hours included
  penalizacion_por_incumplimiento NUMERIC DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_fin DATE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sla_contracts_tenant ON public.sla_contracts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sla_contracts_nivel ON public.sla_contracts(nivel);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sla_contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. INVOICES (Facturación electrónica)
-- Each payment generates an invoice. Supports AR facturas A/B/C.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE SET NULL,
  numero TEXT UNIQUE NOT NULL, -- Factura number (e.g., "A-0001-00012345")
  tipo TEXT NOT NULL DEFAULT 'A' CHECK (tipo IN ('A', 'B', 'C', 'ticket', 'proforma')),
  estado TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'emitida', 'pagada', 'vencida', 'cancelada')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  iva NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  concepto TEXT NOT NULL,
  detalles JSONB NOT NULL DEFAULT '[]', -- Line items
  fecha_emision TIMESTAMPTZ DEFAULT now(),
  fecha_vencimiento TIMESTAMPTZ,
  fecha_pago TIMESTAMPTZ,
  pago_id UUID REFERENCES public.pagos(id) ON DELETE SET NULL,
  afip_cae TEXT, -- CAE number for AFIP compliance
  afip_vencimiento TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_cliente ON public.invoices(cliente_id);
CREATE INDEX IF NOT EXISTS idx_invoices_numero ON public.invoices(numero);
CREATE INDEX IF NOT EXISTS idx_invoices_estado ON public.invoices(estado);
CREATE INDEX IF NOT EXISTS idx_invoices_fecha ON public.invoices(fecha_emision);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. INVOICE SEQUENCE (Auto-numbering for invoices)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invoice_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('A', 'B', 'C', 'ticket', 'proforma')),
  prefijo TEXT NOT NULL DEFAULT '',
  secuencial INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, tipo, prefijo)
);

-- ============================================================================
-- 9. AUDIT LOG (Who did what, when)
-- Every important action is logged here for compliance and debugging.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'payment', 'ticket_create', etc.
  entity TEXT NOT NULL, -- 'tenant', 'work_member', 'invoice', 'ticket', etc.
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_tenant ON public.audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at);

-- ============================================================================
-- 10. RENEWAL SCHEDULE (Tracks upcoming renewals for subscriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.renewal_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  tenant_service_id UUID NOT NULL REFERENCES public.tenant_services(id) ON DELETE CASCADE,
  fecha_renovacion TIMESTAMPTZ NOT NULL,
  monto_esperado NUMERIC NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completada', 'fallida', 'cancelada')),
  intentos INT NOT NULL DEFAULT 0,
  max_intentos INT NOT NULL DEFAULT 3,
  notificado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_renewal_schedule_tenant ON public.renewal_schedule(tenant_id);
CREATE INDEX IF NOT EXISTS idx_renewal_schedule_fecha ON public.renewal_schedule(fecha_renovacion);
CREATE INDEX IF NOT EXISTS idx_renewal_schedule_estado ON public.renewal_schedule(estado);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.renewal_schedule
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 11. SEED: Service Catalog
-- ============================================================================
-- ============================================================================
INSERT INTO public.service_catalog (slug, nombre, descripcion, tipo, precio_base, moneda, intervalo) VALUES
  ('mantenimiento-basico', 'Abono Básico', 'Landing page + SSL + Hosting Vercel', 'plan', 25000, 'ARS', 'monthly'),
  ('mantenimiento-avanzado', 'Abono Avanzado', 'Sistemas + Reservas + BD + Backups', 'plan', 50000, 'ARS', 'monthly'),
  ('mantenimiento-premium', 'Abono Premium', 'Edge prioritario + 2h dev + Account Manager', 'plan', 150000, 'ARS', 'monthly'),
  ('dominio-extra', 'Dominio Extra', 'Registro y mantenimiento de dominio adicional', 'addon', 5000, 'ARS', 'annual'),
  ('email-profesional', 'Email Profesional', 'Email corporativo con Google Workspace', 'addon', 8000, 'ARS', 'monthly'),
  ('desarrollo-custom', 'Desarrollo Custom', 'Horas de desarrollo a medida', 'professional', 15000, 'ARS', 'one_time'),
  ('consultoria-estrategica', 'Consultoría Estratégica', 'Sesión de consultoría digital (1h)', 'professional', 25000, 'ARS', 'one_time')
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  tipo = EXCLUDED.tipo,
  precio_base = EXCLUDED.precio_base,
  moneda = EXCLUDED.moneda,
  intervalo = EXCLUDED.intervalo;

-- ============================================================================
-- 13. SEED: Default SLA contracts (commented — fresh DB, no legacy data)
-- ============================================================================
