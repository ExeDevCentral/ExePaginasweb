import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  CreditCard,
} from 'lucide-react'

type TabType = 'overview' | 'sales' | 'automation'

const CHART_DATA: Record<TabType, { label: string; val: string; height: number }[]> = {
  overview: [
    { label: 'L', val: '64 reservas', height: 45 },
    { label: 'M', val: '82 reservas', height: 62 },
    { label: 'M', val: '75 reservas', height: 55 },
    { label: 'J', val: '110 reservas', height: 80 },
    { label: 'V', val: '142 reservas', height: 95 },
    { label: 'S', val: '127 reservas', height: 88 },
    { label: 'D', val: '98 reservas', height: 72 },
  ],
  sales: [
    { label: 'L', val: '$140.000', height: 40 },
    { label: 'M', val: '$195.000', height: 58 },
    { label: 'M', val: '$210.000', height: 65 },
    { label: 'J', val: '$320.000', height: 85 },
    { label: 'V', val: '$450.000', height: 98 },
    { label: 'S', val: '$380.000', height: 89 },
    { label: 'D', val: '$260.000', height: 70 },
  ],
  automation: [
    { label: 'L', val: '320 ejecuciones', height: 50 },
    { label: 'M', val: '410 ejecuciones', height: 68 },
    { label: 'M', val: '390 ejecuciones', height: 62 },
    { label: 'J', val: '520 ejecuciones', height: 82 },
    { label: 'V', val: '680 ejecuciones', height: 96 },
    { label: 'S', val: '610 ejecuciones', height: 90 },
    { label: 'D', val: '480 ejecuciones', height: 75 },
  ],
}

const FEED_DATA: Record<
  TabType,
  { icon: React.ElementType; color: string; title: string; time: string }[]
> = {
  overview: [
    {
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-400/10',
      title: 'Reserva Cancha #2 confirmada',
      time: 'hace 2m',
    },
    {
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-400/10',
      title: 'Recordatorio WhatsApp enviado',
      time: 'hace 5m',
    },
    {
      icon: CreditCard,
      color: 'text-amber-400 bg-amber-400/10',
      title: 'Pago recibido ($18.500)',
      time: 'hace 12m',
    },
  ],
  sales: [
    {
      icon: CreditCard,
      color: 'text-amber-400 bg-amber-400/10',
      title: 'Pago MercadoPago $24.000',
      time: 'hace 1m',
    },
    {
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-400/10',
      title: 'Meta diaria alcanzada (112%)',
      time: 'hace 18m',
    },
    {
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-400/10',
      title: 'Comprobante automático enviado',
      time: 'hace 24m',
    },
  ],
  automation: [
    {
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-400/10',
      title: 'Bot de WhatsApp respondió consulta',
      time: 'hace 30s',
    },
    {
      icon: ShieldCheck,
      color: 'text-indigo-400 bg-indigo-400/10',
      title: 'Backup de BD completado',
      time: 'hace 8m',
    },
    {
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-400/10',
      title: 'Sincronización de Stock OK',
      time: 'hace 14m',
    },
  ],
}

const DashboardMock = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="relative rounded-3xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-slate-950/80 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden group">
      {/* Glow Effect Beams */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/15 rounded-full blur-[70px] group-hover:bg-cyan-500/25 transition-all duration-700 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-amber-500/15 rounded-full blur-[70px] group-hover:bg-amber-500/25 transition-all duration-700 pointer-events-none" />

      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header OS Controls & Live Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[11px] font-mono text-muted-foreground/80 ml-2">
              kernel_dashboard.tsx
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>LIVE · 99.9% Uptime</span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-slate-900/60 rounded-xl border border-border/50 mb-5">
          {(['overview', 'sales', 'automation'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-300 capitalize ${
                activeTab === tab
                  ? 'bg-background dark:bg-slate-800 text-foreground shadow-sm border border-border/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
              }`}
            >
              {tab === 'overview' ? 'General' : tab === 'sales' ? 'Ventas' : 'Automatizaciones'}
            </button>
          ))}
        </div>

        {/* Dynamic Metric Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3 mb-5"
          >
            {/* Metric 1 */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background/50 dark:bg-slate-900/50 backdrop-blur-md">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">
                {activeTab === 'overview'
                  ? t('dashboard.reservas_hoy')
                  : activeTab === 'sales'
                    ? 'Facturación Hoy'
                    : 'Procesos Ejecutados'}
              </p>
              <p className="text-xl font-bold font-mono text-foreground">
                {activeTab === 'overview' ? '127' : activeTab === 'sales' ? '$184.500' : '1.420'}
              </p>
              <p className="text-[10px] font-semibold text-emerald-500 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +14% vs ayer
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-background/50 dark:bg-slate-900/50 backdrop-blur-md">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">
                {activeTab === 'overview'
                  ? t('dashboard.eficiencia')
                  : activeTab === 'sales'
                    ? 'Ticket Promedio'
                    : 'Tiempo Ahorrado'}
              </p>
              <p className="text-xl font-bold font-mono text-foreground">
                {activeTab === 'overview'
                  ? '98.4%'
                  : activeTab === 'sales'
                    ? '$14.200'
                    : '18.5h/sem'}
              </p>
              <p className="text-[10px] font-semibold text-cyan-400 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> Optimizado 24/7
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Interactive Chart Container */}
        <div className="p-4 rounded-xl border border-border/60 bg-background/50 dark:bg-slate-900/50 backdrop-blur-md mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              {t('dashboard.rendimiento_semanal')}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {hoveredBar !== null ? CHART_DATA[activeTab][hoveredBar].val : 'Semana Actual'}
            </span>
          </div>

          <div className="h-28 flex items-end gap-2 pt-2 pb-1 relative">
            {/* Grid line */}
            <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-border/40 pointer-events-none" />

            {CHART_DATA[activeTab].map((bar, i) => {
              const isHovered = hoveredBar === i
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center cursor-pointer group/bar"
                >
                  {/* Animated Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-t from-cyan-500 via-sky-400 to-amber-400 shadow-[0_0_12px_rgba(14,165,233,0.5)] scale-105'
                        : 'bg-gradient-to-t from-cyan-500/30 to-cyan-500/80 group-hover/bar:bg-cyan-400'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          {/* Days axis */}
          <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground/80">
            {CHART_DATA[activeTab].map((d, i) => (
              <span
                key={i}
                className={`flex-1 text-center transition-colors ${
                  hoveredBar === i ? 'text-cyan-400 font-bold' : ''
                }`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="p-4 rounded-xl border border-border/60 bg-background/50 dark:bg-slate-900/50 backdrop-blur-md">
          <p className="text-xs font-semibold text-foreground/80 mb-3">
            {t('dashboard.ultimas_automatizaciones')}
          </p>
          <div className="space-y-2.5">
            {FEED_DATA[activeTab].map((item, i) => {
              const ItemIcon = item.icon
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-card/50 border border-border/40 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md ${item.color}`}>
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-foreground/90 font-medium text-[11px]">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{item.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMock
