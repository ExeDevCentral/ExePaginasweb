import { supabase } from '../../core/auth/supabaseClient'
import { User } from '../../core/domain/entities/User'
import { IUserRepository } from '../../core/domain/repositories/IUserRepository'

export class SupabaseUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(this.mapToDomain)
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return this.mapToDomain(data)
  }

  async createProfile(user: User): Promise<void> {
    const { error } = await supabase.from('profiles').insert([
      { id: user.id, email: user.email, full_name: user.fullName, role: user.role }
    ])
    if (error) throw error
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
  }

  private mapToDomain(raw: any): User {
    return {
      id: raw.id,
      email: raw.email,
      fullName: raw.full_name,
      role: raw.role,
      createdAt: raw.created_at
    }
  }
}
