import { AdminOverview, AdminCliente } from '@/core/domain/entities/AdminDashboard'
import { IAdminDashboardRepository } from '@/core/domain/repositories/IAdminDashboardRepository'

export class InMemoryAdminDashboardRepository implements IAdminDashboardRepository {
  private overview: AdminOverview = {
    clientes: [],
    suscripciones: [],
    pagos: [],
    tickets: [],
  }

  seed(overview?: Partial<AdminOverview>, clientes?: AdminCliente[]) {
    if (overview) this.overview = { ...this.overview, ...overview }
    if (clientes) this.overview.clientes = clientes
  }

  async getAdminOverview(): Promise<AdminOverview> {
    return this.overview
  }
}
