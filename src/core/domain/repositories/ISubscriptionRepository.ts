import { Suscripcion } from '../entities/Suscripcion'

export interface ISubscriptionRepository {
  getByClienteId(clienteId: string): Promise<Suscripcion[]>
}
