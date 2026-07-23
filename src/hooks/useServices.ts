import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseServiceCatalogRepository } from '../core/infra/repositories/SupabaseServiceCatalogRepository'
import { SupabaseTenantServiceRepository } from '../core/infra/repositories/SupabaseTenantServiceRepository'
import type { TenantServiceEstado } from '../core/domain/entities/TenantService'

const catalogRepo = new SupabaseServiceCatalogRepository()
const tenantServiceRepo = new SupabaseTenantServiceRepository()

export function useServiceCatalog() {
  return useQuery({
    queryKey: ['service-catalog'],
    queryFn: () => catalogRepo.listActive(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useAllServices() {
  return useQuery({
    queryKey: ['service-catalog-all'],
    queryFn: () => catalogRepo.listAll(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTenantServices(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['tenant-services', tenantId],
    queryFn: () => tenantServiceRepo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateTenantService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      tenant_id: string
      service_id: string
      estado: TenantServiceEstado
      precio_actual: number
      moneda: string
      started_at: string
      ends_at: string | null
      auto_renew: boolean
      metadata: Record<string, unknown>
    }) => tenantServiceRepo.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['tenant-services', variables.tenant_id] })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}

export function useCancelTenantService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tenantServiceRepo.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenant-services'] })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}
