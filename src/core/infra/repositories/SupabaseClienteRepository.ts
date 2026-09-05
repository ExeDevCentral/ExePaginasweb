import { supabase } from '../supabase/client'
import { Cliente } from '../../domain/entities/Cliente'
import { IClienteRepository } from '../../domain/repositories/IClienteRepository'

export class SupabaseClienteRepository implements IClienteRepository {
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

  async ensureByAuthId(
    authId: string,
    fallback: Pick<Cliente, 'full_name' | 'email'>
  ): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .upsert(
        {
          id: authId,
          full_name: fallback.full_name ?? null,
          email: fallback.email,
        },
        { onConflict: 'id' }
      )
      .select('id, full_name, email')
      .single()

    if (!error) return data as unknown as Cliente
    return {
      id: authId,
      full_name: fallback.full_name ?? null,
      email: fallback.email,
    }
  }
}
