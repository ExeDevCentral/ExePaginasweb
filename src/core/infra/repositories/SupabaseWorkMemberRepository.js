function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

import { isValidUUID } from '../../utils/uuid'

export class SupabaseWorkMemberRepository {
  async listByTenantId(tenantId) {
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
    return _nullishCoalesce(data, () => [])
  }

  async getById(id) {
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
    return data
  }

  async getByUserId(userId) {
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
    return data
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('work_members')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    if (!isValidUUID(id)) throw new Error('Invalid ID')
    const { data: updated, error } = await supabase
      .from('work_members')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async delete(id) {
    if (!isValidUUID(id)) return
    const { error } = await supabase.from('work_members').delete().eq('id', id)

    if (error) throw error
  }

  async countByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return 0
    const { count, error } = await supabase
      .from('work_members')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('activo', true)

    if (error) throw error
    return _nullishCoalesce(count, () => 0)
  }
}
