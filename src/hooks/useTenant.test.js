var _class /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect, vi } from 'vitest'

// Hoist variables before vi.mock runs
const { mockGetByOwnerId, mockGetById, mockGetTenantStats, mockCreate, mockUpdate } = vi.hoisted(
  () => ({
    mockGetByOwnerId: vi.fn().mockResolvedValue(['tenant-1']),
    mockGetById: vi.fn().mockResolvedValue({ id: 'tenant-1' }),
    mockGetTenantStats: vi.fn().mockResolvedValue({ total_members: 3 }),
    mockCreate: vi.fn().mockResolvedValue({ id: 'new-tenant' }),
    mockUpdate: vi.fn().mockResolvedValue({ id: 'updated-tenant' }),
  })
)

// Mock de SupabaseTenantRepository utilizando la clase hoisted
vi.mock('../core/infra/repositories/SupabaseTenantRepository', () => {
  return {
    SupabaseTenantRepository:
      ((_class = class {
        constructor() {
          _class.prototype.__init.call(this)
          _class.prototype.__init2.call(this)
          _class.prototype.__init3.call(this)
          _class.prototype.__init4.call(this)
          _class.prototype.__init5.call(this)
        }
        __init() {
          this.getByOwnerId = mockGetByOwnerId
        }
        __init2() {
          this.getById = mockGetById
        }
        __init3() {
          this.getTenantStats = mockGetTenantStats
        }
        __init4() {
          this.create = mockCreate
        }
        __init5() {
          this.update = mockUpdate
        }
      }),
      _class),
  }
})

// Mock de React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn((options) => options),
  useMutation: vi.fn((options) => options),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}))

import {
  useTenant,
  useTenantById,
  useTenantStats,
  useCreateTenant,
  useUpdateTenant,
} from './useTenant'

function isRecord(value) {
  return typeof value === 'object' && value !== null
}

function toQueryFn(value) {
  if (value === undefined) return undefined
  if (typeof value !== 'function') {
    throw new Error('Expected queryFn a ser una función')
  }
  return value
}

function asQueryHookOptions(returnValue) {
  if (!isRecord(returnValue)) {
    throw new Error('Expected el hook a devolver las opciones de useQuery')
  }
  const { queryKey, queryFn, enabled, refetchInterval } = returnValue
  if (!Array.isArray(queryKey)) {
    throw new Error('Expected queryKey a ser un array')
  }
  if (enabled !== undefined && typeof enabled !== 'boolean') {
    throw new Error('Expected enabled a ser boolean')
  }
  if (refetchInterval !== undefined && typeof refetchInterval !== 'number') {
    throw new Error('Expected refetchInterval a ser number')
  }
  const narrowedQueryFn = toQueryFn(queryFn)
  return {
    queryKey,
    ...(narrowedQueryFn ? { queryFn: narrowedQueryFn } : {}),
    ...(enabled !== undefined ? { enabled } : {}),
    ...(refetchInterval !== undefined ? { refetchInterval } : {}),
  }
}

function asMutationHookOptions(returnValue) {
  if (!isRecord(returnValue)) {
    throw new Error('Expected el hook a devolver las opciones de useMutation')
  }
  const { mutationFn } = returnValue
  if (mutationFn !== undefined && typeof mutationFn !== 'function') {
    throw new Error('Expected mutationFn a ser una función')
  }
  return mutationFn ? { mutationFn: mutationFn } : {}
}

describe('useTenant Hook', () => {
  it('useTenant debe configurar useQuery con queryKey y queryFn', async () => {
    const options = asQueryHookOptions(useTenant('owner-123'))

    expect(options.queryKey).toEqual(['tenant', 'owner-123'])
    expect(options.enabled).toBe(true)

    // Ejecutar queryFn y verificar que llama a repo.getByOwnerId
    const result = await options.queryFn()
    expect(mockGetByOwnerId).toHaveBeenCalledWith('owner-123')
    expect(result).toEqual(['tenant-1'])
  })

  it('useTenantById debe configurar useQuery con queryKey e id de tenant', async () => {
    const options = asQueryHookOptions(useTenantById('tenant-abc'))

    expect(options.queryKey).toEqual(['tenant-detail', 'tenant-abc'])
    expect(options.enabled).toBe(true)

    const result = await options.queryFn()
    expect(mockGetById).toHaveBeenCalledWith('tenant-abc')
    expect(result).toEqual({ id: 'tenant-1' })
  })

  it('useTenantStats debe configurar useQuery con queryKey e intervalo de refetch', async () => {
    const options = asQueryHookOptions(useTenantStats('tenant-abc'))

    expect(options.queryKey).toEqual(['tenant-stats', 'tenant-abc'])
    expect(options.refetchInterval).toBe(30 * 1000)

    const result = await options.queryFn()
    expect(mockGetTenantStats).toHaveBeenCalledWith('tenant-abc')
    expect(result).toEqual({ total_members: 3 })
  })

  it('useCreateTenant debe configurar useMutation', async () => {
    const options = asMutationHookOptions(useCreateTenant())

    expect(options.mutationFn).toBeDefined()
    const newTenantData = {
      slug: 'test-tenant',
      nombre: 'Test Tenant',
      plan_id: null,
      dueno_id: 'owner-123',
      estado: 'activo',
      trial_ends_at: null,
      settings: {},
    }

    const result = await options.mutationFn(newTenantData)
    expect(mockCreate).toHaveBeenCalledWith(newTenantData)
    expect(result).toEqual({ id: 'new-tenant' })
  })

  it('useUpdateTenant debe configurar useMutation de actualización', async () => {
    const options = asMutationHookOptions(useUpdateTenant())

    expect(options.mutationFn).toBeDefined()
    const updates = { id: 'tenant-123', data: { nombre: 'Nuevo Nombre' } }

    const result = await options.mutationFn(updates)
    expect(mockUpdate).toHaveBeenCalledWith('tenant-123', { nombre: 'Nuevo Nombre' })
    expect(result).toEqual({ id: 'updated-tenant' })
  })
})
