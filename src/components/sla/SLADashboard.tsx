/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { motion } from 'framer-motion'
import {
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  LifeBuoy,
  Zap,
  Terminal,
  FileText,
} from 'lucide-react'
import { useActiveSLA, useSLABreaches } from '../../hooks/useSLA'
import { useTranslation } from 'react-i18next'
import type { SLAContract, SLANivel, SLABreach } from '../../core/domain/entities/SLAContract'
import type { Ticket } from '../../core/domain/entities/Ticket'
import type { TicketDraft } from '../dashboard/SupportTicketPanel'

interface Props {
  tenantId: string
  tickets?: Ticket[] | undefined
  openCount?: number | undefined
  onOpenTicket?: ((draft?: TicketDraft) => void) | undefined
}

const NIVEL_CONFIG: Record<SLANivel, { color: string; bg: string }> = {
  basico: {
    color: 'text-[#38BDF8]',
    bg: 'bg-muted/40 border-border',
  },
  avanzado: {
    color: 'text-[#818CF8]',
    bg: 'bg-muted/40 border-border',
  },
  premium: {
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-muted/40 border-amber-500/30',
  },
  enterprise: {
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-muted/40 border-rose-500/30',
  },
}

const TICKET_STATUS_BADGE: Record<string, { label: string; style: string }> = {
  abierto: {
    label: 'Abierto',
    style: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  en_progreso: {
    label: 'En progreso',
    style: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  resuelto: {
    label: 'Resuelto',
    style: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  cerrado: {
    label: 'Cerrado',
    style: 'bg-muted text-muted-foreground border-border',
  },
}

function formatMinutes(minutos: number, t: (key: string, def: string) => string) {
  if (minutos >= 1440) return `${Math.floor(minutos / 1440)} ${t('common.dias', 'días')}`
  if (minutos >= 60) return `${Math.floor(minutos / 60)}h`
  return `${minutos} min`
}

export default function SLADashboard({
  tenantId,
  tickets = [],
  openCount = 0,
  onOpenTicket,
}: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: dbSla, isLoading: slaLoading } = useActiveSLA(tenantId)
  const { data: breaches = [], isLoading: breachesLoading } = useSLABreaches(tenantId)

  const sla = dbSla ?? null

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
    <div className="space-y-7 font-sans">
      {/* Header Unificado Tickets + SLA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5 tracking-tight">
            <Shield className="w-6 h-6 text-[#38BDF8]" />
            <span>Mesa de Ayuda, Tickets & Garantía SLA</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {openCount > 0
              ? `${openCount} ${openCount === 1 ? 'ticket activo' : 'tickets activos'} en seguimiento directo con ingeniería.`
              : t('sla.garantia', 'Tiempos de respuesta y resolución garantizados por contrato')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <span>{sla ? 'Contrato SLA Activo' : 'Mesa de Ayuda Activa'}</span>
          </div>

          {onOpenTicket && (
            <button
              type="button"
              onClick={() => onOpenTicket({ categoria: 'consulta' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Ticket Prioritario</span>
            </button>
          )}
        </div>
      </div>

      {/* Disparadores Rápidos en 1 Clic (Pre-cargan asunto y categoría) */}
      {onOpenTicket && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() =>
              onOpenTicket({
                asunto: 'Solicitud de ajuste o mejora visual / funcional',
                mensaje: 'Hola equipo, me gustaría realizar el siguiente cambio en mi sistema: ',
                categoria: 'consulta',
              })
            }
            className="text-left p-3.5 rounded-2xl border border-slate-300/85 dark:border-border bg-muted/30 hover:border-[#4361EE]/60 transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-[#4361EE]/15 text-[#4361EE] dark:text-[#38BDF8] shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Cambio / Nueva Mejora</p>
              <p className="text-[11px] text-muted-foreground">Abrir solicitud en 1 clic</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenTicket({
                asunto: 'Soporte en Terminal Linux POS / Red Local',
                mensaje: 'Necesito asistencia técnica o revisión remota SSH sobre: ',
                categoria: 'consulta',
              })
            }
            className="text-left p-3.5 rounded-2xl border border-slate-300/85 dark:border-border bg-muted/30 hover:border-emerald-500/60 transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Asistencia Linux / Servidor</p>
              <p className="text-[11px] text-muted-foreground">Guardia técnica & nodos POS</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenTicket({
                asunto: 'Consulta administrativa / Facturación',
                mensaje: 'Hola, tengo una consulta sobre mi abono o comprobante: ',
                categoria: 'consulta',
              })
            }
            className="text-left p-3.5 rounded-2xl border border-slate-300/85 dark:border-border bg-muted/30 hover:border-violet-500/60 transition-all cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Facturación & Abonos</p>
              <p className="text-[11px] text-muted-foreground">Comprobantes o cambios de plan</p>
            </div>
          </button>
        </div>
      )}

      {/* Historial de Tickets del Cliente en Vivo */}
      <div className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-[#38BDF8]" />
            <span>Tus Tickets Recientes ({tickets.length})</span>
          </h3>
          {onOpenTicket && (
            <button
              type="button"
              onClick={() => onOpenTicket()}
              className="text-xs font-bold text-[#38BDF8] hover:underline cursor-pointer"
            >
              Ver bandeja / Redactar →
            </button>
          )}
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-xl bg-muted/30 border border-border px-4 py-5 text-center">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              No tenés tickets abiertos ni incidencias pendientes. Todos tus sistemas operan al
              100%.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.slice(0, 6).map((tk) => {
              const badge = TICKET_STATUS_BADGE[tk.estado] ?? TICKET_STATUS_BADGE.abierto!
              return (
                <div
                  key={tk.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {tk.asunto}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {tk.mensaje}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {new Date(tk.created_at).toLocaleDateString(i18n.language || 'es-AR')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SLA Contract Card */}
      {sla ? (
        <>
          <SLACard sla={sla} />

          {/* Breach Summary Cards (solo si hay contrato SLA real) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-center shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
                {breaches.filter((b: SLABreach) => b.estado_sla === 'ok').length}
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {t('sla.dentro_sla', 'Dentro del SLA')}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-center shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {warningCount}
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {t('sla.por_vencer', 'Por vencer')}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5 text-center shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {breachCount}
              </p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">
                {t('sla.incumplidos', 'Incumplidos')}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center space-y-1.5">
          <p className="text-sm font-bold text-foreground">Sin contrato SLA dedicado asignado</p>
          <p className="text-xs text-muted-foreground">
            Tus tickets y consultas se atienden por orden de llegada en la mesa de ayuda.
          </p>
        </div>
      )}

      {/* Breach Details */}
      {breaches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
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
      className={`rounded-3xl border p-6 sm:p-7 ${config.bg} shadow-xs`}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{sla.nombre}</h3>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${config.color} mt-1 inline-block`}
          >
            {t('sla.nivel', 'Nivel')} {sla.nivel}
          </span>
        </div>
        {sla.horas_por_mes > 0 && (
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold font-mono text-foreground">
              {sla.horas_por_mes}h
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {t('sla.horas_desarrollo_mes', 'de desarrollo/mes')}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <Clock className="w-5 h-5 text-[#38BDF8] shrink-0" />
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              {t('sla.tiempo_respuesta', 'Tiempo de respuesta')}
            </p>
            <p className="text-sm font-bold font-mono text-foreground mt-0.5">
              {formatMinutes(sla.tiempo_respuesta_minutos, t)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <Clock className="w-5 h-5 text-[#818CF8] shrink-0" />
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              {t('sla.tiempo_resolucion', 'Tiempo de resolución')}
            </p>
            <p className="text-sm font-bold font-mono text-foreground mt-0.5">
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
    return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20'
  }
  if (estado === 'warning') {
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
  }
  return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
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
    <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-card border border-border shadow-xs">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{breach.asunto}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">
            {Math.floor(elapsed / 60)}h {Math.floor(elapsed % 60)}m{' '}
            {t('sla.transcurridos', 'transcurridos')}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {t('sla.limite', 'Límite')}: {formatMinutes(limit, t)}
          </span>
        </div>
        <div className="mt-2.5 h-2 bg-muted/40 rounded-full overflow-hidden">
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
