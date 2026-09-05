import { Suscripcion } from '@/core/domain/entities/Suscripcion'
import { ISubscriptionRepository } from '@/core/domain/repositories/ISubscriptionRepository'

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private suscripciones = new Map<string, Suscripcion[]>()

  seed(byCliente: Record<string, Suscripcion[]>) {
    Object.entries(byCliente).forEach(([clienteId, subs]) =>
      this.suscripciones.set(clienteId, subs)
    )
  }

  async getByClienteId(clienteId: string): Promise<Suscripcion[]> {
    return this.suscripciones.get(clienteId) ?? []
  }
}
