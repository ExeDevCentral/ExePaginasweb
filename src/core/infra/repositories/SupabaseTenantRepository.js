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

export class SupabaseTenantRepository {
  async getById(id) {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        `
        *,
        plan:planes(id, slug, nombre, precio)
      `
      )
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        `
        *,
        plan:planes(id, slug, nombre, precio)
      `
      )
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async getByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from('tenants')
      .select(
        `
        *,
        plan:planes(id, slug, nombre, precio)
      `
      )
      .eq('dueno_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('tenants')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('tenants')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated
  }

  async getTenantStats(tenantId) {
    const { data, error } = await supabase.rpc('get_tenant_stats', {
      p_tenant_id: tenantId,
    })

    if (error) throw error
    return data
  }

  async createWorkspace(params) {
    const { data, error } = await supabase.rpc('create_workspace', {
      p_slug: params.slug,
      p_nombre: params.nombre,
      p_dueno_id: params.duenoId,
      p_estado: params.estado,
      p_trial_ends_at: params.trialEndsAt,
      p_settings: params.settings,
      p_cliente_nombre: params.clienteNombre,
      p_cliente_email: params.clienteEmail,
      p_create_groups: params.createDefaultGroups,
      p_work_groups: params.workGroups,
    })

    if (error) throw error

    return {
      id: typeof data === 'object' && data !== null && 'id' in data ? String(data.id) : params.slug,
      slug: params.slug,
      nombre: params.nombre,
      plan_id: null,
      dueno_id: params.duenoId,
      estado: params.estado,
      trial_ends_at: params.trialEndsAt,
      settings: params.settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}
