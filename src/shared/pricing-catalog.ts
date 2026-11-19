/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Fuente Única de Verdad (SSOT) de Precios para Classic y V2 Cloud Utility.
 *
 * Estructura en 3 niveles comerciales:
 * 1. ARS_PYME : PyMEs, comercios y emprendedores de Argentina (en Pesos ARS).
 * 2. USD_AR   : Empresas y PyMEs de Argentina en USD con ~30% de bonificación local sobre tarifa internacional.
 * 3. USD_INTL : Tarifa Internacional Global (USA, Europa, LATAM / Exterior).
 */

export type PricingTier = 'ARS_PYME' | 'USD_AR' | 'USD_INTL'

export type LegacyCurrency = 'ARS' | 'USD'

export interface ServiceRateCard {
  readonly id:
    | 'landing-express'
    | 'tienda-turnos'
    | 'saas-medida'
    | 'automatizacion-ia'
    | 'linux-pos'
    | 'linux-lan-server'
  readonly code: string
  readonly setup: {
    readonly ARS_PYME: string
    readonly USD_AR: string
    readonly USD_INTL: string
    /** Numeric values for calculators */
    readonly numericARS: number
    readonly numericUsdAr: number
    readonly numericUsdIntl: number
  }
  readonly monthly: {
    readonly ARS_PYME: string
    readonly USD_AR: string
    readonly USD_INTL: string
  }
  readonly discountPercentAr: number
}

export const UNIFIED_PRICING: Record<ServiceRateCard['id'], ServiceRateCard> = {
  'landing-express': {
    id: 'landing-express',
    code: 'web-express-72h',
    setup: {
      ARS_PYME: '$450.000',
      USD_AR: 'u$s 380',
      USD_INTL: 'USD 550',
      numericARS: 450_000,
      numericUsdAr: 380,
      numericUsdIntl: 550,
    },
    monthly: {
      ARS_PYME: '$22.000/mes',
      USD_AR: 'u$s 25/mes',
      USD_INTL: 'USD 40/mes',
    },
    discountPercentAr: 31,
  },
  'tienda-turnos': {
    id: 'tienda-turnos',
    code: 'biz-commerce-pro',
    setup: {
      ARS_PYME: '$850.000',
      USD_AR: 'u$s 780',
      USD_INTL: 'USD 1.150',
      numericARS: 850_000,
      numericUsdAr: 780,
      numericUsdIntl: 1_150,
    },
    monthly: {
      ARS_PYME: '$42.000/mes',
      USD_AR: 'u$s 48/mes',
      USD_INTL: 'USD 75/mes',
    },
    discountPercentAr: 32,
  },
  'saas-medida': {
    id: 'saas-medida',
    code: 'enterprise-saas',
    setup: {
      ARS_PYME: 'Desde $1.950.000',
      USD_AR: 'Desde u$s 1.650',
      USD_INTL: 'From USD 2.400',
      numericARS: 1_950_000,
      numericUsdAr: 1_650,
      numericUsdIntl: 2_400,
    },
    monthly: {
      ARS_PYME: '$85.000/mes',
      USD_AR: 'u$s 95/mes',
      USD_INTL: 'USD 150/mes',
    },
    discountPercentAr: 31,
  },
  'automatizacion-ia': {
    id: 'automatizacion-ia',
    code: 'ai-ops-engine',
    setup: {
      ARS_PYME: '$680.000',
      USD_AR: 'u$s 590',
      USD_INTL: 'USD 890',
      numericARS: 680_000,
      numericUsdAr: 590,
      numericUsdIntl: 890,
    },
    monthly: {
      ARS_PYME: '$35.000/mes',
      USD_AR: 'u$s 38/mes',
      USD_INTL: 'USD 60/mes',
    },
    discountPercentAr: 34,
  },
  'linux-pos': {
    id: 'linux-pos',
    code: 'linux-kiosk-pos',
    setup: {
      ARS_PYME: '$520.000',
      USD_AR: 'u$s 450',
      USD_INTL: 'USD 650',
      numericARS: 520_000,
      numericUsdAr: 450,
      numericUsdIntl: 650,
    },
    monthly: {
      ARS_PYME: '$48.000/mes',
      USD_AR: 'u$s 42/mes',
      USD_INTL: 'USD 65/mes',
    },
    discountPercentAr: 31,
  },
  'linux-lan-server': {
    id: 'linux-lan-server',
    code: 'linux-lan-node',
    setup: {
      ARS_PYME: '$980.000',
      USD_AR: 'u$s 890',
      USD_INTL: 'USD 1.290',
      numericARS: 980_000,
      numericUsdAr: 890,
      numericUsdIntl: 1_290,
    },
    monthly: {
      ARS_PYME: '$48.000/mes',
      USD_AR: 'u$s 42/mes',
      USD_INTL: 'USD 65/mes',
    },
    discountPercentAr: 31,
  },
} as const

export function formatTierSetup(
  serviceId: ServiceRateCard['id'],
  tier: PricingTier
): { primary: string; strikeIntl?: string; badge?: string } {
  const card = UNIFIED_PRICING[serviceId]
  if (tier === 'ARS_PYME') {
    return {
      primary: card.setup.ARS_PYME,
      badge: `PyME AR · Eq. ${card.setup.USD_AR}`,
    }
  }
  if (tier === 'USD_AR') {
    return {
      primary: card.setup.USD_AR,
      strikeIntl: card.setup.USD_INTL,
      badge: `-${card.discountPercentAr}% Bonificación AR`,
    }
  }
  return {
    primary: card.setup.USD_INTL,
    badge: 'Global Rate',
  }
}
