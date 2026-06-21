import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../core/infra/supabase/client'
import { SupabaseClienteRepository } from '../core/infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../core/infra/repositories/SupabaseSubscriptionRepository'
import { Cliente } from '../core/domain/entities/Cliente'
import { Suscripcion } from '../core/domain/entities/Suscripcion'
import { resolvePlanTier, type PlanTier } from '../components/dashboard/resolvePlanTier'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])

  const isPremium = useMemo(() => suscripciones.length > 0, [suscripciones.length])

  const planTier = useMemo<PlanTier>(
    () => resolvePlanTier(suscripciones, pagos[0]?.plan_nombre, pagos[0]?.plan_slug),
    [suscripciones, pagos]
  )

  const loadData = useCallback(async (active: boolean) => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error('[useDashboard] auth.getUser error:', {
          message: authError.message,
          code: (authError as any).code,
          details: (authError as any).details,
          hint: (authError as any).hint,
        })
        throw authError
      }

      if (!user || !user.email) {
        if (active) setLoading(false)
        return
      }

      let clienteData: Cliente | null = null

      try {
        clienteData = await clienteRepo.getByAuthId(user.id)
      } catch (e: unknown) {
        console.error('[useDashboard] clienteRepo.getByAuthId error:', e)
        clienteData = null
      }

      if (!active) return

      if (!clienteData) {
        try {
          const { data: newCliente, error: insertError } = await supabase
            .from('clientes')
            .insert({
              id: user.id,
              nombre: user.user_metadata?.full_name ?? null,
              email: user.email,
            })
            .select('id, nombre as full_name, email')
            .single()
          if (!insertError) clienteData = newCliente as Cliente
        } catch (e: unknown) {
          console.error('[useDashboard] insert clientes error (fallback will be used):', e)
          clienteData = {
            id: user.id,
            full_name: user.user_metadata?.full_name ?? null,
            email: user.email,
          }
        }
      }

      setCliente(clienteData)

      if (clienteData) {
        try {
          const subsData = await subscriptionRepo.getByClienteId(clienteData.id)
          if (active) setSuscripciones(subsData)
        } catch {
          if (active) setSuscripciones([])
        }

        try {
          const { data: pagosData } = await supabase
            .from('pagos')
            .select('id, monto, moneda, estado, plan_nombre, plan_slug, created_at')
            .eq('cliente_id', clienteData.id)
            .order('created_at', { ascending: false })
            .limit(10)
          if (active) setPagos((pagosData as Pago[]) || [])
        } catch {
          if (active) setPagos([])
        }
      }
    } catch (e: unknown) {
      console.error('[useDashboard] loadData fatal error:', e)
      if (active) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          const anyErr = e as any
          setError(
            anyErr?.message ||
              `Error cargando dashboard: ${JSON.stringify({ code: anyErr?.code, details: anyErr?.details, hint: anyErr?.hint })}`
          )
        }
      }
    } finally {
      if (active) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setLoading(true)
      return
    }
    let active = true
    loadData(active)
    return () => {
      active = false
    }
  }, [enabled, loadData])

  return {
    loading,
    error,
    cliente,
    suscripciones,
    pagos,
    isPremium,
    planTier,
    refresh: () => loadData(true),
  }
}
