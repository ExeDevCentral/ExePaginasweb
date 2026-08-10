export const queryKeys = {
  serviceCatalog: {
    all: ['service-catalog'] as const,
    active: ['service-catalog', 'active'] as const,
    full: ['service-catalog', 'all'] as const,
  },
  tenantServices: {
    all: ['tenant-services'] as const,
    byTenant: (tenantId: string | null) => ['tenant-services', tenantId] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    byTenant: (tenantId: string | null) => ['invoices', tenantId] as const,
  },
  workGroups: {
    all: ['work-groups'] as const,
    byTenant: (tenantId: string | null) => ['work-groups', tenantId] as const,
    members: (groupId: string | null) => ['work-group-members', groupId] as const,
  },
  tenant: {
    all: ['tenant'] as const,
    byCliente: (clienteId: string | null) => ['tenant', clienteId] as const,
  },
  sla: {
    all: ['sla'] as const,
    byTenant: (tenantId: string | null) => ['sla', tenantId] as const,
  },
  auditLog: {
    all: ['audit-log'] as const,
    byTenant: (tenantId: string | null) => ['audit-log', tenantId] as const,
  },
}
