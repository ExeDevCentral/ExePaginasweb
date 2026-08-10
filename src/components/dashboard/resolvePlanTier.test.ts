import { describe, it, expect } from 'vitest'
import { resolvePlanTier } from './resolvePlanTier'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'

describe('resolvePlanTier', () => {
  it('debe resolver "none" cuando no hay suscripciones ni pagos', () => {
    expect(resolvePlanTier([])).toBe('none')
  })

  it('debe resolver el tier según el slug de la suscripción activa', () => {
    const subs: Suscripcion[] = [
      {
        id: 'sub-1',
        cliente_id: 'c-1',
        plan_slug: 'mantenimiento-avanzado',
        estado: 'activa',
        fecha_inicio: '2026-01-01',
        plan: {
          nombre: 'Abono Avanzado',
          slug: 'mantenimiento-avanzado',
        },
      },
    ]
    expect(resolvePlanTier(subs)).toBe('avanzado')
  })

  it('debe resolver el tier desde el slug del pago como fallback si no hay slug en la suscripción', () => {
    expect(resolvePlanTier([], 'Abono Premium', 'mantenimiento-premium')).toBe('premium')
  })

  it('debe resolver el tier desde el nombre del plan como fallback', () => {
    expect(resolvePlanTier([], 'Abono Básico', null)).toBe('basico')
  })
})
