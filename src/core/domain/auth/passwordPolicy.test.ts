import { describe, it, expect } from 'vitest'
import {
  PASSWORD_RULES,
  PASSWORD_MIN_LENGTH,
  validatePassword,
  isPasswordValid,
  firstPasswordRuleFailed,
} from './passwordPolicy'

describe('passwordPolicy', () => {
  it('define 4 reglas', () => {
    expect(PASSWORD_RULES).toHaveLength(4)
    expect(PASSWORD_MIN_LENGTH).toBe(8)
  })

  it('acepta una contraseña fuerte', () => {
    expect(isPasswordValid('Abcdef12')).toBe(true)
    expect(validatePassword('Abcdef12')).toEqual([])
    expect(firstPasswordRuleFailed('Abcdef12')).toBeNull()
  })

  it('rechaza contraseñas cortas', () => {
    expect(isPasswordValid('A1b')).toBe(false)
    expect(validatePassword('A1b').map((r) => r.id)).toContain('length')
  })

  it('reporta reglas individuales', () => {
    expect(validatePassword('abcdefgh').map((r) => r.id)).toEqual(['uppercase', 'number'])
    expect(firstPasswordRuleFailed('abcdefgh')?.id).toBe('uppercase')
    expect(validatePassword('12345678').map((r) => r.id)).toEqual(['uppercase', 'lowercase'])
    expect(validatePassword('ABCDEFGH').map((r) => r.id)).toEqual(['lowercase', 'number'])
  })

  it('soporta caracteres no ASCII sin romperse', () => {
    expect(isPasswordValid('ÁbcdEf12')).toBe(true)
  })
})
