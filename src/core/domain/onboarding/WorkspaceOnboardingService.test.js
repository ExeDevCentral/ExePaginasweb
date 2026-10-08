function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { WorkspaceOnboardingService } from './WorkspaceOnboardingService'
import { InMemoryTenantRepository } from '../../infra/repositories/fakes/InMemoryTenantRepository'

const CLIENTE = { id: 'c1', full_name: 'Ana Pérez', email: 'ana@test.com' }

function form(overrides = {}) {
  return {
    nombre: 'Acme Corp',
    slug: 'acme-corp',
    color: '#6366f1',
    theme: 'dark',
    lang: 'es',
    createDefaultGroups: true,
    ...overrides,
  }
}

describe('WorkspaceOnboardingService.createWorkspace', () => {
  let repo
  let service

  beforeEach(() => {
    repo = new InMemoryTenantRepository()
    service = new WorkspaceOnboardingService(repo)
  })

  it('crea el workspace con estado activo para planes pagos', async () => {
    await service.createWorkspace({ form: form(), cliente: CLIENTE, planTier: 'avanzado' })

    expect(repo.all).toHaveLength(1)
    const tenant = repo.all[0]
    expect(tenant.nombre).toBe('Acme Corp')
    expect(tenant.estado).toBe('activo')
    expect(tenant.trial_ends_at).toBeNull()
  })

  it('crea trial de 14 días para plan none', async () => {
    const now = new Date('2026-01-01T00:00:00Z')
    await service.createWorkspace({ form: form(), cliente: CLIENTE, planTier: 'none', now })

    const tenant = repo.all[0]
    expect(tenant.estado).toBe('trial')
    expect(new Date(tenant.trial_ends_at).getTime()).toBe(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  })

  it('no crea grupos cuando createDefaultGroups es false', async () => {
    await service.createWorkspace({
      form: form({ createDefaultGroups: false }),
      cliente: CLIENTE,
      planTier: 'avanzado',
    })

    const created = repo.getLastParams()
    expect(_optionalChain([created, 'optionalAccess', (_) => _.workGroups])).toEqual([])
    expect(_optionalChain([created, 'optionalAccess', (_2) => _2.createDefaultGroups])).toBe(false)
  })

  it('lanza error de validación con slug inválido', async () => {
    await expect(
      service.createWorkspace({
        form: form({ slug: 'Acme Corp' }),
        cliente: CLIENTE,
        planTier: 'avanzado',
      })
    ).rejects.toThrow('El identificador solo puede contener letras minúsculas, números y guiones.')
    expect(repo.all).toHaveLength(0)
  })
})
