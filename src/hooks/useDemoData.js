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
;('use client')

import { useSearchParams } from 'next/navigation'

import { isLocalDashboardPreview } from '../core/auth/siteUrl'

const VALID_TIERS = ['basico', 'avanzado', 'premium']

export const DEMO_TENANT = {
  id: 'demo-tenant-1',
  nombre: 'Workspace ExeSistemasWEB',
  slug: 'exesistemasweb-ws',
}

const DEMO_CLIENTE = {
  id: 'demo-user-1',
  full_name: 'John Carter',
  email: 'john.carter@dashdark.io',
}

const DEMO_SUSCRIPCIONES = [
  {
    id: 'demo-sub',
    cliente_id: 'demo-user-1',
    plan_slug: 'avanzado',
    plan_id: 'plan-avanzado',
    estado: 'activa',
    fecha_inicio: '2025-01-15T00:00:00Z',
    plan: {
      slug: 'avanzado',
      nombre: 'Plan Avanzado',
      precio: 144.6,
    },
  },
]

const DEMO_PAGOS = [
  {
    id: 'demo-pago-1',
    monto: 144.6,
    moneda: 'USD',
    estado: 'aprobado',
    plan_nombre: 'Plan Avanzado',
    plan_slug: 'avanzado',
    created_at: '2025-02-01T00:00:00Z',
  },
]

export function useDemoData(options = {}) {
  const searchParams = useSearchParams()
  const isPreview = isLocalDashboardPreview(searchParams)

  const effectiveCliente = isPreview ? DEMO_CLIENTE : _nullishCoalesce(options.cliente, () => null)
  const tierParam = searchParams.get('tier')
  const effectiveTier = isPreview
    ? VALID_TIERS.includes(tierParam)
      ? tierParam
      : 'avanzado'
    : _nullishCoalesce(options.planTier, () => null)

  const currentTenant = isPreview
    ? DEMO_TENANT
    : _nullishCoalesce(options.currentTenant, () => null)
  const effectiveTenantId = _nullishCoalesce(
    _optionalChain([currentTenant, 'optionalAccess', (_) => _.id]),
    () => DEMO_TENANT.id
  )

  return {
    isPreview,
    effectiveCliente,
    effectiveTier,
    effectiveSuscripciones: isPreview
      ? DEMO_SUSCRIPCIONES
      : _nullishCoalesce(options.suscripciones, () => []),
    effectivePagos: isPreview ? DEMO_PAGOS : _nullishCoalesce(options.pagos, () => []),
    effectiveTenantId,
    currentTenant,
  }
}
