/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useMemo, useState } from 'react'
import {
  Crown,
  Monitor,
  Building,
  Building2,
  Download,
  Plus,
  Paperclip,
  Clock,
  RefreshCw,
  Receipt,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import type { PlanTier } from './resolvePlanTier'
import type { DashboardView } from './DashboardView'
import type { EcosystemSubTab } from '../services/ServicesPanel'
import type { PlanData } from '../store/PlanCard'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel, { type TicketDraft } from './SupportTicketPanel'
import AdjuntarComprobanteModal from './AdjuntarComprobanteModal'
import HudButton from '../HudButton'
import { useTranslation } from 'react-i18next'
import {
  MetricGrid,
  QuickActionsHub,
  ActivityTimeline,
  PerksPanel,
  SupportCard,
} from './shared/DashboardPrimitives'

const TIER_ICONS = {
  basico: Monitor,
  avanzado: Building,
  premium: Building2,
} as const

function formatDate(d?: string | null, locale = 'es-AR') {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

type PlanDashboardViewProps = {
  tier: Exclude<PlanTier, 'none'>
  cliente: Cliente | null
  suscripciones: Suscripcion[]
  pagos: Pago[]
  onRefresh: () => void
  refreshing: boolean
  onLogout: () => void
  onNavigate?: ((tab: DashboardView) => void) | undefined
  onOpenEcosystemSubTab?: ((subTab: EcosystemSubTab) => void) | undefined
  onOpenTicketModal?: ((draft?: TicketDraft) => void) | undefined
  onSelectCheckoutPlan?: ((plan: PlanData) => void) | undefined
}

export default function PlanDashboardView({
  tier,
  cliente,
  suscripciones,
  pagos,
  onRefresh,
  refreshing,
  onLogout: _onLogout,
  onNavigate,
  onOpenEcosystemSubTab,
  onOpenTicketModal,
}: Readonly<PlanDashboardViewProps>) {
  const { t, i18n } = useTranslation()
  const theme = PLAN_THEMES[tier]
  const Icon = tier === 'premium' ? Crown : TIER_ICONS[tier]
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'Cliente'
  const planSlug = suscripciones[0]?.plan?.slug ?? pagos[0]?.plan_slug ?? null
  const [localTicketOpen, setLocalTicketOpen] = useState(false)
  const [localTicketDraft, setLocalTicketDraft] = useState<TicketDraft | null>(null)
  const [comprobanteModalOpen, setComprobanteModalOpen] = useState(false)
  const pendingPago = pagos.find((p) => p.estado === 'pendiente')

  const {
    tickets,
    notifications,
    openCount,
    submitting,
    error: ticketError,
    createTicket,
    markRead,
    refresh: refreshTickets,
  } = useSupportTickets(true, cliente, tier, planSlug)

  const triggerOpenTicket = (draft?: TicketDraft) => {
    if (onOpenTicketModal) {
      onOpenTicketModal(draft)
      return
    }
    setLocalTicketDraft(draft ?? null)
    setLocalTicketOpen(true)
  }

  const activePlanName =
    suscripciones[0]?.plan?.nombre ??
    (tier === 'premium'
      ? 'Plan Premium Custom'
      : tier === 'avanzado'
        ? 'Plan Avanzado'
        : 'Plan Básico')

  const totalPaid = pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0)

  const unreadCount = notifications.filter((n) => !n.leida).length

  const realMetrics = useMemo(() => {
    const subStatus = suscripciones[0]?.estado
    return [
      {
        label: 'Plan Contratado',
        value: activePlanName,
        delta:
          subStatus === 'activa'
            ? 'Activo ●'
            : subStatus === 'pendiente'
              ? 'Pendiente ●'
              : 'Vigente ●',
        trend: subStatus === 'pendiente' ? ('neutral' as const) : ('up' as const),
      },
      {
        label: 'Pagos Registrados',
        value: String(pagos.length),
        delta:
          pagos.length > 0
            ? `$${totalPaid.toLocaleString(i18n.language || 'es-AR')} abonado`
            : 'Sin pagos aún',
        trend: pagos.length > 0 ? ('up' as const) : ('neutral' as const),
      },
      {
        label: 'Tickets de Soporte',
        value: String(openCount),
        delta: openCount === 0 ? 'Sin pendientes ↗' : `${openCount} en curso ↘`,
        trend: openCount === 0 ? ('up' as const) : ('down' as const),
      },
      {
        label: 'Alertas sin leer',
        value: String(unreadCount),
        delta: unreadCount === 0 ? 'Al día ↗' : `${unreadCount} nuevas`,
        trend: unreadCount === 0 ? ('up' as const) : ('neutral' as const),
      },
    ]
  }, [
    activePlanName,
    suscripciones,
    openCount,
    unreadCount,
    pagos.length,
    totalPaid,
    i18n.language,
  ])

  const realActivities = useMemo(() => {
    const items = []
    if (suscripciones[0]) {
      items.push({
        label: `Suscripción ${suscripciones[0].estado}: ${activePlanName}`,
        time: formatDate(suscripciones[0].fecha_inicio, i18n.language),
        status: suscripciones[0].estado === 'activa' ? ('ok' as const) : ('info' as const),
      })
    }
    for (const pago of pagos.slice(0, 3)) {
      items.push({
        label: `Pago ${pago.estado}: $${pago.monto} ${pago.moneda} (${pago.plan_nombre || activePlanName})`,
        time: formatDate(pago.created_at, i18n.language),
        status: pago.estado === 'aprobado' ? ('ok' as const) : ('warn' as const),
      })
    }
    for (const ticket of tickets.slice(0, 2)) {
      items.push({
        label: `Ticket #${ticket.id.slice(0, 6)}: ${ticket.asunto}`,
        time: formatDate(ticket.created_at, i18n.language),
        status: ticket.estado === 'abierto' ? ('warn' as const) : ('ok' as const),
      })
    }
    return items
  }, [suscripciones, activePlanName, pagos, tickets, i18n.language])

  const handleRefresh = () => {
    onRefresh()
    refreshTickets()
  }

  const handleExportSummary = () => {
    if (typeof window === 'undefined') return
    const lines = [
      'EXEPAGINASWEB — RESUMEN EJECUTIVO DE CUENTA',
      `Fecha de emisión: ${new Date().toLocaleString('es-AR')}`,
      `Cliente: ${cliente?.full_name || nombre} (${cliente?.email || '—'})`,
      `Plan vigente: ${activePlanName} (${theme.badge})`,
      `Estado suscripción: ${suscripciones[0]?.estado || 'vigente'}`,
      `Tickets activos: ${openCount}`,
      `Comprobantes registrados: ${pagos.length} (Total abonado: $${totalPaid.toLocaleString('es-AR')})`,
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resumen-exepaginasweb-${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Resumen exportado', {
      description: 'Se descargó el estado ejecutivo de tu cuenta.',
    })
  }

  const handleMetricShortcut = (index: number) => {
    if (index === 0) onOpenEcosystemSubTab?.('store')
    else if (index === 1) onNavigate?.('invoices')
    else if (index === 2) triggerOpenTicket({ categoria: 'consulta' })
    else if (index === 3) triggerOpenTicket({ categoria: 'consulta' })
  }

  const investmentText = suscripciones[0]?.plan?.precio
    ? `$${suscripciones[0].plan.precio} / mes`
    : pagos[0]
      ? `$${pagos[0].monto} ${pagos[0].moneda}`
      : 'Abono Activo'

  return (
    <div className="relative space-y-6">
      {/* 1. Header Welcome Section with Direct Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t('dashboard.hola', 'Hola')}, {nombre}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted/50 border border-border text-[#4361EE] dark:text-[#38BDF8] flex items-center gap-1">
              <Icon size={12} />
              {theme.badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t(
              'dashboard.subtitulo_real',
              'Estado real de tu suscripción, comprobantes de pago, tickets y herramientas activas.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Sincronizar datos en vivo"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-slate-300/80 dark:border-border text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#4361EE]' : ''}`}
            />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/40 hover:bg-muted text-foreground border border-slate-300/80 dark:border-border text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{t('dashboard.export_data', 'Exportar Resumen')}</span>
          </button>

          <button
            type="button"
            onClick={() => triggerOpenTicket({ categoria: 'consulta' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('dashboard.create_report', 'Solicitar Mejora / Ticket')}</span>
          </button>
        </div>
      </div>

      {/* Banner de transferencia registrada / pendiente */}
      {pendingPago && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Transferencia en proceso de verificación
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Registraste tu suscripción para {pendingPago.plan_nombre || 'tu abono'}. Adjuntá tu
                comprobante de pago para acelerar la activación.
              </p>
            </div>
          </div>
          <HudButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setComprobanteModalOpen(true)}
            icon={<Paperclip className="w-3.5 h-3.5" />}
          >
            Adjuntar Comprobante
          </HudButton>
        </div>
      )}

      {/* 2. Top 4 Metric Cards (1-Click Direct Shortcuts) */}
      <MetricGrid metrics={realMetrics} theme={theme} onMetricClick={handleMetricShortcut} />

      {/* 3. Estado Real de Suscripción, Pagos y Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial real de pagos (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#4361EE] dark:text-[#38BDF8]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Últimos Pagos &amp; Comprobantes
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setComprobanteModalOpen(true)}
                className="text-xs font-semibold text-foreground hover:text-[#4361EE] dark:hover:text-[#38BDF8] inline-flex items-center gap-1 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Adjuntar</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('invoices')}
                className="text-xs font-bold text-[#4361EE] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas las facturas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {pagos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Todavía no registraste pagos en esta cuenta
              </p>
              <p className="text-xs text-muted-foreground">
                Cuando abones un plan o adjuntes un comprobante de transferencia, aparecerá acá con
                su estado real.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pagos.slice(0, 4).map((pago) => {
                const isApproved = pago.estado === 'aprobado'
                const isPending = pago.estado === 'pendiente'
                return (
                  <div
                    key={pago.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {pago.plan_nombre || activePlanName}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {formatDate(pago.created_at, i18n.language)} · #{pago.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold font-mono text-foreground">
                        ${pago.monto} {pago.moneda}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : isPending
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {pago.estado}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Estado de Suscripción & Tickets Recientes (1 col) */}
        <div className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tu Abono Actual
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {suscripciones[0]?.estado || 'Activo'}
              </span>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{investmentText}</p>
            {suscripciones[0] && (
              <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border">
                <div className="flex justify-between">
                  <span>Inicio:</span>
                  <span className="text-foreground font-medium">
                    {formatDate(suscripciones[0].fecha_inicio, i18n.language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="text-foreground font-medium">{activePlanName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-[#38BDF8]" />
                Tickets Recientes ({tickets.length})
              </span>
              <button
                type="button"
                onClick={() => triggerOpenTicket({ categoria: 'consulta' })}
                className="text-xs font-bold text-[#4361EE] dark:text-[#38BDF8] hover:underline cursor-pointer"
              >
                + Nuevo
              </button>
            </div>
            {tickets.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Sin tickets abiertos. Escribinos ante cualquier cambio o consulta.
              </p>
            ) : (
              <div className="space-y-1.5">
                {tickets.slice(0, 2).map((tk) => (
                  <button
                    key={tk.id}
                    type="button"
                    onClick={() => triggerOpenTicket({ categoria: 'consulta' })}
                    className="w-full text-left flex items-center justify-between gap-2 rounded-lg bg-muted/40 hover:bg-muted px-3 py-2 text-xs transition-colors cursor-pointer"
                  >
                    <span className="truncate font-medium text-foreground">{tk.asunto}</span>
                    <span className="shrink-0 text-[10px] font-mono uppercase text-muted-foreground">
                      {tk.estado}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Actions & Live Pulse */}
      <div className="space-y-6 pt-1">
        <QuickActionsHub
          onOpenTicket={(draft) => triggerOpenTicket(draft)}
          onOpenQuoter={() => onOpenEcosystemSubTab?.('quoter')}
          onOpenLinux={() => onOpenEcosystemSubTab?.('linux')}
          onOpenInvoices={() => onNavigate?.('invoices')}
          userEmail={cliente?.email}
        />

        <ServicePulseHub
          theme={theme}
          tier={tier}
          openTickets={openCount}
          unreadNotifications={unreadCount}
          notifications={notifications}
          planLabel={activePlanName}
          accountStatus={suscripciones[0]?.estado === 'activa' ? 'Activa' : 'Vigente'}
          onOpenTickets={() => triggerOpenTicket({ categoria: 'consulta' })}
          onMarkRead={markRead}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityTimeline items={realActivities} theme={theme} />
          </div>

          <div className="space-y-6">
            <PerksPanel perks={theme.perks} theme={theme} />
            <SupportCard
              theme={theme}
              openCount={openCount}
              onOpenTicket={() => triggerOpenTicket({ categoria: 'consulta' })}
            />

            <div className="rounded-2xl bg-card border border-slate-300/85 dark:border-border p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t('dashboard.tu_cuenta', 'Tu cuenta')}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate?.('settings')}
                  className="text-[11px] font-bold text-[#4361EE] dark:text-[#38BDF8] hover:underline cursor-pointer"
                >
                  Editar →
                </button>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center gap-3 pb-2 border-b border-border">
                  <span className="text-muted-foreground">{t('dashboard.email', 'Email')}</span>
                  <span className="text-foreground font-medium truncate max-w-[190px]">
                    {cliente?.email ?? '—'}
                  </span>
                </div>
                {suscripciones[0] && (
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-muted-foreground">{t('dashboard.desde', 'Desde')}</span>
                    <span className="text-foreground font-medium">
                      {formatDate(suscripciones[0].fecha_inicio, i18n.language)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {pagos.length > 0 && (
              <div className="rounded-2xl bg-card border border-slate-300/85 dark:border-border p-5 shadow-xs space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('dashboard.ultimo_pago', 'Último pago')}
                </p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  ${pagos[0]!.monto} {pagos[0]!.moneda}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide">
                  ● {pagos[0]!.estado}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fallback local modal si se usa fuera de DashboardViewport */}
      {!onOpenTicketModal && (
        <SupportTicketPanel
          open={localTicketOpen}
          onClose={() => setLocalTicketOpen(false)}
          theme={theme}
          tier={tier}
          tickets={tickets}
          openCount={openCount}
          submitting={submitting}
          error={ticketError}
          initialDraft={localTicketDraft}
          onSubmit={async (asunto, mensaje, categoria) => {
            await createTicket(asunto, mensaje, categoria)
          }}
        />
      )}

      <AdjuntarComprobanteModal
        open={comprobanteModalOpen}
        onClose={() => setComprobanteModalOpen(false)}
        pagos={pagos}
        onSuccess={handleRefresh}
      />
    </div>
  )
}
