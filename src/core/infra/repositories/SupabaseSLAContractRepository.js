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

export class SupabaseSLAContractRepository {
  async listByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return []
    const { data, error } = await supabase
      .from('sla_contracts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async getActiveByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return null
    const { data, error } = await supabase
      .from('sla_contracts')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('activo', true)
      .order('nivel', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('sla_contracts')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    if (!isValidUUID(id)) throw new Error('Invalid ID')
    const { data: updated, error } = await supabase
      .from('sla_contracts')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async checkBreaches(tenantId) {
    if (!isValidUUID(tenantId)) return []
    const { data, error } = await supabase.rpc('check_sla_breaches', {
      p_tenant_id: tenantId,
    })

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }
}
