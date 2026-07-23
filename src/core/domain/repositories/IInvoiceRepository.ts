import { Invoice } from '../entities/Invoice'

export interface IInvoiceRepository {
  listByTenantId(tenantId: string, limit?: number, offset?: number): Promise<Invoice[]>
  listByClienteId(clienteId: string, limit?: number, offset?: number): Promise<Invoice[]>
  getById(id: string): Promise<Invoice | null>
  create(data: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'numero'>): Promise<Invoice>
  markAsPaid(id: string, pagoId: string): Promise<void>
  countByTenantId(tenantId: string): Promise<number>
  sumTotalByTenantId(tenantId: string): Promise<number>
}
