function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseServiceCatalogRepository {
  async listActive() {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('activo', true)
      .order('tipo')
      .order('nombre')

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async listAll() {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .order('tipo')
      .order('nombre')

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('service_catalog')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('service_catalog')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('service_catalog')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async delete(id) {
    const { error } = await supabase.from('service_catalog').delete().eq('id', id)

    if (error) throw error
  }
}
