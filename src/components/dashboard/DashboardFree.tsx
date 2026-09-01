'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'

const PREVIEW_TIERS = [
  { tier: 'basico' as const, icon: Monitor },
  { tier: 'avanzado' as const, icon: Building },
  { tier: 'premium' as const, icon: Building2 },
]

type DashboardFreeProps = {
  cliente: Cliente | null
  suscripciones?: Suscripcion[]
  pagos?: Pago[]
  onRefresh?: () => void
  refreshing?: boolean
  onLogout: () => void
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
  onLogout,
}: Readonly<DashboardFreeProps>) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'Cliente'
  const theme = PLAN_THEMES.basico
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
  } = useSupportTickets(true, cliente, 'none', null)
  const unreadCount = notifications.filter((n) => !n.leida).length

  const totalPaid = useMemo(() => pagos.reduce((sum, p) => sum + Number(p.monto || 0), 0), [pagos])

  const handleRefresh = () => {
    onRefresh?.()
    refreshTickets()
  }

  return (
    <div className="relative space-y-8 font-sans">
      {/* 1. Header Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#1E2638] bg-[#111622] p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#151B28] border border-[#1E2638] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                  {suscripciones.length > 0
                    ? t('dash.suscripcion_en_revision', 'Cuenta Registrada')
                    : t('dash.sin_suscripcion', 'Sin Suscripción Activa')}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('dash.cuenta_activa', 'Sesión Activa')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {t('dashboard.hola', 'Hola')}, {nombre}
              </h1>

              <p className="mt-2 text-sm text-[#8C9BB0] max-w-xl font-medium leading-relaxed">
                {suscripciones.length > 0
                  ? t(
                      'dash.panel_cliente_desc',
                      'Tu cuenta está conectada. Podés gestionar tus tickets, revisar comprobantes de pago o activar más servicios.'
                    )
                  : t(
                      'dash.activar_suscripcion_desc',
                      'Explorá los servicios de desarrollo web, sistemas de turnos y abonos mensuales para tu negocio.'
                    )}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#8C9BB0]">
                <span>Email: {cliente?.email ?? '—'}</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {t('dashboard.salir', 'Cerrar Sesión')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <button
              type="button"
              onClick={() => setTicketPanelOpen(true)}
              className="flex-1 md:flex-initial px-4 py-3 rounded-xl bg-[#151B28] hover:bg-[#1C2438] text-slate-300 border border-[#1E2638] font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>{t('dashboard.abrir_ticket', 'Abrir Ticket')}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tienda')}
              className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{t('dash.subir_plan', 'Mejorar Plan')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-5 shadow-sm">
          <p className="text-xs text-[#8C9BB0] font-semibold uppercase tracking-wider">
            Plan Actual
          </p>
          <p className="text-lg font-bold text-white mt-1 truncate">
            {suscripciones[0]?.plan?.nombre ?? 'Plan Básico (Web)'}
          </p>
          <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">
            ● Cuenta verificada
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-5 shadow-sm">
          <p className="text-xs text-[#8C9BB0] font-semibold uppercase tracking-wider">
            Disponibilidad
          </p>
          <p className="text-lg font-bold text-white mt-1 font-mono">99.99%</p>
          <span className="text-xs text-[#38BDF8] font-medium mt-1 inline-block">
            Edge CDN Online
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-5 shadow-sm">
          <p className="text-xs text-[#8C9BB0] font-semibold uppercase tracking-wider">
            Tickets Soporte
          </p>
          <p className="text-lg font-bold text-white mt-1 font-mono">{openCount}</p>
          <span className="text-xs text-[#8C9BB0] font-medium mt-1 inline-block">
            {openCount === 0 ? 'Sin pendientes' : `${openCount} en gestión`}
          </span>
        </div>

        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-5 shadow-sm">
          <p className="text-xs text-[#8C9BB0] font-semibold uppercase tracking-wider">
            Comprobantes
          </p>
          <p className="text-lg font-bold text-white mt-1 font-mono">{pagos.length}</p>
          <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">
            {pagos.length > 0
              ? `$${totalPaid.toLocaleString(i18n.language || 'es-AR')} registrado`
              : 'Al día'}
          </span>
        </div>
      </div>

      {/* 3. Pagos Registrados (si existen) */}
      {pagos.length > 0 && (
        <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Receipt className="w-5 h-5 text-[#38BDF8]" />
              <h3 className="text-base font-bold text-white">Comprobantes y Pagos Registrados</h3>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs font-semibold text-[#8C9BB0] hover:text-white transition-colors cursor-pointer"
            >
              Actualizar
            </button>
          </div>

          <div className="divide-y divide-[#1E2638] border-t border-[#1E2638]">
            {pagos.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-white">
                    {p.plan_nombre || 'Pago de Servicio / Abono'}
                  </span>
                  <p className="text-[#8C9BB0] text-[11px] mt-0.5">
                    Comprobante ID: {p.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-white text-sm">
                    ${Number(p.monto).toLocaleString(i18n.language || 'es-AR')} {p.moneda}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    {p.estado}
                  </span>
                  <span className="text-[#64748B] flex items-center gap-1">
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
      <div>
        <ServicePulseHub
          theme={theme}
          tier="none"
          openTickets={openCount}
          unreadNotifications={unreadCount}
          notifications={notifications}
          onOpenTickets={() => setTicketPanelOpen(true)}
          onMarkRead={markRead}
        />
      </div>

      {/* 5. Vista Previa de Planes Disponibles */}
      <div className="pt-2">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
          {t('dashboard.vista_previa_planes', 'Soluciones y Planes Disponibles')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PREVIEW_TIERS.map(({ tier, icon: Icon }, i) => {
            const planTheme = PLAN_THEMES[tier]
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl border border-[#1E2638] bg-[#151B28] flex items-center justify-center mb-3.5">
                    <Icon className={`w-5 h-5 ${planTheme.accent}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{planTheme.badge}</h3>
                  <p className="mt-1 text-xs text-[#8C9BB0] font-medium">{planTheme.subtitle}</p>
                  <ul className="mt-4 space-y-2">
                    {planTheme.perks.slice(0, 3).map((p) => (
                      <li
                        key={p}
                        className="text-xs text-slate-300 font-medium flex items-center gap-2"
                      >
                        <span className="text-[#38BDF8]">✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2638] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#64748B]">dashboard.{tier}.exe</span>
                  <button
                    type="button"
                    onClick={() => navigate('/tienda')}
                    className="text-xs font-bold text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Ver detalle</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 6. Support Ticket Panel Modal */}
      <SupportTicketPanel
        open={ticketPanelOpen}
        onClose={() => setTicketPanelOpen(false)}
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
    </div>
  )
}
