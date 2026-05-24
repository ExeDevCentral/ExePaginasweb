import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../core/infra/supabase/client'
import { SupabaseClienteRepository } from '../infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../infra/repositories/SupabaseSubscriptionRepository'
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

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user || !user.email) {
        if (active) setLoading(false)
        return
      }

      let clienteData: Cliente | null = null

      try {
        clienteData = await clienteRepo.getByEmail(user.email)
      } catch {
        clienteData = {
          id: user.id,
          nombre: user.user_metadata?.full_name ?? null,
          email: user.email,
          telefono: null,
        }
      }

      if (!active) return

      if (!clienteData) {
        try {
          const { data: newCliente, error: insertError } = await supabase
            .from('clientes')
            .insert({ nombre: user.user_metadata?.full_name ?? null, email: user.email, telefono: null })
            .select('id, nombre, email, telefono')
            .single()
          if (!insertError) clienteData = newCliente as Cliente
        } catch {
          clienteData = {
            id: user.id,
            nombre: user.user_metadata?.full_name ?? null,
            email: user.email,
            telefono: null,
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
          if (active) setPagos(pagosData as Pago[] || [])
        } catch {
          if (active) setPagos([])
        }
      }
    } catch (e: any) {
      if (active) setError(e?.message ?? 'Error cargando dashboard')
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
    return () => { active = false }
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
