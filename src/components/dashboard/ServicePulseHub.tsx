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
  theme: _theme,
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
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm relative overflow-hidden"
    >
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-[#38BDF8]" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C9BB0]">
              {t('dashboard.pulse_servicio', 'Pulse del Servicio')}
            </p>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {t('dashboard.operacion_un_lugar', 'Tu operación en un solo lugar')}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#8C9BB0] font-medium max-w-lg">
            {defaultSla}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTickets}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-sm cursor-pointer"
        >
          <LifeBuoy size={16} className="text-white" />
          <span>{t('dashboard.abrir_ticket', 'Abrir ticket')}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PulseStat
          label={t('dashboard.tickets_abiertos', 'Tickets abiertos')}
          value={String(openTickets)}
          icon={LifeBuoy}
          accent="text-[#38BDF8]"
        />
        <div className="rounded-xl border border-[#1E2638] bg-[#151B28] p-3.5 shadow-sm">
          <div
            className={`mb-1.5 ${unreadNotifications > 0 ? 'text-amber-400' : 'text-emerald-400'}`}
          >
            <MorphIcon
              icon={unreadNotifications > 0 ? BellData : CheckData}
              size={16}
              spring="snappy"
            />
          </div>
          <p className="text-xl font-bold font-mono text-white leading-none">
            {unreadNotifications}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#8C9BB0] mt-1.5 font-bold">
            {t('dashboard.alertas', 'Alertas')}
          </p>
        </div>
        <PulseStat
          label={t('dashboard.infra', 'Infra')}
          value="Vercel Edge"
          icon={Shield}
          accent="text-emerald-400"
        />
        <PulseStat
          label={t('dashboard.estado', 'Estado')}
          value="Online"
          icon={Zap}
          accent="text-emerald-400"
        />
      </div>

      {notifications.length > 0 && (
        <ul className="relative mt-4 space-y-2">
          {notifications.slice(0, 3).map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-3 rounded-xl border p-3 shadow-sm transition-all ${
                n.leida ? 'border-[#1E2638] bg-[#151B28]' : 'border-amber-500/30 bg-amber-500/10'
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate">{n.titulo}</p>
                <p className="text-xs text-[#8C9BB0] line-clamp-1 mt-0.5">{n.mensaje}</p>
              </div>
              {!n.leida && (
                <button
                  type="button"
                  onClick={() => onMarkRead(n.id)}
                  className="shrink-0 text-[10px] font-bold uppercase text-amber-400 hover:underline px-2 py-1 rounded-md bg-amber-500/10"
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
    <div className="rounded-xl border border-[#1E2638] bg-[#151B28] p-3.5 shadow-sm">
      <Icon className={`w-4 h-4 mb-1.5 ${accent}`} />
      <p className="text-xl font-bold font-mono text-white leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-[#8C9BB0] mt-1.5 font-bold">
        {label}
      </p>
    </div>
  )
}
