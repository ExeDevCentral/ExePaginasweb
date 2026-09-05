import type { Tenant, TenantWithPlan } from '@/core/domain/entities/Tenant'
import {
  ITenantRepository,
  CreateWorkspaceParams,
  TenantStats,
} from '@/core/domain/repositories/ITenantRepository'

const EMPTY_STATS: TenantStats = {
  total_members: 0,
  total_groups: 0,
  active_services: 0,
  open_tickets: 0,
  sla_breaches: 0,
  pending_invoices: 0,
  total_revenue: 0,
}

export class InMemoryTenantRepository implements ITenantRepository {
  private tenants: Tenant[] = []
  private lastParams: CreateWorkspaceParams | null = null
  private fail = false

  seed(tenants: Tenant[]) {
    this.tenants = [...tenants]
  }

  failNext() {
    this.fail = true
  }

  get all(): Tenant[] {
    return this.tenants
  }

  getLastParams(): CreateWorkspaceParams | null {
    return this.lastParams
  }

  async getById(id: string): Promise<TenantWithPlan | null> {
    return this.tenants.find((t) => t.id === id) ?? null
  }

  async getBySlug(slug: string): Promise<TenantWithPlan | null> {
    return this.tenants.find((t) => t.slug === slug) ?? null
  }

  async getByOwnerId(ownerId: string): Promise<TenantWithPlan[]> {
    return this.tenants
      .filter((t) => t.dueno_id === ownerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  async create(data: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
    const now = new Date().toISOString()
    const tenant: Tenant = { ...data, id: data.slug, created_at: now, updated_at: now }
    this.tenants.push(tenant)
    return tenant
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const idx = this.tenants.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('tenant not found')
    this.tenants[idx] = {
      ...this.tenants[idx],
      ...data,
      id,
      updated_at: new Date().toISOString(),
    }
    return this.tenants[idx]
  }

  async getTenantStats(): Promise<TenantStats> {
    return EMPTY_STATS
  }

  async createWorkspace(params: CreateWorkspaceParams): Promise<Tenant> {
    this.lastParams = params
    if (this.fail) {
      this.fail = false
      throw new Error('duplicate slug')
    }

    const now = new Date().toISOString()
    const tenant: Tenant = {
      id: params.slug,
      slug: params.slug,
      nombre: params.nombre,
      plan_id: null,
      dueno_id: params.duenoId,
      estado: params.estado,
      trial_ends_at: params.trialEndsAt,
      settings: params.settings,
      created_at: now,
      updated_at: now,
    }
    this.tenants.push(tenant)
    return tenant
  }
}
