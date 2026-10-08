/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */

/**
 * Resuelve la configuración de un tenant basada en su plan y nivel de validación (Nivel 1).
 * Evita el over-engineering permitiendo incorporar nuevos clientes de forma simple y repetible.
 */
export function resolveTenantConfig(tenantId, planSlug) {
  const normalizedSlug = (planSlug || '').toLowerCase().trim()

  const isBookingOnly = normalizedSlug.includes('booking') || normalizedSlug.includes('reserva')
  const catalogTier = tierFromStorePlanId(normalizedSlug)
  const tier = catalogTier === 'none' ? tierFromPlanLabel(normalizedSlug) : catalogTier
  const isPremium = tier === 'premium'
  const isAvanzado = tier === 'avanzado'

  return {
    tenantId,
    planSlug: normalizedSlug || 'sin_plan',
    features: {
      hasCustomSLA: isPremium,
      hasWorkgroups: isAvanzado || isPremium,
      hasAdvancedAnalytics: isPremium,
      isBookingOnly,
      maxWorkMembers: isPremium ? 10 : isAvanzado ? 5 : 1,
    },
  }
}
import { tierFromPlanLabel, tierFromStorePlanId } from '../planCatalog'
