function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
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
import { supabase } from '../supabase/client'

import { isValidUUID } from '../../utils/uuid'

export class SupabaseWorkGroupRepository {
  async listByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return []
    const { data: groups, error } = await supabase
      .from('work_groups')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('activo', true)
      .order('nombre')

    if (error) throw error

    const groupRows = _nullishCoalesce(groups, () => [])
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

    const membersByGroup = new Map()
    for (const member of _nullishCoalesce(members, () => [])) {
      const groupMembers = _nullishCoalesce(membersByGroup.get(member.work_group_id), () => [])
      groupMembers.push(member)
      membersByGroup.set(member.work_group_id, groupMembers)
    }

    return groupRows.map((group) => {
      const groupMembers = _nullishCoalesce(membersByGroup.get(group.id), () => [])
      return {
        ...group,
        members: groupMembers,
        member_count: groupMembers.length,
      }
    })
  }

  async getById(id) {
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
      members: _nullishCoalesce(members, () => []),
      member_count: _nullishCoalesce(
        _optionalChain([members, 'optionalAccess', (_) => _.length]),
        () => 0
      ),
    }
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('work_groups')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    if (!isValidUUID(id)) throw new Error('Invalid ID')
    const { data: updated, error } = await supabase
      .from('work_groups')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async delete(id) {
    if (!isValidUUID(id)) return
    const { error } = await supabase.from('work_groups').update({ activo: false }).eq('id', id)

    if (error) throw error
  }
}
