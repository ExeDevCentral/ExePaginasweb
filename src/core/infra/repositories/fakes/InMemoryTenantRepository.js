function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

const EMPTY_STATS = {
  total_members: 0,
  total_groups: 0,
  active_services: 0,
  open_tickets: 0,
  sla_breaches: 0,
  pending_invoices: 0,
  total_revenue: 0,
}

export class InMemoryTenantRepository {
  constructor() {
    InMemoryTenantRepository.prototype.__init.call(this)
    InMemoryTenantRepository.prototype.__init2.call(this)
    InMemoryTenantRepository.prototype.__init3.call(this)
  }
  __init() {
    this.tenants = []
  }
  __init2() {
    this.lastParams = null
  }
  __init3() {
    this.fail = false
  }

  seed(tenants) {
    this.tenants = [...tenants]
  }

  failNext() {
    this.fail = true
  }

  get all() {
    return this.tenants
  }

  getLastParams() {
    return this.lastParams
  }

  async getById(id) {
    return _nullishCoalesce(
      this.tenants.find((t) => t.id === id),
      () => null
    )
  }

  async getBySlug(slug) {
    return _nullishCoalesce(
      this.tenants.find((t) => t.slug === slug),
      () => null
    )
  }

  async getByOwnerId(ownerId) {
    return this.tenants
      .filter((t) => t.dueno_id === ownerId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
  }

  async create(data) {
    const now = new Date().toISOString()
    const tenant = { ...data, id: data.slug, created_at: now, updated_at: now }
    this.tenants.push(tenant)
    return tenant
  }

  async update(id, data) {
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

  async getTenantStats() {
    return EMPTY_STATS
  }

  async createWorkspace(params) {
    this.lastParams = params
    if (this.fail) {
      this.fail = false
      throw new Error('duplicate slug')
    }

    const now = new Date().toISOString()
    const tenant = {
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
