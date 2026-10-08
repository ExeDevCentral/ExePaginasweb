function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}

export const ROLE_HIERARCHY = {
  anonymous: 0,
  customer: 1,
  staff: 2,
  manager: 3,
  admin: 4,
}

export function roleRank(role) {
  return _nullishCoalesce(ROLE_HIERARCHY[role], () => 0)
}

export function canRoleUseTool(tool, userRole, isAuthenticated) {
  if (tool.requiresAuth && !isAuthenticated) return false
  if (tool.rolesAllowed.length > 0 && !tool.rolesAllowed.includes(userRole)) return false
  return roleRank(userRole) >= roleRank(tool.minRole)
}

export function toolAuthorizationError(tool) {
  return `Sin autorización para ejecutar "${tool.name}". Se requiere rol ${tool.minRole} y sesión activa.`
}

export function assertRole(condition, message) {
  if (!condition) throw new Error(message)
}

export const GUEST_ROLE = 'anonymous'
