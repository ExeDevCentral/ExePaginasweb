/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect } from 'vitest'
import { fetchDashboardData, type DashboardDataDeps } from './useDashboard'
import { InMemoryClienteRepository } from '../core/infra/repositories/fakes/InMemoryClienteRepository'
import { InMemorySubscriptionRepository } from '../core/infra/repositories/fakes/InMemorySubscriptionRepository'
import { InMemoryClientePagoRepository } from '../core/infra/repositories/fakes/InMemoryClientePagoRepository'
import { fromPartial } from '@total-typescript/shoehorn'
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
    const result = await fetchDashboardData(deps, { id: 'x' })
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
        fromPartial<Suscripcion>({
          id: 's1',
          cliente_id: 'user-1',
          plan_slug: 'avanzado',
          estado: 'activa',
          fecha_inicio: null,
          plan: null,
        }),
      ],
    })
    deps.pagoRepo.seed({
      'user-1': [
        fromPartial<Pago>({
          id: 'p1',
          monto: 144.6,
          moneda: 'USD',
          estado: 'approved',
          plan_nombre: 'Avanzado',
          plan_slug: 'avanzado',
          created_at: '2026-01-01T00:00:00Z',
        }),
      ],
    })

    const result = await fetchDashboardData(deps, {
      id: 'user-1',
      email: 'ana@test.com',
    })
    expect(result.suscripciones).toHaveLength(1)
    expect(result.pagos).toHaveLength(1)
    expect(result.pagos[0]!.monto).toBe(144.6)
  })

  it('propaga fallos de repos de suscripciones y pagos', async () => {
    const deps = buildDeps()
    deps.clienteRepo.seed([{ id: 'user-1', full_name: null, email: 'ana@test.com' }])

    const throwing: () => Promise<never> = async () => {
      throw new Error('repo down')
    }

    const brokenDeps: DashboardDataDeps = {
      clienteRepo: deps.clienteRepo,
      subRepo: { getByClienteId: throwing },
      pagoRepo: { listByClienteId: throwing },
    }

    await expect(
      fetchDashboardData(brokenDeps, {
        id: 'user-1',
        email: 'ana@test.com',
      })
    ).rejects.toThrow('repo down')
  })
})
