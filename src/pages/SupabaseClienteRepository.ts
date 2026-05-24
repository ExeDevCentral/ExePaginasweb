import { supabase } from '../core/auth/supabaseClient'
import { Cliente } from './Cliente'

export class SupabaseClienteRepository {
  async getByEmail(email: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nombre, email, telefono')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    return data as Cliente | null
  }
}