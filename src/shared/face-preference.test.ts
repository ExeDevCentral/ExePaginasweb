/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Unit tests for `exe:face` persistence, validation, and storage failure resilience.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  clearStoredFace,
  FACE_STORAGE_KEY,
  isValidFace,
  readStoredFace,
  writeStoredFace,
} from './face-preference'

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial))
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      map.delete(key)
    }),
  }
}

describe('face-preference (exe:face)', () => {
  it('validates only classic and v2 values', () => {
    expect(isValidFace('classic')).toBe(true)
    expect(isValidFace('v2')).toBe(true)
    expect(isValidFace('legacy')).toBe(false)
    expect(isValidFace(null)).toBe(false)
    expect(isValidFace(undefined)).toBe(false)
  })

  it('reads and writes valid face preference under exe:face key', () => {
    const storage = createMemoryStorage()

    expect(readStoredFace(storage)).toBeNull()
    expect(writeStoredFace('v2', storage)).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith(FACE_STORAGE_KEY, 'v2')
    expect(readStoredFace(storage)).toBe('v2')

    expect(writeStoredFace('classic', storage)).toBe(true)
    expect(readStoredFace(storage)).toBe('classic')
  })

  it('ignores corrupted or unknown values in storage', () => {
    const storage = createMemoryStorage({ [FACE_STORAGE_KEY]: 'invalid-face' })
    expect(readStoredFace(storage)).toBeNull()
  })

  it('clears stored preference safely', () => {
    const storage = createMemoryStorage({ [FACE_STORAGE_KEY]: 'v2' })
    expect(clearStoredFace(storage)).toBe(true)
    expect(readStoredFace(storage)).toBeNull()
  })

  it('fails gracefully when localStorage throws (private mode / quota / security error)', () => {
    const throwingStorage = {
      getItem: vi.fn(() => {
        throw new Error('SecurityError: localStorage disabled')
      }),
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError')
      }),
      removeItem: vi.fn(() => {
        throw new Error('SecurityError')
      }),
    }

    expect(readStoredFace(throwingStorage)).toBeNull()
    expect(writeStoredFace('v2', throwingStorage)).toBe(false)
    expect(clearStoredFace(throwingStorage)).toBe(false)
  })

  it('resolves gateway redirect decision correctly with preference and ?choose=1', () => {
    const resolveRedirectTarget = (
      stored: 'classic' | 'v2' | null,
      search: string
    ): string | null => {
      const params = new URLSearchParams(search)
      if (params.get('choose') === '1') return null
      return stored ? `/${stored}` : null
    }

    expect(resolveRedirectTarget('v2', '')).toBe('/v2')
    expect(resolveRedirectTarget('classic', '')).toBe('/classic')
    expect(resolveRedirectTarget('v2', '?choose=1')).toBeNull()
    expect(resolveRedirectTarget('classic', '?choose=1')).toBeNull()
    expect(resolveRedirectTarget(null, '')).toBeNull()
  })
})
