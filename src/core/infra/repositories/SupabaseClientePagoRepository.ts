import { supabase } from '../supabase/client'
import { Pago } from '../../domain/entities/Pago'
import { IClientePagoRepository } from '../../domain/repositories/IClientePagoRepository'

export class SupabaseClientePagoRepository implements IClientePagoRepository {
  async listByClienteId(clienteId: string, limit = 10): Promise<Pago[]> {
    const { data, error } = await supabase
      .from('pagos')
      .select('id, monto, moneda, estado, plan_nombre, plan_slug, created_at')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as Pago[]) || []
  }
}
