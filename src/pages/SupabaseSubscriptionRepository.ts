import { supabase } from '../core/auth/supabaseClient'
import { Suscripcion } from './Suscripcion'

export class SupabaseSubscriptionRepository {
  async getByClienteId(clienteId: string): Promise<Suscripcion[]> {
    const { data, error } = await supabase
      .from('suscripciones')
      .select(`
        id, 
        cliente_id, 
        plan_id, 
        fecha_inicio, 
        plan:planes(id, nombre, precio, caracteristicas)
      `)
      .eq('cliente_id', clienteId)
      .order('fecha_inicio', { ascending: false })

    if (error) throw error
    return (data ?? []) as unknown as Suscripcion[]
  }
}