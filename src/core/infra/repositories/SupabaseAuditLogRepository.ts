import { supabase } from '../supabase/client'
import { AuditLogEntry, AuditAction } from '../../domain/entities/AuditLog'
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository'

export class SupabaseAuditLogRepository implements IAuditLogRepository {
  async log(
    tenantId: string | null,
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldData?: Record<string, unknown>,
    newData?: Record<string, unknown>
  ): Promise<void> {
    const { error } = await supabase.from('audit_log').insert({
      tenant_id: tenantId,
      action,
      entity,
      entity_id: entityId,
      old_data: oldData ?? null,
      new_data: newData ?? null,
    })

    if (error) throw error
  }

  async listByTenantId(tenantId: string, limit = 50, offset = 0): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return (data ?? []) as AuditLogEntry[]
  }

  async listByEntity(entity: string, entityId: string): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('entity', entity)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []) as AuditLogEntry[]
  }
}
