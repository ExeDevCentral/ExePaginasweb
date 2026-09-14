/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { WorkMember, WorkMemberWithGroup } from '../entities/WorkMember'

export interface IWorkMemberRepository {
  listByTenantId(tenantId: string): Promise<WorkMemberWithGroup[]>
  getById(id: string): Promise<WorkMemberWithGroup | null>
  getByUserId(userId: string): Promise<WorkMemberWithGroup | null>
  create(data: Omit<WorkMember, 'id' | 'created_at' | 'updated_at'>): Promise<WorkMember>
  update(id: string, data: Partial<WorkMember>): Promise<WorkMember>
  delete(id: string): Promise<void>
  countByTenantId(tenantId: string): Promise<number>
}
