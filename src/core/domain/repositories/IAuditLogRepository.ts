import { AuditLogEntry, AuditAction } from '../entities/AuditLog'

export interface IAuditLogRepository {
  log(
    tenantId: string | null,
    action: AuditAction,
    entity: string,
    entityId: string | null,
    oldData?: Record<string, unknown>,
    newData?: Record<string, unknown>
  ): Promise<void>
  listByTenantId(tenantId: string, limit?: number, offset?: number): Promise<AuditLogEntry[]>
  listByEntity(entity: string, entityId: string): Promise<AuditLogEntry[]>
}
