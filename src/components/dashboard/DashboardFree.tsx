import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Monitor, Building, Building2, Sparkles } from 'lucide-react'
import type { Cliente } from '../../core/domain/entities/Cliente'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'

const PREVIEW_TIERS = [
  { tier: 'basico' as const, icon: Monitor },
  { tier: 'avanzado' as const, icon: Building },
  { tier: 'premium' as const, icon: Building2 },
]

type DashboardFreeProps = {
  cliente: Cliente | null
  onLogout: () => void
}

export default function DashboardFree({ cliente, onLogout }: DashboardFreeProps) {
  const navigate = useNavigate()
  const nombre = cliente?.nombre?.split(' ')[0] ?? 'Cliente'
  const theme = PLAN_THEMES.basico
  const [ticketPanelOpen, setTicketPanelOpen] = useState(false)
  const {
    tickets,
    notifications,
    openCount,
    submitting,
    error: ticketError,
    createTicket,
    markRead,
  } = useSupportTickets(true, cliente, 'none', null)
  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-border bg-gradient-to-br from-muted/40 to-transparent p-8 backdrop-blur-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-magenta/15 border border-accent-magenta/30 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-accent-magenta" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-cyan font-bold">
              Sin abono activo
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mt-1">Hola, {nombre}</h1>
            <p className="mt-2 text-muted-foreground max-w-lg">
              Elegí un plan para desbloquear tu panel operativo. Cada nivel tiene su propio
              dashboard con métricas y herramientas adaptadas a tu negocio.
            </p>
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 text-xs font-bold text-foreground/40 hover:text-accent-magenta"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/tienda')}
          className="mt-8 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-[#050508] font-black hover:opacity-90 transition-opacity"
        >
          Ver planes y activar panel
        </button>
      </motion.div>

      <div className="mt-6">
        <ServicePulseHub
          theme={theme}
          tier="none"
          openTickets={openCount}
          unreadNotifications={unreadCount}
          notifications={notifications}
          onOpenTickets={() => setTicketPanelOpen(true)}
          onMarkRead={markRead}
        />
      </div>

      <p className="mt-10 mb-4 text-xs font-bold uppercase tracking-[0.3em] text-foreground/40 text-center">
        Vista previa por plan
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREVIEW_TIERS.map(({ tier, icon: Icon }, i) => {
          const t = PLAN_THEMES[tier]
          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`rounded-3xl border ${t.border} bg-card/60 p-6 backdrop-blur-xl cursor-default`}
            >
              <div
                className={`w-12 h-12 rounded-xl border ${t.border} flex items-center justify-center mb-4 ${t.glow}`}
              >
                <Icon className={`w-6 h-6 ${t.accent}`} />
              </div>
              <h3 className={`text-lg font-black ${t.accent}`}>{t.badge}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.subtitle}</p>
              <ul className="mt-4 space-y-1.5">
                {t.perks.slice(0, 3).map((p) => (
                  <li key={p} className="text-xs text-foreground/60">
                    · {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] font-mono text-foreground/25">dashboard.{tier}.exe</p>
            </motion.div>
          )
        })}
      </div>

      <SupportTicketPanel
        open={ticketPanelOpen}
        onClose={() => setTicketPanelOpen(false)}
        theme={theme}
        tier="none"
        tickets={tickets}
        openCount={openCount}
        submitting={submitting}
        error={ticketError}
        onSubmit={async (a, m, c) => {
          await createTicket(a, m, c)
        }}
      />
    </div>
  )
}
