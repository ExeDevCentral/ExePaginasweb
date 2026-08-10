import { describe, it, expect } from 'vitest'
import { resolveTenantConfig } from './tenantConfigResolver'

describe('tenantConfigResolver Domain Tests', () => {
  it('resuelve correctamente la configuración para el módulo de reservas standalone ($20/mes)', () => {
    const config = resolveTenantConfig('tenant-001', 'modulo-reservas')

    expect(config.features.isBookingOnly).toBe(true)
    expect(config.features.hasCustomSLA).toBe(false)
    expect(config.features.hasWorkgroups).toBe(false)
    expect(config.features.maxWorkMembers).toBe(1)
  })

  it('resuelve correctamente la configuración para Plan Avanzado ($200/mes)', () => {
    const config = resolveTenantConfig('tenant-002', 'mantenimiento-avanzado')

    expect(config.features.isBookingOnly).toBe(false)
    expect(config.features.hasWorkgroups).toBe(true)
    expect(config.features.hasCustomSLA).toBe(false)
    expect(config.features.maxWorkMembers).toBe(5)
  })

  it('resuelve correctamente la configuración para Plan Premium', () => {
    const config = resolveTenantConfig('tenant-003', 'mantenimiento-premium')

    expect(config.features.hasCustomSLA).toBe(true)
    expect(config.features.hasWorkgroups).toBe(true)
    expect(config.features.hasAdvancedAnalytics).toBe(true)
    expect(config.features.maxWorkMembers).toBe(10)
  })

  it('asigna defaults seguros cuando el plan no está reconocido', () => {
    const config = resolveTenantConfig('tenant-004', '')

    expect(config.planSlug).toBe('sin_plan')
    expect(config.features.hasCustomSLA).toBe(false)
    expect(config.features.hasWorkgroups).toBe(false)
    expect(config.features.maxWorkMembers).toBe(1)
  })
})
