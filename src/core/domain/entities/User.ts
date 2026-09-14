/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
export type UserRole = 'admin' | 'staff' | 'customer'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
}
