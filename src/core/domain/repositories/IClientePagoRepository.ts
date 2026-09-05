import { Pago } from '../entities/Pago'

export interface IClientePagoRepository {
  listByClienteId(clienteId: string, limit?: number): Promise<Pago[]>
}
