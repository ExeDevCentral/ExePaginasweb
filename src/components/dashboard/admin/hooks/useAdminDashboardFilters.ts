import { useState, useMemo } from 'react'
import type {
  AdminCliente,
  AdminSuscripcion,
  AdminTicket,
} from '../../../../hooks/useAdminDashboard'

export function useAdminDashboardFilters(
  clientes: AdminCliente[],
  suscripciones: AdminSuscripcion[],
  tickets: AdminTicket[]
) {
  const [activeTab, setActiveTab] = useState<'clientes' | 'tickets' | 'pagos'>('clientes')
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('todos')
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('todos')

  // Filtrado de clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      const matchSearch =
        (c.full_name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchSearch) return false

      if (planFilter === 'todos') return true

      const activeSubs = suscripciones.filter((s) => s.cliente_id === c.id && s.estado === 'activa')
      const hasPlan = activeSubs.length > 0
      const primaryPlan = hasPlan ? activeSubs[0].plan_slug : 'none'

      if (planFilter === 'sin_plan') return !hasPlan
      if (planFilter === 'basico') return primaryPlan.includes('basico')
      if (planFilter === 'avanzado')
        return primaryPlan.includes('avanzado') || primaryPlan.includes('pro')
      if (planFilter === 'premium') return primaryPlan.includes('premium')

      return true
    })
  }, [clientes, suscripciones, searchQuery, planFilter])

  // Filtrado de tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.asunto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.mensaje.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchSearch) return false

      if (ticketStatusFilter === 'todos') return true
      return t.estado === ticketStatusFilter
    })
  }, [tickets, searchQuery, ticketStatusFilter])

  const handleTabChange = (tab: 'clientes' | 'tickets' | 'pagos') => {
    setActiveTab(tab)
    setSearchQuery('')
  }

  return {
    activeTab,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    ticketStatusFilter,
    setTicketStatusFilter,
    filteredClientes,
    filteredTickets,
    handleTabChange,
  }
}
