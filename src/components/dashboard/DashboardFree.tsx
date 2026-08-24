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
    <div className="relative space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#090a12]/90 p-8 sm:p-10 backdrop-blur-2xl shadow-xl dark:shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400 font-black">
                {t('dash.sin_suscripcion', 'Sin Suscripción Activa')}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                {t('dashboard.hola', 'Hola')}, {nombre}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-xl text-sm sm:text-base font-medium">
                {t(
                  'dash.activar_suscripcion_desc',
                  'Activá tu abono mensual para acceder al panel completo y soporte 24/7.'
                )}
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                {t('dashboard.salir', 'Cerrar Sesión')}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tienda')}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-500 dark:via-purple-600 dark:to-pink-500 text-white font-black hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
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

      <div className="pt-4">
        <p className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 text-center">
          {t('dashboard.vista_previa_planes', 'Vista previa por plan')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PREVIEW_TIERS.map(({ tier, icon: Icon }, i) => {
            const t = PLAN_THEMES[tier]
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border ${t.border} bg-white/90 dark:bg-[#090a12]/90 p-7 backdrop-blur-xl shadow-md dark:shadow-xl cursor-default transition-all`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl border ${t.border} flex items-center justify-center mb-4 ${t.glow} shadow-sm`}
                >
                  <Icon className={`w-6 h-6 ${t.accent}`} />
                </div>
                <h3 className={`text-xl font-black ${t.accent}`}>{t.badge}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {t.subtitle}
                </p>
                <ul className="mt-5 space-y-2">
                  {t.perks.slice(0, 3).map((p) => (
                    <li
                      key={p}
                      className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2"
                    >
                      <span className="text-cyan-500">✦</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  dashboard.{tier}.exe
                </p>
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
