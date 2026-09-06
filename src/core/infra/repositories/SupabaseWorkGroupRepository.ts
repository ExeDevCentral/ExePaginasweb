import { supabase } from '../supabase/client'
import { WorkGroup, WorkGroupWithMembers } from '../../domain/entities/WorkGroup'
import { WorkMember } from '../../domain/entities/WorkMember'
import { IWorkGroupRepository } from '../../domain/repositories/IWorkGroupRepository'
import { isValidUUID } from '../../utils/uuid'

export class SupabaseWorkGroupRepository implements IWorkGroupRepository {
  async listByTenantId(tenantId: string): Promise<WorkGroupWithMembers[]> {
    if (!isValidUUID(tenantId)) return []
    const { data: groups, error } = await supabase
      .from('work_groups')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('activo', true)
      .order('nombre')

    if (error) throw error

    const groupRows = groups ?? []
    if (groupRows.length === 0) return []

    const { data: members, error: membersError } = await supabase
      .from('work_members')
      .select('*')
      .in(
        'work_group_id',
        groupRows.map((group) => group.id)
      )
      .eq('activo', true)

    if (membersError) throw membersError

    const membersByGroup = new Map<string, WorkMember[]>()
    for (const member of members ?? []) {
      const groupMembers = membersByGroup.get(member.work_group_id) ?? []
      groupMembers.push(member as WorkMember)
      membersByGroup.set(member.work_group_id, groupMembers)
    }

    return groupRows.map((group) => {
      const groupMembers = membersByGroup.get(group.id) ?? []
      return {
        ...group,
        members: groupMembers,
        member_count: groupMembers.length,
      }
    })
  }

  async getById(id: string): Promise<WorkGroupWithMembers | null> {
    if (!isValidUUID(id)) return null
    const { data: group, error } = await supabase
      .from('work_groups')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!group) return null

    const { data: members, error: membersError } = await supabase
      .from('work_members')
      .select('*')
      .eq('work_group_id', id)
      .eq('activo', true)

    if (membersError) throw membersError

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
    if (!isValidUUID(id)) throw new Error('Invalid ID')
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
    if (!isValidUUID(id)) return
    const { error } = await supabase.from('work_groups').update({ activo: false }).eq('id', id)

    if (error) throw error
  }
}
