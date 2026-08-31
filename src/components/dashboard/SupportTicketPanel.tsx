'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { X, LifeBuoy, CheckCircle2 } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { Send as SendData, CheckCircle2 as CheckCircle2Data } from 'lucide'
import { useTranslation } from 'react-i18next'
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
  theme: _theme,
  tier,
  tickets,
  openCount,
  submitting,
  error,
  onSubmit,
}: Readonly<SupportTicketPanelProps>) {
  const { t } = useTranslation()
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [categoria, setCategoria] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = tier !== 'none' ? TICKET_CATEGORIES[tier] : TICKET_CATEGORIES.basico
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
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
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
            className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[#1E2638] bg-[#111622] text-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 border-b border-[#1E2638] bg-[#0D111A] px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[#1E2638] bg-[#151B28] flex items-center justify-center">
                    <LifeBuoy className="w-5 h-5 text-[#38BDF8]" />
                  </div>
                  <div>
                    <h2
                      id="ticket-panel-title"
                      className="text-base sm:text-lg font-bold text-white"
                    >
                      {t('tickets.titulo', 'Soporte y Tickets')}
                    </h2>
                    <p className="text-xs text-[#8C9BB0] font-medium">{sla}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#1E2638] bg-[#151B28] p-1.5 text-[#8C9BB0] hover:text-white hover:bg-[#1C2438] transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
              {openCount > 0 && (
                <p className="mt-2.5 text-xs font-bold text-amber-400">
                  Tenés {openCount} ticket{openCount > 1 ? 's' : ''} abierto
                  {openCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="p-6 space-y-5">
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
                <p className="text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]"
                    htmlFor="ticket-cat"
                  >
                    Tipo de consulta
                  </label>
                  <select
                    id="ticket-cat"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#1E2638] bg-[#151B28] px-3.5 py-2.5 text-white text-xs sm:text-sm focus:border-[#4361EE] focus:outline-none"
                  >
                    <option value="" className="bg-[#151B28] text-white">
                      Elegí una categoría
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#151B28] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]"
                    htmlFor="ticket-asunto"
                  >
                    Asunto
                  </label>
                  <input
                    id="ticket-asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="Ej: El formulario no envía emails"
                    className="mt-1.5 w-full rounded-xl border border-[#1E2638] bg-[#151B28] px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]"
                    htmlFor="ticket-msg"
                  >
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
                    className="mt-1.5 w-full rounded-xl border border-[#1E2638] bg-[#151B28] px-3.5 py-2.5 text-white text-xs sm:text-sm placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm text-white bg-[#4361EE] hover:bg-[#3854E0] transition-colors disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <MorphIcon
                        icon={success ? CheckCircle2Data : SendData}
                        size={16}
                        spring="snappy"
                      />
                      {success ? '¡Ticket enviado!' : 'Enviar ticket'}
                    </>
                  )}
                </button>
              </form>

              {tickets.length > 0 && (
                <div className="pt-2 border-t border-[#1E2638]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0] mb-2.5">
                    Tus tickets
                  </p>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {tickets.map((t) => (
                      <li
                        key={t.id}
                        className="rounded-xl border border-[#1E2638] bg-[#151B28] px-3.5 py-2.5"
                      >
                        <div className="flex justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-white truncate">
                            {t.asunto}
                          </p>
                          <span className="shrink-0 text-[10px] font-bold uppercase text-[#38BDF8]">
                            {ESTADO_LABEL[t.estado] ?? t.estado}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-1 font-mono">
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
