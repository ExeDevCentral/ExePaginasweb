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

export class SupabaseTenantServiceRepository {
  async listByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return []
    const { data, error } = await supabase
      .from('tenant_services')
      .select(
        `
        *,
        service:service_catalog(id, slug, nombre, descripcion, tipo, intervalo)
      `
      )
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async getById(id) {
    if (!isValidUUID(id)) return null
    const { data, error } = await supabase
      .from('tenant_services')
      .select(
        `
        *,
        service:service_catalog(id, slug, nombre, descripcion, tipo, intervalo)
      `
      )
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('tenant_services')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    if (!isValidUUID(id)) throw new Error('Invalid ID')
    const { data: updated, error } = await supabase
      .from('tenant_services')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async cancel(id) {
    if (!isValidUUID(id)) return
    const { error } = await supabase
      .from('tenant_services')
      .update({ estado: 'cancelado', auto_renew: false })
      .eq('id', id)

    if (error) throw error
  }

  async getActiveCount(tenantId) {
    if (!isValidUUID(tenantId)) return 0
    const { count, error } = await supabase
      .from('tenant_services')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('estado', 'activo')

    if (error) throw error
    return _nullishCoalesce(count, () => 0)
  }
}
