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
    const payload: { id: string; email: string; full_name?: string } = {
      id: authId,
      email: fallback.email,
    }

    if (fallback.full_name) payload.full_name = fallback.full_name

    const { data, error } = await supabase
      .from('clientes')
      .upsert(payload, { onConflict: 'id' })
      .select('id, full_name, email')
      .single()

    if (error) throw error
    return data as Cliente
  }
}
