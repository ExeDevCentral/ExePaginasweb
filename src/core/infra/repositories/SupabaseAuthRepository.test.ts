import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SupabaseAuthRepository } from './SupabaseAuthRepository'
import { supabase } from '../supabase/client'

vi.mock('../supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      updateUser: vi.fn(),
    },
  },
}))

describe('SupabaseAuthRepository', () => {
  const mockFrom = vi.mocked(supabase.from)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('actualiza clientes y auth al cambiar el perfil', async () => {
    const query = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    mockFrom.mockReturnValue(query as never)
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({ error: null } as never)

    await new SupabaseAuthRepository().updateProfile({
      clienteId: 'c1',
      fullName: 'Ana Pérez',
    })

    expect(mockFrom).toHaveBeenCalledWith('clientes')
    expect(query.update).toHaveBeenCalledWith({ full_name: 'Ana Pérez' })
    expect(query.eq).toHaveBeenCalledWith('id', 'c1')
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Ana Pérez' },
    })
  })

  it('lanza error si la tabla clientes falla', async () => {
    const query = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: new Error('db down') }),
    }
    mockFrom.mockReturnValue(query as never)

    await expect(
      new SupabaseAuthRepository().updateProfile({ clienteId: 'c1', fullName: 'Ana' })
    ).rejects.toThrow('db down')
  })

  it('actualiza la contraseña vía auth.updateUser', async () => {
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({ error: null } as never)

    await new SupabaseAuthRepository().updatePassword('NuevaClave1')
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'NuevaClave1' })
  })
})
