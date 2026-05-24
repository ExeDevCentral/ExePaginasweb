import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { X, Send, LifeBuoy, CheckCircle2 } from 'lucide-react'
import type { PlanTier } from '../../core/domain/planCatalog'
import { TICKET_CATEGORIES, SLA_BY_TIER } from '../../core/domain/ticketConfig'
import type { Ticket } from '../../core/domain/entities/Ticket'
import type { PlanDashboardTheme } from './planDashboardConfig'

type SupportTicketPanelProps = {
  open: boolean
  onClose: () => void
  theme: PlanDashboardTheme
  tier: PlanTier
  tickets: Ticket[]
  openCount: number
  submitting: boolean
  error: string | null
  onSubmit: (asunto: string, mensaje: string, categoria: string) => Promise<void>
}

const ESTADO_LABEL: Record<string, string> = {
  abierto: 'Abierto',
  en_progreso: 'En progreso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
}

export default function SupportTicketPanel({
  open,
  onClose,
  theme,
  tier,
  tickets,
  openCount,
  submitting,
  error,
  onSubmit,
}: SupportTicketPanelProps) {
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [categoria, setCategoria] = useState('')
  const [success, setSuccess] = useState(false)

  const categories =
    tier !== 'none' ? TICKET_CATEGORIES[tier] : TICKET_CATEGORIES.basico
  const sla = tier !== 'none' ? SLA_BY_TIER[tier] : SLA_BY_TIER.basico

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asunto.trim() || !mensaje.trim() || !categoria) return
    await onSubmit(asunto.trim(), mensaje.trim(), categoria)
    setSuccess(true)
    setAsunto('')
    setMensaje('')
    setCategoria('')
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-panel-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className={`relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border ${theme.border} bg-[#08080c] shadow-2xl`}
          >
            <div className={`sticky top-0 z-10 border-b ${theme.border} bg-[#08080c]/95 backdrop-blur-xl px-6 py-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl border ${theme.border} ${theme.glow} flex items-center justify-center`}>
                    <LifeBuoy className={`w-5 h-5 ${theme.accent}`} />
                  </div>
                  <div>
                    <h2 id="ticket-panel-title" className="text-lg font-black text-white">
                      Centro de soporte
                    </h2>
                    <p className="text-xs text-white/50">{sla}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 p-2 text-white/60 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
              {openCount > 0 && (
                <p className="mt-3 text-xs font-bold text-amber-400">
                  Tenés {openCount} ticket{openCount > 1 ? 's' : ''} abierto{openCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="p-6 space-y-6">
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 font-semibold"
                >
                  <CheckCircle2 size={18} />
                  Ticket enviado. Te avisamos en el panel.
                </motion.div>
              )}

              {error && (
                <p className="text-sm font-bold text-accent-magenta bg-accent-magenta/10 border border-accent-magenta/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/45" htmlFor="ticket-cat">
                    Tipo de consulta
                  </label>
                  <select
                    id="ticket-cat"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm focus:border-accent-cyan/50 focus:outline-none"
                  >
                    <option value="" className="bg-[#0a0a0c]">
                      Elegí una categoría
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0a0a0c]">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/45" htmlFor="ticket-asunto">
                    Asunto
                  </label>
                  <input
                    id="ticket-asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="Ej: El formulario no envía emails"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder:text-white/30 focus:border-accent-cyan/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-white/45" htmlFor="ticket-msg">
                    Detalle
                  </label>
                  <textarea
                    id="ticket-msg"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                    rows={4}
                    maxLength={2000}
                    placeholder="Contanos qué necesitás o qué falló..."
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white text-sm placeholder:text-white/30 focus:border-accent-cyan/50 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-[#050508] bg-gradient-to-r from-accent-cyan to-accent-magenta disabled:opacity-50`}
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-[#050508]/30 border-t-[#050508] rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar ticket
                    </>
                  )}
                </button>
              </form>

              {tickets.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Tus tickets</p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {tickets.map((t) => (
                      <li
                        key={t.id}
                        className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-semibold text-white truncate">{t.asunto}</p>
                          <span className="shrink-0 text-[10px] font-bold uppercase text-white/40">
                            {ESTADO_LABEL[t.estado] ?? t.estado}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/35 mt-1 font-mono">
                          {new Date(t.created_at).toLocaleString('es-AR')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
