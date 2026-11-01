/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Monitor,
  Building,
  Building2,
  Sparkles,
  ArrowRight,
  Receipt,
  Plus,
  Calendar,
  CheckCircle2,
  Paperclip,
  Clock,
  Terminal,
  Calculator,
} from 'lucide-react'
import {
  CyberPlanBasic,
  CyberPlanAdvanced,
  CyberPlanPremium,
} from '@/components/ui/MagnificentIcons'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { PLAN_CATALOG } from '../../core/domain/planCatalog'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import type { DashboardView } from './DashboardView'
import type { EcosystemSubTab } from '../services/ServicesPanel'
import type { PlanData } from '../store/PlanCard'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel, { type TicketDraft } from './SupportTicketPanel'
import AdjuntarComprobanteModal from './AdjuntarComprobanteModal'
import HudButton from '../HudButton'

const PREVIEW_TIERS = [
  {
    tier: 'basico' as const,
    planId: 'mantenimiento-basico',
    icon: Monitor,
    cyberIcon: CyberPlanBasic,
  },
  {
    tier: 'avanzado' as const,
    planId: 'mantenimiento-avanzado',
    icon: Building,
    cyberIcon: CyberPlanAdvanced,
  },
  {
    tier: 'premium' as const,
    planId: 'mantenimiento-premium',
    icon: Building2,
    cyberIcon: CyberPlanPremium,
  },
]

type DashboardFreeProps = {
  cliente: Cliente | null
  suscripciones?: Suscripcion[]
  pagos?: Pago[]
  onRefresh?: () => void
  refreshing?: boolean
  onLogout: () => void
  onNavigate?: ((tab: DashboardView) => void) | undefined
  onOpenEcosystemSubTab?: ((subTab: EcosystemSubTab) => void) | undefined
  onOpenTicketModal?: ((draft?: TicketDraft) => void) | undefined
  onSelectCheckoutPlan?: ((plan: PlanData) => void) | undefined
}

function formatDate(d?: string | null, locale = 'es-AR') {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DashboardFree({
  cliente,
  suscripciones = [],
  pagos = [],
  onRefresh,
  refreshing: _refreshing,
  onLogout: _onLogout,
  onNavigate,
  onOpenEcosystemSubTab,
  onOpenTicketModal,
  onSelectCheckoutPlan,
}: Readonly<DashboardFreeProps>) {
  const { t, i18n } = useTranslation()
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'Cliente'
  const theme = PLAN_THEMES.basico
  const [localTicketOpen, setLocalTicketOpen] = useState(false)
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
  } = useSupportTickets(true, cliente, 'none', null)
  const unreadCount = notifications.filter((n) => !n.leida).length

  const totalPaid = useMemo(() => pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0), [pagos])

  const triggerOpenTicket = (draft?: TicketDraft) => {
    if (onOpenTicketModal) {
      onOpenTicketModal(draft)
      return
    }
    setLocalTicketOpen(true)
  }

  const handleDirectPlanActivate = (tierKey: 'basico' | 'avanzado' | 'premium', planId: string) => {
    const entry = PLAN_CATALOG.find((c) => c.id === planId)
    const planTheme = PLAN_THEMES[tierKey]
    const rawARS = entry?.precio ?? 32000
    const rawUSD = entry?.precioUSD ?? 28
    const matchIcon = PREVIEW_TIERS.find((p) => p.tier === tierKey)?.cyberIcon ?? CyberPlanBasic

    if (onSelectCheckoutPlan) {
      onSelectCheckoutPlan({
        id: planId,
        title: entry?.nombre ?? planTheme.badge,
        description: planTheme.subtitle,
        icon: matchIcon,
        color: 'from-cyan-400 to-purple-500',
        shadow: 'shadow-cyan-500/20',
        border: 'border-cyan-500/30',
        features: planTheme.perks,
        popular: tierKey === 'avanzado',
        rawPriceARS: rawARS,
        rawPriceUSD: rawUSD,
        price: '$' + rawARS.toLocaleString('es-AR'),
        priceUSD: '$' + rawUSD,
        period: '/mes',
      })
      return
    }

    onOpenEcosystemSubTab?.('store')
  }

  const handleRefresh = () => {
    onRefresh?.()
    refreshTickets()
  }

  return (
    <div className="relative space-y-7 font-sans">
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

      {/* 1. Header Hero Card (Acciones Directas sin Salir del Panel) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-300/90 dark:border-border bg-card p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs uppercase tracking-wider text-[#4361EE] dark:text-[#38BDF8] font-bold">
                  {suscripciones.length > 0
                    ? t('dash.suscripcion_en_revision', 'Cuenta Registrada')
                    : t('dash.sin_suscripcion', 'Panel Unificado de Cliente')}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('dash.cuenta_activa', 'Sesión Activa')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1 tracking-tight">
                {t('dashboard.hola', 'Hola')}, {nombre}
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground max-w-xl font-medium leading-relaxed">
                Desde este mismo panel podés activar tu abono en 1 clic, simular el ahorro de tu
                flota con Linux POS, cotizar módulos de turnos/tienda o hablar directo con
                ingeniería.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => triggerOpenTicket({ categoria: 'consulta' })}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted text-foreground border border-slate-300/80 dark:border-border font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>{t('dashboard.abrir_ticket', 'Abrir Ticket')}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenEcosystemSubTab?.('quoter')}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted text-foreground border border-slate-300/80 dark:border-border font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator size={16} className="text-cyan-500" />
              <span>Cotizador</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenEcosystemSubTab?.('linux')}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal size={16} />
              <span>Linux POS</span>
            </button>

            <button
              type="button"
              onClick={() => handleDirectPlanActivate('avanzado', 'mantenimiento-avanzado')}
              className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{t('dash.subir_plan', 'Activar Abono')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Metric Cards (Clickable Shortcuts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onOpenEcosystemSubTab?.('store')}
          className="text-left rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all cursor-pointer"
        >
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Plan Actual
          </p>
          <p className="text-lg font-bold text-foreground mt-1 truncate">
            {suscripciones[0]?.plan?.nombre ?? 'Cuenta Base (Web)'}
          </p>
          <span className="text-xs text-[#4361EE] dark:text-[#38BDF8] font-semibold mt-1 inline-block">
            Elegir plan en 1 clic →
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpenEcosystemSubTab?.('linux')}
          className="text-left rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Infraestructura &amp; POS
          </p>
          <p className="text-lg font-bold text-foreground mt-1 font-mono">99.99%</p>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1 inline-block">
            Edge Cloud + Linux LAN →
          </span>
        </button>

        <button
          type="button"
          onClick={() => triggerOpenTicket({ categoria: 'consulta' })}
          className="text-left rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all cursor-pointer"
        >
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Tickets Soporte
          </p>
          <p className="text-lg font-bold text-foreground mt-1 font-mono">{openCount}</p>
          <span className="text-xs text-muted-foreground font-medium mt-1 inline-block">
            {openCount === 0 ? 'Abrir consulta →' : `${openCount} en gestión →`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate?.('invoices')}
          className="text-left rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all cursor-pointer"
        >
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Comprobantes
          </p>
          <p className="text-lg font-bold text-foreground mt-1 font-mono">{pagos.length}</p>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1 inline-block">
            {pagos.length > 0
              ? `$${totalPaid.toLocaleString(i18n.language || 'es-AR')} registrado`
              : 'Ver facturación →'}
          </span>
        </button>
      </div>

      {/* 3. Pagos Registrados */}
      {pagos.length > 0 && (
        <div className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Receipt className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-base font-bold text-foreground">
                Comprobantes y Pagos Registrados
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Actualizar
            </button>
          </div>

          <div className="divide-y divide-border border-t border-border">
            {pagos.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-foreground">
                    {p.plan_nombre || 'Pago de Servicio / Abono'}
                  </span>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Comprobante ID: {p.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-foreground text-sm">
                    ${Number(p.monto).toLocaleString(i18n.language || 'es-AR')} {p.moneda}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                    {p.estado}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(p.created_at, i18n.language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Live Pulse Hub */}
      <ServicePulseHub
        theme={theme}
        tier="none"
        openTickets={openCount}
        unreadNotifications={unreadCount}
        notifications={notifications}
        onOpenTickets={() => triggerOpenTicket({ categoria: 'consulta' })}
        onMarkRead={markRead}
      />

      {/* 5. Activación Directa de Planes (Checkout en Modal sin Salir del Dashboard) */}
      <div className="pt-1">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('dashboard.vista_previa_planes', 'Activación Directa en 1 Clic (Sin Salir del Panel)')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PREVIEW_TIERS.map(({ tier, planId, icon: Icon }, i) => {
            const planTheme = PLAN_THEMES[tier]
            const catalogEntry = PLAN_CATALOG.find((c) => c.id === planId)
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border p-6 bg-card shadow-xs flex flex-col justify-between transition-all ${
                  tier === 'avanzado'
                    ? 'border-2 border-violet-500/50'
                    : 'border-slate-300/85 dark:border-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-10 h-10 rounded-xl border border-border bg-muted/40 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${planTheme.accent}`} />
                    </div>
                    {catalogEntry && (
                      <span className="font-mono text-sm font-extrabold text-foreground">
                        ${catalogEntry.precio.toLocaleString('es-AR')}
                        <span className="text-[11px] font-normal text-muted-foreground">/mes</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{planTheme.badge}</h3>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">
                    {planTheme.subtitle}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {planTheme.perks.slice(0, 3).map((p) => (
                      <li
                        key={p}
                        className="text-xs text-muted-foreground font-medium flex items-center gap-2"
                      >
                        <span className="text-[#38BDF8]">✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Pago directo CBU / PayPal
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDirectPlanActivate(tier, planId)}
                    className="text-xs font-bold text-[#4361EE] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Activar ahora</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {!onOpenTicketModal && (
        <SupportTicketPanel
          open={localTicketOpen}
          onClose={() => setLocalTicketOpen(false)}
          theme={theme}
          tier="none"
          tickets={tickets}
          openCount={openCount}
          submitting={submitting}
          error={ticketError}
          onSubmit={async (a, m, c) => {
            await createTicket(a, m, c)
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
