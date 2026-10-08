/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseWorkGroupRepository } from '../core/infra/repositories/SupabaseWorkGroupRepository'

import { isValidUUID } from '../core/utils/uuid'

const repo = new SupabaseWorkGroupRepository()

export function useWorkGroups(tenantId, enabled = true) {
  return useQuery({
    queryKey: ['work-groups', tenantId],
    queryFn: () => (isValidUUID(tenantId) ? repo.listByTenantId(tenantId) : Promise.resolve([])),
    enabled: enabled && !!tenantId && isValidUUID(tenantId),
    staleTime: 2 * 60 * 1000,
  })
}

export function useWorkGroup(id, enabled = true) {
  return useQuery({
    queryKey: ['work-group', id],
    queryFn: () => (isValidUUID(id) ? repo.getById(id) : Promise.resolve(null)),
    enabled: enabled && !!id && isValidUUID(id),
  })
}

export function useCreateWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => repo.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['work-groups', variables.tenant_id] })
    },
  })
}

export function useUpdateWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => repo.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-groups'] })
      qc.invalidateQueries({ queryKey: ['work-group'] })
    },
  })
}

export function useDeleteWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => repo.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-groups'] })
    },
  })
}
