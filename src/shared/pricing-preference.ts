/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Persistencia de la modalidad de precio elegida en V2 (ARS PyME / USD AR / USD INT).
 * Evita que el cliente pierda su selección al recargar o volver desde otra cara.
 */
import type { PricingTier } from './pricing-catalog'

export const PRICING_TIER_STORAGE_KEY = 'exe:v2-tier' as const

export const PRICING_TIERS: readonly PricingTier[] = ['ARS_PYME', 'USD_AR', 'USD_INTL']

export function isValidPricingTier(value: unknown): value is PricingTier {
  return typeof value === 'string' && (PRICING_TIERS as readonly string[]).includes(value)
}

export function readStoredPricingTier(
  storage?: Pick<Storage, 'getItem'> | null
): PricingTier | null {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return null
    const raw = target.getItem(PRICING_TIER_STORAGE_KEY)
    return isValidPricingTier(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredPricingTier(
  tier: PricingTier,
  storage?: Pick<Storage, 'setItem'> | null
): boolean {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return false
    target.setItem(PRICING_TIER_STORAGE_KEY, tier)
    return true
  } catch {
    return false
  }
}
