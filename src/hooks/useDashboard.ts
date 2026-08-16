import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../core/infra/supabase/client'
import { SupabaseClienteRepository } from '../core/infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../core/infra/repositories/SupabaseSubscriptionRepository'
import { Cliente } from '../core/domain/entities/Cliente'
import { Suscripcion } from '../core/domain/entities/Suscripcion'
import { resolvePlanTier, type PlanTier } from '../components/dashboard/resolvePlanTier'
import { getErrorMessage, formatSupabaseErrorDetails } from '../core/utils/errorUtils'

export interface Pago {
  id: string
  monto: number
  moneda: string
  estado: string
  plan_nombre: string | null
  plan_slug: string | null
  created_at: string
}

const clienteRepo = new SupabaseClienteRepository()
const subscriptionRepo = new SupabaseSubscriptionRepository()

export function useDashboard(enabled = true) {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['client-dashboard'],
    enabled,
    staleTime: 1000 * 60 * 3, // 3 minutos de caché fresco
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error('[useDashboard] auth.getUser error:', formatSupabaseErrorDetails(authError))
        throw authError
      }

      if (!user || !user.email) {
        return { cliente: null, suscripciones: [], pagos: [] }
      }

      let clienteData: Cliente | null = null

      try {
        clienteData = await clienteRepo.getByAuthId(user.id)
      } catch (e: unknown) {
        console.error('[useDashboard] clienteRepo.getByAuthId error:', e)
        clienteData = null
      }

      if (!clienteData) {
        try {
          const { data: newCliente, error: insertError } = await supabase
            .from('clientes')
            .upsert(
              {
                id: user.id,
                full_name: user.user_metadata?.full_name ?? null,
                email: user.email,
              },
              { onConflict: 'id' }
            )
            .select('id, full_name, email')
            .single()
          if (!insertError) clienteData = newCliente as unknown as Cliente
        } catch (e: unknown) {
          console.error('[useDashboard] upsert clientes error (fallback):', e)
          clienteData = {
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            email: user.email,
          }
        }
      }

      let suscripcionesData: Suscripcion[] = []
      let pagosDataList: Pago[] = []

      if (clienteData) {
        try {
          suscripcionesData = await subscriptionRepo.getByClienteId(clienteData.id)
        } catch {
          suscripcionesData = []
        }

        try {
          const { data: rawPagos } = await supabase
            .from('pagos')
            .select('id, monto, moneda, estado, plan_nombre, plan_slug, created_at')
            .eq('cliente_id', clienteData.id)
            .order('created_at', { ascending: false })
            .limit(10)
          pagosDataList = (rawPagos as Pago[]) || []
        } catch {
          pagosDataList = []
        }
      }

      return {
        cliente: clienteData,
        suscripciones: suscripcionesData,
        pagos: pagosDataList,
      }
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
