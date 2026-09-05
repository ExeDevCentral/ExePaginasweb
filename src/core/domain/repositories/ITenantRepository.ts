import { Tenant, TenantWithPlan } from '../entities/Tenant'
import type { OnboardingWorkGroup } from '../onboarding/workspaceOnboarding'

export interface ITenantRepository {
  getById(id: string): Promise<TenantWithPlan | null>
  getBySlug(slug: string): Promise<TenantWithPlan | null>
  getByOwnerId(ownerId: string): Promise<TenantWithPlan[]>
  create(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant>
  update(id: string, data: Partial<Tenant>): Promise<Tenant>
  getTenantStats(tenantId: string): Promise<TenantStats>
  createWorkspace(params: CreateWorkspaceParams): Promise<Tenant>
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

export interface CreateWorkspaceParams {
  slug: string
  nombre: string
  duenoId: string
  estado: Tenant['estado']
  trialEndsAt: string | null
  settings: Record<string, unknown>
  clienteNombre: string | null
  clienteEmail: string
  createDefaultGroups: boolean
  workGroups: OnboardingWorkGroup[]
}
