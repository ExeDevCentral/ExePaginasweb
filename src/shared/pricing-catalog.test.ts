/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Unit tests for unified pricing catalog across Classic and V2 (ARS PyME, USD AR Discount, USD International).
 */
import { describe, expect, it } from 'vitest'
import { formatTierSetup, UNIFIED_PRICING } from './pricing-catalog'

describe('UNIFIED_PRICING catalog (Classic + V2 SSOT)', () => {
  it('enforces ~30% discount for Argentina USD_AR compared to USD_INTL across all services', () => {
    for (const card of Object.values(UNIFIED_PRICING)) {
      expect(card.setup.numericUsdAr).toBeLessThan(card.setup.numericUsdIntl)
      expect(card.discountPercentAr).toBeGreaterThanOrEqual(30)
      expect(card.discountPercentAr).toBeLessThanOrEqual(35)
    }
  })

  it('formats ARS_PYME, USD_AR (with international anchor strike), and USD_INTL properly', () => {
    const arPyme = formatTierSetup('linux-pos', 'ARS_PYME')
    expect(arPyme.primary).toBe('$520.000')
    expect(arPyme.badge).toContain('u$s 450')

    const usdAr = formatTierSetup('linux-pos', 'USD_AR')
    expect(usdAr.primary).toBe('u$s 450')
    expect(usdAr.strikeIntl).toBe('USD 650')
    expect(usdAr.badge).toContain('-31%')

    const intl = formatTierSetup('linux-pos', 'USD_INTL')
    expect(intl.primary).toBe('USD 650')
  })
})
