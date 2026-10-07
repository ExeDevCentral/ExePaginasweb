/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, expect, it } from 'vitest'
import {
  maskEmail,
  validateContentLength,
  validateFetchMetadata,
} from '../../lib/server/requestSecurity'

describe('lib/server/requestSecurity', () => {
  describe('validateContentLength', () => {
    it('permite solicitudes sin cabecera content-length', () => {
      const req = new Request('http://localhost:3000/api/contact')
      const result = validateContentLength(req)
      expect(result.allowed).toBe(true)
      expect(result.errorResponse).toBeUndefined()
    })

    it('permite solicitudes con tamaño menor o igual al límite', () => {
      const req = new Request('http://localhost:3000/api/contact', {
        headers: { 'content-length': '1024' },
      })
      const result = validateContentLength(req, 2048)
      expect(result.allowed).toBe(true)
      expect(result.errorResponse).toBeUndefined()
    })

    it('rechaza solicitudes que superan el límite con status 413', async () => {
      const req = new Request('http://localhost:3000/api/contact', {
        headers: { 'content-length': '60000' },
      })
      const result = validateContentLength(req, 50 * 1024)
      expect(result.allowed).toBe(false)
      expect(result.errorResponse).toBeDefined()
      expect(result.errorResponse?.status).toBe(413)

      const body = await result.errorResponse?.json()
      expect(body.error).toMatch(/excede el límite/)
    })
  })

  describe('validateFetchMetadata', () => {
    it('permite solicitudes same-origin o sin cabecera sec-fetch-site', () => {
      const req = new Request('http://localhost:3000/api/contact', {
        headers: { 'sec-fetch-site': 'same-origin' },
      })
      const result = validateFetchMetadata(req)
      expect(result.allowed).toBe(true)
      expect(result.errorResponse).toBeUndefined()
    })

    it('permite solicitudes same-site', () => {
      const req = new Request('http://localhost:3000/api/contact', {
        headers: { 'sec-fetch-site': 'same-site' },
      })
      const result = validateFetchMetadata(req)
      expect(result.allowed).toBe(true)
    })

    it('bloquea solicitudes cross-site con status 403', async () => {
      const req = new Request('http://localhost:3000/api/contact', {
        headers: { 'sec-fetch-site': 'cross-site' },
      })
      const result = validateFetchMetadata(req)
      expect(result.allowed).toBe(false)
      expect(result.errorResponse).toBeDefined()
      expect(result.errorResponse?.status).toBe(403)

      const body = await result.errorResponse?.json()
      expect(body.error).toMatch(/no autorizado/)
    })
  })

  describe('maskEmail', () => {
    it('enmascara correos estándar preservando inicio y fin local', () => {
      expect(maskEmail('exequiel@example.com')).toBe('ex***l@example.com')
      expect(maskEmail('contacto@empresa.org')).toBe('co***o@empresa.org')
    })

    it('maneja correos con identificadores locales cortos', () => {
      expect(maskEmail('ab@example.com')).toBe('a***@example.com')
      expect(maskEmail('a@example.com')).toBe('a***@example.com')
    })

    it('maneja valores inválidos o nulos sin lanzar errores', () => {
      expect(maskEmail('')).toBe('***')
      expect(maskEmail('invalid-email')).toBe('***')
    })
  })
})
