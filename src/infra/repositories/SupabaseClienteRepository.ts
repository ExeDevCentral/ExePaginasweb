import { supabase } from '../../core/infra/supabase/client'
import { Cliente } from '../../core/domain/entities/Cliente'

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