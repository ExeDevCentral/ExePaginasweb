/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  Activity,
  Lock,
  Database,
  Zap,
  FileText,
  ArrowUpRight,
  Eye,
  Users,
  UserPlus,
  Star,
  TrendingUp,
  Calculator,
  Terminal,
} from 'lucide-react'
import type { ActivityItem, Metric, PlanDashboardTheme } from '../planDashboardConfig'
import type { TicketDraft } from '../SupportTicketPanel'
import HudButton from '../../HudButton'

// 1. Live Badge
export function LiveBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

// 2. Top 4 Metric Cards (1-Click Direct Shortcuts)
const METRIC_ICONS = [Eye, Users, UserPlus, Star]

export function MetricGrid({
  metrics,
  theme: _theme,
  onMetricClick,
}: Readonly<{
  metrics: Metric[]
  theme: PlanDashboardTheme
  onMetricClick?: ((index: number) => void) | undefined
}>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((m, i) => {
        const IconComponent = METRIC_ICONS[i % METRIC_ICONS.length] || Eye
        const isNegative = m.delta.includes('↘') || m.trend === 'down'

        return (
          <motion.button
            key={m.label}
            type="button"
            onClick={() => onMetricClick?.(i)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="group text-left rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-2 text-xs font-medium">
                <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="truncate">{m.label}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">
                {m.value}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 shrink-0 ${
                  isNegative
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {m.delta}
              </span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

// 7. Quick Actions Hub (4 Direct 1-Click Actions — Zero Redirects)
export function QuickActionsHub({
  onOpenTicket,
  onOpenQuoter,
  onOpenLinux,
  onOpenInvoices,
  userEmail: _userEmail,
}: Readonly<{
  onOpenTicket: (draft?: TicketDraft) => void
  onOpenQuoter?: (() => void) | undefined
  onOpenLinux?: (() => void) | undefined
  onOpenInvoices?: (() => void) | undefined
  userEmail?: string | undefined
}>) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('dashboard.acciones_rapidas', 'Acciones Directas en 1 Clic (Sin Recargas)')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            onOpenTicket({
              asunto: 'Solicitud de mejora / cambio prioritario',
              categoria: 'consulta',
            })
          }
          className="p-4 rounded-xl bg-muted/40 border border-slate-300/80 dark:border-border hover:border-[#4361EE]/60 hover:bg-muted dark:hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <Zap className="w-5 h-5 text-[#38BDF8] mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">
            {t('dashboard.solicitar_mejora', 'Solicitar Mejora / Ticket')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.abrir_ticket_prioritario', 'Abre bandeja directa en este panel')}
          </p>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenQuoter}
          className="p-4 rounded-xl bg-muted/40 border border-slate-300/80 dark:border-border hover:border-cyan-500/60 hover:bg-muted dark:hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <Calculator className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Cotizar &amp; Sumar Módulos</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Turnos, Canchas o Tienda 0% comisión
          </p>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenLinux}
          className="p-4 rounded-xl bg-muted/40 border border-slate-300/80 dark:border-border hover:border-emerald-500/60 hover:bg-muted dark:hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Terminales Linux &amp; POS</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulador de flota y nodos LAN locales
          </p>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenInvoices}
          className="p-4 rounded-xl bg-muted/40 border border-slate-300/80 dark:border-border hover:border-violet-500/60 hover:bg-muted dark:hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">
            {t('dashboard.descargar_factura', 'Facturas & Comprobantes')}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.pdfs_historial', 'Historial contable y carga en 1 clic')}
          </p>
        </motion.button>
      </div>
    </div>
  )
}

// 8. Weekly Bar Chart
export function WeeklyChart({
  label,
  values,
  theme: _theme,
}: Readonly<{
  label: string
  values: number[]
  theme: PlanDashboardTheme
}>) {
  const { t } = useTranslation()
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">{label}</p>
        <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
          {t('dashboard.en_vivo_7d', 'live · 7d')}
        </span>
      </div>
      <div className="h-40 flex items-end gap-2 sm:gap-3 pt-4">
        {values.map((h, i) => (
          <motion.div
            key={`bar-${days[i]}`}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-[#4361EE] to-[#38BDF8] shadow-xs hover:opacity-85 transition-opacity"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.45 }}
          />
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-border flex justify-between font-mono text-xs font-medium text-muted-foreground">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </motion.div>
  )
}

// 9. Activity Timeline
export function ActivityTimeline({
  items,
  theme: _theme,
}: Readonly<{
  items: ActivityItem[]
  theme: PlanDashboardTheme
}>) {
  const { t } = useTranslation()
  const dotColor = { ok: 'bg-emerald-400', info: 'bg-[#38BDF8]', warn: 'bg-amber-400' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="rounded-2xl bg-card border border-slate-300/85 dark:border-border p-6 shadow-xs"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
        {t('dashboard.actividad_reciente', 'Actividad Reciente')}
      </p>
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="rounded-xl bg-muted/40 border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
            {t(
              'dashboard.sin_actividad',
              'Tu historial real aparecerá acá a medida que registres pagos, comprobantes o tickets.'
            )}
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={`activity-${item.label}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 border border-border px-4 py-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor[item.status]}`} />
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {item.label}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

// 10. Perks Panel
export function PerksPanel({
  perks,
  theme: _theme,
}: Readonly<{
  perks: string[]
  theme: PlanDashboardTheme
}>) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-card border border-slate-300/85 dark:border-border p-6 shadow-xs">
      <p className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
        {t('dashboard.beneficios_incluidos', 'Beneficios Incluidos')}
      </p>
      <ul className="space-y-2.5">
        {perks.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-muted-foreground"
          >
            <span className="text-[#38BDF8] font-bold">✦</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 11. Support Card
export function SupportCard({
  theme,
  openCount,
  onOpenTicket,
}: Readonly<{
  theme: PlanDashboardTheme
  openCount: number
  onOpenTicket: () => void
}>) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-card border border-slate-300/85 dark:border-border p-6 shadow-xs">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
        {t('dash.chat', 'Soporte Directo')}
      </p>
      <p className="mt-2 text-xl font-bold text-foreground">{theme.supportLabel}</p>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{theme.supportDetail}</p>
      {openCount > 0 && (
        <p className="mt-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
          {openCount} {t('dashboard.tickets_abiertos_badge', 'ticket(s) activos')}
        </p>
      )}
      <HudButton
        type="button"
        variant="secondary"
        size="sm"
        onClick={onOpenTicket}
        className="mt-4 w-full justify-center"
      >
        {t('tickets.nuevo_ticket', 'Nuevo Ticket')}
      </HudButton>
    </div>
  )
}
