import { AdminOverview } from '../entities/AdminDashboard'

export interface IAdminDashboardRepository {
  getAdminOverview(): Promise<AdminOverview>
}
