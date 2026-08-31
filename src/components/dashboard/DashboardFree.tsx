'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Monitor, Building, Building2, Sparkles, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
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
  onLogout: () => void
}

export default function DashboardFree({ cliente, onLogout }: Readonly<DashboardFreeProps>) {
  const { t } = useTranslation()
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
  } = useSupportTickets(true, cliente, 'none', null)
  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <div className="relative space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#38BDF8] font-bold">
                {t('dash.sin_suscripcion', 'Sin Suscripción Activa')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {t('dashboard.hola', 'Hola')}, {nombre}
              </h1>
              <p className="mt-1 text-sm text-[#8C9BB0] font-medium max-w-xl">
                {t(
                  'dash.activar_suscripcion_desc',
                  'Activá tu abono mensual para acceder al panel completo y soporte 24/7.'
                )}
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="mt-3 text-xs font-semibold text-[#8C9BB0] hover:text-rose-400 transition-colors cursor-pointer"
              >
                {t('dashboard.salir', 'Cerrar Sesión')}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tienda')}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{t('dash.subir_plan', 'Mejorar Plan')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

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

      <div className="pt-2">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
          {t('dashboard.vista_previa_planes', 'Vista previa por plan')}
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
                className="rounded-2xl border border-[#1E2638] bg-[#111622] p-6 shadow-sm cursor-default"
              >
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
                <p className="mt-5 text-[10px] font-mono text-[#64748B]">dashboard.{tier}.exe</p>
              </motion.div>
            )
          })}
        </div>
      </div>

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
