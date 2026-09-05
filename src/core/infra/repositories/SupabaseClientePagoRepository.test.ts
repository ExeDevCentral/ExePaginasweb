import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseClientePagoRepository } from './SupabaseClientePagoRepository'
import { supabase } from '../supabase/client'

vi.mock('../supabase/client', () => {
  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockImplementation(async () => ({ data: [], error: null })),
  }

  return {
    supabase: {
      from: vi.fn(() => queryBuilder),
      rpc: vi.fn().mockImplementation(async () => ({ data: null, error: null })),
    },
  }
})

describe('SupabaseClientePagoRepository', () => {
  let repo: SupabaseClientePagoRepository
  let fromMock: any

  beforeEach(() => {
    repo = new SupabaseClientePagoRepository()
    fromMock = vi.mocked(supabase.from)
    vi.clearAllMocks()
  })

  it('lista pagos por cliente ordenados desc', async () => {
    const pagos = [
      {
        id: 'p1',
        monto: 100,
        moneda: 'USD',
        estado: 'approved',
        plan_nombre: 'Avanzado',
        plan_slug: 'avanzado',
        created_at: '2026-01-02T00:00:00Z',
      },
    ]
    const qb = fromMock()
    qb.limit.mockResolvedValueOnce({ data: pagos, error: null })

    const result = await repo.listByClienteId('cliente-1')

    expect(fromMock).toHaveBeenCalledWith('pagos')
    expect(qb.eq).toHaveBeenCalledWith('cliente_id', 'cliente-1')
    expect(qb.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(result).toEqual(pagos)
  })

  it('retorna lista vacia si no hay pagos', async () => {
    const qb = fromMock()
    qb.limit.mockResolvedValueOnce({ data: null, error: null })

    const result = await repo.listByClienteId('cliente-inexistente')
    expect(result).toEqual([])
  })

  it('lanza error si supabase falla', async () => {
    const qb = fromMock()
    qb.limit.mockResolvedValueOnce({ data: null, error: new Error('DB down') })

    await expect(repo.listByClienteId('cliente-1')).rejects.toThrow('DB down')
  })
})
