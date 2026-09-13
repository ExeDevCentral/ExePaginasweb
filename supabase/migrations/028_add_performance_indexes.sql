-- supabase/migrations/028_add_performance_indexes.sql
-- Optimizaciones de índices para queries críticas

-- ============================================
-- Índices para queries de Tenant
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tenants_owner_id 
  ON tenants(owner_id) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_tenants_slug 
  ON tenants(slug) 
  WHERE status = 'active';

-- ============================================
-- Índices para queries de WorkGroups
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workgroups_tenant_status 
  ON workgroups(tenant_id, status) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_workgroups_tenant_name 
  ON workgroups(tenant_id, name);

-- ============================================
-- Índices para queries de Invoices (crítico para reportes)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_date 
  ON invoices(tenant_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status 
  ON invoices(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_invoices_number_tenant 
  ON invoices(tenant_id, number);

-- ============================================
-- Índices para queries de Tickets (crítico para SLA)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_priority_status 
  ON tickets(tenant_id, priority, status);

CREATE INDEX IF NOT EXISTS idx_tickets_tenant_created 
  ON tickets(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to 
  ON tickets(assigned_to) 
  WHERE assigned_to IS NOT NULL;

-- ============================================
-- Índices para queries de SLA
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sla_contracts_tenant 
  ON sla_contracts(tenant_id);

-- ============================================
-- Índices para queries de TenantServices
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tenant_services_tenant_status 
  ON tenant_services(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_tenant_services_renewal 
  ON tenant_services(renewal_date) 
  WHERE status = 'active';

-- ============================================
-- Índices para queries de AuditLog (BRIN para series temporales)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_timestamp 
  ON audit_log(tenant_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp_brin 
  USING BRIN ON audit_log(timestamp) 
  WITH (pages_per_range = 128);

-- ============================================
-- Índices para queries de WorkMembers
-- ============================================
CREATE INDEX IF NOT EXISTS idx_work_members_group 
  ON work_members(work_group_id);

CREATE INDEX IF NOT EXISTS idx_work_members_user 
  ON work_members(user_id);

-- ============================================
-- Índices para queries de WebhookEvents (para debugging/monitoring)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_webhook_events_type 
  ON webhook_events(event_type);

CREATE INDEX IF NOT EXISTS idx_webhook_events_timestamp_brin 
  USING BRIN ON webhook_events(created_at) 
  WITH (pages_per_range = 64);

-- ============================================
-- Índices para RLS (fila-nivel de seguridad)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_auth_users_tenant_id 
  ON auth.users(raw_user_meta_data->>'tenant_id');

-- ============================================
-- Vacuum and Analyze (opcional, ejecutar manualmente en producción)
-- ============================================
-- VACUUM ANALYZE tenants;
-- VACUUM ANALYZE invoices;
-- VACUUM ANALYZE tickets;
-- VACUUM ANALYZE audit_log;
