import { motion } from 'framer-motion'
import { Bell, LifeBuoy, Zap, Shield, ArrowRight } from 'lucide-react'
import type { PlanTier } from '../../core/domain/planCatalog'
import { SLA_BY_TIER } from '../../core/domain/ticketConfig'
import type { Notificacion } from '../../core/domain/entities/Ticket'
import type { PlanDashboardTheme } from './planDashboardConfig'

type ServicePulseHubProps = {
  theme: PlanDashboardTheme
  tier: PlanTier
  openTickets: number
  unreadNotifications: number
  notifications: Notificacion[]
  onOpenTickets: () => void
  onMarkRead: (id: string) => void
}

export default function ServicePulseHub({
  theme,
  tier,
  openTickets,
  unreadNotifications,
  notifications,
  onOpenTickets,
  onMarkRead,
}: ServicePulseHubProps) {
  const sla = tier !== 'none' ? SLA_BY_TIER[tier] : 'Activá un abono para soporte dedicado'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className={`rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} p-5 sm:p-6 backdrop-blur-xl overflow-hidden relative`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-60 pointer-events-none bg-accent-cyan/20" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${theme.accent}`} />
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/45">
              Pulse del servicio
            </p>
          </div>
          <h3 className="text-xl font-black text-white">Tu operación en un solo lugar</h3>
          <p className="mt-1 text-sm text-white/55 max-w-md">{sla}</p>
        </div>

        <button
          type="button"
          onClick={onOpenTickets}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 transition-colors shrink-0"
        >
          <LifeBuoy size={18} className={theme.accent} />
          Abrir ticket
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PulseStat
          label="Tickets abiertos"
          value={String(openTickets)}
          icon={LifeBuoy}
          accent={theme.accent}
        />
        <PulseStat
          label="Alertas"
          value={String(unreadNotifications)}
          icon={Bell}
          accent={unreadNotifications > 0 ? 'text-amber-400' : 'text-white/50'}
        />
        <PulseStat label="Infra" value="Vercel" icon={Shield} accent="text-emerald-400" />
        <PulseStat label="Estado" value="Online" icon={Zap} accent="text-emerald-400" />
      </div>

      {notifications.length > 0 && (
        <ul className="relative mt-4 space-y-2">
          {notifications.slice(0, 3).map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                n.leida ? 'border-white/5 bg-black/10' : 'border-amber-500/20 bg-amber-500/5'
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{n.titulo}</p>
                <p className="text-xs text-white/50 line-clamp-1">{n.mensaje}</p>
              </div>
              {!n.leida && (
                <button
                  type="button"
                  onClick={() => onMarkRead(n.id)}
                  className="shrink-0 text-[10px] font-bold uppercase text-amber-400 hover:text-amber-300"
                >
                  Marcar leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

function PulseStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  icon: typeof Bell
  accent: string
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2.5">
      <Icon className={`w-3.5 h-3.5 mb-1 ${accent}`} />
      <p className="text-lg font-black text-white leading-none">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-bold">{label}</p>
    </div>
  )
}
