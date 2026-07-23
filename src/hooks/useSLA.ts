import { useQuery } from '@tanstack/react-query'
import { SupabaseSLAContractRepository } from '../core/infra/repositories/SupabaseSLAContractRepository'

const repo = new SupabaseSLAContractRepository()

export function useSLAContracts(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-contracts', tenantId],
    queryFn: () => repo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useActiveSLA(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-active', tenantId],
    queryFn: () => repo.getActiveByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSLABreaches(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['sla-breaches', tenantId],
    queryFn: () => repo.checkBreaches(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}
