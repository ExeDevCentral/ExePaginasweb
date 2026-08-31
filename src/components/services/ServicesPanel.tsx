'use client'

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
} from 'lucide-react'
import { useTenantServices } from '../../hooks/useServices'
import { useTranslation } from 'react-i18next'

interface Props {
  tenantId: string
}

export default function ServicesPanel({ tenantId }: Readonly<Props>) {
  const { t } = useTranslation()
  const { isLoading } = useTenantServices(tenantId)

  // Default core ExeSistemasWEB services when not yet populated in DB
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('services.titulo', 'Servicios Web, Turnos & Servidores Activos')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            Infraestructura, sistemas y módulos en ejecución para tu negocio en ExeSistemasWEB.
          </p>
        </div>

        <a
          href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Quisiera%20solicitar%20un%20nuevo%20servicio%20o%20modulo"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Nuevo Módulo</span>
        </a>
      </div>

      {/* Grid of Active Services */}
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

      {/* Available Upgrades / Add-ons */}
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
