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
import { supabase } from '../core/infra/supabase/client'

import { SupabaseClienteRepository } from '../core/infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../core/infra/repositories/SupabaseSubscriptionRepository'
import { SupabaseClientePagoRepository } from '../core/infra/repositories/SupabaseClientePagoRepository'

import { Pago } from '../core/domain/entities/Pago'
import { resolvePlanTier } from '../components/dashboard/resolvePlanTier'
import { getErrorMessage, formatSupabaseErrorDetails } from '../core/utils/errorUtils'

export async function fetchDashboardData(deps, user) {
  if (!user || !user.email) {
    return { cliente: null, suscripciones: [], pagos: [] }
  }

  let clienteData = null

  clienteData = await deps.clienteRepo.getByAuthId(user.id)

  if (!clienteData) {
    clienteData = await deps.clienteRepo.ensureByAuthId(user.id, {
      full_name: _nullishCoalesce(user.full_name, () => null),
      email: user.email,
    })
  }

  const [suscripcionesData, pagosDataList] = await Promise.all([
    deps.subRepo.getByClienteId(clienteData.id),
    deps.pagoRepo.listByClienteId(clienteData.id),
  ])

  return {
    cliente: clienteData,
    suscripciones: suscripcionesData,
    pagos: pagosDataList,
  }
}

const defaultClienteRepo = new SupabaseClienteRepository()
const defaultSubRepo = new SupabaseSubscriptionRepository()
const defaultPagoRepo = new SupabaseClientePagoRepository()

export function useDashboard(options = {}) {
  const {
    enabled = true,
    userId,
    clienteRepo = defaultClienteRepo,
    subRepo = defaultSubRepo,
    pagoRepo = defaultPagoRepo,
  } = options
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['client-dashboard', _nullishCoalesce(userId, () => null)],
    enabled,
    staleTime: 1000 * 60 * 3,
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error('[useDashboard] auth.getUser error:', formatSupabaseErrorDetails(authError))
        throw authError
      }

      return fetchDashboardData(
        { clienteRepo, subRepo, pagoRepo },
        {
          id: _nullishCoalesce(_optionalChain([user, 'optionalAccess', (_) => _.id]), () => ''),
          email: _optionalChain([user, 'optionalAccess', (_2) => _2.email]),
          full_name:
            typeof _optionalChain([
              user,
              'optionalAccess',
              (_3) => _3.user_metadata,
              'optionalAccess',
              (_4) => _4.full_name,
            ]) === 'string'
              ? user.user_metadata.full_name
              : null,
        }
      )
    },
  })

  const cliente = _nullishCoalesce(
    _optionalChain([data, 'optionalAccess', (_5) => _5.cliente]),
    () => null
  )
  const suscripciones = useMemo(
    () =>
      _nullishCoalesce(
        _optionalChain([data, 'optionalAccess', (_6) => _6.suscripciones]),
        () => []
      ),
    [_optionalChain([data, 'optionalAccess', (_7) => _7.suscripciones])]
  )
  const activeSuscripciones = useMemo(
    () => suscripciones.filter((subscription) => subscription.estado === 'activa'),
    [suscripciones]
  )
  const pagos = useMemo(
    () => _nullishCoalesce(_optionalChain([data, 'optionalAccess', (_8) => _8.pagos]), () => []),
    [_optionalChain([data, 'optionalAccess', (_9) => _9.pagos])]
  )

  const isPremium = activeSuscripciones.length > 0

  const planTier = useMemo(
    () =>
      resolvePlanTier(
        activeSuscripciones,
        _optionalChain([
          pagos,
          'access',
          (_10) => _10[0],
          'optionalAccess',
          (_11) => _11.plan_nombre,
        ]),
        _optionalChain([pagos, 'access', (_12) => _12[0], 'optionalAccess', (_13) => _13.plan_slug])
      ),
    [activeSuscripciones, pagos]
  )

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: ['client-dashboard', _nullishCoalesce(userId, () => null)],
    })
  }

  return {
    loading: isLoading,
    error: error ? getErrorMessage(error, 'Error al cargar los datos del panel') : null,
    cliente,
    suscripciones,
    pagos,
    isPremium,
    planTier,
    refresh: handleRefresh,
  }
}
