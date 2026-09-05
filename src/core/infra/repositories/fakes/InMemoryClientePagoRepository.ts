import { Pago } from '@/core/domain/entities/Pago'
import { IClientePagoRepository } from '@/core/domain/repositories/IClientePagoRepository'

export class InMemoryClientePagoRepository implements IClientePagoRepository {
  private pagos = new Map<string, Pago[]>()

  seed(byCliente: Record<string, Pago[]>) {
    Object.entries(byCliente).forEach(([clienteId, pagos]) => this.pagos.set(clienteId, pagos))
  }

  async listByClienteId(clienteId: string, limit = 10): Promise<Pago[]> {
    const list = this.pagos.get(clienteId) ?? []
    return list.slice(0, limit)
  }
}
