import { supabase } from '../supabase/client'
import { SLAContract, SLABreach } from '../../domain/entities/SLAContract'
import { ISLAContractRepository } from '../../domain/repositories/ISLAContractRepository'

export class SupabaseSLAContractRepository implements ISLAContractRepository {
  async listByTenantId(tenantId: string): Promise<SLAContract[]> {
    const { data, error } = await supabase
      .from('sla_contracts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as SLAContract[]
  }

  async getActiveByTenantId(tenantId: string): Promise<SLAContract | null> {
    const { data, error } = await supabase
      .from('sla_contracts')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('activo', true)
      .order('nivel', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data as SLAContract | null
  }

  async create(data: Omit<SLAContract, 'id' | 'created_at' | 'updated_at'>): Promise<SLAContract> {
    const { data: created, error } = await supabase
      .from('sla_contracts')
      .insert(data)
      .select('*')
      .single()

    if (error) throw error
    return created as SLAContract
  }

  async update(id: string, data: Partial<SLAContract>): Promise<SLAContract> {
    const { data: updated, error } = await supabase
      .from('sla_contracts')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return updated as SLAContract
  }

  async checkBreaches(tenantId: string): Promise<SLABreach[]> {
    const { data, error } = await supabase.rpc('check_sla_breaches', {
      p_tenant_id: tenantId,
    })

    if (error) throw error
    return (data ?? []) as SLABreach[]
  }
}
