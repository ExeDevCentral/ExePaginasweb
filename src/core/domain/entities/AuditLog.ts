export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'payment'
  | 'ticket_create'
  | 'ticket_resolve'
  | 'renewal_attempt'
  | 'subscription_change'

export interface AuditLogEntry {
  id: number
  tenant_id: string | null
  user_id: string | null
  action: AuditAction
  entity: string
  entity_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}
