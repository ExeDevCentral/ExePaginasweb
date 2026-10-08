/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseAuthRepository {
  async updateProfile(params) {
    const { error: clienteError } = await supabase
      .from('clientes')
      .update({ full_name: params.fullName })
      .eq('id', params.clienteId)

    if (clienteError) throw clienteError

    const { error: userError } = await supabase.auth.updateUser({
      data: { full_name: params.fullName },
    })

    if (userError) throw userError
  }

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }
}
