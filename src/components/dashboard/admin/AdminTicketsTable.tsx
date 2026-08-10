import { motion } from 'framer-motion'
import { Calendar, Check } from 'lucide-react'
import type { AdminTicket, AdminCliente } from '../../../hooks/useAdminDashboard'
import { TicketResolutionModal } from './TicketResolutionModal'

interface AdminTicketsTableProps {
  tickets: AdminTicket[]
  clientes: AdminCliente[]
  editingTicket: AdminTicket | null
  resolutionText: string
  updatingTicket: boolean
  setEditingTicket: (ticket: AdminTicket | null) => void
  setResolutionText: (text: string) => void
  handleResolveTicket: (e: React.FormEvent) => void
}

export function AdminTicketsTable({
  tickets,
  clientes,
  editingTicket,
  resolutionText,
  updatingTicket,
  setEditingTicket,
  setResolutionText,
  handleResolveTicket,
}: AdminTicketsTableProps) {
  const getClienteDetails = (clienteId: string) => {
    const found = clientes.find((c) => c.id === clienteId)
    return found
      ? { full_name: found.full_name ?? 'Sin nombre', email: found.email }
      : { full_name: 'Desconocido', email: 'N/A' }
  }

  return (
    <motion.div
      key="tickets-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {tickets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
          No hay tickets de soporte en este estado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((t) => {
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

      {editingTicket && (
        <TicketResolutionModal
          ticket={editingTicket}
          resolutionText={resolutionText}
          updatingTicket={updatingTicket}
          onResolutionTextChange={setResolutionText}
          onClose={() => setEditingTicket(null)}
          onSubmit={handleResolveTicket}
        />
      )}
    </motion.div>
  )
}
