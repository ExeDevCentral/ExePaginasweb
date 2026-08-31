'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Monitor,
  Building,
  Building2,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  Globe,
  MessageSquare,
  ShieldCheck,
  Zap,
  PhoneCall,
  Check,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import { useSupportTickets } from '../../hooks/useSupportTickets'
import { PLAN_THEMES } from './planDashboardConfig'
import ServicePulseHub from './ServicePulseHub'
import SupportTicketPanel from './SupportTicketPanel'
import { toast } from 'sonner'

const PREVIEW_TIERS = [
  {
    tier: 'basico' as const,
    icon: Monitor,
    price: '$32.000 ARS / mes',
    badge: 'Abono Básico Web',
    desc: 'Hosting Edge, SSL, Mantenimiento preventivo y Uptime 99.99%.',
  },
  {
    tier: 'avanzado' as const,
    icon: Building,
    price: '$65.000 ARS / mes',
    badge: 'Abono Avanzado + Turnos',
    desc: 'Motor de reservas 24/7, Bot WhatsApp recordatorios y base de clientes.',
    popular: true,
  },
  {
    tier: 'premium' as const,
    icon: Building2,
    price: '$195.000 ARS / mes',
    badge: 'Abono Enterprise PRO',
    desc: 'Multi-sede, pasarela Mercado Pago/PayPal, PWA y SLA prioritario < 1h.',
  },
]

type DashboardFreeProps = {
  cliente: Cliente | null
  onLogout: () => void
}

export default function DashboardFree({
  cliente,
  onLogout: _onLogout,
}: Readonly<DashboardFreeProps>) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const nombre = cliente?.full_name?.split(' ')[0] ?? 'Cliente'
  const theme = PLAN_THEMES.basico
  const [ticketPanelOpen, setTicketPanelOpen] = useState(false)

  // Interactive Booking Simulator state
  const [simService, setSimService] = useState<'peluqueria' | 'padel' | 'medico' | 'comercio'>(
    'padel'
  )
  const [simTime, setSimTime] = useState('18:00')
  const [simConfirmed, setSimConfirmed] = useState(false)

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

  const handleSimulateBooking = () => {
    setSimConfirmed(true)
    toast.success('¡Reserva de prueba generada!', {
      description: 'El bot de WhatsApp enviaría confirmación y recordatorio automático 24h antes.',
    })
    setTimeout(() => {
      setSimConfirmed(false)
    }, 4500)
  }

  return (
    <div className="relative space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. WELCOME & WORKSPACE READY BANNER */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-[#1E2638] bg-gradient-to-br from-[#111622] via-[#151B28] to-[#0D111A] p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4361EE]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2438] border border-[#2A364F] text-[#38BDF8] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espacio de Trabajo Configurado & Listo para Despegar</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('dashboard.hola', 'Hola')}, {nombre} 👋
            </h1>

            <p className="text-sm text-[#8C9BB0] font-medium leading-relaxed">
              Bienvenido al centro de operaciones de{' '}
              <strong className="text-white">ExeSistemasWEB</strong>. Desde este panel podés
              gestionar tu sitio web, sistema de turnos, bot de WhatsApp, equipo de trabajo y
              soporte técnico garantizado.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Seguridad SSL TLS 1.3
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                <Zap className="w-4 h-4 text-sky-400" />
                Vercel Edge Global CDN
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <Clock className="w-4 h-4 text-indigo-400" />
                SLA &lt; 2hs de Respuesta
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Acabo%20de%20ingresar%20al%20panel%20y%20quiero%20poner%20en%20marcha%20mi%20sitio"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-[#151B28] hover:bg-[#1C2438] text-white border border-[#1E2638] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Hablar con un Asesor VIP</span>
            </a>

            <button
              type="button"
              onClick={() => navigate('/tienda')}
              className="px-6 py-3 rounded-2xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#4361EE]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Ver Planes & Activar Abono</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. ONBOARDING QUICK LAUNCHPAD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#4361EE] bg-[#4361EE]/10 px-2.5 py-1 rounded-lg border border-[#4361EE]/20">
                PASO 1
              </span>
              <Globe className="w-4 h-4 text-[#8C9BB0]" />
            </div>
            <h3 className="text-sm font-bold text-white">Dominio & Sitio Web</h3>
            <p className="text-xs text-[#8C9BB0] mt-1">
              Despliegue de tu página en Vercel Edge con CDN mundial y optimización SEO 100/100.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Listo para conectar
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-1 rounded-lg border border-[#38BDF8]/20">
                PASO 2
              </span>
              <Calendar className="w-4 h-4 text-[#8C9BB0]" />
            </div>
            <h3 className="text-sm font-bold text-white">Sistema de Turnos & Bot</h3>
            <p className="text-xs text-[#8C9BB0] mt-1">
              Reservas 24/7 con recordatorios automáticos por WhatsApp y base de datos propia.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between">
            <span className="text-[11px] text-[#38BDF8] font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Módulo Sandbox activo
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#A855F7] bg-[#A855F7]/10 px-2.5 py-1 rounded-lg border border-[#A855F7]/20">
                PASO 3
              </span>
              <ShieldCheck className="w-4 h-4 text-[#8C9BB0]" />
            </div>
            <h3 className="text-sm font-bold text-white">Mantenimiento & SLA</h3>
            <p className="text-xs text-[#8C9BB0] mt-1">
              Atención prioritaria inmediata, copias de seguridad diarias y soporte continuo.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between">
            <span className="text-[11px] text-[#A855F7] font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Soporte VIP garantizado
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE TURNOS & WHATSAPP ENGINE SIMULATOR */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#111622] border border-[#1E2638] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E2638]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Simulador del Motor de Turnos & WhatsApp en Vivo
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1">
              Probá cómo funciona la experiencia de reserva que tendrán tus clientes desde tu página
              web.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimService('padel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                simService === 'padel' ? 'bg-[#4361EE] text-white' : 'bg-[#151B28] text-[#8C9BB0]'
              }`}
            >
              Canchas / Pádel
            </button>
            <button
              type="button"
              onClick={() => setSimService('peluqueria')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                simService === 'peluqueria'
                  ? 'bg-[#4361EE] text-white'
                  : 'bg-[#151B28] text-[#8C9BB0]'
              }`}
            >
              Peluquería / Barber
            </button>
            <button
              type="button"
              onClick={() => setSimService('medico')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                simService === 'medico' ? 'bg-[#4361EE] text-white' : 'bg-[#151B28] text-[#8C9BB0]'
              }`}
            >
              Consultorio
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
          {/* Left: Interactive Booking Card */}
          <div className="lg:col-span-7 bg-[#151B28] border border-[#1E2638] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
              Paso 1: Seleccionar Horario de Reserva
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['14:00', '15:30', '17:00', '18:00', '19:30', '21:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSimTime(time)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    simTime === time
                      ? 'bg-[#4361EE] border-[#4361EE] text-white shadow-md'
                      : 'bg-[#111622] border-[#1E2638] text-slate-300 hover:border-[#4361EE]/50'
                  }`}
                >
                  {time} hs
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#111622] border border-[#1E2638] space-y-2 text-xs">
              <div className="flex justify-between text-[#8C9BB0]">
                <span>Servicio seleccionado:</span>
                <span className="font-bold text-white uppercase">{simService}</span>
              </div>
              <div className="flex justify-between text-[#8C9BB0]">
                <span>Horario reservado:</span>
                <span className="font-bold text-[#38BDF8]">{simTime} hs (Hoy)</span>
              </div>
              <div className="flex justify-between text-[#8C9BB0]">
                <span>Notificación:</span>
                <span className="font-bold text-emerald-400">WhatsApp Instantáneo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateBooking}
              disabled={simConfirmed}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4361EE] to-[#38BDF8] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {simConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡Reserva Confirmada & Notificación Enviada!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Probar Confirmación de Reserva</span>
                </>
              )}
            </button>
          </div>

          {/* Right: WhatsApp Notification Preview */}
          <div className="lg:col-span-5 bg-[#0B0E14] border border-[#1E2638] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Bot ExeSistemasWEB</p>
                <p className="text-[10px] text-emerald-400">En línea · Respuestas automáticas</p>
              </div>
            </div>

            <div className="bg-[#151B28] rounded-2xl rounded-tl-sm p-4 border border-[#1E2638] text-xs text-slate-200 space-y-2">
              <p className="font-bold text-emerald-400">✅ ¡Turno Confirmado!</p>
              <p className="text-[11px] leading-relaxed text-[#8C9BB0]">
                Hola <strong className="text-white">{nombre}</strong>, tu turno para{' '}
                <strong className="text-white">{simService}</strong> a las{' '}
                <strong className="text-[#38BDF8]">{simTime} hs</strong> ha sido registrado con
                éxito.
              </p>
              <p className="text-[10px] text-[#64748B] pt-1 border-t border-[#1E2638]">
                🔔 Te enviaremos un recordatorio 24h antes para confirmar tu asistencia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PLANS & UPGRADE CARDS */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Planes de Mantenimiento & Abonos</h2>
            <p className="text-xs text-[#8C9BB0]">
              Elegí el plan que mejor se adapte a las necesidades de tu negocio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tienda')}
            className="text-xs font-bold text-[#38BDF8] hover:underline flex items-center gap-1 w-fit"
          >
            <span>Ver comparativa completa en tienda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PREVIEW_TIERS.map(({ tier, icon: Icon, price, badge, desc, popular }, i) => {
            const planTheme = PLAN_THEMES[tier]
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between shadow-sm transition-all ${
                  popular
                    ? 'bg-[#151B28] border-[#4361EE] shadow-lg shadow-[#4361EE]/10'
                    : 'bg-[#111622] border-[#1E2638] hover:border-[#2A364F]'
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#4361EE] text-[10px] font-extrabold uppercase text-white tracking-wider shadow-sm">
                    Recomendado
                  </span>
                )}

                <div>
                  <div className="w-10 h-10 rounded-xl border border-[#1E2638] bg-[#151B28] flex items-center justify-center mb-3.5 text-[#38BDF8]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{badge}</h3>
                  <p className="text-xs font-mono font-bold text-[#38BDF8] mt-1">{price}</p>
                  <p className="mt-2 text-xs text-[#8C9BB0] font-medium leading-relaxed">{desc}</p>

                  <ul className="mt-4 space-y-2 pt-3 border-t border-[#1E2638]">
                    {planTheme.perks.map((p) => (
                      <li
                        key={p}
                        className="text-xs text-slate-300 font-medium flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2638]">
                  <button
                    type="button"
                    onClick={() => navigate('/tienda')}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      popular
                        ? 'bg-[#4361EE] hover:bg-[#3854E0] text-white shadow-sm'
                        : 'bg-[#1C2438] hover:bg-[#25304A] text-slate-200'
                    }`}
                  >
                    <span>Contratar {badge}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Pulse Hub & Tickets */}
      <ServicePulseHub
        theme={theme}
        tier="none"
        openTickets={openCount}
        unreadNotifications={unreadCount}
        notifications={notifications}
        onOpenTickets={() => setTicketPanelOpen(true)}
        onMarkRead={markRead}
      />

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
