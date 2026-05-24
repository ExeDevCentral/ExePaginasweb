import { motion } from 'framer-motion'
import type { ActivityItem, Metric, PlanDashboardTheme } from '../planDashboardConfig'

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {label}
    </span>
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
          className={`rounded-2xl border ${theme.border} bg-white/[0.04] p-4 backdrop-blur-md`}
        >
          <p className="text-[10px] uppercase tracking-wider text-white/45 font-bold">{m.label}</p>
          <p className={`mt-2 text-2xl font-black text-white`}>{m.value}</p>
          <p
            className={`mt-1 text-xs font-semibold ${
              m.trend === 'up' ? 'text-emerald-400' : m.trend === 'down' ? 'text-red-400' : theme.accentMuted
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
      className={`rounded-3xl border ${theme.border} bg-white/[0.03] p-5 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</p>
        <span className="font-mono text-[10px] text-white/30">live · 7d</span>
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
      <div className="mt-2 flex justify-between font-mono text-[10px] text-white/25">
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
      className={`rounded-3xl border ${theme.border} bg-white/[0.03] p-5 backdrop-blur-xl`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Actividad en vivo</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32 + i * 0.05 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor[item.status]}`} />
              <span className="text-sm text-white/85 truncate">{item.label}</span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-white/35">{item.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function PerksPanel({ perks, theme }: { perks: string[]; theme: PlanDashboardTheme }) {
  return (
    <div className={`rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradient} p-5`}>
      <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Incluido en tu plan</p>
      <ul className="space-y-2">
        {perks.map((p) => (
          <li key={p} className="flex items-center gap-2 text-sm text-white/80">
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
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-3xl border ${theme.border} ${theme.glow} p-5`}
    >
      <p className="text-[10px] uppercase tracking-widest text-white/45 font-bold">Soporte</p>
      <p className={`mt-2 text-xl font-black ${theme.accent}`}>{theme.supportLabel}</p>
      <p className="mt-1 text-sm text-white/55">{theme.supportDetail}</p>
      {openCount > 0 && (
        <p className="mt-2 text-xs font-bold text-amber-400">{openCount} ticket(s) en curso</p>
      )}
      <button
        type="button"
        onClick={onOpenTicket}
        className={`mt-4 w-full rounded-xl border ${theme.border} py-3 text-sm font-bold text-white hover:bg-white/5 transition-colors`}
      >
        Abrir ticket
      </button>
    </motion.div>
  )
}
