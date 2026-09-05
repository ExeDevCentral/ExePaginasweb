import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../core/infra/supabase/client'
import { IClienteRepository } from '../core/domain/repositories/IClienteRepository'
import { ISubscriptionRepository } from '../core/domain/repositories/ISubscriptionRepository'
import { IClientePagoRepository } from '../core/domain/repositories/IClientePagoRepository'
import { SupabaseClienteRepository } from '../core/infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../core/infra/repositories/SupabaseSubscriptionRepository'
import { SupabaseClientePagoRepository } from '../core/infra/repositories/SupabaseClientePagoRepository'
import { Cliente } from '../core/domain/entities/Cliente'
import { Suscripcion } from '../core/domain/entities/Suscripcion'
import { Pago } from '../core/domain/entities/Pago'
import { resolvePlanTier, type PlanTier } from '../components/dashboard/resolvePlanTier'
import { getErrorMessage, formatSupabaseErrorDetails } from '../core/utils/errorUtils'

export type { Pago } from '../core/domain/entities/Pago'

export interface DashboardData {
  cliente: Cliente | null
  suscripciones: Suscripcion[]
  pagos: Pago[]
}

export interface DashboardDataDeps {
  clienteRepo: IClienteRepository
  subRepo: ISubscriptionRepository
  pagoRepo: IClientePagoRepository
}

export interface DashboardUser {
  id: string
  email?: string
  full_name?: string | null
}

export async function fetchDashboardData(
  deps: DashboardDataDeps,
  user: DashboardUser
): Promise<DashboardData> {
  if (!user || !user.email) {
    return { cliente: null, suscripciones: [], pagos: [] }
  }

  let clienteData: Cliente | null = null

  try {
    clienteData = await deps.clienteRepo.getByAuthId(user.id)
  } catch (e: unknown) {
    console.error('[useDashboard] clienteRepo.getByAuthId error:', e)
    clienteData = null
  }

  if (!clienteData) {
    try {
      clienteData = await deps.clienteRepo.ensureByAuthId(user.id, {
        full_name: user.full_name ?? null,
        email: user.email,
      })
    } catch (e: unknown) {
      console.error('[useDashboard] ensureByAuthId error (fallback):', e)
      clienteData = {
        id: user.id,
        full_name: user.full_name ?? null,
        email: user.email,
      }
    }
  }

  let suscripcionesData: Suscripcion[] = []
  let pagosDataList: Pago[] = []

  if (clienteData) {
    try {
      suscripcionesData = await deps.subRepo.getByClienteId(clienteData.id)
    } catch {
      suscripcionesData = []
    }

    try {
      pagosDataList = await deps.pagoRepo.listByClienteId(clienteData.id)
    } catch {
      pagosDataList = []
    }
  }

  return {
    cliente: clienteData,
    suscripciones: suscripcionesData,
    pagos: pagosDataList,
  }
}

export interface UseDashboardOptions {
  enabled?: boolean
  clienteRepo?: IClienteRepository
  subRepo?: ISubscriptionRepository
  pagoRepo?: IClientePagoRepository
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const {
    enabled = true,
    clienteRepo = new SupabaseClienteRepository(),
    subRepo = new SupabaseSubscriptionRepository(),
    pagoRepo = new SupabaseClientePagoRepository(),
  } = options
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client-dashboard'],
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
          id: user?.id ?? '',
          email: user?.email,
          full_name: user?.user_metadata?.full_name ?? null,
        }
      )
    },
  })

  const cliente = data?.cliente ?? null
  const suscripciones = useMemo(() => data?.suscripciones ?? [], [data?.suscripciones])
  const pagos = useMemo(() => data?.pagos ?? [], [data?.pagos])

  const isPremium = useMemo(() => suscripciones.length > 0, [suscripciones.length])

  const planTier = useMemo<PlanTier>(
    () => resolvePlanTier(suscripciones, pagos[0]?.plan_nombre, pagos[0]?.plan_slug),
    [suscripciones, pagos]
  )

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['client-dashboard'] })
    refetch()
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
