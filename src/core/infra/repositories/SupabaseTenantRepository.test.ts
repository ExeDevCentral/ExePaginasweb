import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseTenantRepository } from './SupabaseTenantRepository'
import { supabase } from '../supabase/client'
import { Tenant, TenantEstado } from '../../domain/entities/Tenant'

// Mock de Supabase client
vi.mock('../supabase/client', () => {
  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(async () => ({ data: null, error: null })),
    maybeSingle: vi.fn().mockImplementation(async () => ({ data: null, error: null })),
  }

  return {
    supabase: {
      from: vi.fn(() => queryBuilder),
      rpc: vi.fn().mockImplementation(async () => ({ data: null, error: null })),
    },
  }
})

describe('SupabaseTenantRepository', () => {
  let repository: SupabaseTenantRepository
  let fromMock: any
  let rpcMock: any

  beforeEach(() => {
    repository = new SupabaseTenantRepository()
    fromMock = vi.mocked(supabase.from)
    rpcMock = vi.mocked(supabase.rpc)
    vi.clearAllMocks()
  })

  const mockTenant: Tenant = {
    id: 'tenant-123',
    slug: 'test-tenant',
    nombre: 'Test Tenant LLC',
    plan_id: 'plan-basic',
    dueno_id: 'owner-456',
    estado: 'activo' as TenantEstado,
    trial_ends_at: null,
    settings: {},
    created_at: '2026-07-21T06:00:00Z',
    updated_at: '2026-07-21T06:00:00Z',
  }

  describe('getById', () => {
    it('debe retornar el tenant cuando existe', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.maybeSingle.mockResolvedValueOnce({
        data: {
          ...mockTenant,
          plan: {
            id: 'plan-basic',
            slug: 'basic',
            nombre: 'Plan Básico',
            precio: 29,
          },
        },
        error: null,
      })

      const result = await repository.getById('tenant-123')

      expect(fromMock).toHaveBeenCalledWith('tenants')
      expect(mockQueryBuilder.select).toHaveBeenCalled()
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'tenant-123')
      expect(result).toBeDefined()
      expect(result?.id).toBe('tenant-123')
      expect(result?.plan?.slug).toBe('basic')
    })

    it('debe retornar null si no se encuentra el tenant', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await repository.getById('tenant-nonexistent')

      expect(result).toBeNull()
    })

    it('debe lanzar error si supabase falla', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: new Error('Database Error'),
      })

      await expect(repository.getById('tenant-123')).rejects.toThrow('Database Error')
    })
  })

  describe('getBySlug', () => {
    it('debe retornar el tenant filtrando por slug', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.maybeSingle.mockResolvedValueOnce({
        data: mockTenant,
        error: null,
      })

      const result = await repository.getBySlug('test-tenant')

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('slug', 'test-tenant')
      expect(result?.slug).toBe('test-tenant')
    })
  })

  describe('getByOwnerId', () => {
    it('debe retornar lista de tenants ordenados', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.order.mockResolvedValueOnce({
        data: [mockTenant],
        error: null,
      })

      const result = await repository.getByOwnerId('owner-456')

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('dueno_id', 'owner-456')
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('tenant-123')
    })
  })

  describe('create', () => {
    it('debe insertar un nuevo tenant y retornarlo', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: mockTenant,
        error: null,
      })

      const newTenantData = {
        slug: 'test-tenant',
        nombre: 'Test Tenant LLC',
        plan_id: 'plan-basic',
        dueno_id: 'owner-456',
        estado: 'activo' as TenantEstado,
        trial_ends_at: null,
        settings: {},
      }

      const result = await repository.create(newTenantData)

      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(newTenantData)
      expect(result.id).toBe('tenant-123')
    })
  })

  describe('update', () => {
    it('debe actualizar el tenant y retornar los datos actualizados', async () => {
      const mockQueryBuilder = fromMock()
      mockQueryBuilder.single.mockResolvedValueOnce({
        data: { ...mockTenant, nombre: 'Updated Tenant Name' },
        error: null,
      })

      const updates = { nombre: 'Updated Tenant Name' }
      const result = await repository.update('tenant-123', updates)

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(updates)
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'tenant-123')
      expect(result.nombre).toBe('Updated Tenant Name')
    })
  })

  describe('getTenantStats', () => {
    it('debe invocar la función RPC para obtener estadísticas', async () => {
      const mockStats = {
        total_members: 5,
        total_groups: 2,
        active_services: 3,
        open_tickets: 1,
        sla_breaches: 0,
        pending_invoices: 1,
        total_revenue: 150,
      }

      rpcMock.mockResolvedValueOnce({
        data: mockStats,
        error: null,
      })

      const result = await repository.getTenantStats('tenant-123')

      expect(rpcMock).toHaveBeenCalledWith('get_tenant_stats', {
        p_tenant_id: 'tenant-123',
      })
      expect(result.total_members).toBe(5)
      expect(result.total_revenue).toBe(150)
    })
  })
})
