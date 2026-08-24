'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useActiveSLA, useSLABreaches } from '../../hooks/useSLA'
import { useTranslation } from 'react-i18next'
import type { SLAContract, SLABreach } from '../../core/domain/entities/SLAContract'

const NIVEL_CONFIG: Record<string, { color: string; bg: string }> = {
  basico: { color: 'text-slate-600 dark:text-gray-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  avanzado: { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  premium: {
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  enterprise: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
}

function formatMinutes(minutes: number, t: (key: string, def: string) => string): string {
  if (minutes < 60) return `${minutes} ${t('sla.min', 'min')}`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)} ${t('sla.dias', 'días')}`
}

interface Props {
  tenantId: string
}

export default function SLADashboard({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { data: sla, isLoading: slaLoading } = useActiveSLA(tenantId)
  const { data: breaches = [], isLoading: breachesLoading } = useSLABreaches(tenantId)

  if (slaLoading || breachesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const breachCount = breaches.filter((b: SLABreach) => b.estado_sla === 'breach').length
  const warningCount = breaches.filter((b: SLABreach) => b.estado_sla === 'warning').length

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          {t('sla.titulo', 'SLA & Garantía de Servicio')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          {t('sla.garantia', 'Tiempos de respuesta y resolución garantizados por contrato')}
        </p>
      </div>

      {/* SLA Contract Card */}
      {sla ? (
        <SLACard sla={sla} />
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/15 bg-white/90 dark:bg-slate-950/80 p-8 text-center shadow-sm">
          <Shield className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {t('sla.sin_contrato', 'No hay contrato SLA configurado')}
          </p>
        </div>
      )}

      {/* Breach Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            {breaches.filter((b: SLABreach) => b.estado_sla === 'ok').length}
          </p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
            {t('sla.dentro_sla', 'Dentro del SLA')}
          </p>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
            {warningCount}
          </p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
            {t('sla.por_vencer', 'Por vencer')}
          </p>
        </div>

        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-2xl bg-rose-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
            {breachCount}
          </p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
            {t('sla.incumplidos', 'Incumplidos')}
          </p>
        </div>
      </div>

      {/* Breach Details */}
      {breaches.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
            {t('sla.tickets_con_sla', 'Tickets con SLA activo')}
          </h3>
          <div className="space-y-3">
            {breaches.map((breach: SLABreach) => (
              <BreachRow key={breach.ticket_id} breach={breach} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SLACard({ sla }: Readonly<{ sla: SLAContract }>) {
  const { t } = useTranslation()
  const config = NIVEL_CONFIG[sla.nivel] || NIVEL_CONFIG.basico

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border p-6 sm:p-7 ${config.bg} shadow-md dark:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{sla.nombre}</h3>
          <span
            className={`text-xs font-extrabold uppercase tracking-wider ${config.color} mt-1 inline-block`}
          >
            {t('sla.nivel', 'Nivel')} {sla.nivel}
          </span>
        </div>
        {sla.horas_por_mes > 0 && (
          <div className="text-right">
            <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {sla.horas_por_mes}h
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              {t('sla.horas_desarrollo_mes', 'de desarrollo/mes')}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('sla.tiempo_respuesta', 'Tiempo de respuesta')}
            </p>
            <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-0.5">
              {formatMinutes(sla.tiempo_respuesta_minutos, t)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-black/30 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('sla.tiempo_resolucion', 'Tiempo de resolución')}
            </p>
            <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-0.5">
              {formatMinutes(sla.tiempo_resolucion_minutos, t)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function getBreachProgressColor(pct: number) {
  if (pct >= 100) return 'bg-rose-500'
  if (pct >= 80) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getBreachBadgeStyle(estado: string) {
  if (estado === 'breach') {
    return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
  }
  if (estado === 'warning') {
    return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
  }
  return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
}

function getBreachBadgeText(estado: string, t: (key: string, def: string) => string) {
  if (estado === 'breach') return t('sla.badge_incumplido', 'INCUMPLIDO')
  if (estado === 'warning') return t('sla.badge_alerta', 'ALERTA')
  return t('sla.badge_ok', 'OK')
}

function BreachRow({ breach }: Readonly<{ breach: SLABreach }>) {
  const { t } = useTranslation()
  const elapsed = breach.minutos_transcurridos
  const limit = breach.tiempo_limite_minutos
  const pct = Math.min((elapsed / limit) * 100, 100)

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/10 shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{breach.asunto}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {Math.floor(elapsed / 60)}h {Math.floor(elapsed % 60)}m{' '}
            {t('sla.transcurridos', 'transcurridos')}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {t('sla.limite', 'Límite')}: {formatMinutes(limit, t)}
          </span>
        </div>
        <div className="mt-2.5 h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getBreachProgressColor(pct)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span
        className={`shrink-0 text-[11px] font-black uppercase px-3 py-1 rounded-full ${getBreachBadgeStyle(breach.estado_sla)}`}
      >
        {getBreachBadgeText(breach.estado_sla, t)}
      </span>
    </div>
  )
}
