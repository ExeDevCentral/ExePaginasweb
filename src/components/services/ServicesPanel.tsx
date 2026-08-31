'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Globe,
  Calendar,
  MessageSquare,
  Database,
  ShieldCheck,
  Zap,
  ExternalLink,
  Plus,
  Server,
  Activity,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react'
import { useTenantServices } from '../../hooks/useServices'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface Props {
  tenantId: string
}

type ServiceSubTab = 'all' | 'turnos' | 'whatsapp' | 'infra'

export default function ServicesPanel({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { isLoading } = useTenantServices(tenantId)
  const [activeSubTab, setActiveSubTab] = useState<ServiceSubTab>('all')

  // Interactive Turnos Config state
  const [workDays, setWorkDays] = useState(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'])
  const [openTime, setOpenTime] = useState('09:00')
  const [closeTime, setCloseTime] = useState('21:00')
  const [slotDuration, setSlotDuration] = useState('45')
  const [requireDeposit, setRequireDeposit] = useState(true)

  // Interactive WhatsApp Bot state
  const [testPhone, setTestPhone] = useState('')
  const [botSending, setBotSending] = useState(false)

  const toggleDay = (day: string) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day))
    } else {
      setWorkDays([...workDays, day])
    }
  }

  const handleSaveTurnosConfig = () => {
    toast.success('Configuración de turnos guardada', {
      description: `Horario: ${openTime} a ${closeTime} hs (${slotDuration} min/turno). Días: ${workDays.join(', ')}.`,
    })
  }

  const handleSendTestWhatsApp = () => {
    if (!testPhone.trim()) {
      toast.error('Por favor ingresá un número de teléfono')
      return
    }
    setBotSending(true)
    setTimeout(() => {
      setBotSending(false)
      toast.success('Mensaje de prueba enviado', {
        description: `Se envió una simulación de confirmación de turno a ${testPhone}.`,
      })
    }, 1200)
  }

  // Default core ExeSistemasWEB services
  const defaultCoreServices = [
    {
      id: 'srv-web',
      nombre: 'Desarrollo Web & Hosting Vercel Edge',
      tipo: 'Infraestructura Web',
      descripcion:
        'Sitio web corporativo de alta velocidad con CDN global, SSL TLS 1.3 y Uptime 99.99%.',
      icon: Globe,
      estado: 'Activo',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      specs: 'Edge CDN · SSL Automático · Uptime 99.99%',
      plan: 'Incluido en Abono',
      tab: 'infra',
    },
    {
      id: 'srv-turnos',
      nombre: 'Motor de Turnos & Reservas 24/7',
      tipo: 'Aplicación SaaS',
      descripcion:
        'Sistema inteligente de reservas de turnos en tiempo real con control de ocupación.',
      icon: Calendar,
      estado: 'Operativo',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      specs: 'Disponibilidad 24/7 · Cancelaciones · Bloqueos',
      plan: 'Módulo Activo',
      tab: 'turnos',
    },
    {
      id: 'srv-whatsapp',
      nombre: 'Bot Automatizado de WhatsApp',
      tipo: 'Automatización & CRM',
      descripcion:
        'Envío de recordatorios automáticos de turnos 24h antes y confirmaciones directas.',
      icon: MessageSquare,
      estado: 'Conectado',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      specs: 'Notificaciones 1-Clic · Respuestas Rápidas',
      plan: 'WhatsApp API',
      tab: 'whatsapp',
    },
    {
      id: 'srv-supabase',
      nombre: 'Base de Datos Supabase Postgres',
      tipo: 'Almacenamiento Cloud',
      descripcion:
        'Almacenamiento seguro de clientes, turnos y facturas con copias de seguridad diarias.',
      icon: Database,
      estado: 'Protegido',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      specs: 'Backups 03:00 UTC · Cifrado E2E · PostgreSQL',
      plan: 'Cloud Dedicado',
      tab: 'infra',
    },
    {
      id: 'srv-soporte',
      nombre: 'Garantía & Soporte Técnico VIP SLA',
      tipo: 'Mantenimiento Continuo',
      descripcion:
        'Mantenimiento preventivo mensual, parches de seguridad y respuesta prioritaria en < 2h.',
      icon: ShieldCheck,
      estado: 'Garantizado',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      specs: 'Canal WhatsApp 24/7 · Monitoreo de Errores',
      plan: 'SLA Prioritario',
      tab: 'infra',
    },
  ]

  const availableAddons = [
    {
      id: 'addon-mp',
      nombre: 'Checkout Mercado Pago & PayPal PRO',
      tipo: 'Pasarela de Cobros',
      descripcion:
        'Cobro de señas obligatorias o pago total de turnos con acreditación automática.',
      precio: '$25.000 ARS / mes',
      icon: Zap,
    },
    {
      id: 'addon-pwa',
      nombre: 'App Móvil Progresiva PWA (iOS / Android)',
      tipo: 'Aplicación Móvil',
      descripcion:
        'Acceso directo con ícono en la pantalla de inicio de tus clientes sin pasar por tiendas.',
      precio: '$30.000 ARS / mes',
      icon: Server,
    },
    {
      id: 'addon-multisede',
      nombre: 'Multi-Sedes & Múltiples Empleados',
      tipo: 'Expansión de Negocio',
      descripcion:
        'Gestión centralizada de múltiples sucursales, canchas, consultorios o profesionales.',
      precio: '$20.000 ARS / mes',
      icon: Activity,
    },
    {
      id: 'addon-seo',
      nombre: 'Campaña SEO & Google Ads Optimization',
      tipo: 'Marketing Digital',
      descripcion:
        'Posicionamiento en las primeras posiciones de Google para captar más clientes en tu zona.',
      precio: '$35.000 ARS / mes',
      icon: Package,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* 1. HEADER & SUB-NAVIGATION */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('services.titulo', 'Servicios Web, Turnos & Servidores')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Infraestructura, sistemas y módulos en ejecución para tu negocio en ExeSistemasWEB.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#151B28] p-1 rounded-xl border border-[#1E2638]">
            <button
              type="button"
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-[#4361EE] text-white shadow-sm'
                  : 'text-[#8C9BB0] hover:text-white'
              }`}
            >
              Todos los Módulos
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('turnos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'turnos'
                  ? 'bg-[#4361EE] text-white shadow-sm'
                  : 'text-[#8C9BB0] hover:text-white'
              }`}
            >
              Configurar Turnos
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('whatsapp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'whatsapp'
                  ? 'bg-[#4361EE] text-white shadow-sm'
                  : 'text-[#8C9BB0] hover:text-white'
              }`}
            >
              Bot WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('infra')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'infra'
                  ? 'bg-[#4361EE] text-white shadow-sm'
                  : 'text-[#8C9BB0] hover:text-white'
              }`}
            >
              Servidores & SSL
            </button>
          </div>

          <a
            href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Quisiera%20solicitar%20un%20nuevo%20servicio%20o%20modulo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151B28] hover:bg-[#1C2438] text-white border border-[#1E2638] text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Sumar Módulo</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TAB: TURNOS CONFIGURATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'turnos' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#111622] border border-[#1E2638] p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-[#1E2638]">
            <div className="w-10 h-10 rounded-xl bg-[#4361EE]/20 border border-[#4361EE]/40 flex items-center justify-center text-[#38BDF8]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configuración del Motor de Turnos</h3>
              <p className="text-xs text-[#8C9BB0]">
                Definí los días de atención, rango horario y reglas de reserva para tu negocio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Days & Hours */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#8C9BB0] block mb-2">
                  Días de Atención Semanal
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => {
                    const isSelected = workDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#4361EE] border-[#4361EE] text-white shadow-sm'
                            : 'bg-[#151B28] border-[#1E2638] text-[#8C9BB0]'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="openTimeInput"
                    className="text-xs font-bold uppercase text-[#8C9BB0] block mb-1.5"
                  >
                    Horario de Apertura
                  </label>
                  <input
                    id="openTimeInput"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full bg-[#151B28] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4361EE]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="closeTimeInput"
                    className="text-xs font-bold uppercase text-[#8C9BB0] block mb-1.5"
                  >
                    Horario de Cierre
                  </label>
                  <input
                    id="closeTimeInput"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full bg-[#151B28] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4361EE]"
                  />
                </div>
              </div>
            </div>

            {/* Rules & Deposit */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="slotDurationSelect"
                  className="text-xs font-bold uppercase text-[#8C9BB0] block mb-1.5"
                >
                  Duración por Turno
                </label>
                <select
                  id="slotDurationSelect"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full bg-[#151B28] border border-[#1E2638] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#4361EE]"
                >
                  <option value="30">30 Minutos (Cortes rápidos, consultas breves)</option>
                  <option value="45">45 Minutos (Turno estándar)</option>
                  <option value="60">60 Minutos (Canchas de pádel, sesiones completas)</option>
                  <option value="90">90 Minutos (Servicios especiales o partidos largos)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    Requerir Seña Previa (Mercado Pago)
                  </p>
                  <p className="text-[11px] text-[#8C9BB0]">
                    Reduce el ausentismo exigiendo un anticipo del 30% o 50% al reservar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireDeposit(!requireDeposit)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    requireDeposit ? 'bg-[#4361EE]' : 'bg-[#1E2638]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      requireDeposit ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveTurnosConfig}
              className="px-6 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Guardar Configuración de Horarios
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB: WHATSAPP BOT PREVIEW & TEST */}
      {/* ========================================================================= */}
      {activeSubTab === 'whatsapp' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#111622] border border-[#1E2638] p-6 space-y-6"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-[#1E2638]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Bot Automatizado de WhatsApp & Mensajería
              </h3>
              <p className="text-xs text-[#8C9BB0]">
                Confirmaciones instantáneas, recordatorios 24h antes y atención interactiva.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template 1: Instant Confirmation */}
            <div className="bg-[#151B28] rounded-2xl p-5 border border-[#1E2638] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Plantilla 1: Confirmación de Turno
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">Disparo: Al reservar</span>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded-xl text-xs text-slate-200 leading-relaxed border border-[#1E2638]">
                ¡Hola! 👋 Tu turno ha sido confirmado para el día{' '}
                <strong>Mañana a las 18:00 hs</strong>. Te esperamos en la sucursal. Para cancelar o
                reprogramar, respondé a este mensaje.
              </div>
            </div>

            {/* Template 2: 24h Reminder */}
            <div className="bg-[#151B28] rounded-2xl p-5 border border-[#1E2638] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#38BDF8] flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Plantilla 2: Recordatorio 24h Previas
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">Disparo: 24h antes</span>
              </div>
              <div className="bg-[#0B0E14] p-4 rounded-xl text-xs text-slate-200 leading-relaxed border border-[#1E2638]">
                ¡Recordatorio de tu cita! ⏰ Mañana tenés tu turno a las <strong>18:00 hs</strong>.
                Por favor confirmá tu asistencia respondiendo <strong>&quot;SI&quot;</strong> a este
                mensaje.
              </div>
            </div>
          </div>

          {/* Test Sender */}
          <div className="p-5 rounded-2xl bg-[#151B28] border border-[#1E2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase text-white">
                Probar Envío de WhatsApp a tu Teléfono
              </h4>
              <p className="text-xs text-[#8C9BB0]">
                Ingresá tu número con código de país (ej: +54 9 341 ...) para recibir la prueba.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="+54 9 341 687-4786"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="bg-[#111622] border border-[#1E2638] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4361EE] w-48"
              />
              <button
                type="button"
                onClick={handleSendTestWhatsApp}
                disabled={botSending}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{botSending ? 'Enviando...' : 'Enviar Prueba'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVE SERVICES GRID */}
      {/* ========================================================================= */}
      {(activeSubTab === 'all' || activeSubTab === 'infra') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
              Módulos y Servicios en Funcionamiento (5 Activos)
            </h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Operativos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {defaultCoreServices.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl bg-[#151B28] border border-[#1E2638] p-5 hover:border-[#2C3852] transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1C2438] border border-[#232D42] flex items-center justify-center text-[#38BDF8] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${srv.statusColor}`}
                      >
                        ● {srv.estado}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{srv.nombre}</h4>
                    <p className="text-[11px] text-[#38BDF8] font-mono mt-0.5">{srv.tipo}</p>
                    <p className="text-xs text-[#8C9BB0] mt-2 font-medium leading-relaxed">
                      {srv.descripcion}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-mono">{srv.specs}</span>
                    <span className="text-[#38BDF8] font-semibold">{srv.plan}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AVAILABLE UPGRADES & ADD-ONS */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-[#1E2638]">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0]">
            Módulos Adicionales Disponibles para Expandir tu Plataforma
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Podés sumar cualquiera de estos complementos comunicándote directamente por WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {availableAddons.map((item) => {
            const AddonIcon = item.icon
            const waMsg = encodeURIComponent(
              `¡Hola ExePaginasWeb! Quisiera activar el complemento: "${item.nombre}" (${item.precio}) para mi sitio web.`
            )

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#111622] border border-[#1E2638] p-5 hover:border-[#2C3852] transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-center text-[#4361EE] mb-3">
                    <AddonIcon className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] font-mono text-[#8C9BB0] uppercase">{item.tipo}</p>
                  <h4 className="text-xs font-bold text-white mt-1">{item.nombre}</h4>
                  <p className="text-xs text-[#8C9BB0] mt-1.5 font-medium leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-white">{item.precio}</span>
                  <a
                    href={`https://wa.me/5493416874786?text=${waMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#38BDF8] hover:underline"
                  >
                    <span>Activar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
