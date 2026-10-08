export class InMemoryAdminDashboardRepository {
  constructor() {
    InMemoryAdminDashboardRepository.prototype.__init.call(this)
  }
  __init() {
    this.overview = {
      clientes: [],
      suscripciones: [],
      pagos: [],
      tickets: [],
    }
  }

  seed(overview, clientes) {
    if (overview) this.overview = { ...this.overview, ...overview }
    if (clientes) this.overview.clientes = clientes
  }

  async getAdminOverview() {
    return this.overview
  }
}
