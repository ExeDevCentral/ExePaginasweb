import { motion } from 'framer-motion'
import type { AdminTicket } from '../../../hooks/useAdminDashboard'

interface TicketResolutionModalProps {
  ticket: AdminTicket
  resolutionText: string
  updatingTicket: boolean
  onResolutionTextChange: (text: string) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function TicketResolutionModal({
  ticket,
  resolutionText,
  updatingTicket,
  onResolutionTextChange,
  onClose,
  onSubmit,
}: TicketResolutionModalProps) {
  return (
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
          <p className="text-foreground font-bold text-sm">{ticket.asunto}</p>
          <p className="text-muted-foreground text-xs truncate">{ticket.mensaje}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="ticket-resolution-text"
              className="text-xs font-bold text-muted-foreground"
            >
              Resolución para el Cliente
            </label>
            <textarea
              id="ticket-resolution-text"
              required
              rows={4}
              value={resolutionText}
              onChange={(e) => onResolutionTextChange(e.target.value)}
              placeholder="Escribe la respuesta o solución que verá el cliente en su panel..."
              className="w-full p-4 rounded-2xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-accent-magenta focus:outline-none text-sm transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              disabled={updatingTicket}
              onClick={onClose}
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
  )
}
