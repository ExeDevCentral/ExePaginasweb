/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Unit tests for `exe:v2-tier` persistence and validation.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  isValidPricingTier,
  PRICING_TIER_STORAGE_KEY,
  readStoredPricingTier,
  writeStoredPricingTier,
} from './pricing-preference'

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial))
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value)
    }),
  }
}

describe('pricing-preference (exe:v2-tier)', () => {
  it('validates only the three supported tiers', () => {
    expect(isValidPricingTier('ARS_PYME')).toBe(true)
    expect(isValidPricingTier('USD_AR')).toBe(true)
    expect(isValidPricingTier('USD_INTL')).toBe(true)
    expect(isValidPricingTier('EUR')).toBe(false)
    expect(isValidPricingTier(null)).toBe(false)
    expect(isValidPricingTier(undefined)).toBe(false)
  })

  it('reads and writes the selected tier under exe:v2-tier', () => {
    const storage = createMemoryStorage()

    expect(readStoredPricingTier(storage)).toBeNull()
    expect(writeStoredPricingTier('USD_INTL', storage)).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith(PRICING_TIER_STORAGE_KEY, 'USD_INTL')
    expect(readStoredPricingTier(storage)).toBe('USD_INTL')
  })

  it('ignores corrupted values and survives storage failures', () => {
    const corrupted = createMemoryStorage({ [PRICING_TIER_STORAGE_KEY]: 'usd' })
    expect(readStoredPricingTier(corrupted)).toBeNull()

    const throwing = {
      getItem: vi.fn(() => {
        throw new Error('SecurityError')
      }),
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError')
      }),
    }

    expect(readStoredPricingTier(throwing)).toBeNull()
    expect(writeStoredPricingTier('ARS_PYME', throwing)).toBe(false)
  })
})
