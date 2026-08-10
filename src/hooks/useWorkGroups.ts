import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseWorkGroupRepository } from '../core/infra/repositories/SupabaseWorkGroupRepository'
import type { WorkGroup } from '../core/domain/entities/WorkGroup'

const repo = new SupabaseWorkGroupRepository()

export function useWorkGroups(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['work-groups', tenantId],
    queryFn: () => repo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useWorkGroup(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ['work-group', id],
    queryFn: () => repo.getById(id!),
    enabled: enabled && !!id,
  })
}

export function useCreateWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>) => repo.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['work-groups', variables.tenant_id] })
    },
  })
}

export function useUpdateWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkGroup> }) => repo.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-groups'] })
      qc.invalidateQueries({ queryKey: ['work-group'] })
    },
  })
}

export function useDeleteWorkGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repo.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-groups'] })
    },
  })
}
