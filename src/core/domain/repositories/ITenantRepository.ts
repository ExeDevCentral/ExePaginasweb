import { Tenant, TenantWithPlan } from '../entities/Tenant'

export interface ITenantRepository {
  getById(id: string): Promise<TenantWithPlan | null>
  getBySlug(slug: string): Promise<TenantWithPlan | null>
  getByOwnerId(ownerId: string): Promise<TenantWithPlan[]>
  create(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant>
  update(id: string, data: Partial<Tenant>): Promise<Tenant>
  getTenantStats(tenantId: string): Promise<TenantStats>
}

export interface TenantStats {
  total_members: number
  total_groups: number
  active_services: number
  open_tickets: number
  sla_breaches: number
  pending_invoices: number
  total_revenue: number
}
