import { describe, it, expect, vi, beforeEach } from 'vitest'
import { smoothScrollTo, setGlobalLenis } from '../../src/components/shared/scrollUtils'
import type Lenis from 'lenis'

describe('smoothScrollTo navigation utility', () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document

  beforeEach(() => {
    vi.restoreAllMocks()
    setGlobalLenis(null)
  })

  it('debe delegar a lenis.scrollTo con offset -88 y duration 0.85 cuando Lenis esta disponible', () => {
    const mockScrollTo = vi.fn()
    setGlobalLenis({ scrollTo: mockScrollTo } as unknown as Lenis)

    const fakeEl = { id: 'contact' } as unknown as HTMLElement
    globalThis.window = {
      location: { href: '' },
      scrollY: 0,
      scrollTo: vi.fn(),
    } as unknown as Window & typeof globalThis
    globalThis.document = {
      querySelector: vi.fn((sel: string) => (sel === '#contact' ? fakeEl : null)),
    } as unknown as Document

    smoothScrollTo('#contact', -88)

    expect(mockScrollTo).toHaveBeenCalledWith(fakeEl, {
      offset: -88,
      duration: 0.85,
    })

    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })

  it('debe usar fallback window.scrollTo suave con offset exacto si Lenis es null', () => {
    setGlobalLenis(null)
    const windowScrollToMock = vi.fn()

    const fakeEl = {
      id: 'soluciones',
      getBoundingClientRect: () => ({ top: 500, bottom: 600 }),
    } as unknown as HTMLElement

    globalThis.window = {
      location: { href: '' },
      scrollY: 100,
      scrollTo: windowScrollToMock,
    } as unknown as Window & typeof globalThis
    globalThis.document = {
      querySelector: vi.fn((sel: string) => (sel === '#soluciones' ? fakeEl : null)),
    } as unknown as Document

    smoothScrollTo('#soluciones', -88)

    // top = 500 (rect.top) + 100 (scrollY) + (-88) = 512
    expect(windowScrollToMock).toHaveBeenCalledWith({
      top: 512,
      behavior: 'smooth',
    })

    globalThis.window = originalWindow
    globalThis.document = originalDocument
  })
})
