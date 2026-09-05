import { supabase } from '../supabase/client'
import { IAuthRepository, UpdateProfileParams } from '../../domain/repositories/IAuthRepository'

export class SupabaseAuthRepository implements IAuthRepository {
  async updateProfile(params: UpdateProfileParams): Promise<void> {
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

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }
}
