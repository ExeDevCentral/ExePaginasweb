/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { WorkGroup, WorkGroupWithMembers } from '../entities/WorkGroup'

export interface IWorkGroupRepository {
  listByTenantId(tenantId: string): Promise<WorkGroupWithMembers[]>
  getById(id: string): Promise<WorkGroupWithMembers | null>
  create(data: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WorkGroup>
  update(id: string, data: Partial<WorkGroup>): Promise<WorkGroup>
  delete(id: string): Promise<void>
}
