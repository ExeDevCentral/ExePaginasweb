/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 */
import { SupabaseAuthRepository } from '../core/infra/repositories/SupabaseAuthRepository'
import type { IAuthRepository } from '../core/domain/repositories/IAuthRepository'

export const authRepository: IAuthRepository = new SupabaseAuthRepository()
