import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseServiceCatalogRepository } from '../core/infra/repositories/SupabaseServiceCatalogRepository'
import { SupabaseTenantServiceRepository } from '../core/infra/repositories/SupabaseTenantServiceRepository'
import type {
  TenantServiceEstado,
  TenantServiceWithDetails,
} from '../core/domain/entities/TenantService'
import { queryKeys } from '../core/infra/query/queryKeys'
import { isValidUUID } from '../core/utils/uuid'

const catalogRepo = new SupabaseServiceCatalogRepository()
const tenantServiceRepo = new SupabaseTenantServiceRepository()

export function useServiceCatalog() {
  return useQuery({
    queryKey: queryKeys.serviceCatalog.active,
    queryFn: () => catalogRepo.listActive(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useAllServices() {
  return useQuery({
    queryKey: queryKeys.serviceCatalog.full,
    queryFn: () => catalogRepo.listAll(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useTenantServices(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tenantServices.byTenant(tenantId),
    queryFn: () =>
      isValidUUID(tenantId) ? tenantServiceRepo.listByTenantId(tenantId!) : Promise.resolve([]),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
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
      qc.invalidateQueries({ queryKey: queryKeys.tenantServices.byTenant(variables.tenant_id) })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}

export function useCancelTenantService(tenantId?: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tenantServiceRepo.cancel(id),
    onMutate: async (cancelledServiceId: string) => {
      if (!tenantId) return
      const targetKey = queryKeys.tenantServices.byTenant(tenantId)
      await qc.cancelQueries({ queryKey: targetKey })
      const previousServices = qc.getQueryData<TenantServiceWithDetails[]>(targetKey)

      if (previousServices) {
        qc.setQueryData<TenantServiceWithDetails[]>(
          targetKey,
          previousServices.map((s) =>
            s.id === cancelledServiceId ? { ...s, estado: 'cancelado' as TenantServiceEstado } : s
          )
        )
      }

      return { previousServices }
    },
    onError: (_err, _id, context) => {
      if (tenantId && context?.previousServices) {
        qc.setQueryData(queryKeys.tenantServices.byTenant(tenantId), context.previousServices)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenantServices.all })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}
