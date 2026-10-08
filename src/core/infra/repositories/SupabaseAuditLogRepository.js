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

export class SupabaseAuditLogRepository {
  async log(tenantId, action, entity, entityId, oldData, newData) {
    const { error } = await supabase.from('audit_log').insert({
      tenant_id: tenantId,
      action,
      entity,
      entity_id: entityId,
      old_data: _nullishCoalesce(oldData, () => null),
      new_data: _nullishCoalesce(newData, () => null),
    })

    if (error) throw error
  }

  async listByTenantId(tenantId, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async listByEntity(entity, entityId) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('entity', entity)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }
}
