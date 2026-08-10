import { supabase } from '../supabase/client'
import { ServiceCatalog } from '../../domain/entities/ServiceCatalog'
import { IServiceCatalogRepository } from '../../domain/repositories/IServiceCatalogRepository'

export class SupabaseServiceCatalogRepository implements IServiceCatalogRepository {
  async listActive(): Promise<ServiceCatalog[]> {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('activo', true)
      .order('tipo')
      .order('nombre')

    if (error) throw error
    return (data ?? []) as ServiceCatalog[]
  }

  async listAll(): Promise<ServiceCatalog[]> {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .order('tipo')
      .order('nombre')

    if (error) throw error
    return (data ?? []) as ServiceCatalog[]
  }

  async getBySlug(slug: string): Promise<ServiceCatalog | null> {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data as ServiceCatalog | null
  }

  async getById(id: string): Promise<ServiceCatalog | null> {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data as ServiceCatalog | null
  }

  async create(
    data: Omit<ServiceCatalog, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ServiceCatalog> {
    const { data: created, error } = await supabase
      .from('service_catalog')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as ServiceCatalog
  }

  async update(id: string, data: Partial<ServiceCatalog>): Promise<ServiceCatalog> {
    const { data: updated, error } = await supabase
      .from('service_catalog')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as ServiceCatalog
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('service_catalog').delete().eq('id', id)

    if (error) throw error
  }
}
