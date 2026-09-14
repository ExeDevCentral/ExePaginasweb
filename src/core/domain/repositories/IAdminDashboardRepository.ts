/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AdminOverview } from '../entities/AdminDashboard'

export interface IAdminDashboardRepository {
  getAdminOverview(): Promise<AdminOverview>
}
