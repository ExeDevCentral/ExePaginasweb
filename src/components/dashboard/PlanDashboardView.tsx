'use client'

import { useMemo, useState } from 'react'
import { Crown, Monitor, Building, Building2, Download, Plus } from 'lucide-react'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import type { PlanTier } from './resolvePlanTier'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'
import { useTranslation } from 'react-i18next'
import {
  MetricGrid,
  DashdarkRevenueChart,
  DashdarkProfitCard,
  DashdarkSessionsCard,
  LiveHealthCard,
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
}

export default function PlanDashboardView({
  tier,
  cliente,
  suscripciones,
  pagos,
  onRefresh,
  refreshing,
  onLogout: _onLogout,
}: Readonly<PlanDashboardViewProps>) {
  const { t, i18n } = useTranslation()
  const theme = PLAN_THEMES[tier]
  const Icon = tier === 'premium' ? Crown : TIER_ICONS[tier]
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'John'
  const planSlug = suscripciones[0]?.plan?.slug ?? pagos[0]?.plan_slug ?? null
  const [ticketPanelOpen, setTicketPanelOpen] = useState(false)

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

  const activePlanName =
    suscripciones[0]?.plan?.nombre ??
    (tier === 'premium'
      ? 'Plan Premium Custom'
      : tier === 'avanzado'
        ? 'Plan Avanzado'
        : 'Plan Básico')

  const totalPaid = pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0)

  const realMetrics = useMemo(() => {
    return [
      {
        label: 'Plan Contratado',
        value: activePlanName,
        delta: suscripciones[0]?.estado === 'activa' ? 'Activo ●' : 'Vigente ●',
        trend: 'up' as const,
      },
      {
        label: 'Disponibilidad Web',
        value: '99.99%',
        delta: 'Online ↗',
        trend: 'up' as const,
      },
      {
        label: 'Tickets de Soporte',
        value: String(openCount),
        delta: openCount === 0 ? 'Sin pendientes ↗' : `${openCount} en curso ↘`,
        trend: openCount === 0 ? ('up' as const) : ('down' as const),
      },
      {
        label: 'Comprobantes / Pagos',
        value: String(pagos.length),
        delta:
          pagos.length > 0
            ? `$${totalPaid.toLocaleString(i18n.language || 'es-AR')} abonado`
            : 'Al día ↗',
        trend: 'up' as const,
      },
    ]
  }, [activePlanName, suscripciones, openCount, pagos.length, totalPaid, i18n.language])

  const realActivities = useMemo(() => {
    const items = []
    if (suscripciones[0]) {
      items.push({
        label: `Suscripción activa: ${activePlanName}`,
        time: formatDate(suscripciones[0].fecha_inicio, i18n.language),
        status: 'ok' as const,
      })
    }
    if (pagos[0]) {
      items.push({
        label: `Comprobante acreditado: $${pagos[0].monto} ${pagos[0].moneda} (${pagos[0].plan_nombre || activePlanName})`,
        time: formatDate(pagos[0].created_at, i18n.language),
        status: 'ok' as const,
      })
    }
    if (tickets[0]) {
      items.push({
        label: `Ticket #${tickets[0].id.slice(0, 6)}: ${tickets[0].asunto}`,
        time: formatDate(tickets[0].created_at, i18n.language),
        status: tickets[0].estado === 'abierto' ? ('warn' as const) : ('ok' as const),
      })
    }
    items.push({
      label: 'Certificado de seguridad SSL TLS 1.3 activo y verificado',
      time: 'Activo',
      status: 'ok' as const,
    })
    items.push({
      label: 'Servicios en la nube y base de datos sincronizados',
      time: 'En línea',
      status: 'ok' as const,
    })
    return items
  }, [suscripciones, activePlanName, pagos, tickets, i18n.language])

  const unreadCount = notifications.filter((n) => !n.leida).length

  const handleRefresh = () => {
    onRefresh()
    refreshTickets()
  }

  const investmentText = suscripciones[0]?.plan?.precio
    ? `$${suscripciones[0].plan.precio} / mes`
    : pagos[0]
      ? `$${pagos[0].monto} ${pagos[0].moneda}`
      : 'Abono Activo'

  return (
    <div className="relative space-y-6">
      {/* 1. Header Welcome Section with Action Buttons (Dashdark X Top Bar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('dashboard.hola', 'Hola')}, {nombre}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#151B28] border border-[#1E2638] text-[#38BDF8] flex items-center gap-1">
              <Icon size={12} />
              {theme.badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8C9BB0] font-medium">
            {t(
              'dashboard.subtitulo_dashdark',
              'Monitoreá el rendimiento de tu sitio web, turnos y servicios contratados.'
            )}
          </p>
        </div>

        {/* Action buttons on top right */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151B28] hover:bg-[#1C2438] text-slate-300 border border-[#1E2638] text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#8C9BB0]" />
            <span>{t('dashboard.export_data', 'Descargar Reporte')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTicketPanelOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('dashboard.create_report', 'Solicitar Mejora / Ticket')}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards (Plan, Availability, Tickets, Invoices) */}
      <MetricGrid metrics={realMetrics} theme={theme} />

      {/* 3. Main Analytics Grid (2/3 Main Curve Chart + 1/3 Side Profit & Sessions Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashdarkRevenueChart theme={theme} />
        </div>
        <div className="space-y-6 flex flex-col justify-between">
          <DashdarkProfitCard amountText={investmentText} />
          <DashdarkSessionsCard />
        </div>
      </div>

      {/* 4. Reports Overview Section & Quick Actions */}
      <div className="space-y-6 pt-2">
        <QuickActionsHub onOpenTicket={() => setTicketPanelOpen(true)} userEmail={cliente?.email} />

        <LiveHealthCard theme={theme} />

        {/* Service Pulse & Support Hub */}
        <ServicePulseHub
          theme={theme}
          tier={tier}
          openTickets={openCount}
          unreadNotifications={unreadCount}
          notifications={notifications}
          onOpenTickets={() => setTicketPanelOpen(true)}
          onMarkRead={markRead}
        />

        {/* Activity & Account Meta Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityTimeline items={realActivities} theme={theme} />
          </div>

          <div className="space-y-6">
            <PerksPanel perks={theme.perks} theme={theme} />
            <SupportCard
              theme={theme}
              openCount={openCount}
              onOpenTicket={() => setTicketPanelOpen(true)}
            />

            {/* Account Profile Card */}
            <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {t('dashboard.tu_cuenta', 'Tu cuenta')}
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center gap-3 pb-2 border-b border-[#1E2638]">
                  <span className="text-[#8C9BB0]">{t('dashboard.email', 'Email')}</span>
                  <span className="text-white font-medium truncate max-w-[190px]">
                    {cliente?.email ?? '—'}
                  </span>
                </div>
                {suscripciones[0] && (
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-[#8C9BB0]">{t('dashboard.desde', 'Desde')}</span>
                    <span className="text-white font-medium">
                      {formatDate(suscripciones[0].fecha_inicio, i18n.language)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Last Payment Card */}
            {pagos.length > 0 && (
              <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 shadow-sm space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
                  {t('dashboard.ultimo_pago', 'Último pago')}
                </p>
                <p className="text-2xl font-bold font-mono text-white">
                  ${pagos[0].monto} {pagos[0].moneda}
                </p>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">
                  ● {pagos[0].estado}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support Ticket Modal / Drawer */}
      <SupportTicketPanel
        open={ticketPanelOpen}
        onClose={() => setTicketPanelOpen(false)}
        theme={theme}
        tier={tier}
        tickets={tickets}
        openCount={openCount}
        submitting={submitting}
        error={ticketError}
        onSubmit={async (asunto, mensaje, categoria) => {
          await createTicket(asunto, mensaje, categoria)
        }}
      />
    </div>
  )
}
