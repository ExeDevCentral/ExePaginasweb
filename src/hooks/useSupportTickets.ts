import { useCallback, useEffect, useState } from 'react'
import type { Cliente } from '../core/domain/entities/Cliente'
import type { Notificacion, Ticket } from '../core/domain/entities/Ticket'
import { priorityForTier } from '../core/domain/ticketConfig'
import type { PlanTier } from '../core/domain/planCatalog'
import { SupabaseTicketRepository } from '../core/infra/repositories/SupabaseTicketRepository'

const repo = new SupabaseTicketRepository()

export function useSupportTickets(
  enabled: boolean,
  cliente: Cliente | null,
  planTier: PlanTier,
  planSlug: string | null
) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [notifications, setNotifications] = useState<Notificacion[]>([])
  const [openCount, setOpenCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!enabled || !cliente?.id) {
      setLoading(false)
      return
    }
    try {
      setError(null)
      const [list, open, notifs] = await Promise.all([
        repo.listByClienteId(cliente.id),
        repo.countOpenByClienteId(cliente.id),
        repo.listNotifications(cliente.id),
      ])
      setTickets(list)
      setOpenCount(open)
      setNotifications(notifs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los tickets')
    } finally {
      setLoading(false)
    }
  }, [enabled, cliente?.id])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const createTicket = async (asunto: string, mensaje: string, categoria: string) => {
    if (!cliente?.id) {
      throw new Error('Perfil de cliente no encontrado. Volvé a iniciar sesión.')
    }
    setSubmitting(true)
    setError(null)
    try {
      const prioridad = planTier === 'none' ? 'baja' : priorityForTier(planTier)
      const ticket = await repo.create({
        clienteId: cliente.id,
        asunto,
        mensaje,
        categoria,
        prioridad,
        planSlug,
      })
      await repo.createNotificationForTicket(cliente.id, ticket)
      await load()
      return ticket
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear el ticket'
      setError(msg)
      throw e
    } finally {
      setSubmitting(false)
    }
  }

  const markRead = async (notificationId: string) => {
    await repo.markNotificationRead(notificationId)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, leida: true } : n))
    )
  }

  return {
    tickets,
    notifications,
    openCount,
    loading,
    submitting,
    error,
    createTicket,
    refresh: load,
    markRead,
  }
}
