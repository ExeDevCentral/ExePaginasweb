/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Persistencia del plan seleccionado en V2.
 * Restaura la selección del cliente sin alterar el flujo de cotización.
 */
import { UNIFIED_PRICING, type ServiceRateCard } from './pricing-catalog'

export const V2_PLAN_STORAGE_KEY = 'exe:v2-plan' as const

export const V2_PLAN_IDS = Object.keys(UNIFIED_PRICING) as readonly ServiceRateCard['id'][]

export function isValidV2PlanId(value: unknown): value is ServiceRateCard['id'] {
  return typeof value === 'string' && (V2_PLAN_IDS as readonly string[]).includes(value)
}

export function readStoredV2PlanId(
  storage?: Pick<Storage, 'getItem'> | null
): ServiceRateCard['id'] | null {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return null
    const raw = target.getItem(V2_PLAN_STORAGE_KEY)
    return isValidV2PlanId(raw) ? raw : null
  } catch {
    return null
  }
}

export function writeStoredV2PlanId(
  planId: ServiceRateCard['id'],
  storage?: Pick<Storage, 'setItem'> | null
): boolean {
  try {
    const target =
      storage !== undefined ? storage : typeof window !== 'undefined' ? window.localStorage : null
    if (!target) return false
    target.setItem(V2_PLAN_STORAGE_KEY, planId)
    return true
  } catch {
    return false
  }
}
