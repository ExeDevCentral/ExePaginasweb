import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../core/infra/supabase/client'

export interface AdminCliente {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  created_at: string
}

export interface AdminSuscripcion {
  id: string
  cliente_id: string
  plan_slug: string
  estado: string
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
}

export interface AdminPago {
  id: string
  cliente_id: string
  monto: number
  moneda: string
  estado: string
  plan_nombre: string | null
  plan_slug: string | null
  metodo_pago: string | null
  created_at: string
}

export interface AdminTicket {
  id: string
  cliente_id: string
  asunto: string
  mensaje: string
  categoria: string
  prioridad: string
  estado: string
  respuesta_resolucion?: string | null
  fecha_cierre?: string | null
  created_at: string
  updated_at: string
}

export interface AdminStats {
  totalClientes: number
  planBasico: number
  planAvanzado: number
  planPremium: number
  sinPlan: number
  ticketsAbiertos: number
  ingresosTotalesARS: number
  ingresosTotalesUSD: number
}

const DEFAULT_STATS: AdminStats = {
  totalClientes: 0,
  planBasico: 0,
  planAvanzado: 0,
  planPremium: 0,
  sinPlan: 0,
  ticketsAbiertos: 0,
  ingresosTotalesARS: 0,
  ingresosTotalesUSD: 0,
}

export function useAdminDashboard(enabled = true) {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos de caché fresco
    queryFn: async () => {
      const [clientesRes, suscripcionesRes, pagosRes, ticketsRes] = await Promise.all([
        supabase
          .from('clientes')
          .select('id, full_name, email, avatar_url, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('suscripciones').select('*').order('created_at', { ascending: false }),
        supabase.from('pagos').select('*').order('created_at', { ascending: false }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      ])

      if (clientesRes.error) throw clientesRes.error
      if (suscripcionesRes.error) throw suscripcionesRes.error
      if (pagosRes.error) throw pagosRes.error
      if (ticketsRes.error) throw ticketsRes.error

      const clientList = (clientesRes.data || []) as unknown as AdminCliente[]
      const subList = (suscripcionesRes.data || []) as AdminSuscripcion[]
      const paymentList = (pagosRes.data || []) as AdminPago[]
      const ticketList = (ticketsRes.data || []) as AdminTicket[]

      // Calcular Estadísticas
      const totalClientes = clientList.length
      const ticketsAbiertos = ticketList.filter(
        (t) => t.estado === 'abierto' || t.estado === 'en_progreso'
      ).length

      const pagosAprobados = paymentList.filter(
        (p) => p.estado === 'approved' || p.estado === 'aprobado'
      )
      const ingresosTotalesARS = pagosAprobados
        .filter((p) => p.moneda === 'ARS')
        .reduce((sum, p) => sum + Number(p.monto), 0)
      const ingresosTotalesUSD = pagosAprobados
        .filter((p) => p.moneda === 'USD')
        .reduce((sum, p) => sum + Number(p.monto), 0)

      let planBasico = 0
      let planAvanzado = 0
      let planPremium = 0
      let sinPlan = 0

      clientList.forEach((c) => {
        const clienteSubs = subList.filter((s) => s.cliente_id === c.id && s.estado === 'activa')
        if (clienteSubs.length === 0) {
          sinPlan++
        } else {
          const activeSub = clienteSubs[0]
          const slug = activeSub.plan_slug || ''
          if (slug.includes('premium')) {
            planPremium++
          } else if (slug.includes('avanzado') || slug.includes('pro')) {
            planAvanzado++
          } else {
            planBasico++
          }
        }
      })

      const calculatedStats: AdminStats = {
        totalClientes,
        planBasico,
        planAvanzado,
        planPremium,
        sinPlan,
        ticketsAbiertos,
        ingresosTotalesARS,
        ingresosTotalesUSD,
      }

      return {
        clientes: clientList,
        suscripciones: subList,
        pagos: paymentList,
        tickets: ticketList,
        stats: calculatedStats,
      }
    },
  })

  const clientes = useMemo(() => data?.clientes ?? [], [data?.clientes])
  const suscripciones = useMemo(() => data?.suscripciones ?? [], [data?.suscripciones])
  const pagos = useMemo(() => data?.pagos ?? [], [data?.pagos])
  const tickets = useMemo(() => data?.tickets ?? [], [data?.tickets])
  const stats = data?.stats ?? DEFAULT_STATS

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    refetch()
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
