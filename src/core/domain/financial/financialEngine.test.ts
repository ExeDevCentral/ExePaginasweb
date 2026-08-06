import { describe, it, expect } from 'vitest'
import {
  calculateInvoiceTotals,
  calculateTenantMRR,
  formatCurrency,
  calculateDiscount,
  resolvePaymentState,
} from './financialEngine'

describe('financialEngine Domain Unit Tests', () => {
  describe('calculateInvoiceTotals', () => {
    it('calcula correctamente los totales de facturas pagadas y pendientes', () => {
      const items = [
        { id: '1', monto: 1000, estado: 'pagada', moneda: 'ARS' },
        { id: '2', monto: 2000, estado: 'approved', moneda: 'ARS' },
        { id: '3', monto: 500, estado: 'emitida', moneda: 'ARS' },
        { id: '4', monto: 300, estado: 'vencida', moneda: 'ARS' },
        { id: '5', monto: 150, estado: 'cancelada', moneda: 'ARS' },
      ]

      const summary = calculateInvoiceTotals(items)

      expect(summary.totalPaid).toBe(3000)
      expect(summary.paidCount).toBe(2)
      expect(summary.totalPending).toBe(800)
      expect(summary.pendingCount).toBe(2)
      expect(summary.currency).toBe('ARS')
    })

    it('devuelve ceros cuando la lista de facturas está vacía', () => {
      const summary = calculateInvoiceTotals([])

      expect(summary.totalPaid).toBe(0)
      expect(summary.paidCount).toBe(0)
      expect(summary.totalPending).toBe(0)
      expect(summary.pendingCount).toBe(0)
      expect(summary.currency).toBe('ARS')
    })
  })

  describe('calculateTenantMRR', () => {
    it('suma únicamente las suscripciones con estado activa', () => {
      const subs = [
        { estado: 'activa', monto: 150 },
        { estado: 'active', monto: 50 },
        { estado: 'cancelada', monto: 200 },
        { estado: 'pendiente', monto: 100 },
      ]

      const mrr = calculateTenantMRR(subs)
      expect(mrr).toBe(200)
    })

    it('retorna 0 si no hay suscripciones activas', () => {
      const mrr = calculateTenantMRR([{ estado: 'cancelada', monto: 500 }])
      expect(mrr).toBe(0)
    })
  })

  describe('formatCurrency', () => {
    it('formatea montos en ARS de forma consistente', () => {
      const formatted = formatCurrency(1500.5, 'ARS', 'es-AR')
      expect(formatted).toContain('1.500,50')
    })

    it('maneja NaN de forma segura retornando 0', () => {
      const formatted = formatCurrency(NaN, 'ARS', 'es-AR')
      expect(formatted).toContain('0,00')
    })
  })

  describe('calculateDiscount', () => {
    it('aplica porcentaje de descuento correctamente', () => {
      expect(calculateDiscount(100, 20)).toBe(80)
      expect(calculateDiscount(200, 50)).toBe(100)
    })

    it('devuelve el monto original si el descuento es 0 o negativo', () => {
      expect(calculateDiscount(100, 0)).toBe(100)
      expect(calculateDiscount(100, -10)).toBe(100)
    })

    it('devuelve 0 si el descuento es 100% o superior', () => {
      expect(calculateDiscount(100, 100)).toBe(0)
      expect(calculateDiscount(100, 120)).toBe(0)
    })
  })

  describe('resolvePaymentState', () => {
    it('mapea los estados de pasarela a los 4 estados canónicos', () => {
      expect(resolvePaymentState('approved')).toBe('pagada')
      expect(resolvePaymentState('paid')).toBe('pagada')
      expect(resolvePaymentState('pending')).toBe('pendiente')
      expect(resolvePaymentState('overdue')).toBe('vencida')
      expect(resolvePaymentState('failed')).toBe('cancelada')
    })
  })
})
