import { describe, it, expect } from 'vitest'
import { computeAdminStats } from './computeAdminStats'
import { AdminCliente, AdminSuscripcion, AdminPago, AdminTicket } from '../entities/AdminDashboard'

const clientes: AdminCliente[] = [
  {
    id: 'c1',
    full_name: 'Ana',
    email: 'ana@test.com',
    avatar_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c2',
    full_name: 'Beto',
    email: 'beto@test.com',
    avatar_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c3',
    full_name: 'Clau',
    email: 'clau@test.com',
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
  {
    id: 's2',
    cliente_id: 'c2',
    plan_slug: 'avanzado',
    estado: 'activa',
    fecha_inicio: null,
    fecha_fin: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  // c3 queda sin suscripción activa → sinPlan
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
  {
    id: 'p2',
    cliente_id: 'c2',
    monto: 5000,
    moneda: 'ARS',
    estado: 'aprobado',
    plan_nombre: null,
    plan_slug: null,
    metodo_pago: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    cliente_id: 'c3',
    monto: 200,
    moneda: 'USD',
    estado: 'pendiente', // no se cuenta
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
  {
    id: 't2',
    cliente_id: 'c2',
    asunto: 'Duda',
    mensaje: '...',
    categoria: 'consulta',
    prioridad: 'media',
    estado: 'en_progreso',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 't3',
    cliente_id: 'c3',
    asunto: 'Cerrado',
    mensaje: '...',
    categoria: 'consulta',
    prioridad: 'baja',
    estado: 'cerrado', // no se cuenta
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

describe('computeAdminStats', () => {
  it('cuenta clientes totales y sin plan', () => {
    const stats = computeAdminStats(clientes, suscripciones, pagos, tickets)
    expect(stats.totalClientes).toBe(3)
    expect(stats.sinPlan).toBe(1)
  })

  it('clasifica por plan: premium, avanzado, basico', () => {
    const stats = computeAdminStats(clientes, suscripciones, pagos, tickets)
    expect(stats.planPremium).toBe(1)
    expect(stats.planAvanzado).toBe(1)
    expect(stats.planBasico).toBe(0)
  })

  it('cuenta tickets abiertos y en progreso', () => {
    const stats = computeAdminStats(clientes, suscripciones, pagos, tickets)
    expect(stats.ticketsAbiertos).toBe(2)
  })

  it('suma ingresos por moneda solo de pagos aprobados', () => {
    const stats = computeAdminStats(clientes, suscripciones, pagos, tickets)
    expect(stats.ingresosTotalesUSD).toBe(100)
    expect(stats.ingresosTotalesARS).toBe(5000)
  })

  it('plan pro se clasifica como avanzado', () => {
    const subsPro: AdminSuscripcion[] = [
      {
        id: 's-pro',
        cliente_id: 'c1',
        plan_slug: 'pro',
        estado: 'activa',
        fecha_inicio: null,
        fecha_fin: null,
        created_at: '2026-01-01T00:00:00Z',
      },
    ]
    const stats = computeAdminStats(clientes, subsPro, pagos, tickets)
    expect(stats.planAvanzado).toBe(1)
  })

  it('retorna defaults con datos vacios', () => {
    const stats = computeAdminStats([], [], [], [])
    expect(stats).toEqual({
      totalClientes: 0,
      planBasico: 0,
      planAvanzado: 0,
      planPremium: 0,
      sinPlan: 0,
      ticketsAbiertos: 0,
      ingresosTotalesARS: 0,
      ingresosTotalesUSD: 0,
    })
  })
})
