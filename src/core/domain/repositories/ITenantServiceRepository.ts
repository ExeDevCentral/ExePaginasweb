import { TenantService, TenantServiceWithDetails } from '../entities/TenantService'

export interface ITenantServiceRepository {
  listByTenantId(tenantId: string): Promise<TenantServiceWithDetails[]>
  getById(id: string): Promise<TenantServiceWithDetails | null>
  create(data: Omit<TenantService, 'id' | 'created_at' | 'updated_at'>): Promise<TenantService>
  update(id: string, data: Partial<TenantService>): Promise<TenantService>
  cancel(id: string): Promise<void>
  getActiveCount(tenantId: string): Promise<number>
}
