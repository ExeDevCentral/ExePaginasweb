import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseTenantRepository } from '../core/infra/repositories/SupabaseTenantRepository'
import type { Tenant } from '../core/domain/entities/Tenant'

const repo = new SupabaseTenantRepository()

export function useTenant(ownerId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['tenant', ownerId],
    queryFn: () => repo.getByOwnerId(ownerId!),
    enabled: enabled && !!ownerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTenantById(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['tenant-detail', tenantId],
    queryFn: () => repo.getById(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useTenantStats(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['tenant-stats', tenantId],
    queryFn: () => repo.getTenantStats(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export function useCreateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => repo.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant'] })
    },
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) => repo.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tenant'] })
      qc.invalidateQueries({ queryKey: ['tenant-detail', variables.id] })
    },
  })
}
