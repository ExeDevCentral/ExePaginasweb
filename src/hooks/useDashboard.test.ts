import { describe, it, expect } from 'vitest'
import { fetchDashboardData } from './useDashboard'
import { InMemoryClienteRepository } from '../core/infra/repositories/fakes/InMemoryClienteRepository'
import { InMemorySubscriptionRepository } from '../core/infra/repositories/fakes/InMemorySubscriptionRepository'
import { InMemoryClientePagoRepository } from '../core/infra/repositories/fakes/InMemoryClientePagoRepository'
import { Cliente } from '../core/domain/entities/Cliente'
import { Suscripcion } from '../core/domain/entities/Suscripcion'
import { Pago } from '../core/domain/entities/Pago'

function buildDeps() {
  return {
    clienteRepo: new InMemoryClienteRepository(),
    subRepo: new InMemorySubscriptionRepository(),
    pagoRepo: new InMemoryClientePagoRepository(),
  }
}

describe('fetchDashboardData', () => {
  it('retorna cliente nulo y listas vacias si el usuario no tiene email', async () => {
    const deps = buildDeps()
    const result = await fetchDashboardData(deps, { id: 'x', email: undefined })
    expect(result).toEqual({ cliente: null, suscripciones: [], pagos: [] })
  })

  it('crea el cliente via ensureByAuthId cuando no existe', async () => {
    const deps = buildDeps()
    const result = await fetchDashboardData(deps, {
      id: 'user-1',
      email: 'ana@test.com',
      full_name: 'Ana',
    })
    expect(result.cliente).toEqual({
      id: 'user-1',
      full_name: 'Ana',
      email: 'ana@test.com',
    })
  })

  it('usa el cliente existente cuando hay match', async () => {
    const deps = buildDeps()
    const existing: Cliente = { id: 'user-1', full_name: 'Ana', email: 'ana@test.com' }
    deps.clienteRepo.seed([existing])
    const result = await fetchDashboardData(deps, {
      id: 'user-1',
      email: 'ana@test.com',
      full_name: 'Nuevo Nombre',
    })
    expect(result.cliente).toEqual(existing)
  })

  it('trae suscripciones y pagos del cliente', async () => {
    const deps = buildDeps()
    deps.clienteRepo.seed([{ id: 'user-1', full_name: null, email: 'ana@test.com' }])
    deps.subRepo.seed({
      'user-1': [
        {
          id: 's1',
          cliente_id: 'user-1',
          plan_slug: 'avanzado',
          estado: 'activa',
          fecha_inicio: null,
          plan: null,
        } as Suscripcion,
      ],
    })
    deps.pagoRepo.seed({
      'user-1': [
        {
          id: 'p1',
          monto: 144.6,
          moneda: 'USD',
          estado: 'approved',
          plan_nombre: 'Avanzado',
          plan_slug: 'avanzado',
          created_at: '2026-01-01T00:00:00Z',
        } as Pago,
      ],
    })

    const result = await fetchDashboardData(deps, {
      id: 'user-1',
      email: 'ana@test.com',
    })
    expect(result.suscripciones).toHaveLength(1)
    expect(result.pagos).toHaveLength(1)
    expect(result.pagos[0].monto).toBe(144.6)
  })

  it('tolera fallos de repos de suscripciones y pagos', async () => {
    const deps = buildDeps()
    deps.clienteRepo.seed([{ id: 'user-1', full_name: null, email: 'ana@test.com' }])

    const throwing: () => Promise<never> = async () => {
      throw new Error('repo down')
    }
    const brokenDeps = {
      clienteRepo: deps.clienteRepo,
      subRepo: { getByClienteId: throwing } as unknown as typeof deps.subRepo,
      pagoRepo: { listByClienteId: throwing } as unknown as typeof deps.pagoRepo,
    }

    const result = await fetchDashboardData(brokenDeps, {
      id: 'user-1',
      email: 'ana@test.com',
    })
    expect(result.suscripciones).toEqual([])
    expect(result.pagos).toEqual([])
  })
})
