/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseClientePagoRepository {
  async listByClienteId(clienteId, limit = 10) {
    const { data, error } = await supabase
      .from('pagos')
      .select('id, monto, moneda, estado, plan_nombre, plan_slug, created_at')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}
