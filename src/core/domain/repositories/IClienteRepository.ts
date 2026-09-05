import { Cliente } from '../entities/Cliente'

export interface IClienteRepository {
  getByAuthId(authId: string): Promise<Cliente | null>
  ensureByAuthId(authId: string, fallback: Pick<Cliente, 'full_name' | 'email'>): Promise<Cliente>
}
