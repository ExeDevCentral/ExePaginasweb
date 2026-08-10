import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import {
  tierFromPlanLabel,
  tierFromStorePlanId,
  type PlanTier,
} from '../../core/domain/planCatalog'

export type { PlanTier }

/**
 * Determina el panel del cliente según su suscripción/pago activo.
 * Prioridad: slug del plan en BD → slug del último pago → nombre del plan.
 */
export function resolvePlanTier(
  suscripciones: Suscripcion[],
  planNombrePago?: string | null,
  planSlugPago?: string | null
): PlanTier {
  const active = suscripciones.find((s) => s.estado !== 'cancelada') ?? suscripciones[0]

  const slug = active?.plan?.slug ?? planSlugPago
  if (slug) {
    const fromSlug = tierFromStorePlanId(slug)
    if (fromSlug !== 'none') return fromSlug
  }

  const fromNombre = tierFromPlanLabel(active?.plan?.nombre ?? planNombrePago)
  if (fromNombre !== 'none') return fromNombre

  return tierFromPlanLabel(planNombrePago)
}
