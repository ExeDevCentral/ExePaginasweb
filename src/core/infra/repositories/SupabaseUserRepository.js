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

export class SupabaseUserRepository {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToDomain)
  }

  async getById(id) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()

    if (_optionalChain([error, 'optionalAccess', (_) => _.code]) === 'PGRST116') return null
    if (error) throw error
    return this.mapToDomain(data)
  }

  async createProfile(user) {
    const { error } = await supabase
      .from('profiles')
      .insert([{ id: user.id, email: user.email, full_name: user.fullName, role: user.role }])
    if (error) throw error
  }

  async delete(id) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
  }

  mapToDomain(raw) {
    return {
      id: raw.id,
      email: raw.email,
      fullName: _nullishCoalesce(raw.full_name, () => ''),
      role: raw.role,
      createdAt: raw.created_at,
    }
  }
}
