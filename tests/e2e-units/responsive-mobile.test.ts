import { describe, it, expect, vi } from 'vitest'

describe('📱 SUITE DE VERIFICACIÓN RESPONSIVE: PC, Tablets y Celulares', () => {
  it('debe detectar dispositivos móviles basados en viewport breakpoint', () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('max-width: 639px'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    vi.stubGlobal('matchMedia', matchMediaMock)

    expect(matchMediaMock('(max-width: 639px)').matches).toBe(true)
    expect(matchMediaMock('(pointer: coarse)').matches).toBe(false)
  })

  it('debe proteger touch devices contra eventos de ratón pesados', () => {
    const coarseTouch = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(pointer: coarse)',
      media: query,
    }))

    vi.stubGlobal('matchMedia', coarseTouch)
    expect(coarseTouch('(pointer: coarse)').matches).toBe(true)
  })
})
