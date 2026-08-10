import { motion } from 'framer-motion'
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

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
  )
}

export function LiveHealthCard({ theme }: { theme: PlanDashboardTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border ${theme.border} bg-zinc-900/40 dark:bg-slate-950/60 p-5 backdrop-blur-xl space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Salud y Seguridad en Tiempo Real</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
          Uptime 99.99%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-card/40 border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> Latencia
          </p>
          <p className="text-base font-extrabold font-mono text-foreground mt-1">14 ms</p>
          <p className="text-[10px] text-emerald-400">Excelente</p>
        </div>

        <div className="p-3 rounded-2xl bg-card/40 border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3 text-accent-cyan" /> SSL / TLS
          </p>
          <p className="text-base font-extrabold font-mono text-foreground mt-1">TLS 1.3</p>
          <p className="text-[10px] text-accent-cyan">Válido & Seguro</p>
        </div>

        <div className="p-3 rounded-2xl bg-card/40 border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <Database className="w-3 h-3 text-accent-magenta" /> Respaldo BD
          </p>
          <p className="text-base font-extrabold font-mono text-foreground mt-1">Hoy 03:00</p>
          <p className="text-[10px] text-accent-magenta">Auto Backup OK</p>
        </div>

        <div className="p-3 rounded-2xl bg-card/40 border border-border/50">
          <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> WAF Firewall
          </p>
          <p className="text-base font-extrabold font-mono text-foreground mt-1">Protegido</p>
          <p className="text-[10px] text-amber-400">0 Amenazas</p>
        </div>
      </div>
    </motion.div>
  )
}

export function QuickActionsHub({
  onOpenTicket,
  userEmail,
}: {
  onOpenTicket: () => void
  userEmail?: string
}) {
  const waMsg = encodeURIComponent(
    `Hola ExePaginasWeb! Necesito soporte VIP para mi sitio web (Cliente: ${userEmail || 'Registrado'}).`
  )

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-xl space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Acciones Rápidas (1-Clic)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={onOpenTicket}
          className="p-3 rounded-2xl border border-accent-cyan/30 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-left transition-all group"
        >
          <Zap className="w-4 h-4 text-accent-cyan mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Solicitar Mejora</p>
          <p className="text-[10px] text-muted-foreground">Abrir ticket prioritario</p>
        </button>

        <a
          href={`https://wa.me/5491112345678?text=${waMsg}`}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all group"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Soporte VIP WhatsApp</p>
          <p className="text-[10px] text-muted-foreground">Chat directo 24/7</p>
        </a>

        <a
          href="/dashboard?tab=invoices"
          className="p-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-left transition-all group"
        >
          <FileText className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Descargar Factura</p>
          <p className="text-[10px] text-muted-foreground">PDFs e historial</p>
        </a>

        <a
          href="/cotizador"
          className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition-all group"
        >
          <ArrowUpRight className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-foreground">Upgrade de Plan</p>
          <p className="text-[10px] text-muted-foreground">Escalar recursos</p>
        </a>
      </div>
    </div>
  )
}

export function MetricGrid({ metrics, theme }: { metrics: Metric[]; theme: PlanDashboardTheme }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className={`rounded-2xl border ${theme.border} bg-zinc-800/5 dark:bg-white/[0.04] p-4 backdrop-blur-md`}
        >
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-white/45 font-bold">
            {m.label}
          </p>
          <p className={`mt-2 text-2xl font-black text-foreground`}>{m.value}</p>
          <p
            className={`mt-1 text-xs font-semibold ${
              m.trend === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : m.trend === 'down'
                  ? 'text-red-600 dark:text-red-400'
                  : theme.accentMuted
            }`}
          >
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
}: {
  label: string
  values: number[]
  theme: PlanDashboardTheme
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-3xl border ${theme.border} bg-zinc-800/5 dark:bg-white/[0.03] p-5 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/50">
          {label}
        </p>
        <span className="font-mono text-[10px] text-zinc-400 dark:text-white/30">live · 7d</span>
      </div>
      <div className="h-36 flex items-end gap-2">
        {values.map((h, i) => (
          <motion.div
            key={i}
            className={`flex-1 rounded-t-lg bg-gradient-to-t ${theme.chartBar}`}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ opacity: 0.9 }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-zinc-400 dark:text-white/25">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </motion.div>
  )
}

export function ActivityTimeline({
  items,
  theme,
}: {
  items: ActivityItem[]
  theme: PlanDashboardTheme
}) {
  const dotColor = { ok: 'bg-emerald-400', info: 'bg-cyan-400', warn: 'bg-amber-400' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className={`rounded-3xl border ${theme.border} bg-zinc-800/5 dark:bg-white/[0.03] p-5 backdrop-blur-xl`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-white/50 mb-4">
        Actividad
      </p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 + i * 0.05 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-100/30 dark:bg-black/20 px-3 py-2.5"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor[item.status]}`} />
              <span className="text-sm text-zinc-800 dark:text-white/85 truncate">
                {item.label}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-zinc-500 dark:text-white/35">
              {item.time}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function PerksPanel({ perks, theme }: { perks: string[]; theme: PlanDashboardTheme }) {
  return (
    <div className={`rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} p-5`}>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-800/70 dark:text-white/50 mb-3">
        Features
      </p>
      <ul className="space-y-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-zinc-900 dark:text-white/80">
            <span className={`${theme.accent}`}>✦</span>
            {p}
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
}: {
  theme: PlanDashboardTheme
  openCount: number
  onOpenTicket: () => void
}) {
  const { t } = useTranslation()
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-3xl border ${theme.border} ${theme.glow} p-5`}
    >
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-white/45 font-bold">
        {t('dash.chat')}
      </p>
      <p className={`mt-2 text-xl font-black ${theme.accent}`}>{theme.supportLabel}</p>
      <p className="mt-1 text-sm text-zinc-700 dark:text-white/55">{theme.supportDetail}</p>
      {openCount > 0 && (
        <p className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          {openCount} ticket(s)
        </p>
      )}
      <button
        type="button"
        onClick={onOpenTicket}
        className={`mt-4 w-full rounded-xl border ${theme.border} py-3 text-sm font-bold text-foreground hover:bg-zinc-800/5 dark:hover:bg-white/5 transition-colors`}
      >
        {t('tickets.crear_ticket')}
      </button>
    </motion.div>
  )
}
