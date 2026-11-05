/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
-- Índices compuestos para consultas frecuentes del esquema SaaS.
-- Los índices simples de claves foráneas y columnas de estado ya se crean en
-- las migraciones 004, 016 y 018; aquí solo agregamos combinaciones útiles.

CREATE INDEX IF NOT EXISTS idx_tenants_dueno_created_at
  ON public.tenants (dueno_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_work_groups_activos_tenant_nombre
  ON public.work_groups (tenant_id, nombre)
  WHERE activo = true;

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_fecha_emision
  ON public.invoices (tenant_id, fecha_emision DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_cliente_fecha_emision
  ON public.invoices (cliente_id, fecha_emision DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_estado
  ON public.invoices (tenant_id, estado);

CREATE INDEX IF NOT EXISTS idx_tickets_cliente_created_at
  ON public.tickets (cliente_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_cliente_estado
  ON public.tickets (cliente_id, estado);

CREATE INDEX IF NOT EXISTS idx_sla_contracts_tenant_activos
  ON public.sla_contracts (tenant_id)
  WHERE activo = true;

CREATE INDEX IF NOT EXISTS idx_tenant_services_tenant_estado
  ON public.tenant_services (tenant_id, estado);

CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_created_at
  ON public.audit_log (tenant_id, created_at DESC);
