import { describe, it, expect, beforeEach } from 'vitest'
import { WorkspaceOnboardingService } from './WorkspaceOnboardingService'
import { InMemoryTenantRepository } from '../../infra/repositories/fakes/InMemoryTenantRepository'
import { OnboardingFormData } from './workspaceOnboarding'
import type { Cliente } from '../entities/Cliente'

const CLIENTE: Cliente = { id: 'c1', full_name: 'Ana Pérez', email: 'ana@test.com' }

function form(overrides: Partial<OnboardingFormData> = {}): OnboardingFormData {
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
  let repo: InMemoryTenantRepository
  let service: WorkspaceOnboardingService

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
    expect(new Date(tenant.trial_ends_at!).getTime()).toBe(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  })

  it('no crea grupos cuando createDefaultGroups es false', async () => {
    await service.createWorkspace({
      form: form({ createDefaultGroups: false }),
      cliente: CLIENTE,
      planTier: 'avanzado',
    })

    const created = repo.getLastParams()
    expect(created?.workGroups).toEqual([])
    expect(created?.createDefaultGroups).toBe(false)
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
