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
import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { SupabaseAdminDashboardRepository } from '../core/infra/repositories/SupabaseAdminDashboardRepository'
import { computeAdminStats } from '../core/domain/financial/computeAdminStats'
import {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
  DEFAULT_ADMIN_STATS,
} from '../core/domain/entities/AdminDashboard'

export async function fetchAdminDashboard(repo) {
  const overview = await repo.getAdminOverview()
  const stats = computeAdminStats(
    overview.clientes,
    overview.suscripciones,
    overview.pagos,
    overview.tickets
  )
  return { ...overview, stats }
}

const defaultAdminDashboardRepo = new SupabaseAdminDashboardRepository()

export function useAdminDashboard(options = {}) {
  const { enabled = true, userId, repo = defaultAdminDashboardRepo } = options
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard', _nullishCoalesce(userId, () => null)],
    enabled,
    staleTime: 1000 * 60 * 2,
    queryFn: () => fetchAdminDashboard(repo),
  })

  const clientes = useMemo(
    () => _nullishCoalesce(_optionalChain([data, 'optionalAccess', (_) => _.clientes]), () => []),
    [_optionalChain([data, 'optionalAccess', (_2) => _2.clientes])]
  )
  const suscripciones = useMemo(
    () =>
      _nullishCoalesce(
        _optionalChain([data, 'optionalAccess', (_3) => _3.suscripciones]),
        () => []
      ),
    [_optionalChain([data, 'optionalAccess', (_4) => _4.suscripciones])]
  )
  const pagos = useMemo(
    () => _nullishCoalesce(_optionalChain([data, 'optionalAccess', (_5) => _5.pagos]), () => []),
    [_optionalChain([data, 'optionalAccess', (_6) => _6.pagos])]
  )
  const tickets = useMemo(
    () => _nullishCoalesce(_optionalChain([data, 'optionalAccess', (_7) => _7.tickets]), () => []),
    [_optionalChain([data, 'optionalAccess', (_8) => _8.tickets])]
  )
  const stats = _nullishCoalesce(
    _optionalChain([data, 'optionalAccess', (_9) => _9.stats]),
    () => DEFAULT_ADMIN_STATS
  )

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: ['admin-dashboard', _nullishCoalesce(userId, () => null)],
    })
  }

  return {
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : 'Error cargando datos de administrador'
      : null,
    clientes,
    suscripciones,
    pagos,
    tickets,
    stats,
    refresh: handleRefresh,
  }
}
