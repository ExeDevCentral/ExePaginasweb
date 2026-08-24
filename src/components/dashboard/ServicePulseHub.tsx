'use client'

import { motion } from 'framer-motion'
import { Bell, LifeBuoy, Zap, Shield, ArrowRight } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { Bell as BellData, Check as CheckData } from 'lucide'
import { useTranslation } from 'react-i18next'
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
}: Readonly<ServicePulseHubProps>) {
  const { t } = useTranslation()
  const defaultSla =
    tier !== 'none'
      ? SLA_BY_TIER[tier]
      : t('dashboard.activar_abono_soporte', 'Activá un abono para soporte dedicado')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className={`rounded-3xl border ${theme.border} bg-white/90 dark:bg-slate-950/70 p-6 sm:p-7 backdrop-blur-xl overflow-hidden relative shadow-md dark:shadow-xl transition-all`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[90px] opacity-40 pointer-events-none bg-cyan-500/20" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${theme.accent}`} />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {t('dashboard.pulse_servicio', 'Pulse del Servicio')}
            </p>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('dashboard.operacion_un_lugar', 'Tu operación en un solo lugar')}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 max-w-lg font-medium">
            {defaultSla}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTickets}
          className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-5 py-3 text-sm font-extrabold hover:opacity-90 transition-all shrink-0 shadow-md"
        >
          <LifeBuoy size={18} className="text-cyan-400 dark:text-cyan-600" />
          <span>{t('dashboard.abrir_ticket', 'Abrir ticket')}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <PulseStat
          label={t('dashboard.tickets_abiertos', 'Tickets abiertos')}
          value={String(openTickets)}
          icon={LifeBuoy}
          accent={theme.accent}
        />
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-3.5 shadow-sm">
          <div
            className={`mb-1.5 ${unreadNotifications > 0 ? 'text-amber-500' : 'text-emerald-500'}`}
          >
            <MorphIcon
              icon={unreadNotifications > 0 ? BellData : CheckData}
              size={16}
              spring="snappy"
            />
          </div>
          <p className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">
            {unreadNotifications}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1.5 font-extrabold">
            {t('dashboard.alertas', 'Alertas')}
          </p>
        </div>
        <PulseStat
          label={t('dashboard.infra', 'Infra')}
          value="Vercel Edge"
          icon={Shield}
          accent="text-emerald-500 dark:text-emerald-400"
        />
        <PulseStat
          label={t('dashboard.estado', 'Estado')}
          value="Online"
          icon={Zap}
          accent="text-emerald-500 dark:text-emerald-400"
        />
      </div>

      {notifications.length > 0 && (
        <ul className="relative mt-5 space-y-2.5">
          {notifications.slice(0, 3).map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-3 rounded-2xl border p-3.5 shadow-sm transition-all ${
                n.leida
                  ? 'border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'
                  : 'border-amber-500/30 bg-amber-500/10'
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {n.titulo}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                  {n.mensaje}
                </p>
              </div>
              {!n.leida && (
                <button
                  type="button"
                  onClick={() => onMarkRead(n.id)}
                  className="shrink-0 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 hover:underline px-2 py-1 rounded-lg bg-amber-500/10"
                >
                  {t('dashboard.marcar_leida', 'Marcar leída')}
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
}: Readonly<{
  label: string
  value: string
  icon: typeof Bell
  accent: string
}>) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-3.5 shadow-sm">
      <Icon className={`w-4 h-4 mb-1.5 ${accent}`} />
      <p className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1.5 font-extrabold">
        {label}
      </p>
    </div>
  )
}
