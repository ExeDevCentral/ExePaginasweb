import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Monitor, Building, Building2, RefreshCw } from 'lucide-react'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import type { PlanTier } from './resolvePlanTier'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'
import {
  LiveBadge,
  MetricGrid,
  WeeklyChart,
  ActivityTimeline,
  PerksPanel,
  SupportCard,
} from './shared/DashboardPrimitives'

const TIER_ICONS = {
  basico: Monitor,
  avanzado: Building,
  premium: Building2,
} as const

function formatDate(d?: string | null) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

type PlanDashboardViewProps = {
  tier: Exclude<PlanTier, 'none'>
  cliente: Cliente | null
  suscripciones: Suscripcion[]
  pagos: Pago[]
  onRefresh: () => void
  refreshing: boolean
  onLogout: () => void
}

export default function PlanDashboardView({
  tier,
  cliente,
  suscripciones,
  pagos,
  onRefresh,
  refreshing,
  onLogout,
}: PlanDashboardViewProps) {
  const theme = PLAN_THEMES[tier]
  const Icon = tier === 'premium' ? Crown : TIER_ICONS[tier]
  const nombre = cliente?.nombre?.split(' ')[0] ?? 'Cliente'
  const planSlug = suscripciones[0]?.plan?.slug ?? pagos[0]?.plan_slug ?? null
  const [ticketPanelOpen, setTicketPanelOpen] = useState(false)

  const {
    tickets,
    notifications,
    openCount,
    submitting,
    error: ticketError,
    createTicket,
    markRead,
    refresh: refreshTickets,
  } = useSupportTickets(true, cliente, tier, planSlug)

  const metrics = useMemo(() => {
    return theme.metrics.map((m) =>
      m.label.toLowerCase().includes('ticket')
        ? {
            ...m,
            value: String(openCount),
            delta: openCount === 0 ? 'Sin pendientes' : `${openCount} en curso`,
            trend: openCount === 0 ? ('up' as const) : ('neutral' as const),
          }
        : m
    )
  }, [theme.metrics, openCount])

  const unreadCount = notifications.filter((n) => !n.leida).length

  const handleRefresh = () => {
    onRefresh()
    refreshTickets()
  }

  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full blur-[120px] ${theme.glow}`}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-magenta/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[2rem] border ${theme.border} bg-[#08080c]/80 backdrop-blur-2xl`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-80`} />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <LiveBadge label="Sistema online" />
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${theme.border} ${theme.accent} bg-black/30`}
                >
                  <Icon size={14} />
                  {theme.badge}
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40 font-bold">Panel de cliente</p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-montserrat font-black text-white">
                Hola, {nombre}
              </h1>
              <p className="mt-2 text-lg text-white/55 max-w-xl">{theme.subtitle}</p>
              <p className="mt-1 text-sm font-montserrat text-white/35">{theme.title}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white transition-colors disabled:opacity-40"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                Actualizar
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/50 hover:text-accent-magenta transition-colors"
              >
                Salir
              </button>
            </div>
          </div>

          <div className="mt-8">
            <MetricGrid metrics={metrics} theme={theme} />
          </div>
        </div>
      </motion.div>

      <div className="mt-6">
        <ServicePulseHub
          theme={theme}
          tier={tier}
          openTickets={openCount}
          unreadNotifications={unreadCount}
          notifications={notifications}
          onOpenTickets={() => setTicketPanelOpen(true)}
          onMarkRead={markRead}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeeklyChart label={theme.chartLabel} values={theme.chartValues} theme={theme} />
          <ActivityTimeline items={theme.activities} theme={theme} />
        </div>

        <div className="space-y-6">
          <PerksPanel perks={theme.perks} theme={theme} />
          <SupportCard
            theme={theme}
            openCount={openCount}
            onOpenTicket={() => setTicketPanelOpen(true)}
          />

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Tu cuenta</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-white/50">Email</span>
                <span className="text-white font-medium truncate">{cliente?.email ?? '—'}</span>
              </div>
              {suscripciones[0] && (
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Desde</span>
                  <span className="text-white/80">{formatDate(suscripciones[0].fecha_inicio)}</span>
                </div>
              )}
            </div>
          </div>

          {pagos.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Último pago</p>
              <p className="text-xl font-black text-white">
                ${pagos[0].monto} {pagos[0].moneda}
              </p>
              <p className="text-xs text-emerald-400 mt-1 capitalize">{pagos[0].estado}</p>
            </div>
          )}
        </div>
      </div>

      <SupportTicketPanel
        open={ticketPanelOpen}
        onClose={() => setTicketPanelOpen(false)}
        theme={theme}
        tier={tier}
        tickets={tickets}
        openCount={openCount}
        submitting={submitting}
        error={ticketError}
        onSubmit={async (asunto, mensaje, categoria) => {
          await createTicket(asunto, mensaje, categoria)
        }}
      />
    </div>
  )
}
