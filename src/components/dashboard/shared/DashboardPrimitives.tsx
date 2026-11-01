/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
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

// 3. Main Curved Performance & Traffic Chart (Interactive 7d / 30d / 12m)
const CHART_PRESETS = {
  '7d': {
    pill: '7 Días',
    headline: '1.84K Visitas',
    delta: '+18.2% ↗',
    tooltipTitle: '310 visitas · 14 turnos',
    tooltipSub: 'Pico semanal · Viernes',
    xLabels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    yLabels: ['500', '400', '300', '200', '100', '50', '0'],
    blueCurve: 'M 0,155 C 65,140 120,115 180,105 C 240,95 300,55 360,42 C 420,58 465,70 500,60',
    cyanCurve:
      'M 0,175 C 65,165 120,150 180,142 C 240,130 300,105 360,96 C 420,115 465,125 500,118',
    markerX: 360,
    markerY: 42,
  },
  '30d': {
    pill: '30 Días',
    headline: '7.92K Visitas',
    delta: '+21.4% ↗',
    tooltipTitle: '1.120 visitas · 39 turnos',
    tooltipSub: 'Semana 3 · Conversión récord',
    xLabels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    yLabels: ['10K', '8K', '6K', '4K', '2K', '1K', '0'],
    blueCurve: 'M 0,170 C 90,145 160,120 240,85 C 320,55 390,65 500,48',
    cyanCurve: 'M 0,182 C 90,168 160,150 240,122 C 320,108 390,118 500,104',
    markerX: 240,
    markerY: 85,
  },
  '12m': {
    pill: '12 Meses (2026)',
    headline: '48.5K Visitas',
    delta: '+24.6% ↗',
    tooltipTitle: '1.450 visitas · 48 turnos',
    tooltipSub: 'Pico sostenido · Temporada 2026',
    xLabels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    yLabels: ['50K', '40K', '30K', '20K', '10K', '5K', '0'],
    blueCurve:
      'M 0,185 C 40,180 80,120 120,135 C 170,150 200,90 250,95 C 300,100 350,30 400,45 C 450,60 480,75 500,70',
    cyanCurve:
      'M 0,170 C 50,160 80,140 130,155 C 180,170 210,120 260,115 C 310,110 350,150 400,130 C 450,110 480,135 500,125',
    markerX: 250,
    markerY: 95,
  },
} as const

export function DashdarkRevenueChart({
  theme: _theme,
}: Readonly<{
  theme?: PlanDashboardTheme
}>) {
  const { t } = useTranslation()
  const [rangeKey, setRangeKey] = useState<keyof typeof CHART_PRESETS>('12m')
  const preset = CHART_PRESETS[rangeKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs flex flex-col justify-between"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('dashboard.total_revenue', 'Tráfico Web & Rendimiento de tu Sistema')}
          </p>
          <motion.div
            key={`chart-head-${rangeKey}`}
            initial={{ opacity: 0.4, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-3 mt-1.5"
          >
            <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {preset.headline}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-0.5">
              {preset.delta}
            </span>
          </motion.div>
        </div>

        {/* Right side: Legend & 1-Click Interactive Range Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden xl:flex items-center gap-3 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4361EE]" />
              {t('dashboard.revenue', 'Tráfico Web')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
              {t('dashboard.expenses', 'Turnos / Contactos')}
            </span>
          </div>

          <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-muted/50 border border-slate-300/90 dark:border-border p-1 text-xs">
            {(Object.keys(CHART_PRESETS) as Array<keyof typeof CHART_PRESETS>).map((rk) => {
              const active = rangeKey === rk
              return (
                <button
                  key={rk}
                  type="button"
                  onClick={() => setRangeKey(rk)}
                  className={`relative px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    active ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dash-chart-range"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-[#4361EE] shadow-2xs"
                    />
                  )}
                  <span className="relative z-10">{CHART_PRESETS[rk].pill}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* SVG Curved Graph Area */}
      <div className="relative pt-6 min-h-[250px] sm:min-h-[280px] w-full flex">
        <div className="flex flex-col justify-between text-[11px] font-mono text-muted-foreground pr-3 select-none">
          {preset.yLabels.map((yl) => (
            <span key={yl} className="text-right leading-none">
              {yl}
            </span>
          ))}
        </div>

        <div className="relative flex-1 h-[215px] sm:h-[235px]">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {preset.yLabels.map((yl) => (
              <div
                key={`grid-${yl}`}
                className="w-full h-px bg-slate-200/80 dark:bg-white/[0.06]"
              />
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 500 200"
          >
            <defs>
              <linearGradient id="curveGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4361EE" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#4361EE" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="curveGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            <motion.path
              d={preset.cyanCurve}
              initial={false}
              animate={{ d: preset.cyanCurve }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              fill="none"
              stroke="url(#curveGradCyan)"
              strokeWidth="2.5"
            />

            <motion.path
              d={preset.blueCurve}
              initial={false}
              animate={{ d: preset.blueCurve }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              fill="none"
              stroke="url(#curveGradBlue)"
              strokeWidth="3"
            />

            <circle
              cx={preset.markerX}
              cy={preset.markerY}
              r="5"
              fill="#4361EE"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx={preset.markerX} cy={preset.markerY} r="9" fill="#4361EE" opacity="0.2" />
          </svg>

          <motion.div
            key={`tooltip-${rangeKey}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-[10%] -translate-x-1/2 px-3 py-2 rounded-xl bg-white/95 dark:bg-[#0b1222]/95 backdrop-blur-md border border-slate-300 dark:border-border shadow-lg text-center pointer-events-none z-10"
          >
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-xs font-bold text-foreground">{preset.tooltipTitle}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {preset.delta}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5 block">
              {preset.tooltipSub}
            </span>
          </motion.div>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-[11px] font-mono text-muted-foreground pt-4 pl-8 select-none">
        {preset.xLabels.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </motion.div>
  )
}

// 4. Inversión & Abono Mensual Widget
export function DashdarkProfitCard({
  amountText = 'Abono Activo',
  onViewInvoices,
}: Readonly<{
  amountText?: string
  onViewInvoices?: (() => void) | undefined
}>) {
  const { t } = useTranslation()
  const barHeights = [45, 65, 30, 80, 55, 90, 70, 85, 40, 95, 60, 75, 88, 50, 92, 65]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span>{t('dashboard.total_profit', 'Inversión de tu Abono')}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mt-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">{amountText}</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Al Día ●
          </span>
        </div>

        <div className="h-24 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2">
          {barHeights.map((h, i) => (
            <motion.div
              key={`bar-profit-${i}`}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[#4361EE] to-[#38BDF8] hover:opacity-80 transition-opacity"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.12 + i * 0.015, duration: 0.35 }}
            />
          ))}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1">
          <span>00:00</span>
          <span>08:00</span>
          <span>16:00</span>
          <span>23:59</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {t('dashboard.last_12_months', 'Control contable directo')}
        </span>
        <button
          type="button"
          onClick={onViewInvoices}
          className="text-[#4361EE] dark:text-[#38BDF8] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
        >
          <span>{t('dashboard.view_report', 'Ver facturas')}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// 5. Sesiones en Vivo & Servidor Widget
export function DashdarkSessionsCard({
  onViewServices,
}: Readonly<{
  onViewServices?: (() => void) | undefined
}>) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span>{t('dashboard.total_sessions', 'Actividad en Tiempo Real')}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mt-2">
          <span className="text-2xl font-bold text-foreground tracking-tight">400 req/s</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            99.99% Uptime
          </span>
        </div>

        <div className="h-20 w-full relative pt-2">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 200 80"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sessionsArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4361EE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4361EE" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,65 L 25,50 L 50,60 L 75,35 L 100,55 L 125,20 L 150,58 L 175,60 L 200,68 L 200,80 L 0,80 Z"
              fill="url(#sessionsArea)"
            />
            <path
              d="M 0,65 L 25,50 L 50,60 L 75,35 L 100,55 L 125,20 L 150,58 L 175,60 L 200,68"
              fill="none"
              stroke="#4361EE"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1">
          <span>00:00</span>
          <span>08:00</span>
          <span>16:00</span>
          <span>23:59</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
          <span>Vercel Edge &amp; Supabase OK</span>
        </div>
        <button
          type="button"
          onClick={onViewServices}
          className="text-[#4361EE] dark:text-[#38BDF8] hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
        >
          <span>{t('dashboard.view_report', 'Ver ecosistema')}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

// 6. Real-time Security & Health Card
export function LiveHealthCard({ theme: _theme }: Readonly<{ theme: PlanDashboardTheme }>) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>
            {t('dashboard.salud_seguridad_tiempo_real', 'Salud y Seguridad en Tiempo Real')}
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full font-bold">
          {t('dashboard.uptime_stat', 'Uptime 99.99%')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>{t('dashboard.latencia', 'Latencia')}</span>
          </p>
          <p className="text-lg font-bold font-mono text-foreground mt-1">14 ms</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
            {t('dashboard.excelente', 'Excelente')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>SSL / TLS</span>
          </p>
          <p className="text-lg font-bold font-mono text-foreground mt-1">TLS 1.3</p>
          <p className="text-xs text-[#38BDF8] font-medium mt-0.5">
            {t('dashboard.valido_seguro', 'Válido & Seguro')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>{t('dashboard.respaldo_bd', 'Respaldo BD')}</span>
          </p>
          <p className="text-lg font-bold font-mono text-foreground mt-1">03:00 UTC</p>
          <p className="text-xs text-[#818CF8] font-medium mt-0.5">
            {t('dashboard.auto_backup_ok', 'Auto Backup OK')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
          <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>WAF Firewall</span>
          </p>
          <p className="text-lg font-bold font-mono text-foreground mt-1">
            {t('dashboard.protegido', 'Protegido')}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            {t('dashboard.cero_amenazas', '0 Amenazas')}
          </p>
        </div>
      </div>
    </motion.div>
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
        {items.map((item, i) => (
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
        ))}
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
