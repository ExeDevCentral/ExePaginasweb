'use client'

import React, { useState } from 'react'
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
  MoreHorizontal,
  Eye,
  Users,
  UserPlus,
  Star,
  TrendingUp,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import type { ActivityItem, Metric, PlanDashboardTheme } from '../planDashboardConfig'

// 1. Live Badge
export function LiveBadge({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

// 2. Dashdark X Top 4 Metric Cards
const METRIC_ICONS = [Eye, Users, UserPlus, Star]

export function MetricGrid({
  metrics,
  theme: _theme,
}: Readonly<{
  metrics: Metric[]
  theme: PlanDashboardTheme
}>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((m, i) => {
        const IconComponent = METRIC_ICONS[i % METRIC_ICONS.length] || Eye
        const isNegative = m.delta.includes('↘') || m.trend === 'down'

        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 shadow-sm hover:border-[#2C3852] transition-all"
          >
            {/* Top row: Icon + Label + Menu */}
            <div className="flex items-center justify-between text-[#8C9BB0]">
              <div className="flex items-center gap-2 text-xs font-medium">
                <IconComponent className="w-4 h-4 text-[#8C9BB0]" />
                <span className="truncate">{m.label}</span>
              </div>
              <button
                type="button"
                className="text-[#64748B] hover:text-white transition-colors p-1"
                aria-label="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Middle row: Large Value & Percentage Badge */}
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {m.value}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 shrink-0 ${
                  isNegative
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {m.delta}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// 3. Main Curved Performance & Traffic Chart (2/3 Grid Area)
export function DashdarkRevenueChart({
  theme: _theme,
}: Readonly<{
  theme?: PlanDashboardTheme
}>) {
  const { t } = useTranslation()
  const [dateRange] = useState('Ene 2025 - Dic 2025')
  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ]
  const yLabels = ['50K', '40K', '30K', '20K', '10K', '5K', '0']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm flex flex-col justify-between"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2638]">
        <div>
          <p className="text-xs text-[#8C9BB0] font-medium uppercase tracking-wider">
            {t('dashboard.total_revenue', 'Tráfico Web & Rendimiento de tu Sistema')}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              48.5K Visitas
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-0.5">
              +24.6% ↗
            </span>
          </div>
        </div>

        {/* Right side: Legend & Date selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-xs text-[#8C9BB0] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4361EE]" />
              {t('dashboard.revenue', 'Tráfico Web')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
              {t('dashboard.expenses', 'Turnos / Contactos')}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#151B28] border border-[#1E2638] px-3 py-1.5 rounded-xl text-xs text-slate-300 font-medium cursor-pointer hover:border-[#2C3852] transition-colors">
            <Calendar className="w-3.5 h-3.5 text-[#8C9BB0]" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C9BB0]" />
          </div>
        </div>
      </div>

      {/* SVG Curved Graph Area */}
      <div className="relative pt-6 min-h-[260px] sm:min-h-[290px] w-full flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[11px] font-mono text-[#64748B] pr-3 select-none">
          {yLabels.map((yl) => (
            <span key={yl} className="text-right leading-none">
              {yl}
            </span>
          ))}
        </div>

        {/* Graph Canvas */}
        <div className="relative flex-1 h-[220px] sm:h-[240px]">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yLabels.map((yl) => (
              <div key={`grid-${yl}`} className="w-full h-px bg-[#1B2335]" />
            ))}
          </div>

          {/* SVG Vector Curves */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 500 200"
          >
            <defs>
              <linearGradient id="curveGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4361EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#4361EE" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="curveGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Cyan Curve (Conversiones / Turnos) */}
            <path
              d="M 0,170 C 50,160 80,140 130,155 C 180,170 210,120 260,115 C 310,110 350,150 400,130 C 450,110 480,135 500,125"
              fill="none"
              stroke="url(#curveGradCyan)"
              strokeWidth="2.5"
            />

            {/* Blue Primary Curve (Tráfico Web) */}
            <path
              d="M 0,185 C 40,180 80,120 120,135 C 170,150 200,90 250,95 C 300,100 350,30 400,45 C 450,60 480,75 500,70"
              fill="none"
              stroke="url(#curveGradBlue)"
              strokeWidth="3"
            />

            {/* Glowing Active Marker Point */}
            <circle cx="250" cy="95" r="5" fill="#4361EE" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="250" cy="95" r="10" fill="#4361EE" opacity="0.3" className="animate-ping" />
          </svg>

          {/* Active Hover Tooltip Card */}
          <div className="absolute left-[42%] sm:left-[45%] top-[12%] sm:top-[16%] -translate-x-1/2 p-2.5 rounded-xl bg-[#151B28] border border-[#232D42] shadow-xl text-center pointer-events-none z-10">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                1.450 visitas · 48 turnos
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +14.5% ↗
              </span>
            </div>
            <span className="text-[10px] text-[#8C9BB0] font-medium mt-0.5 block">
              Semana de pico · Agosto 2025
            </span>
          </div>
        </div>
      </div>

      {/* X-Axis Month Labels */}
      <div className="flex justify-between text-[11px] font-mono text-[#64748B] pt-4 pl-8 select-none">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </motion.div>
  )
}

// 4. Inversión & Abono Mensual Widget (Top Right Column)
export function DashdarkProfitCard() {
  const { t } = useTranslation()
  const barHeights = [45, 65, 30, 80, 55, 90, 70, 85, 40, 95, 60, 75, 88, 50, 92, 65]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C9BB0] font-medium">
          <TrendingUp className="w-4 h-4 text-[#8C9BB0]" />
          <span>{t('dashboard.total_profit', 'Inversión de tu Abono')}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mt-2">
          <span className="text-2xl font-bold text-white tracking-tight">$45.000 / mes</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Al Día ●
          </span>
        </div>

        {/* Vertical Bars */}
        <div className="h-28 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2">
          {barHeights.map((h, i) => (
            <motion.div
              key={`bar-profit-${i}`}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[#4361EE] to-[#38BDF8] hover:opacity-80 transition-opacity"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.15 + i * 0.02, duration: 0.4 }}
            />
          ))}
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-[10px] font-mono text-[#64748B] pt-1">
          <span>00:00</span>
          <span>08:00</span>
          <span>16:00</span>
          <span>23:59</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs">
        <span className="text-[#8C9BB0]">
          {t('dashboard.last_12_months', 'Historial de 12 meses')}
        </span>
        <Link href="/dashboard?tab=invoices" className="text-[#38BDF8] hover:underline font-medium">
          {t('dashboard.view_report', 'Ver facturas')}
        </Link>
      </div>
    </motion.div>
  )
}

// 5. Sesiones en Vivo & Servidor Widget (Bottom Right Column)
export function DashdarkSessionsCard() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 text-xs text-[#8C9BB0] font-medium">
          <Activity className="w-4 h-4 text-[#8C9BB0]" />
          <span>{t('dashboard.total_sessions', 'Actividad en Tiempo Real')}</span>
        </div>
        <div className="flex items-baseline gap-2.5 mt-2">
          <span className="text-2xl font-bold text-white tracking-tight">400 req/s</span>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            99.99% Uptime
          </span>
        </div>

        {/* Sparkline Canvas */}
        <div className="h-24 w-full relative pt-2">
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

        {/* Time markers */}
        <div className="flex justify-between text-[10px] font-mono text-[#64748B] pt-1">
          <span>00:00</span>
          <span>08:00</span>
          <span>16:00</span>
          <span>23:59</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Vercel Edge & Supabase OK</span>
        </div>
        <Link href="/dashboard?tab=services" className="text-[#38BDF8] hover:underline font-medium">
          {t('dashboard.view_report', 'Ver servicios')}
        </Link>
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
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {t('dashboard.salud_seguridad_tiempo_real', 'Salud y Seguridad en Tiempo Real')}
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full font-bold">
          {t('dashboard.uptime_stat', 'Uptime 99.99%')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638]">
          <p className="text-[11px] font-medium text-[#8C9BB0] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('dashboard.latencia', 'Latencia')}</span>
          </p>
          <p className="text-lg font-bold font-mono text-white mt-1">14 ms</p>
          <p className="text-xs text-emerald-400 font-medium mt-0.5">
            {t('dashboard.excelente', 'Excelente')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638]">
          <p className="text-[11px] font-medium text-[#8C9BB0] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>SSL / TLS</span>
          </p>
          <p className="text-lg font-bold font-mono text-white mt-1">TLS 1.3</p>
          <p className="text-xs text-[#38BDF8] font-medium mt-0.5">
            {t('dashboard.valido_seguro', 'Válido & Seguro')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638]">
          <p className="text-[11px] font-medium text-[#8C9BB0] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>{t('dashboard.respaldo_bd', 'Respaldo BD')}</span>
          </p>
          <p className="text-lg font-bold font-mono text-white mt-1">03:00 UTC</p>
          <p className="text-xs text-[#818CF8] font-medium mt-0.5">
            {t('dashboard.auto_backup_ok', 'Auto Backup OK')}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151B28] border border-[#1E2638]">
          <p className="text-[11px] font-medium text-[#8C9BB0] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>WAF Firewall</span>
          </p>
          <p className="text-lg font-bold font-mono text-white mt-1">
            {t('dashboard.protegido', 'Protegido')}
          </p>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            {t('dashboard.cero_amenazas', '0 Amenazas')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// 7. Quick Actions Hub
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
    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 space-y-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
        {t('dashboard.acciones_rapidas', 'Acciones Rápidas (1-Clic)')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={onOpenTicket}
          className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] hover:border-[#4361EE]/50 hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <Zap className="w-5 h-5 text-[#38BDF8] mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-white">
            {t('dashboard.solicitar_mejora', 'Solicitar Mejora')}
          </p>
          <p className="text-xs text-[#8C9BB0] mt-0.5">
            {t('dashboard.abrir_ticket_prioritario', 'Abrir ticket prioritario')}
          </p>
        </button>

        <a
          href={`https://wa.me/5493416874786?text=${waMsg}`}
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] hover:border-emerald-500/50 hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-white">
            {t('dashboard.soporte_vip_whatsapp', 'Soporte VIP WhatsApp')}
          </p>
          <p className="text-xs text-[#8C9BB0] mt-0.5">
            {t('dashboard.chat_directo', 'Chat directo 24/7')}
          </p>
        </a>

        <Link
          href="/dashboard?tab=invoices"
          className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] hover:border-[#818CF8]/50 hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <FileText className="w-5 h-5 text-[#818CF8] mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-white">
            {t('dashboard.descargar_factura', 'Descargar Factura')}
          </p>
          <p className="text-xs text-[#8C9BB0] mt-0.5">
            {t('dashboard.pdfs_historial', 'PDFs e historial')}
          </p>
        </Link>

        <Link
          href="/cotizador"
          className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] hover:border-amber-500/50 hover:bg-[#1C2438] text-left transition-all group cursor-pointer"
        >
          <ArrowUpRight className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-white">
            {t('dashboard.upgrade_plan', 'Upgrade de Plan')}
          </p>
          <p className="text-xs text-[#8C9BB0] mt-0.5">
            {t('dashboard.escalar_recursos', 'Escalar recursos')}
          </p>
        </Link>
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
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-white">{label}</p>
        <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
          {t('dashboard.en_vivo_7d', 'live · 7d')}
        </span>
      </div>
      <div className="h-40 flex items-end gap-2 sm:gap-3 pt-4">
        {values.map((h, i) => (
          <motion.div
            key={`bar-${days[i]}`}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-[#4361EE] to-[#38BDF8] shadow-sm hover:opacity-85 transition-opacity"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.45 }}
          />
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-[#1E2638] flex justify-between font-mono text-xs font-medium text-[#8C9BB0]">
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
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">
        {t('dashboard.actividad_reciente', 'Actividad Reciente')}
      </p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={`activity-${item.label}-${i}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-[#151B28] border border-[#1E2638] px-4 py-3 hover:border-[#2C3852] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor[item.status]}`} />
              <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                {item.label}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-[#8C9BB0]">{item.time}</span>
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
    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">
        {t('dashboard.beneficios_incluidos', 'Beneficios Incluidos')}
      </p>
      <ul className="space-y-2.5">
        {perks.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300"
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
    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-[#8C9BB0] font-bold">
        {t('dash.chat', 'Chat de Soporte')}
      </p>
      <p className="mt-2 text-xl font-bold text-white">{theme.supportLabel}</p>
      <p className="mt-1 text-xs sm:text-sm text-[#8C9BB0]">{theme.supportDetail}</p>
      {openCount > 0 && (
        <p className="mt-2.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
          {openCount} {t('dashboard.tickets_abiertos_badge', 'ticket(s) activos')}
        </p>
      )}
      <button
        type="button"
        onClick={onOpenTicket}
        className="mt-4 w-full rounded-xl bg-[#151B28] hover:bg-[#1C2438] border border-[#1E2638] py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
      >
        {t('tickets.nuevo_ticket', 'Nuevo Ticket')}
      </button>
    </div>
  )
}
