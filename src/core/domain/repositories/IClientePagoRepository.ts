/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { Pago } from '../entities/Pago'

export interface IClientePagoRepository {
  listByClienteId(clienteId: string, limit?: number): Promise<Pago[]>
}
