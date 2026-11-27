/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Unit tests for `exe:v2-plan` persistence and validation.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  isValidV2PlanId,
  readStoredV2PlanId,
  V2_PLAN_IDS,
  V2_PLAN_STORAGE_KEY,
  writeStoredV2PlanId,
} from './v2-plan-preference'

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial))
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value)
    }),
  }
}

describe('v2-plan-preference (exe:v2-plan)', () => {
  it('validates only known V2 plan IDs', () => {
    for (const id of V2_PLAN_IDS) {
      expect(isValidV2PlanId(id)).toBe(true)
    }
    expect(isValidV2PlanId('unknown-plan')).toBe(false)
    expect(isValidV2PlanId('')).toBe(false)
    expect(isValidV2PlanId(null)).toBe(false)
    expect(isValidV2PlanId(undefined)).toBe(false)
  })

  it('reads and writes the selected plan under exe:v2-plan', () => {
    const storage = createMemoryStorage()

    expect(readStoredV2PlanId(storage)).toBeNull()
    expect(writeStoredV2PlanId('saas-medida', storage)).toBe(true)
    expect(storage.setItem).toHaveBeenCalledWith(V2_PLAN_STORAGE_KEY, 'saas-medida')
    expect(readStoredV2PlanId(storage)).toBe('saas-medida')
  })

  it('ignores corrupted values and survives storage failures', () => {
    const corrupted = createMemoryStorage({ [V2_PLAN_STORAGE_KEY]: 'legacy-plan' })
    expect(readStoredV2PlanId(corrupted)).toBeNull()

    const throwing = {
      getItem: vi.fn(() => {
        throw new Error('SecurityError')
      }),
      setItem: vi.fn(() => {
        throw new Error('QuotaExceededError')
      }),
    }

    expect(readStoredV2PlanId(throwing)).toBeNull()
    expect(writeStoredV2PlanId('landing-express', throwing)).toBe(false)
  })
})
