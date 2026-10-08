function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseServiceCatalogRepository } from '../core/infra/repositories/SupabaseServiceCatalogRepository'
import { SupabaseTenantServiceRepository } from '../core/infra/repositories/SupabaseTenantServiceRepository'

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

export function useTenantServices(tenantId, enabled = true) {
  return useQuery({
    queryKey: queryKeys.tenantServices.byTenant(tenantId),
    queryFn: () =>
      isValidUUID(tenantId) ? tenantServiceRepo.listByTenantId(tenantId) : Promise.resolve([]),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateTenantService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => tenantServiceRepo.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.tenantServices.byTenant(variables.tenant_id) })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}

export function useCancelTenantService(tenantId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => tenantServiceRepo.cancel(id),
    onMutate: async (cancelledServiceId) => {
      if (!tenantId) return
      const targetKey = queryKeys.tenantServices.byTenant(tenantId)
      await qc.cancelQueries({ queryKey: targetKey })
      const previousServices = qc.getQueryData(targetKey)

      if (previousServices) {
        qc.setQueryData(
          targetKey,
          previousServices.map((s) =>
            s.id === cancelledServiceId ? { ...s, estado: 'cancelado' } : s
          )
        )
      }

      return { previousServices }
    },
    onError: (_err, _id, context) => {
      if (tenantId && _optionalChain([context, 'optionalAccess', (_2) => _2.previousServices])) {
        qc.setQueryData(queryKeys.tenantServices.byTenant(tenantId), context.previousServices)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenantServices.all })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}
