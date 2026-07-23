-- 019_saas_rls.sql: Row Level Security policies for SaaS tables
-- SECURITY: Every table is locked down by default.
-- Only tenant owners, admins, and assigned members can access their data.

-- ============================================================================
-- TENANTS RLS
-- ============================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Tenants: owner can do everything
DROP POLICY IF EXISTS "Tenant owner full access" ON public.tenants;
CREATE POLICY "Tenant owner full access"
  ON public.tenants FOR ALL
  TO authenticated
  USING (dueno_id = auth.uid())
  WITH CHECK (dueno_id = auth.uid());

-- Tenants: members can read their tenant
DROP POLICY IF EXISTS "Tenant members read" ON public.tenants;
CREATE POLICY "Tenant members read"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- ============================================================================
-- WORK GROUPS RLS
-- ============================================================================
ALTER TABLE public.work_groups ENABLE ROW LEVEL SECURITY;

-- Work groups: tenant owner can manage
DROP POLICY IF EXISTS "Work groups owner manage" ON public.work_groups;
CREATE POLICY "Work groups owner manage"
  ON public.work_groups FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- Work groups: members can read
DROP POLICY IF EXISTS "Work groups members read" ON public.work_groups;
CREATE POLICY "Work groups members read"
  ON public.work_groups FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- ============================================================================
-- WORK MEMBERS RLS
-- ============================================================================
ALTER TABLE public.work_members ENABLE ROW LEVEL SECURITY;

-- Work members: tenant owner can manage
DROP POLICY IF EXISTS "Work members owner manage" ON public.work_members;
CREATE POLICY "Work members owner manage"
  ON public.work_members FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- Work members: members can read their own tenant's members
DROP POLICY IF EXISTS "Work members read own tenant" ON public.work_members;
CREATE POLICY "Work members read own tenant"
  ON public.work_members FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- Work members: members can read own profile
DROP POLICY IF EXISTS "Work members read own" ON public.work_members;
CREATE POLICY "Work members read own"
  ON public.work_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- SERVICE CATALOG RLS (public read for active services)
-- ============================================================================
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service catalog public read" ON public.service_catalog;
CREATE POLICY "Service catalog public read"
  ON public.service_catalog FOR SELECT
  TO anon, authenticated
  USING (activo = true);

-- Admin can manage
DROP POLICY IF EXISTS "Service catalog admin manage" ON public.service_catalog;
CREATE POLICY "Service catalog admin manage"
  ON public.service_catalog FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- TENANT SERVICES RLS
-- ============================================================================
ALTER TABLE public.tenant_services ENABLE ROW LEVEL SECURITY;

-- Tenant owner can read their services
DROP POLICY IF EXISTS "Tenant services owner read" ON public.tenant_services;
CREATE POLICY "Tenant services owner read"
  ON public.tenant_services FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- Members can read their tenant's services
DROP POLICY IF EXISTS "Tenant services member read" ON public.tenant_services;
CREATE POLICY "Tenant services member read"
  ON public.tenant_services FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- ============================================================================
-- SLA CONTRACTS RLS
-- ============================================================================
ALTER TABLE public.sla_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "SLA owner read" ON public.sla_contracts;
CREATE POLICY "SLA owner read"
  ON public.sla_contracts FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "SLA member read" ON public.sla_contracts;
CREATE POLICY "SLA member read"
  ON public.sla_contracts FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- Admin can manage all SLAs
DROP POLICY IF EXISTS "SLA admin manage" ON public.sla_contracts;
CREATE POLICY "SLA admin manage"
  ON public.sla_contracts FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- INVOICES RLS
-- ============================================================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Owner can read their invoices
DROP POLICY IF EXISTS "Invoices owner read" ON public.invoices;
CREATE POLICY "Invoices owner read"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- Member read
DROP POLICY IF EXISTS "Invoices member read" ON public.invoices;
CREATE POLICY "Invoices member read"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );

-- Admin full access
DROP POLICY IF EXISTS "Invoices admin manage" ON public.invoices;
CREATE POLICY "Invoices admin manage"
  ON public.invoices FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- INVOICE SEQUENCES RLS (admin only)
-- ============================================================================
ALTER TABLE public.invoice_sequences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Invoice sequences admin" ON public.invoice_sequences;
CREATE POLICY "Invoice sequences admin"
  ON public.invoice_sequences FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- AUDIT LOG RLS
-- ============================================================================
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Admin can read all
DROP POLICY IF EXISTS "Audit log admin read" ON public.audit_log;
CREATE POLICY "Audit log admin read"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (is_admin());

-- Tenant owner can read their audit log
DROP POLICY IF EXISTS "Audit log tenant owner read" ON public.audit_log;
CREATE POLICY "Audit log tenant owner read"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- System can insert (via SECURITY DEFINER functions)
DROP POLICY IF EXISTS "Audit log system insert" ON public.audit_log;
CREATE POLICY "Audit log system insert"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- RENEWAL SCHEDULE RLS
-- ============================================================================
ALTER TABLE public.renewal_schedule ENABLE ROW LEVEL SECURITY;

-- Owner read
DROP POLICY IF EXISTS "Renewal owner read" ON public.renewal_schedule;
CREATE POLICY "Renewal owner read"
  ON public.renewal_schedule FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE dueno_id = auth.uid()
    )
  );

-- Admin full access
DROP POLICY IF EXISTS "Renewal admin manage" ON public.renewal_schedule;
CREATE POLICY "Renewal admin manage"
  ON public.renewal_schedule FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Member read
DROP POLICY IF EXISTS "Renewal member read" ON public.renewal_schedule;
CREATE POLICY "Renewal member read"
  ON public.renewal_schedule FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.work_members
      WHERE user_id = auth.uid() AND activo = true
    )
  );
