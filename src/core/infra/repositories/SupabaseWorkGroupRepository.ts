import { supabase } from '../supabase/client'
import { WorkGroup, WorkGroupWithMembers } from '../../domain/entities/WorkGroup'
import { WorkMember } from '../../domain/entities/WorkMember'
import { IWorkGroupRepository } from '../../domain/repositories/IWorkGroupRepository'

export class SupabaseWorkGroupRepository implements IWorkGroupRepository {
  async listByTenantId(tenantId: string): Promise<WorkGroupWithMembers[]> {
    const { data: groups, error } = await supabase
      .from('work_groups')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('activo', true)
      .order('nombre')

    if (error) throw error

    const result: WorkGroupWithMembers[] = []

    for (const group of groups ?? []) {
      const { data: members } = await supabase
        .from('work_members')
        .select('*')
        .eq('work_group_id', group.id)
        .eq('activo', true)

      result.push({
        ...group,
        members: (members ?? []) as WorkMember[],
        member_count: members?.length ?? 0,
      })
    }

    return result
  }

  async getById(id: string): Promise<WorkGroupWithMembers | null> {
    const { data: group, error } = await supabase
      .from('work_groups')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!group) return null

    const { data: members } = await supabase
      .from('work_members')
      .select('*')
      .eq('work_group_id', id)
      .eq('activo', true)

    return {
      ...group,
      members: (members ?? []) as WorkMember[],
      member_count: members?.length ?? 0,
    }
  }

  async create(data: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WorkGroup> {
    const { data: created, error } = await supabase
      .from('work_groups')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as WorkGroup
  }

  async update(id: string, data: Partial<WorkGroup>): Promise<WorkGroup> {
    const { data: updated, error } = await supabase
      .from('work_groups')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as WorkGroup
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('work_groups').delete().eq('id', id)

    if (error) throw error
  }
}
