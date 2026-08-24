'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  ShieldCheck,
  Activity,
  Lock,
  Database,
  Zap,
  FileText,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react'
import type { ActivityItem, Metric, PlanDashboardTheme } from '../planDashboardConfig'

const WEEK_DAYS: Record<string, string[]> = {
  es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  'pt-BR': ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
  fr: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  de: ['M', 'D', 'M', 'D', 'F', 'S', 'S'],
  'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
  ar: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'],
}

export function LiveBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

export function LiveHealthCard({ theme }: Readonly<{ theme: PlanDashboardTheme }>) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border ${theme.border} bg-white/90 dark:bg-slate-950/70 p-6 backdrop-blur-xl space-y-4 shadow-md dark:shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {t('dashboard.salud_seguridad_tiempo_real', 'Salud y Seguridad en Tiempo Real')}
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 rounded-full font-bold">
          {t('dashboard.uptime_stat', 'Uptime 99.99%')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-card/50 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('dashboard.latencia', 'Latencia')}</span>
          </p>
          <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
            14 ms
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
            {t('dashboard.excelente', 'Excelente')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-card/50 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>SSL / TLS</span>
          </p>
          <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
            TLS 1.3
          </p>
          <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
            {t('dashboard.valido_seguro', 'Válido & Seguro')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-card/50 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t('dashboard.respaldo_bd', 'Respaldo BD')}</span>
          </p>
          <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
            03:00 UTC
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">
            {t('dashboard.auto_backup_ok', 'Auto Backup OK')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-card/50 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>WAF Firewall</span>
          </p>
          <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
            {t('dashboard.protegido', 'Protegido')}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
            {t('dashboard.cero_amenazas', '0 Amenazas')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function QuickActionsHub({
  onOpenTicket,
  userEmail,
}: Readonly<{
  onOpenTicket: () => void
  userEmail?: string
}>) {
  const { t } = useTranslation()
  const waMsg = encodeURIComponent(
    `Hola ExePaginasWeb! Necesito soporte VIP para mi sitio web (Cliente: ${userEmail || 'Registrado'}).`
  )

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-md dark:shadow-lg transition-all">
      <p className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
        {t('dashboard.acciones_rapidas', 'Acciones Rápidas (1-Clic)')}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={onOpenTicket}
          className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/15 text-left transition-all group shadow-sm hover:-translate-y-0.5"
        >
          <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.solicitar_mejora', 'Solicitar Mejora')}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {t('dashboard.abrir_ticket_prioritario', 'Abrir ticket prioritario')}
          </p>
        </button>

        <a
          href={`https://wa.me/5493416874786?text=${waMsg}`}
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-left transition-all group shadow-sm hover:-translate-y-0.5"
        >
          <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.soporte_vip_whatsapp', 'Soporte VIP WhatsApp')}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {t('dashboard.chat_directo', 'Chat directo 24/7')}
          </p>
        </a>

        <Link
          href="/dashboard?tab=invoices"
          className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 text-left transition-all group shadow-sm hover:-translate-y-0.5"
        >
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.descargar_factura', 'Descargar Factura')}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {t('dashboard.pdfs_historial', 'PDFs e historial')}
          </p>
        </Link>

        <Link
          href="/cotizador"
          className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-left transition-all group shadow-sm hover:-translate-y-0.5"
        >
          <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.upgrade_plan', 'Upgrade de Plan')}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            {t('dashboard.escalar_recursos', 'Escalar recursos')}
          </p>
        </Link>
      </div>
    </div>
  )
}

function getTrendColor(trend: 'up' | 'neutral' | 'down', accentMuted: string) {
  if (trend === 'up') return 'text-emerald-600 dark:text-emerald-400'
  if (trend === 'down') return 'text-red-600 dark:text-red-400'
  return accentMuted
}

export function MetricGrid({
  metrics,
  theme,
}: Readonly<{
  metrics: Metric[]
  theme: PlanDashboardTheme
}>) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className={`rounded-3xl border ${theme.border} bg-white/90 dark:bg-white/[0.04] p-5 backdrop-blur-md shadow-sm dark:shadow-md transition-all`}
        >
          <p className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold">
            {m.label}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {m.value}
          </p>
          <p className={`mt-1 text-xs font-bold ${getTrendColor(m.trend, theme.accentMuted)}`}>
            {m.delta}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

export function WeeklyChart({
  label,
  values,
  theme,
}: Readonly<{
  label: string
  values: number[]
  theme: PlanDashboardTheme
}>) {
  const { i18n, t } = useTranslation()
  const langKey = i18n.language || 'es'
  const baseDays = WEEK_DAYS[langKey] || WEEK_DAYS[langKey.slice(0, 2)] || WEEK_DAYS.es
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-3xl border ${theme.border} bg-white/90 dark:bg-white/[0.03] p-6 backdrop-blur-xl shadow-md dark:shadow-lg transition-all`}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
          {label}
        </p>
        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {t('dashboard.en_vivo_7d', 'live · 7d')}
        </span>
      </div>
      <div className="h-40 flex items-end gap-2 sm:gap-3 pt-4">
        {values.map((h, i) => (
          <motion.div
            key={dayKeys[i] || `bar-${h}`}
            className={`flex-1 rounded-t-xl bg-gradient-to-t ${theme.chartBar} shadow-sm`}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ opacity: 0.9, scaleY: 1.02 }}
          />
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex justify-between font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
        {baseDays.map((d, idx) => (
          <span key={dayKeys[idx] || d}>{d}</span>
        ))}
      </div>
    </motion.div>
  )
}

export function ActivityTimeline({
  items,
  theme,
}: Readonly<{
  items: ActivityItem[]
  theme: PlanDashboardTheme
}>) {
  const { t } = useTranslation()
  const dotColor = { ok: 'bg-emerald-500', info: 'bg-cyan-500', warn: 'bg-amber-500' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className={`rounded-3xl border ${theme.border} bg-white/90 dark:bg-white/[0.03] p-6 backdrop-blur-xl shadow-md dark:shadow-lg transition-all`}
    >
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-4">
        {t('dashboard.actividad_reciente', 'Actividad Reciente')}
      </p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={`activity-${item.label}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 + i * 0.05 }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-black/30 px-4 py-3 shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor[item.status]} shadow-[0_0_8px_currentColor]`}
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {item.label}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {item.time}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function PerksPanel({
  perks,
  theme,
}: Readonly<{
  perks: string[]
  theme: PlanDashboardTheme
}>) {
  const { t } = useTranslation()

  return (
    <div
      className={`rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} p-6 shadow-md dark:shadow-lg transition-all`}
    >
      <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-4">
        {t('dashboard.beneficios_incluidos', 'Beneficios Incluidos')}
      </p>
      <ul className="space-y-2.5">
        {perks.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2.5 text-sm font-semibold text-slate-900 dark:text-white/90"
          >
            <span className={`${theme.accent} font-bold`}>✦</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-3xl border ${theme.border} ${theme.glow} p-6 shadow-md dark:shadow-lg transition-all bg-white/90 dark:bg-slate-950/80`}
    >
      <p className="text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-extrabold">
        {t('dash.chat', 'Chat de Soporte')}
      </p>
      <p className={`mt-2 text-xl font-black ${theme.accent}`}>{theme.supportLabel}</p>
      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
        {theme.supportDetail}
      </p>
      {openCount > 0 && (
        <p className="mt-2.5 text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
          {openCount} {t('dashboard.tickets_abiertos_badge', 'ticket(s) activos')}
        </p>
      )}
      <button
        type="button"
        onClick={onOpenTicket}
        className={`mt-4 w-full rounded-2xl border ${theme.border} py-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-cyan-500/10 dark:hover:bg-white/10 transition-all shadow-sm`}
      >
        {t('tickets.nuevo_ticket', 'Nuevo Ticket')}
      </button>
    </motion.div>
  )
}
