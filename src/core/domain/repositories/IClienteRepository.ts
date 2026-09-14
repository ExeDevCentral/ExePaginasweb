/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { Cliente } from '../entities/Cliente'

export interface IClienteRepository {
  getByAuthId(authId: string): Promise<Cliente | null>
  ensureByAuthId(authId: string, fallback: Pick<Cliente, 'full_name' | 'email'>): Promise<Cliente>
}
