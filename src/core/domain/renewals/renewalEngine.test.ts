/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import {
  computeNextRenewalDate,
  findDueRenewals,
  decideRenewalAction,
  computeExpectedRenewalAmount,
} from './renewalEngine'
import { RenewalSchedule } from '../entities/RenewalSchedule'
import { TenantService } from '../entities/TenantService'

function makeTenantService(overrides: Partial<TenantService> = {}): TenantService {
  return {
    id: 'tsvc_1',
    tenant_id: 'tenant_1',
    service_id: 'svc_1',
    estado: 'activo',
    precio_actual: 99,
    moneda: 'USD',
    started_at: '2026-08-01',
    ends_at: null,
    auto_renew: true,
    metadata: {},
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    ...overrides,
  }
}

function makeRenewal(overrides: Partial<RenewalSchedule> = {}): RenewalSchedule {
  return {
    id: 'ren_1',
    tenant_id: 'tenant_1',
    tenant_service_id: 'svc_1',
    fecha_renovacion: '2026-09-01',
    monto_esperado: 99,
    moneda: 'USD',
    estado: 'pendiente',
    intentos: 0,
    max_intentos: 3,
    notificado: false,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    ...overrides,
  }
}

describe('renewalEngine Domain Unit Tests', () => {
  describe('computeNextRenewalDate', () => {
    it('avanza un mes para la periodicidad mensual', () => {
      expect(computeNextRenewalDate('2026-01-15', 'monthly')).toBe('2026-02-15')
    })

    it('avanza tres meses para la periodicidad trimestral', () => {
      expect(computeNextRenewalDate('2026-01-15', 'quarterly')).toBe('2026-04-15')
    })

    it('avanza un año para la periodicidad anual', () => {
      expect(computeNextRenewalDate('2026-05-20', 'annual')).toBe('2027-05-20')
    })

    it('no genera renovación para servicios de un solo pago', () => {
      expect(computeNextRenewalDate('2026-01-15', 'one_time')).toBeNull()
    })

    it('ajusta el fin de mes para que nunca se salte a otro mes', () => {
      expect(computeNextRenewalDate('2026-01-31', 'monthly')).toBe('2026-02-28')
      expect(computeNextRenewalDate('2026-08-31', 'quarterly')).toBe('2026-11-30')
    })
  })

  describe('findDueRenewals', () => {
    it('selecciona solo renovaciones pendientes cuya fecha ya llegó', () => {
      const renewals = [
        makeRenewal({ id: 'a', fecha_renovacion: '2026-09-10', estado: 'pendiente' }),
        makeRenewal({ id: 'b', fecha_renovacion: '2026-09-10', estado: 'completada' }),
        makeRenewal({ id: 'c', fecha_renovacion: '2026-09-13', estado: 'pendiente' }),
        makeRenewal({ id: 'd', fecha_renovacion: '2026-09-10', estado: 'procesando' }),
        makeRenewal({ id: 'e', fecha_renovacion: '2026-09-09', estado: 'pendiente' }),
      ]

      const due = findDueRenewals(renewals, '2026-09-10')

      expect(due.map((r) => r.id)).toEqual(['a', 'e'])
    })
  })

  describe('decideRenewalAction', () => {
    it('ordena cobrar en el primer intento cuando la fecha ya llegó', () => {
      const renewal = makeRenewal({ fecha_renovacion: '2026-09-10', intentos: 0, max_intentos: 3 })

      expect(decideRenewalAction(renewal, '2026-09-10').action).toBe('cobrar')
    })

    it('ordena reintentar cuando ya hubo intentos fallidos y quedan disponibles', () => {
      const renewal = makeRenewal({ fecha_renovacion: '2026-09-10', intentos: 2, max_intentos: 3 })

      expect(decideRenewalAction(renewal, '2026-09-11').action).toBe('reintentar')
    })

    it('marca como fallida al agotar la cantidad máxima de intentos', () => {
      const renewal = makeRenewal({ fecha_renovacion: '2026-09-10', intentos: 3, max_intentos: 3 })

      expect(decideRenewalAction(renewal, '2026-09-11').action).toBe('marcar_fallida')
    })

    it('ignora renovaciones cuya fecha todavía no llegó', () => {
      const renewal = makeRenewal({ fecha_renovacion: '2026-09-12', intentos: 0, max_intentos: 3 })

      expect(decideRenewalAction(renewal, '2026-09-10').action).toBe('ignorar')
    })

    it('ignora estados en curso o finales', () => {
      expect(decideRenewalAction(makeRenewal({ estado: 'procesando' }), '2026-09-11').action).toBe(
        'ignorar'
      )
      expect(decideRenewalAction(makeRenewal({ estado: 'completada' }), '2026-09-11').action).toBe(
        'ignorar'
      )
      expect(decideRenewalAction(makeRenewal({ estado: 'cancelada' }), '2026-09-11').action).toBe(
        'ignorar'
      )
      expect(decideRenewalAction(makeRenewal({ estado: 'fallida' }), '2026-09-11').action).toBe(
        'ignorar'
      )
    })

    it('marca como fallida si se supera la ventana de gracia aunque queden intentos', () => {
      const renewal = makeRenewal({ fecha_renovacion: '2026-09-10', intentos: 1, max_intentos: 3 })

      expect(decideRenewalAction(renewal, '2026-09-15', 3).action).toBe('marcar_fallida')
      expect(decideRenewalAction(renewal, '2026-09-13', 3).action).toBe('reintentar')
    })
  })

  describe('computeExpectedRenewalAmount', () => {
    it('usa el precio actual y la moneda del servicio sin descuento', () => {
      const result = computeExpectedRenewalAmount(makeTenantService())

      expect(result).toEqual({ montoEsperado: 99, moneda: 'USD' })
    })

    it('aplica el porcentaje de descuento del catálogo sobre el precio actual', () => {
      const result = computeExpectedRenewalAmount(
        makeTenantService({ precio_actual: 100, metadata: { discountPct: 20 } })
      )

      expect(result).toEqual({ montoEsperado: 80, moneda: 'USD' })
    })

    it('no genera renovación cuando el servicio no se renueva automáticamente', () => {
      expect(computeExpectedRenewalAmount(makeTenantService({ auto_renew: false }))).toBeNull()
    })

    it('ignora descuentos inválidos en el metadata y usa el precio completo', () => {
      expect(
        computeExpectedRenewalAmount(
          makeTenantService({ precio_actual: 99, metadata: { discountPct: 'veinte' } })
        )
      ).toEqual({ montoEsperado: 99, moneda: 'USD' })
    })
  })
})
