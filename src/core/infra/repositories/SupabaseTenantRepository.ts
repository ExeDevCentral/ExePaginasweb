import { supabase } from '../supabase/client'
import { Tenant, TenantWithPlan } from '../../domain/entities/Tenant'
import {
  ITenantRepository,
  TenantStats,
  CreateWorkspaceParams,
} from '../../domain/repositories/ITenantRepository'

export class SupabaseTenantRepository implements ITenantRepository {
  async getById(id: string): Promise<TenantWithPlan | null> {
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
    return data as TenantWithPlan | null
  }

  async getBySlug(slug: string): Promise<TenantWithPlan | null> {
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
    return data as TenantWithPlan | null
  }

  async getByOwnerId(ownerId: string): Promise<TenantWithPlan[]> {
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
    return (data ?? []) as TenantWithPlan[]
  }

  async create(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
    const { data: created, error } = await supabase
      .from('tenants')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as Tenant
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const { data: updated, error } = await supabase
      .from('tenants')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as Tenant
  }

  async getTenantStats(tenantId: string): Promise<TenantStats> {
    const { data, error } = await supabase.rpc('get_tenant_stats', {
      p_tenant_id: tenantId,
    })

    if (error) throw error
    return data as TenantStats
  }

  async createWorkspace(params: CreateWorkspaceParams): Promise<Tenant> {
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
