import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Users, CreditCard, Ticket, Search, Filter } from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import type {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
} from '../../hooks/useAdminDashboard'

import { useAdminDashboardFilters } from './admin/hooks/useAdminDashboardFilters'
import { AdminStatsCards } from './admin/AdminStatsCards'
import { AdminClientesTable } from './admin/AdminClientesTable'
import { AdminTicketsTable } from './admin/AdminTicketsTable'
import { AdminPagosTable } from './admin/AdminPagosTable'

interface AdminDashboardViewProps {
  clientes: AdminCliente[]
  suscripciones: AdminSuscripcion[]
  pagos: AdminPago[]
  tickets: AdminTicket[]
  stats: AdminStats
  onRefresh: () => void
  refreshing: boolean
}

export default function AdminDashboardView({
  clientes,
  suscripciones,
  pagos,
  tickets,
  stats,
  onRefresh,
}: AdminDashboardViewProps) {
  const {
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
  } = useAdminDashboardFilters(clientes, suscripciones, tickets)

  // Estado para resolver/responder ticket de forma interactiva
  const [editingTicket, setEditingTicket] = useState<AdminTicket | null>(null)
  const [resolutionText, setResolutionText] = useState('')
  const [updatingTicket, setUpdatingTicket] = useState(false)

  // Guardar resolución del ticket
  const handleResolveTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTicket) return
    setUpdatingTicket(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          estado: 'resuelto',
          respuesta_resolucion: resolutionText,
          fecha_cierre: new Date().toISOString(),
        })
        .eq('id', editingTicket.id)

      if (error) throw error

      setEditingTicket(null)
      setResolutionText('')
      onRefresh()
    } catch (err) {
      console.error('Error resolving ticket:', err)
      alert('Error al resolver el ticket')
    } finally {
      setUpdatingTicket(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Grid de Estadísticas Globales */}
      <AdminStatsCards stats={stats} />

      {/* Tabs de Navegación y Filtros */}
      <div className="border border-border bg-card rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
          {/* Selector de Tabs */}
          <div className="flex bg-muted p-1 rounded-2xl border border-border self-start">
            <button
              onClick={() => handleTabChange('clientes')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'clientes'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Users size={16} />
              Clientes ({clientes.length})
            </button>
            <button
              onClick={() => handleTabChange('tickets')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Ticket size={16} />
              Soporte ({tickets.length})
              {stats.ticketsAbiertos > 0 && (
                <span className="w-2 h-2 rounded-full bg-accent-magenta animate-pulse" />
              )}
            </button>
            <button
              onClick={() => handleTabChange('pagos')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'pagos'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <CreditCard size={16} />
              Pagos ({pagos.length})
            </button>
          </div>

          {/* Filtros Contextuales */}
          <div className="flex flex-wrap items-center gap-4 flex-1 lg:justify-end">
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder={
                  activeTab === 'clientes'
                    ? 'Buscar cliente por nombre, email...'
                    : activeTab === 'tickets'
                      ? 'Buscar ticket por asunto, mensaje...'
                      : 'Buscar pagos...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-accent-cyan focus:outline-none text-sm transition-colors"
              />
            </div>

            {activeTab === 'clientes' && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-muted border border-border text-foreground rounded-2xl px-4 py-3 text-sm focus:border-accent-cyan focus:outline-none"
                >
                  <option value="todos">Todos los Planes</option>
                  <option value="basico">Plan Básico</option>
                  <option value="avanzado">Plan Avanzado</option>
                  <option value="premium">Plan Premium</option>
                  <option value="sin_plan">Sin Plan Activo</option>
                </select>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-muted-foreground" />
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="bg-muted border border-border text-foreground rounded-2xl px-4 py-3 text-sm focus:border-accent-cyan focus:outline-none"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="abierto">Abiertos</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelto">Resueltos</option>
                  <option value="cerrado">Cerrados</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contenido Dinámico de las Pestañas */}
        <AnimatePresence mode="wait">
          {activeTab === 'clientes' && (
            <AdminClientesTable clientes={filteredClientes} suscripciones={suscripciones} />
          )}

          {activeTab === 'tickets' && (
            <AdminTicketsTable
              tickets={filteredTickets}
              clientes={clientes}
              editingTicket={editingTicket}
              resolutionText={resolutionText}
              updatingTicket={updatingTicket}
              setEditingTicket={setEditingTicket}
              setResolutionText={setResolutionText}
              handleResolveTicket={handleResolveTicket}
            />
          )}

          {activeTab === 'pagos' && <AdminPagosTable pagos={pagos} clientes={clientes} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
