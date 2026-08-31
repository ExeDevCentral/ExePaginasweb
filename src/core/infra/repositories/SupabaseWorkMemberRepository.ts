import { supabase } from '../supabase/client'
import { WorkMember, WorkMemberWithGroup } from '../../domain/entities/WorkMember'
import { IWorkMemberRepository } from '../../domain/repositories/IWorkMemberRepository'
import { isValidUUID } from '../../utils/uuid'

export class SupabaseWorkMemberRepository implements IWorkMemberRepository {
  async listByTenantId(tenantId: string): Promise<WorkMemberWithGroup[]> {
    if (!isValidUUID(tenantId)) return []
    const { data, error } = await supabase
      .from('work_members')
      .select(
        `
        *,
        work_group:work_groups(id, nombre, color)
      `
      )
      .eq('tenant_id', tenantId)
      .order('nombre')

    if (error) throw error
    return (data ?? []) as WorkMemberWithGroup[]
  }

  async getById(id: string): Promise<WorkMemberWithGroup | null> {
    if (!isValidUUID(id)) return null
    const { data, error } = await supabase
      .from('work_members')
      .select(
        `
        *,
        work_group:work_groups(id, nombre, color)
      `
      )
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as WorkMemberWithGroup | null
  }

  async getByUserId(userId: string): Promise<WorkMemberWithGroup | null> {
    if (!isValidUUID(userId)) return null
    const { data, error } = await supabase
      .from('work_members')
      .select(
        `
        *,
        work_group:work_groups(id, nombre, color)
      `
      )
      .eq('user_id', userId)
      .eq('activo', true)
      .maybeSingle()

    if (error) throw error
    return data as WorkMemberWithGroup | null
  }

  async create(data: Omit<WorkMember, 'id' | 'created_at' | 'updated_at'>): Promise<WorkMember> {
    const { data: created, error } = await supabase
      .from('work_members')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as WorkMember
  }

  async update(id: string, data: Partial<WorkMember>): Promise<WorkMember> {
    if (!isValidUUID(id)) throw new Error('Invalid ID')
    const { data: updated, error } = await supabase
      .from('work_members')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as WorkMember
  }

  async delete(id: string): Promise<void> {
    if (!isValidUUID(id)) return
    const { error } = await supabase.from('work_members').delete().eq('id', id)

    if (error) throw error
  }

  async countByTenantId(tenantId: string): Promise<number> {
    if (!isValidUUID(tenantId)) return 0
    const { count, error } = await supabase
      .from('work_members')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('activo', true)

    if (error) throw error
    return count ?? 0
  }
}
