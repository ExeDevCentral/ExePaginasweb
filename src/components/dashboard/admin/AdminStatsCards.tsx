import { motion } from 'framer-motion'
import { Users, TrendingUp, Ticket, DollarSign } from 'lucide-react'
import type { AdminStats } from '../../../hooks/useAdminDashboard'

interface AdminStatsCardsProps {
  stats: AdminStats
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-accent-cyan/30 transition-all group"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Clientes
            </p>
            <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
              {stats.totalClientes}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-accent-cyan mt-4 font-mono">
          {stats.sinPlan} sin plan activo · {stats.totalClientes - stats.sinPlan} activos
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-yellow-500/30 transition-all group"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Abonos Activos
            </p>
            <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
              {stats.planBasico + stats.planAvanzado + stats.planPremium}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 font-mono flex gap-2">
          <span className="text-blue-400">B: {stats.planBasico}</span>
          <span className="text-emerald-400">A: {stats.planAvanzado}</span>
          <span className="text-accent-magenta">P: {stats.planPremium}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-accent-magenta/30 transition-all group"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Soporte Pendiente
            </p>
            <h3 className="text-3xl font-black text-foreground mt-2 font-montserrat">
              {stats.ticketsAbiertos}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-magenta/10 border border-accent-magenta/20 flex items-center justify-center text-accent-magenta group-hover:scale-110 transition-transform">
            <Ticket className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-accent-magenta mt-4 font-mono">
          {stats.ticketsAbiertos > 0 ? '⚠️ Requiere atención inmediata' : '✅ Soporte al día'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-3xl border border-border bg-card p-6 backdrop-blur-xl hover:border-emerald-500/30 transition-all group"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Ingresos Aprobados
            </p>
            <h3 className="text-xl font-bold text-foreground mt-2 font-montserrat">
              ${stats.ingresosTotalesARS.toLocaleString('es-AR')}{' '}
              <span className="text-[10px] text-muted-foreground">ARS</span>
            </h3>
            <h3 className="text-lg font-bold text-foreground/80 font-montserrat">
              ${stats.ingresosTotalesUSD.toLocaleString('en-US')}{' '}
              <span className="text-[10px] text-muted-foreground">USD</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-emerald-400 mt-2 font-mono">Total acumulado histórico</p>
      </motion.div>
    </div>
  )
}
