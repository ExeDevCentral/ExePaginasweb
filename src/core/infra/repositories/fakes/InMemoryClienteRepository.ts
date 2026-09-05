import { Cliente } from '@/core/domain/entities/Cliente'
import { IClienteRepository } from '@/core/domain/repositories/IClienteRepository'

export class InMemoryClienteRepository implements IClienteRepository {
  private clientes = new Map<string, Cliente>()

  seed(clientes: Cliente[]) {
    clientes.forEach((c) => this.clientes.set(c.id, c))
  }

  async getByAuthId(authId: string): Promise<Cliente | null> {
    return this.clientes.get(authId) ?? null
  }

  async ensureByAuthId(
    authId: string,
    fallback: Pick<Cliente, 'full_name' | 'email'>
  ): Promise<Cliente> {
    const existing = this.clientes.get(authId)
    if (existing) return existing
    const nuevo: Cliente = {
      id: authId,
      full_name: fallback.full_name ?? null,
      email: fallback.email,
    }
    this.clientes.set(authId, nuevo)
    return nuevo
  }
}
