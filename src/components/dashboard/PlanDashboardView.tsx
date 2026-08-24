'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Monitor, Building, Building2 } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { RefreshCw as RefreshCwData, Check as CheckData } from 'lucide'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import type { PlanTier } from './resolvePlanTier'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'
import { useTranslation } from 'react-i18next'
import {
  LiveBadge,
  LiveHealthCard,
  QuickActionsHub,
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

function formatDate(d?: string | null, locale = 'es-AR') {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
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
}: Readonly<PlanDashboardViewProps>) {
  const { t, i18n } = useTranslation()
  const theme = PLAN_THEMES[tier]
  const Icon = tier === 'premium' ? Crown : TIER_ICONS[tier]
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'Cliente'
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
            delta:
              openCount === 0
                ? t('dashboard.sin_pendientes', 'Sin pendientes')
                : `${openCount} ${t('dashboard.en_curso', 'en curso')}`,
            trend: openCount === 0 ? ('up' as const) : ('neutral' as const),
          }
        : m
    )
  }, [theme.metrics, openCount, t])

  const unreadCount = notifications.filter((n) => !n.leida).length

  const handleRefresh = () => {
    onRefresh()
    refreshTickets()
  }

  return (
    <div className="relative space-y-8">
      {/* Glow Backlights */}
      <div
        className={`pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full blur-[140px] opacity-40 ${theme.glow}`}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pink-500/5 blur-[120px]" />

      {/* Main Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[2.5rem] border ${theme.border} bg-white/95 dark:bg-[#090a12]/95 backdrop-blur-2xl shadow-xl dark:shadow-2xl transition-all`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`} />

        <div className="relative p-7 sm:p-10 space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <LiveBadge label={t('features.dashboard_online', 'SISTEMA ONLINE')} />
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-black ${theme.border} ${theme.accent} bg-white/80 dark:bg-slate-900/80 shadow-sm`}
                >
                  <Icon size={14} />
                  {theme.badge}
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 font-extrabold">
                {t('nav.panel_cliente', 'Panel de Control')}
              </p>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('dashboard.hola', 'Hola')}, {nombre}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-medium pt-1">
                {theme.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-300/80 dark:border-white/15 bg-slate-100/90 dark:bg-slate-900/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm disabled:opacity-50"
              >
                <MorphIcon
                  icon={refreshing ? RefreshCwData : CheckData}
                  size={16}
                  spring="snappy"
                  className={
                    refreshing
                      ? 'animate-spin text-cyan-600 dark:text-cyan-400'
                      : 'text-emerald-500'
                  }
                />
                <span>
                  {refreshing
                    ? t('dashboard.actualizando', 'Actualizando...')
                    : t('dashboard.actualizar', 'Actualizar')}
                </span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-2xl border border-rose-300/80 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all shadow-sm"
              >
                {t('dashboard.salir', 'Cerrar Sesión')}
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <MetricGrid metrics={metrics} theme={theme} />
            <LiveHealthCard theme={theme} />
            <QuickActionsHub
              onOpenTicket={() => setTicketPanelOpen(true)}
              userEmail={cliente?.email}
            />
          </div>
        </div>
      </motion.div>

      {/* Service Pulse Hub Section */}
      <ServicePulseHub
        theme={theme}
        tier={tier}
        openTickets={openCount}
        unreadNotifications={unreadCount}
        notifications={notifications}
        onOpenTickets={() => setTicketPanelOpen(true)}
        onMarkRead={markRead}
      />

      {/* Analytics, Activity, and Account Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <WeeklyChart label={theme.chartLabel} values={theme.chartValues} theme={theme} />
          <ActivityTimeline items={theme.activities} theme={theme} />
        </div>

        <div className="space-y-8">
          <PerksPanel perks={theme.perks} theme={theme} />
          <SupportCard
            theme={theme}
            openCount={openCount}
            onOpenTicket={() => setTicketPanelOpen(true)}
          />

          {/* Account Profile Card */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-950/80 p-6 backdrop-blur-xl shadow-md dark:shadow-lg space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
              {t('dashboard.tu_cuenta', 'Tu cuenta')}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center gap-3 pb-2 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {t('dashboard.email', 'Email')}
                </span>
                <span className="text-slate-900 dark:text-white font-bold truncate max-w-[190px]">
                  {cliente?.email ?? '—'}
                </span>
              </div>
              {suscripciones[0] && (
                <div className="flex justify-between items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {t('dashboard.desde', 'Desde')}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {formatDate(suscripciones[0].fecha_inicio, i18n.language)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Last Payment Card */}
          {pagos.length > 0 && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-950/80 p-6 shadow-md dark:shadow-lg space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                {t('dashboard.ultimo_pago', 'Último pago')}
              </p>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                ${pagos[0].monto} {pagos[0].moneda}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
                ● {pagos[0].estado}
              </p>
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
