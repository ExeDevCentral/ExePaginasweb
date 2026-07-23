import { motion } from 'framer-motion'
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useActiveSLA, useSLABreaches } from '../../hooks/useSLA'
import type { SLAContract, SLABreach } from '../../core/domain/entities/SLAContract'

const NIVEL_CONFIG: Record<string, { color: string; bg: string }> = {
  basico: { color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  avanzado: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  premium: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  enterprise: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)} días`
}

interface Props {
  tenantId: string
}

export default function SLADashboard({ tenantId }: Props) {
  const { data: sla, isLoading: slaLoading } = useActiveSLA(tenantId)
  const { data: breaches = [], isLoading: breachesLoading } = useSLABreaches(tenantId)

  if (slaLoading || breachesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const breachCount = breaches.filter((b: SLABreach) => b.estado_sla === 'breach').length
  const warningCount = breaches.filter((b: SLABreach) => b.estado_sla === 'warning').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-cyan" />
          Acuerdo de Nivel de Servicio
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compromisos de tiempo de respuesta y resolución
        </p>
      </div>

      {/* SLA Contract Card */}
      {sla ? (
        <SLACard sla={sla} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay contrato SLA configurado</p>
        </div>
      )}

      {/* Breach Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {breaches.filter((b: SLABreach) => b.estado_sla === 'ok').length}
          </p>
          <p className="text-xs text-muted-foreground">Dentro del SLA</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">{warningCount}</p>
          <p className="text-xs text-muted-foreground">Por vencer</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{breachCount}</p>
          <p className="text-xs text-muted-foreground">Incumplidos</p>
        </div>
      </div>

      {/* Breach Details */}
      {breaches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Tickets con SLA
          </h3>
          <div className="space-y-2">
            {breaches.map((breach: SLABreach) => (
              <BreachRow key={breach.ticket_id} breach={breach} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SLACard({ sla }: { sla: SLAContract }) {
  const config = NIVEL_CONFIG[sla.nivel] || NIVEL_CONFIG.basico

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 ${config.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{sla.nombre}</h3>
          <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
            Nivel {sla.nivel}
          </span>
        </div>
        {sla.horas_por_mes > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{sla.horas_por_mes}h</p>
            <p className="text-xs text-muted-foreground">de desarrollo/mes</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-cyan" />
          <div>
            <p className="text-xs text-muted-foreground">Tiempo de respuesta</p>
            <p className="text-sm font-bold text-foreground">
              {formatMinutes(sla.tiempo_respuesta_minutos)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-magenta" />
          <div>
            <p className="text-xs text-muted-foreground">Tiempo de resolución</p>
            <p className="text-sm font-bold text-foreground">
              {formatMinutes(sla.tiempo_resolucion_minutos)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BreachRow({ breach }: { breach: SLABreach }) {
  const elapsed = breach.minutos_transcurridos
  const limit = breach.tiempo_limite_minutos
  const pct = Math.min((elapsed / limit) * 100, 100)

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{breach.asunto}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">
            {Math.floor(elapsed / 60)}h {Math.floor(elapsed % 60)}m transcurridos
          </span>
          <span className="text-xs text-muted-foreground">Límite: {formatMinutes(limit)}</span>
        </div>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span
        className={`ml-4 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
          breach.estado_sla === 'breach'
            ? 'bg-red-500/20 text-red-400'
            : breach.estado_sla === 'warning'
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-emerald-500/20 text-emerald-400'
        }`}
      >
        {breach.estado_sla === 'breach'
          ? 'INCUMPLIDO'
          : breach.estado_sla === 'warning'
            ? 'ALERTA'
            : 'OK'}
      </span>
    </div>
  )
}
