import { describe, it, expect } from 'vitest'
import {
  slugFromName,
  isValidSlug,
  validateOnboardingStep1,
  buildDefaultWorkGroups,
  computeTrialInfo,
  TRIAL_DAYS,
} from './workspaceOnboarding'

describe('slugFromName', () => {
  it('convierte espacios en guiones y baja a minúsculas', () => {
    expect(slugFromName('Acme Corporation')).toBe('acme-corporation')
  })

  it('quita caracteres especiales', () => {
    expect(slugFromName('¡Hola! Mundo')).toBe('hola-mundo')
  })

  it('evita guiones repetidos', () => {
    expect(slugFromName('Exe  Sistemas   WEB')).toBe('exe-sistemas-web')
  })
})

describe('isValidSlug', () => {
  it('acepta slug válido', () => {
    expect(isValidSlug('acme-corp2')).toBe(true)
  })

  it('rechaza mayúsculas y caracteres especiales', () => {
    expect(isValidSlug('Acme Corp')).toBe(false)
    expect(isValidSlug('acme!')).toBe(false)
    expect(isValidSlug('')).toBe(false)
  })
})

describe('validateOnboardingStep1', () => {
  it('rechaza nombre vacío', () => {
    expect(validateOnboardingStep1(' ', 'acme')).not.toBeNull()
  })

  it('rechaza slug inválido', () => {
    expect(validateOnboardingStep1('Acme', 'Acme Corp')).not.toBeNull()
  })

  it('acepta nombre + slug válidos', () => {
    expect(validateOnboardingStep1('Acme', 'acme-corp')).toBeNull()
  })
})

describe('buildDefaultWorkGroups', () => {
  it('crea grupos Soporte y Desarrollo con el color de marca', () => {
    const groups = buildDefaultWorkGroups('#6366f1')
    expect(groups).toHaveLength(2)
    expect(groups.map((g) => g.nombre)).toEqual(['Soporte', 'Desarrollo'])
    expect(groups[0].color).toBe('#6366f1')
  })
})

describe('computeTrialInfo', () => {
  const now = new Date('2026-01-01T00:00:00Z')

  it('plan none → estado trial a 14 días', () => {
    const info = computeTrialInfo('none', now)
    expect(info.estado).toBe('trial')
    expect(new Date(info.trialEndsAt!).getTime()).toBe(
      now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
    )
  })

  it('plan pagado → estado activo sin trial', () => {
    const info = computeTrialInfo('avanzado', now)
    expect(info.estado).toBe('activo')
    expect(info.trialEndsAt).toBeNull()
  })
})
