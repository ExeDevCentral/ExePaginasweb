/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
export const queryKeys = {
  serviceCatalog: {
    all: ['service-catalog'],
    active: ['service-catalog', 'active'],
    full: ['service-catalog', 'all'],
  },
  tenantServices: {
    all: ['tenant-services'],
    byTenant: (tenantId) => ['tenant-services', tenantId],
  },
  invoices: {
    all: ['invoices'],
    byTenant: (tenantId) => ['invoices', tenantId],
    byCliente: (clienteId) => ['invoices', 'cliente', clienteId],
    detail: (invoiceId) => ['invoices', 'detail', invoiceId],
  },
  workGroups: {
    all: ['work-groups'],
    byTenant: (tenantId) => ['work-groups', tenantId],
    members: (groupId) => ['work-group-members', groupId],
  },
  tenant: {
    all: ['tenant'],
    byCliente: (clienteId) => ['tenant', clienteId],
  },
  sla: {
    all: ['sla'],
    byTenant: (tenantId) => ['sla', tenantId],
  },
  auditLog: {
    all: ['audit-log'],
    byTenant: (tenantId) => ['audit-log', tenantId],
  },
}
