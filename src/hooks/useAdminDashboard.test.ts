import { describe, it, expect } from 'vitest'
import { fetchAdminDashboard } from './useAdminDashboard'
import { InMemoryAdminDashboardRepository } from '../core/infra/repositories/fakes/InMemoryAdminDashboardRepository'
import {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
} from '../core/domain/entities/AdminDashboard'

const clientes: AdminCliente[] = [
  {
    id: 'c1',
    full_name: 'Ana',
    email: 'ana@test.com',
    avatar_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
]

const suscripciones: AdminSuscripcion[] = [
  {
    id: 's1',
    cliente_id: 'c1',
    plan_slug: 'premium',
    estado: 'activa',
    fecha_inicio: null,
    fecha_fin: null,
    created_at: '2026-01-01T00:00:00Z',
  },
]

const pagos: AdminPago[] = [
  {
    id: 'p1',
    cliente_id: 'c1',
    monto: 100,
    moneda: 'USD',
    estado: 'approved',
    plan_nombre: null,
    plan_slug: null,
    metodo_pago: null,
    created_at: '2026-01-01T00:00:00Z',
  },
]

const tickets: AdminTicket[] = [
  {
    id: 't1',
    cliente_id: 'c1',
    asunto: 'Bug',
    mensaje: 'no anda',
    categoria: 'bug',
    prioridad: 'alta',
    estado: 'abierto',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

describe('fetchAdminDashboard', () => {
  it('construye overview + stats desde el repo', async () => {
    const repo = new InMemoryAdminDashboardRepository()
    repo.seed({ clientes, suscripciones, pagos, tickets })

    const result = await fetchAdminDashboard(repo)

    expect(result.clientes).toHaveLength(1)
    expect(result.stats.totalClientes).toBe(1)
    expect(result.stats.planPremium).toBe(1)
    expect(result.stats.ticketsAbiertos).toBe(1)
    expect(result.stats.ingresosTotalesUSD).toBe(100)
  })

  it('retorna defaults con datos vacios', async () => {
    const repo = new InMemoryAdminDashboardRepository()
    const result = await fetchAdminDashboard(repo)
    expect(result.stats.totalClientes).toBe(0)
    expect(result.clientes).toEqual([])
    expect(result.suscripciones).toEqual([])
  })
})
