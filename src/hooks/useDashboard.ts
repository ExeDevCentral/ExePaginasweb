import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../core/infra/supabase/client'
import { SupabaseClienteRepository } from '../infra/repositories/SupabaseClienteRepository'
import { SupabaseSubscriptionRepository } from '../infra/repositories/SupabaseSubscriptionRepository'
import { Cliente } from '../core/domain/entities/Cliente'
import { Suscripcion } from '../core/domain/entities/Suscripcion'

const clienteRepo = new SupabaseClienteRepository()
const subscriptionRepo = new SupabaseSubscriptionRepository()

export function useDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([])

  const isPremium = useMemo(() => suscripciones.length > 0, [suscripciones.length])

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
        // tabla clientes no existe — usamos datos del auth user
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
          // si no se puede insertar, usamos auth user
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
          // tabla suscripciones no existe
          if (active) setSuscripciones([])
        }
      }
    } catch (e: any) {
      if (active) setError(e?.message ?? 'Error cargando dashboard')
    } finally {
      if (active) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    loadData(active)
    return () => { active = false }
  }, [loadData])

  return { loading, error, cliente, suscripciones, isPremium, refresh: () => loadData(true) }
}
