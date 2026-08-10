export interface TenantConfig {
  tenantId: string
  planSlug: string
  features: {
    hasCustomSLA: boolean
    hasWorkgroups: boolean
    hasAdvancedAnalytics: boolean
    isBookingOnly: boolean
    maxWorkMembers: number
  }
}

/**
 * Resuelve la configuración de un tenant basada en su plan y nivel de validación (Nivel 1).
 * Evita el over-engineering permitiendo incorporar nuevos clientes de forma simple y repetible.
 */
export function resolveTenantConfig(tenantId: string, planSlug: string): TenantConfig {
  const normalizedSlug = (planSlug || '').toLowerCase().trim()

  const isBookingOnly = normalizedSlug.includes('booking') || normalizedSlug.includes('reserva')
  const isPremium = normalizedSlug.includes('premium') || normalizedSlug.includes('pro')
  const isAvanzado = normalizedSlug.includes('avanzado')

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
