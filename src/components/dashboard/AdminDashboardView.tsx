import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  CreditCard,
  Ticket,
  TrendingUp,
  Search,
  Calendar,
  DollarSign,
  Check,
  Filter,
} from 'lucide-react'
import { supabase } from '../../core/infra/supabase/client'
import type {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
} from '../../hooks/useAdminDashboard'

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
  const [activeTab, setActiveTab] = useState<'clientes' | 'tickets' | 'pagos'>('clientes')
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('todos')
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('todos')

  // Estado para resolver/responder ticket de forma interactiva
  const [editingTicket, setEditingTicket] = useState<AdminTicket | null>(null)
  const [resolutionText, setResolutionText] = useState('')
  const [updatingTicket, setUpdatingTicket] = useState(false)

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

  // Buscar cliente por ID para mostrar en tickets y pagos
  const getClienteDetails = (clienteId: string) => {
    const found = clientes.find((c) => c.id === clienteId)
    return found
      ? { full_name: found.full_name ?? 'Sin nombre', email: found.email }
      : { nombre: 'Desconocido', email: 'N/A' }
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-accent-cyan/30 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Total Clientes
              </p>
              <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
                {stats.totalClientes}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-accent-cyan mt-4 font-mono">
            {stats.sinPlan} sin plan activo · {stats.totalClientes - stats.sinPlan} activos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-yellow-500/30 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Abonos Activos
              </p>
              <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
                {stats.planBasico + stats.planAvanzado + stats.planPremium}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono flex gap-2">
            <span className="text-blue-400">B: {stats.planBasico}</span>
            <span className="text-emerald-400">A: {stats.planAvanzado}</span>
            <span className="text-accent-magenta">P: {stats.planPremium}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-accent-magenta/30 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Soporte Pendiente
              </p>
              <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
                {stats.ticketsAbiertos}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-magenta/10 border border-accent-magenta/20 flex items-center justify-center text-accent-magenta group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-accent-magenta mt-4 font-mono">
            {stats.ticketsAbiertos > 0 ? '⚠️ Requiere atención inmediata' : '✅ Soporte al día'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Ingresos Aprobados
              </p>
              <h3 className="text-xl font-bold text-foreground mt-2 font-montserrat">
                ${stats.ingresosTotalesARS.toLocaleString('es-AR')}{' '}
                <span className="text-[10px] text-muted-foreground">ARS</span>
              </h3>
              <h3 className="text-lg font-bold text-foreground/80 font-montserrat">
                ${stats.ingresosTotalesUSD.toLocaleString('en-US')}{' '}
                <span className="text-[10px] text-muted-foreground">USD</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-mono">Total acumulado histórico</p>
        </motion.div>
      </div>

      {/* Tabs de Navegación y Filtros */}
      <div className="border border-border bg-card rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
          {/* Selector de Tabs */}
          <div className="flex bg-muted p-1 rounded-2xl border border-border self-start">
            <button
              onClick={() => {
                setActiveTab('clientes')
                setSearchQuery('')
              }}
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
              onClick={() => {
                setActiveTab('tickets')
                setSearchQuery('')
              }}
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
              onClick={() => {
                setActiveTab('pagos')
                setSearchQuery('')
              }}
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
            <motion.div
              key="clientes-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Contacto</th>
                      <th className="px-6 py-3">Suscripción Activa</th>
                      <th className="px-6 py-3">Registrado el</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-muted-foreground font-medium"
                        >
                          No se encontraron clientes que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredClientes.map((c) => {
                        // Obtener suscripción activa
                        const activeSubs = suscripciones.filter(
                          (s) => s.cliente_id === c.id && s.estado === 'activa'
                        )
                        const hasPlan = activeSubs.length > 0
                        const currentSlug = hasPlan ? activeSubs[0].plan_slug : 'ninguno'

                        return (
                          <tr
                            key={c.id}
                            className="bg-card hover:bg-muted transition-colors rounded-2xl group"
                          >
                            <td className="px-6 py-4 rounded-l-2xl border-l border-y border-border">
                              <div className="flex items-center gap-4">
                                {c.avatar_url ? (
                                  <img
                                    src={c.avatar_url}
                                    alt={c.full_name ?? ''}
                                    className="w-10 h-10 rounded-xl object-cover border border-border"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-magenta flex items-center justify-center font-bold text-primary-bg">
                                    {(c.full_name ?? c.email).charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-foreground font-bold text-sm">
                                    {c.full_name || 'Nuevo Usuario'}
                                  </h4>
                                  <p className="text-muted-foreground text-xs font-mono select-all">
                                    {c.id.substring(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 border-y border-border">
                              <p className="text-foreground/80 text-sm select-all">{c.email}</p>
                            </td>
                            <td className="px-6 py-4 border-y border-border">
                              {hasPlan ? (
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                    currentSlug.includes('premium')
                                      ? 'bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20'
                                      : currentSlug.includes('avanzado')
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
                                  }`}
                                >
                                  {currentSlug.replace('mantenimiento-', '')}
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                                  Sin abono
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 rounded-r-2xl border-r border-y border-border text-muted-foreground text-sm font-mono">
                              {new Date(c.created_at).toLocaleDateString('es-AR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div
              key="tickets-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
                  No hay tickets de soporte en este estado.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTickets.map((t) => {
                    const client = getClienteDetails(t.cliente_id)
                    const isClosed = t.estado === 'resuelto' || t.estado === 'cerrado'

                    return (
                      <div
                        key={t.id}
                        className={`p-6 rounded-2xl border transition-colors flex flex-col md:flex-row justify-between gap-6 ${
                          isClosed
                            ? 'bg-card/50 border-border'
                            : 'bg-card border-border hover:border-accent-magenta/30'
                        }`}
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                t.prioridad === 'urgente' || t.prioridad === 'alta'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : t.prioridad === 'normal'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-muted text-muted-foreground border border-border'
                              }`}
                            >
                              {t.prioridad}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                t.estado === 'abierto'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : t.estado === 'en_progreso'
                                    ? 'bg-blue-400/20 text-blue-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {t.estado.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Categoría: {t.categoria}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-foreground font-bold text-base">{t.asunto}</h4>
                            <p className="text-foreground/70 text-sm mt-1 whitespace-pre-wrap font-sans">
                              {t.mensaje}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
                            <span>
                              De:{' '}
                              <strong className="text-foreground/60 hover:text-foreground transition-colors select-all">
                                {client.full_name} ({client.email})
                              </strong>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar size={12} />
                              {new Date(t.created_at).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {t.respuesta_resolucion && (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs">
                              <p className="font-bold flex items-center gap-1 mb-1">
                                <Check size={14} /> Resolución (
                                {new Date(t.fecha_cierre || '').toLocaleDateString('es-AR')}):
                              </p>
                              <p className="text-foreground/70 font-sans italic">
                                {t.respuesta_resolucion}
                              </p>
                            </div>
                          )}
                        </div>

                        {!isClosed && (
                          <div className="self-center flex md:flex-col justify-end">
                            <button
                              onClick={() => {
                                setEditingTicket(t)
                                setResolutionText(t.respuesta_resolucion || '')
                              }}
                              className="px-4 py-2 rounded-xl bg-accent-magenta text-foreground text-xs font-bold hover:bg-accent-magenta/80 transition-colors shadow-lg shadow-accent-magenta/20"
                            >
                              Responder y Cerrar
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Modal de Resolución de Ticket */}
              {editingTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-lg w-full rounded-3xl border border-border bg-primary-bg p-6 space-y-6 shadow-2xl"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Resolver Ticket</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Responderás al ticket y se marcará automáticamente como "resuelto".
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted border border-border space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                        Ticket
                      </p>
                      <p className="text-foreground font-bold text-sm">{editingTicket.asunto}</p>
                      <p className="text-muted-foreground text-xs truncate">
                        {editingTicket.mensaje}
                      </p>
                    </div>

                    <form onSubmit={handleResolveTicket} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground">
                          Resolución para el Cliente
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          placeholder="Escribe la respuesta o solución que verá el cliente en su panel..."
                          className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-accent-magenta focus:outline-none text-sm transition-colors resize-none"
                        />
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          type="button"
                          disabled={updatingTicket}
                          onClick={() => setEditingTicket(null)}
                          className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-xs font-bold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={updatingTicket || !resolutionText.trim()}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-primary-bg font-bold hover:bg-emerald-400 transition-all text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                        >
                          {updatingTicket ? 'Guardando...' : 'Completar Resolución'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pagos' && (
            <motion.div
              key="pagos-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold">
                      <th className="px-6 py-3">ID Pago</th>
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Plan / Detalle</th>
                      <th className="px-6 py-3">Monto</th>
                      <th className="px-6 py-3">Método</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-12 text-muted-foreground font-medium"
                        >
                          No se han registrado pagos en el sistema.
                        </td>
                      </tr>
                    ) : (
                      pagos.map((p) => {
                        const client = getClienteDetails(p.cliente_id)
                        const isApproved = p.estado === 'approved' || p.estado === 'aprobado'

                        return (
                          <tr
                            key={p.id}
                            className="bg-card hover:bg-muted transition-colors rounded-2xl"
                          >
                            <td className="px-6 py-4 rounded-l-2xl border-l border-y border-border text-xs font-mono text-muted-foreground select-all">
                              {p.id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 border-y border-border">
                              <h4 className="text-foreground font-bold text-sm">
                                {client.full_name}
                              </h4>
                              <p className="text-muted-foreground text-xs select-all">
                                {client.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 border-y border-border">
                              <p className="text-foreground font-semibold text-sm">
                                {p.plan_nombre || 'Servicio personalizado'}
                              </p>
                              <p className="text-muted-foreground text-xs font-mono">
                                {p.plan_slug || 'n/a'}
                              </p>
                            </td>
                            <td className="px-6 py-4 border-y border-border font-bold text-sm text-foreground">
                              ${Number(p.monto).toLocaleString('es-AR')} {p.moneda}
                            </td>
                            <td className="px-6 py-4 border-y border-border text-xs text-muted-foreground font-mono">
                              {p.metodo_pago || 'n/a'}
                            </td>
                            <td className="px-6 py-4 border-y border-border">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                  isApproved
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : p.estado === 'pendiente' || p.estado === 'pending'
                                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}
                              >
                                {p.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 rounded-r-2xl border-r border-y border-border text-muted-foreground text-xs font-mono">
                              {new Date(p.created_at).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
