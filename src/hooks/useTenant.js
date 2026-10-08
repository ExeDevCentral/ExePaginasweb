/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseTenantRepository } from '../core/infra/repositories/SupabaseTenantRepository'

const repo = new SupabaseTenantRepository()

export function useTenant(ownerId, enabled = true) {
  return useQuery({
    queryKey: ['tenant', ownerId],
    queryFn: () => repo.getByOwnerId(ownerId),
    enabled: enabled && !!ownerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTenantById(tenantId, enabled = true) {
  return useQuery({
    queryKey: ['tenant-detail', tenantId],
    queryFn: () => repo.getById(tenantId),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useTenantStats(tenantId, enabled = true) {
  return useQuery({
    queryKey: ['tenant-stats', tenantId],
    queryFn: () => repo.getTenantStats(tenantId),
    enabled: enabled && !!tenantId,
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

export function useCreateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => repo.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant'] })
    },
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => repo.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tenant'] })
      qc.invalidateQueries({ queryKey: ['tenant-detail', variables.id] })
    },
  })
}
