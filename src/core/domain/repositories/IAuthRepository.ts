/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
export interface UpdateProfileParams {
  clienteId: string
  fullName: string
}

export interface IAuthRepository {
  updateProfile(params: UpdateProfileParams): Promise<void>
  updatePassword(newPassword: string): Promise<void>
}
