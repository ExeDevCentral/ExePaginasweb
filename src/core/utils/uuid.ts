const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Valida si un string cumple el formato estándar de UUID (PostgreSQL uuid)
 */
export function isValidUUID(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false
  return UUID_REGEX.test(id.trim())
}
