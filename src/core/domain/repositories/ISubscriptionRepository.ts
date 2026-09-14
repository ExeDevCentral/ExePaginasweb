/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { Suscripcion } from '../entities/Suscripcion'

export interface ISubscriptionRepository {
  getByClienteId(clienteId: string): Promise<Suscripcion[]>
}
