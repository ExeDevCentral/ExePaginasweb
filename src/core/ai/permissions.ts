/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { AiRole, AiToolDefinition } from './types'

export const ROLE_HIERARCHY: Record<AiRole, number> = {
  anonymous: 0,
  customer: 1,
  staff: 2,
  manager: 3,
  admin: 4,
}

export function roleRank(role: AiRole): number {
  return ROLE_HIERARCHY[role] ?? 0
}

export function canRoleUseTool(
  tool: Pick<AiToolDefinition, 'minRole' | 'rolesAllowed' | 'requiresAuth'>,
  userRole: AiRole,
  isAuthenticated: boolean
): boolean {
  if (tool.requiresAuth && !isAuthenticated) return false
  if (tool.rolesAllowed.length > 0 && !tool.rolesAllowed.includes(userRole)) return false
  return roleRank(userRole) >= roleRank(tool.minRole)
}

export function toolAuthorizationError(tool: AiToolDefinition): string {
  return `Sin autorización para ejecutar "${tool.name}". Se requiere rol ${tool.minRole} y sesión activa.`
}

export function assertRole(condition: boolean, message: string): void {
  if (!condition) throw new Error(message)
}

export const GUEST_ROLE: AiRole = 'anonymous'
