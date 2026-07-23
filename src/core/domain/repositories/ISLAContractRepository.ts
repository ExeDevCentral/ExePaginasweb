import { SLAContract, SLABreach } from '../entities/SLAContract'

export interface ISLAContractRepository {
  listByTenantId(tenantId: string): Promise<SLAContract[]>
  getActiveByTenantId(tenantId: string): Promise<SLAContract | null>
  create(data: Omit<SLAContract, 'id' | 'created_at' | 'updated_at'>): Promise<SLAContract>
  update(id: string, data: Partial<SLAContract>): Promise<SLAContract>
  checkBreaches(tenantId: string): Promise<SLABreach[]>
}
