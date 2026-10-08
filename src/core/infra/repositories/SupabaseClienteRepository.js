/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseClienteRepository {
  async getByAuthId(authId) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, full_name, email')
      .eq('id', authId)
      .maybeSingle()

    if (error && error.code === 'PGRST116') return null
    if (error) throw error
    return data
  }

  async ensureByAuthId(authId, fallback) {
    const payload = {
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
    return data
  }
}
