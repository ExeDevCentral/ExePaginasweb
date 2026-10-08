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

export class SupabaseInvoiceRepository {
  async listByTenantId(tenantId, limit = 20, offset = 0) {
    if (!isValidUUID(tenantId)) return []
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('fecha_emision', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async listByClienteId(clienteId, limit = 20, offset = 0) {
    if (!isValidUUID(clienteId)) return []
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha_emision', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async getById(id) {
    if (!isValidUUID(id)) return null
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle()

    if (error) throw error
    return data
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('invoices')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async markAsPaid(id, pagoId) {
    if (!isValidUUID(id)) return
    const { error } = await supabase
      .from('invoices')
      .update({
        estado: 'pagada',
        fecha_pago: new Date().toISOString(),
        pago_id: pagoId,
      })
      .eq('id', id)

    if (error) throw error
  }

  async countByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return 0
    const { count, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (error) throw error
    return _nullishCoalesce(count, () => 0)
  }

  async sumTotalByTenantId(tenantId) {
    if (!isValidUUID(tenantId)) return 0
    const { data, error } = await supabase
      .from('invoices')
      .select('total')
      .eq('tenant_id', tenantId)
      .eq('estado', 'pagada')

    if (error) throw error
    return _nullishCoalesce(data, () => []).reduce((sum, inv) => sum + (inv.total || 0), 0)
  }
}
