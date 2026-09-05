export interface PasswordRule {
  id: string
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_MIN_LENGTH = 8

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: '8+ caracteres', test: (p) => p.length >= PASSWORD_MIN_LENGTH },
  { id: 'uppercase', label: 'Mayúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'Minúscula', test: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'Número', test: (p) => /\d/.test(p) },
]

/**
 * Devuelve las reglas NO cumplidas. Vacío = contraseña válida.
 */
export function validatePassword(password: string): PasswordRule[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password))
}

export function isPasswordValid(password: string): boolean {
  return validatePassword(password).length === 0
}

/**
 * Devuelve una única regla fallida (para mensajes al usuario) o null si cumple todo.
 */
export function firstPasswordRuleFailed(password: string): PasswordRule | null {
  return PASSWORD_RULES.find((rule) => !rule.test(password)) ?? null
}
