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
import { useCallback, useEffect, useState } from 'react'

import { priorityForTier } from '../core/domain/ticketConfig'

import { SupabaseTicketRepository } from '../core/infra/repositories/SupabaseTicketRepository'

const repo = new SupabaseTicketRepository()

export function useSupportTickets(enabled, cliente, planTier, planSlug) {
  const [tickets, setTickets] = useState([])
  const [notifications, setNotifications] = useState([])
  const [openCount, setOpenCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!enabled || !_optionalChain([cliente, 'optionalAccess', (_) => _.id])) {
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
  }, [enabled, _optionalChain([cliente, 'optionalAccess', (_2) => _2.id])])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const createTicket = async (asunto, mensaje, categoria) => {
    if (!_optionalChain([cliente, 'optionalAccess', (_3) => _3.id])) {
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

  const markRead = async (notificationId) => {
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
