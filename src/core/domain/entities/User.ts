export type UserRole = 'admin' | 'staff' | 'customer'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
}
