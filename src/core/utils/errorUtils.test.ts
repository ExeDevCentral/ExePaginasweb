import { describe, it, expect } from 'vitest'
import { getErrorMessage, formatSupabaseErrorDetails } from './errorUtils'

describe('errorUtils', () => {
  describe('getErrorMessage', () => {
    it('debe retornar el string directo si se le pasa una cadena', () => {
      expect(getErrorMessage('Error directo')).toBe('Error directo')
    })

    it('debe extraer message de una instancia de Error', () => {
      expect(getErrorMessage(new Error('Error de JS'))).toBe('Error de JS')
    })

    it('debe extraer message o error_description de un objeto tipo SupabaseError', () => {
      expect(getErrorMessage({ message: 'Auth failed' })).toBe('Auth failed')
      expect(getErrorMessage({ error_description: 'Invalid token' })).toBe('Invalid token')
      expect(getErrorMessage({ details: 'Column not found' })).toBe('Column not found')
    })

    it('debe retornar el fallback si el objeto o valor no tiene mensaje válido', () => {
      expect(getErrorMessage(null, 'Fallback custom')).toBe('Fallback custom')
      expect(getErrorMessage({}, 'Fallback custom')).toBe('Fallback custom')
      expect(getErrorMessage(123, 'Fallback custom')).toBe('Fallback custom')
    })
  })

  describe('formatSupabaseErrorDetails', () => {
    it('debe formatear propiedades de error de Supabase correctamente', () => {
      const err = {
        message: 'JWT expired',
        code: 'PGRST301',
        details: 'Token holds expired claim',
        hint: 'Re-authenticate user',
      }
      expect(formatSupabaseErrorDetails(err)).toEqual({
        message: 'JWT expired',
        code: 'PGRST301',
        details: 'Token holds expired claim',
        hint: 'Re-authenticate user',
      })
    })

    it('debe manejar valores no objetos limpiamente', () => {
      expect(formatSupabaseErrorDetails('Boom')).toEqual({
        message: 'Boom',
      })
    })
  })
})
