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
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */

/** IDs de la tienda (/tienda) — misma fuente que StorePage */
export const STORE_PLAN_IDS = [
  'mantenimiento-basico',
  'mantenimiento-avanzado',
  'mantenimiento-premium',
]

export const PLAN_CATALOG = [
  {
    id: 'mantenimiento-basico',
    tier: 'basico',
    nombre: 'Abono Básico',
    precio: 32000,
    precioUSD: 28,
  },
  {
    id: 'mantenimiento-avanzado',
    tier: 'avanzado',
    nombre: 'Abono Avanzado',
    precio: 65000,
    precioUSD: 55,
  },
  {
    id: 'mantenimiento-premium',
    tier: 'premium',
    nombre: 'Abono Premium',
    precio: 195000,
    precioUSD: 140,
  },
]

export function tierFromStorePlanId(planId) {
  const entry = PLAN_CATALOG.find((p) => p.id === planId)
  return _nullishCoalesce(_optionalChain([entry, 'optionalAccess', (_) => _.tier]), () => 'none')
}

export function tierFromPlanLabel(label) {
  if (!label) return 'none'
  const n = label.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

  if (n.includes('premium') || n.includes('enterprise')) return 'premium'
  if (n.includes('avanzado') || n.includes('pro')) return 'avanzado'
  if (n.includes('basico')) return 'basico'

  const byNombre = PLAN_CATALOG.find((p) =>
    n.includes(p.nombre.toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''))
  )
  return _nullishCoalesce(
    _optionalChain([byNombre, 'optionalAccess', (_2) => _2.tier]),
    () => 'none'
  )
}

export function catalogEntryById(planId) {
  return PLAN_CATALOG.find((p) => p.id === planId)
}
