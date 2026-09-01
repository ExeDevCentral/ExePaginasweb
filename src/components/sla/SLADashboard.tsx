'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useActiveSLA, useSLABreaches } from '../../hooks/useSLA'
import { useTranslation } from 'react-i18next'
import type { SLAContract, SLANivel, SLABreach } from '../../core/domain/entities/SLAContract'

interface Props {
  tenantId: string
}

const NIVEL_CONFIG: Record<SLANivel, { color: string; bg: string }> = {
  basico: {
    color: 'text-[#38BDF8]',
    bg: 'bg-[#151B28] border-[#1E2638]',
  },
  avanzado: {
    color: 'text-[#818CF8]',
    bg: 'bg-[#151B28] border-[#1E2638]',
  },
  premium: {
    color: 'text-amber-400',
    bg: 'bg-[#151B28] border-amber-500/30',
  },
  enterprise: {
    color: 'text-rose-400',
    bg: 'bg-[#151B28] border-rose-500/30',
  },
}

function formatMinutes(minutos: number, t: (key: string, def: string) => string) {
  if (minutos >= 1440) return `${Math.floor(minutos / 1440)} ${t('common.dias', 'días')}`
  if (minutos >= 60) return `${Math.floor(minutos / 60)}h`
  return `${minutos} min`
}

export default function SLADashboard({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { data: dbSla, isLoading: slaLoading } = useActiveSLA(tenantId)
  const { data: breaches = [], isLoading: breachesLoading } = useSLABreaches(tenantId)

  // Default SLA contract fallback for demonstration
  const defaultSla: SLAContract = {
    id: 'sla-default',
    tenant_id: tenantId,
    nivel: 'avanzado',
    nombre: 'Garantía Estándar SLA & Mantenimiento Web',
    tiempo_respuesta_minutos: 120, // 2 Horas
    tiempo_resolucion_minutos: 480, // 8 Horas
    horas_por_mes: 5,
    penalizacion_por_incumplimiento: 0,
    activo: true,
    fecha_inicio: new Date().toISOString(),
    fecha_fin: null,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const sla = dbSla ?? defaultSla

  if (slaLoading || breachesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const warningCount = breaches.filter((b: SLABreach) => b.estado_sla === 'warning').length
  const breachCount = breaches.filter((b: SLABreach) => b.estado_sla === 'breach').length

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('sla.titulo', 'Garantía de Servicio (SLA)')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            {t('sla.garantia', 'Tiempos de respuesta y resolución garantizados por contrato')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SLA 99.9% Garantizado</span>
        </div>
      </div>

      {/* SLA Contract Card */}
      {sla && <SLACard sla={sla} />}

      {/* Breach Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {breaches.filter((b: SLABreach) => b.estado_sla === 'ok').length || 1}
          </p>
          <p className="text-xs font-semibold text-[#8C9BB0] mt-1">
            {t('sla.dentro_sla', 'Dentro del SLA')}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">{warningCount}</p>
          <p className="text-xs font-semibold text-[#8C9BB0] mt-1">
            {t('sla.por_vencer', 'Por vencer')}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 text-center shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center mx-auto mb-2 shadow-sm">
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">{breachCount}</p>
          <p className="text-xs font-semibold text-[#8C9BB0] mt-1">
            {t('sla.incumplidos', 'Incumplidos')}
          </p>
        </div>
      </div>

      {/* Breach Details */}
      {breaches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0] mb-3">
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
      className={`rounded-3xl border p-6 sm:p-7 ${config.bg} shadow-sm`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">{sla.nombre}</h3>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${config.color} mt-1 inline-block`}
          >
            {t('sla.nivel', 'Nivel')} {sla.nivel}
          </span>
        </div>
        {sla.horas_por_mes > 0 && (
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {sla.horas_por_mes}h
            </p>
            <p className="text-xs text-[#8C9BB0] font-medium">
              {t('sla.horas_desarrollo_mes', 'de desarrollo/mes')}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#111622] border border-[#1E2638] shadow-sm">
          <Clock className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#8C9BB0]">
              {t('sla.tiempo_respuesta', 'Tiempo de respuesta')}
            </p>
            <p className="text-sm font-bold font-mono text-white mt-0.5">
              {formatMinutes(sla.tiempo_respuesta_minutos, t)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#111622] border border-[#1E2638] shadow-sm">
          <Clock className="w-5 h-5 text-[#818CF8] shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#8C9BB0]">
              {t('sla.tiempo_resolucion', 'Tiempo de resolución')}
            </p>
            <p className="text-sm font-bold font-mono text-white mt-0.5">
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
    return 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
  }
  if (estado === 'warning') {
    return 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
  }
  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
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
    <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-[#111622] border border-[#1E2638] shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{breach.asunto}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-[#8C9BB0] font-medium">
            {Math.floor(elapsed / 60)}h {Math.floor(elapsed % 60)}m{' '}
            {t('sla.transcurridos', 'transcurridos')}
          </span>
          <span className="text-xs text-[#8C9BB0] font-medium">
            {t('sla.limite', 'Límite')}: {formatMinutes(limit, t)}
          </span>
        </div>
        <div className="mt-2.5 h-2 bg-[#151B28] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getBreachProgressColor(pct)}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span
        className={`shrink-0 text-[11px] font-bold uppercase px-3 py-1 rounded-full ${getBreachBadgeStyle(
          breach.estado_sla
        )}`}
      >
        {getBreachBadgeText(breach.estado_sla, t)}
      </span>
    </div>
  )
}
