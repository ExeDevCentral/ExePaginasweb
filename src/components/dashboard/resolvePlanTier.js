function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
}

import { tierFromPlanLabel, tierFromStorePlanId } from '../../core/domain/planCatalog'

/**
 * Determina el panel del cliente según su suscripción/pago activo.
 * Prioridad: slug del plan en BD → slug del último pago → nombre del plan.
 */
export function resolvePlanTier(suscripciones, planNombrePago, planSlugPago) {
  const active = suscripciones.find((s) => s.estado === 'activa')

  const slug = _nullishCoalesce(
    _optionalChain([active, 'optionalAccess', (_) => _.plan, 'optionalAccess', (_2) => _2.slug]),
    () => planSlugPago
  )
  if (slug) {
    const fromSlug = tierFromStorePlanId(slug)
    if (fromSlug !== 'none') return fromSlug
  }

  const fromNombre = tierFromPlanLabel(
    _nullishCoalesce(
      _optionalChain([
        active,
        'optionalAccess',
        (_3) => _3.plan,
        'optionalAccess',
        (_4) => _4.nombre,
      ]),
      () => planNombrePago
    )
  )
  if (fromNombre !== 'none') return fromNombre

  return tierFromPlanLabel(planNombrePago)
}
