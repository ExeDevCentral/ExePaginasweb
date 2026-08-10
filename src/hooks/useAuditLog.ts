import { useQuery } from '@tanstack/react-query'
import { SupabaseAuditLogRepository } from '../core/infra/repositories/SupabaseAuditLogRepository'

const repo = new SupabaseAuditLogRepository()

export function useAuditLog(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['audit-log', tenantId],
    queryFn: () => repo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 60 * 1000,
  })
}

export function useAuditLogByEntity(entity: string, entityId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['audit-log', entity, entityId],
    queryFn: () => repo.listByEntity(entity, entityId!),
    enabled: enabled && !!entityId,
  })
}
