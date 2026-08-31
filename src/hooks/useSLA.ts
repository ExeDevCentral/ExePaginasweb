import { useQuery } from '@tanstack/react-query'
import { SupabaseSLAContractRepository } from '../core/infra/repositories/SupabaseSLAContractRepository'
import { isValidUUID } from '../core/utils/uuid'

const repo = new SupabaseSLAContractRepository()

export function useSLAContracts(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-contracts', tenantId],
    queryFn: () => (isValidUUID(tenantId) ? repo.listByTenantId(tenantId!) : Promise.resolve([])),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useActiveSLA(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-active', tenantId],
    queryFn: () =>
      isValidUUID(tenantId) ? repo.getActiveByTenantId(tenantId!) : Promise.resolve(null),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSLABreaches(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-breaches', tenantId],
    queryFn: () => (isValidUUID(tenantId) ? repo.checkBreaches(tenantId!) : Promise.resolve([])),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}
