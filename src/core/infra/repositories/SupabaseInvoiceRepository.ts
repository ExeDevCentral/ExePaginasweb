import { supabase } from '../supabase/client'
import { Invoice } from '../../domain/entities/Invoice'
import { IInvoiceRepository } from '../../domain/repositories/IInvoiceRepository'

export class SupabaseInvoiceRepository implements IInvoiceRepository {
  async listByTenantId(tenantId: string, limit = 20, offset = 0): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('fecha_emision', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return (data ?? []) as Invoice[]
  }

  async listByClienteId(clienteId: string, limit = 20, offset = 0): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha_emision', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return (data ?? []) as Invoice[]
  }

  async getById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).maybeSingle()

    if (error) throw error
    return data as Invoice | null
  }

  async create(
    data: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'numero'>
  ): Promise<Invoice> {
    const { data: created, error } = await supabase
      .from('invoices')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as Invoice
  }

  async markAsPaid(id: string, pagoId: string): Promise<void> {
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

  async countByTenantId(tenantId: string): Promise<number> {
    const { count, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (error) throw error
    return count ?? 0
  }

  async sumTotalByTenantId(tenantId: string): Promise<number> {
    const { data, error } = await supabase
      .from('invoices')
      .select('total')
      .eq('tenant_id', tenantId)
      .eq('estado', 'pagada')

    if (error) throw error
    return (data ?? []).reduce((sum, inv) => sum + (inv.total || 0), 0)
  }
}
