import { supabase } from '../supabase/client'
import { Cliente } from '../../domain/entities/Cliente'

export class SupabaseClienteRepository {
  async getByAuthId(authId: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, full_name, email')
      .eq('id', authId)
      .maybeSingle()

    if (error && error.code === 'PGRST116') return null
    if (error) throw error
    return data as Cliente | null
  }
}
