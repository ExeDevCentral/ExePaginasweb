import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseWorkMemberRepository } from '../core/infra/repositories/SupabaseWorkMemberRepository'
import type { WorkMember } from '../core/domain/entities/WorkMember'

const repo = new SupabaseWorkMemberRepository()

export function useWorkMembers(tenantId: string | null, enabled = true) {
  return useQuery({
    queryKey: ['work-members', tenantId],
    queryFn: () => repo.listByTenantId(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useWorkMember(id: string | null, enabled = true) {
  return useQuery({
    queryKey: ['work-member', id],
    queryFn: () => repo.getById(id!),
    enabled: enabled && !!id,
  })
}

export function useCreateWorkMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<WorkMember, 'id' | 'created_at' | 'updated_at'>) => repo.create(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['work-members', variables.tenant_id] })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}

export function useUpdateWorkMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkMember> }) => repo.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-members'] })
    },
  })
}

export function useDeleteWorkMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repo.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['work-members'] })
      qc.invalidateQueries({ queryKey: ['tenant-stats'] })
    },
  })
}
