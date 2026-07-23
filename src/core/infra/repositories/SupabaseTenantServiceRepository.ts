import { supabase } from '../supabase/client'
import { TenantService, TenantServiceWithDetails } from '../../domain/entities/TenantService'
import { ITenantServiceRepository } from '../../domain/repositories/ITenantServiceRepository'

export class SupabaseTenantServiceRepository implements ITenantServiceRepository {
  async listByTenantId(tenantId: string): Promise<TenantServiceWithDetails[]> {
    const { data, error } = await supabase
      .from('tenant_services')
      .select(
        `
        *,
        service:service_catalog(id, slug, nombre, descripcion, tipo, intervalo)
      `
      )
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as TenantServiceWithDetails[]
  }

  async getById(id: string): Promise<TenantServiceWithDetails | null> {
    const { data, error } = await supabase
      .from('tenant_services')
      .select(
        `
        *,
        service:service_catalog(id, slug, nombre, descripcion, tipo, intervalo)
      `
      )
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as TenantServiceWithDetails | null
  }

  async create(
    data: Omit<TenantService, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TenantService> {
    const { data: created, error } = await supabase
      .from('tenant_services')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as TenantService
  }

  async update(id: string, data: Partial<TenantService>): Promise<TenantService> {
    const { data: updated, error } = await supabase
      .from('tenant_services')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as TenantService
  }

  async cancel(id: string): Promise<void> {
    const { error } = await supabase
      .from('tenant_services')
      .update({ estado: 'cancelado', auto_renew: false })
      .eq('id', id)

    if (error) throw error
  }

  async getActiveCount(tenantId: string): Promise<number> {
    const { count, error } = await supabase
      .from('tenant_services')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('estado', 'activo')

    if (error) throw error
    return count ?? 0
  }
}
