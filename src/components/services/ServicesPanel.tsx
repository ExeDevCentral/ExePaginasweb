/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  ShieldAlert,
  XCircle,
  Terminal,
  Server,
  ShoppingBag,
  Calculator,
  Sparkles,
  Check,
  Sliders,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import {
  CyberPlanBasic,
  CyberPlanAdvanced,
  CyberPlanPremium,
} from '@/components/ui/MagnificentIcons'
import { useTenantServices, useServiceCatalog } from '../../hooks/useServices'
import { useTranslation } from 'react-i18next'
import type {
  TenantServiceWithDetails,
  TenantServiceEstado,
} from '../../core/domain/entities/TenantService'
import type { ServiceCatalog } from '../../core/domain/entities/ServiceCatalog'
import { PLAN_CATALOG } from '../../core/domain/planCatalog'
import type { PlanData } from '../store/PlanCard'
import type { TicketDraft } from '../dashboard/SupportTicketPanel'
import HudButton from '../HudButton'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

export type EcosystemSubTab = 'active' | 'store' | 'linux' | 'quoter'

interface Props {
  tenantId: string
  initialSubTab?: EcosystemSubTab | undefined
  onOpenTicket?: ((draft?: TicketDraft) => void) | undefined
  onSelectCheckoutPlan?: ((plan: PlanData) => void) | undefined
}

interface QuoterModule {
  id: string
  category: string
  title: string
  detail: string
  priceARS: number
  priceUSD: number
  days: number
}

const QUOTER_MODULES: readonly QuoterModule[] = [
  {
    id: 'web-pro',
    category: 'WEB EDGE',
    title: 'Landing / Web Corporativa Pro',
    detail: 'Velocidad <0.4s, SEO técnico, diseño a medida y contacto directo.',
    priceARS: 280000,
    priceUSD: 260,
    days: 7,
  },
  {
    id: 'turnos-247',
    category: 'AGENDA SAAS',
    title: 'Motor de Turnos & Recordatorios 24/7',
    detail: 'Reservas automáticas sin solapamiento y avisos por WhatsApp.',
    priceARS: 390000,
    priceUSD: 360,
    days: 10,
  },
  {
    id: 'canchas-rt',
    category: 'COMPLEJOS',
    title: 'Grilla de Canchas & Ocupación en Vivo',
    detail: 'Bloqueo transaccional en tiempo real, señas y turnos fijos.',
    priceARS: 440000,
    priceUSD: 410,
    days: 12,
  },
  {
    id: 'ecommerce-direct',
    category: 'TIENDA 0% FEE',
    title: 'Tienda Online E-Commerce Propia',
    detail: 'Catálogo, variantes, stock en vivo y cobros directos sin comisiones.',
    priceARS: 460000,
    priceUSD: 430,
    days: 12,
  },
  {
    id: 'linux-pos',
    category: 'LINUX CAJA',
    title: 'Terminal Linux POS & Quiosco Blindado',
    detail: 'Arranque en 4.5s, drivers térmicos ESC/POS y pendrive USB de rescate.',
    priceARS: 350000,
    priceUSD: 320,
    days: 4,
  },
  {
    id: 'linux-lan',
    category: 'OFFLINE-FIRST',
    title: 'Nodo Servidor Local LAN PostgreSQL',
    detail: 'Operación continua <0.4ms ante cortes de internet + réplica cloud.',
    priceARS: 680000,
    priceUSD: 620,
    days: 6,
  },
] as const

function getIntervalLabel(intervalo: string | null | undefined) {
  if (intervalo === 'mensual') return 'mes'
  if (intervalo === 'anual') return 'año'
  return 'único'
}

export default function ServicesPanel({
  tenantId,
  initialSubTab = 'active',
  onOpenTicket,
  onSelectCheckoutPlan,
}: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: dbServices = [], isLoading: servicesLoading } = useTenantServices(tenantId)
  const { data: catalog = [], isLoading: catalogLoading } = useServiceCatalog()

  const [subTab, setSubTab] = useState<EcosystemSubTab>(initialSubTab)
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [pcCount, setPcCount] = useState<number>(4)
  const [osMode, setOsMode] = useState<'linux' | 'comercial'>('linux')
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(['turnos-247'])

  useEffect(() => {
    setSubTab(initialSubTab)
  }, [initialSubTab])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#linux') {
      setSubTab('linux')
    }
  }, [])

  const formatARS = (val: number) => '$' + val.toLocaleString('es-AR')
  const formatUSD = (val: number) => 'u$s ' + val.toLocaleString('en-US')

  // Servicios por defecto si el tenant aún no registra filas en DB
  const defaultServices: TenantServiceWithDetails[] = useMemo(
    () => [
      {
        id: 'srv-001',
        tenant_id: tenantId,
        service_id: 'srv-web',
        estado: 'activo',
        precio_actual: 65000,
        moneda: 'ARS',
        started_at: new Date().toISOString(),
        ends_at: null,
        auto_renew: true,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        service: {
          id: 'srv-web',
          slug: 'hosting-edge',
          nombre: 'Desarrollo Web & Hosting Vercel Edge',
          descripcion:
            'Sitio web corporativo de alta velocidad con CDN global, SSL y Uptime 99.99%.',
          tipo: 'hosting',
          intervalo: 'mensual',
          precio_base: 65000,
          moneda: 'ARS',
          activo: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'srv-002',
        tenant_id: tenantId,
        service_id: 'srv-turnos',
        estado: 'activo',
        precio_actual: 0,
        moneda: 'ARS',
        started_at: new Date().toISOString(),
        ends_at: null,
        auto_renew: true,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        service: {
          id: 'srv-turnos',
          slug: 'motor-turnos',
          nombre: 'Motor de Turnos & Reservas 24/7',
          descripcion:
            'Sistema inteligente de reservas de turnos en tiempo real con notificaciones automáticas.',
          tipo: 'saas',
          intervalo: 'mensual',
          precio_base: 0,
          moneda: 'ARS',
          activo: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
    [tenantId]
  )

  const services = dbServices.length > 0 ? dbServices : defaultServices

  // Planes unificados de Tienda para Checkout directo sin salir del Dashboard
  const storePlans: PlanData[] = useMemo(() => {
    const defs = [
      {
        id: 'mantenimiento-basico',
        title: 'Abono Básico',
        description: 'Mantenimiento mensual para Landing Pages y sitios institucionales.',
        icon: CyberPlanBasic,
        color: 'from-blue-400 to-cyan-400',
        shadow: 'shadow-cyan-500/20',
        border: 'border-cyan-500/35',
        features: [
          'Hosting Vercel Edge global + SSL automático',
          'Monitoreo de uptime 24/7 y parches de seguridad',
          'Soporte técnico por ticket en tu panel',
        ],
        popular: false,
      },
      {
        id: 'mantenimiento-avanzado',
        title: 'Abono Avanzado',
        description: 'Mantenimiento integral para Sistemas Web, Turnos y E-Commerce.',
        icon: CyberPlanAdvanced,
        color: 'from-cyan-400 to-purple-500',
        shadow: 'shadow-purple-500/30',
        border: 'border-violet-500/50',
        features: [
          'Gestión de Base de Datos + Backups diarios cloud',
          'Monitoreo de pasarelas de pago y webhooks',
          'Renovación de dominio bonificada + SLA < 4h',
        ],
        popular: true,
      },
      {
        id: 'mantenimiento-premium',
        title: 'Abono Premium',
        description: 'Evolución continua, máxima prioridad y bolsa de horas mensual.',
        icon: CyberPlanPremium,
        color: 'from-purple-500 to-pink-500',
        shadow: 'shadow-pink-500/20',
        border: 'border-fuchsia-500/40',
        features: [
          'Infraestructura prioritaria con SLA < 1h',
          'Bolsa de desarrollo incluida (2 hs/mes)',
          'Consultoría estratégica y mejoras continuas',
        ],
        popular: false,
      },
    ]

    return defs.map((d) => {
      const cat = PLAN_CATALOG.find((c) => c.id === d.id)
      const rawPriceARS = cat?.precio ?? 32000
      const rawPriceUSD = cat?.precioUSD ?? 28
      return {
        ...d,
        rawPriceARS,
        rawPriceUSD,
        price: formatARS(rawPriceARS),
        priceUSD: '$' + rawPriceUSD,
        period: '/mes',
      }
    })
  }, [])

  const estadoConfig = useMemo<
    Record<TenantServiceEstado, { color: string; label: string; icon: typeof CheckCircle }>
  >(
    () => ({
      activo: {
        color: 'text-emerald-700 dark:text-emerald-400',
        label: t('services.estado_activo', 'Activo'),
        icon: CheckCircle,
      },
      suspendido: {
        color: 'text-amber-700 dark:text-amber-400',
        label: t('services.estado_suspendido', 'Suspendido'),
        icon: Clock,
      },
      pausado: {
        color: 'text-amber-700 dark:text-amber-400',
        label: t('services.estado_pausado', 'Pausado'),
        icon: Clock,
      },
      cancelado: {
        color: 'text-rose-700 dark:text-rose-400',
        label: t('services.estado_cancelado', 'Cancelado'),
        icon: XCircle,
      },
      vencido: {
        color: 'text-rose-700 dark:text-rose-400',
        label: t('services.estado_vencido', 'Vencido'),
        icon: XCircle,
      },
      pendiente: {
        color: 'text-sky-700 dark:text-sky-400',
        label: t('services.estado_pendiente', 'Pendiente'),
        icon: ShieldAlert,
      },
    }),
    [t]
  )

  const tipoLabels = useMemo<Record<string, string>>(
    () => ({
      plan: t('services.tipo_plan', 'Plan Base'),
      addon: t('services.tipo_addon', 'Módulo Adicional'),
      hosting: t('services.tipo_hosting', 'Hosting & Dominio'),
      saas: t('services.tipo_saas', 'Software SaaS'),
      professional: t('services.tipo_profesional', 'Servicio Profesional'),
      one_time: t('services.tipo_one_time', 'Pago Único'),
    }),
    [t]
  )

  const columns = useMemo<ColumnDef<TenantServiceWithDetails, unknown>[]>(
    () => [
      {
        accessorKey: 'service.nombre',
        header: t('services.col_servicio', 'Servicio'),
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-foreground text-xs sm:text-sm">
              {row.original.service?.nombre || 'Servicio General'}
            </span>
            {row.original.service?.descripcion && (
              <p className="text-[11px] text-muted-foreground truncate max-w-xs mt-0.5 font-medium">
                {row.original.service.descripcion}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'service.tipo',
        header: t('services.col_tipo', 'Tipo'),
        cell: ({ row }) => (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-muted/60 text-[#38BDF8] border border-border uppercase tracking-wider">
            {tipoLabels[row.original.service?.tipo || ''] || row.original.service?.tipo || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'precio_actual',
        header: t('services.col_precio', 'Precio'),
        cell: ({ row }) => (
          <div className="font-bold font-mono text-foreground text-xs sm:text-sm">
            ${row.original.precio_actual.toLocaleString(i18n.language || 'es-AR')}
            <span className="ml-1 text-[10px] text-muted-foreground font-sans font-normal">
              {row.original.moneda}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'estado',
        header: t('services.col_estado', 'Estado'),
        cell: ({ row }) => {
          const config = estadoConfig[row.original.estado] || estadoConfig.activo
          const Icon = config.icon
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${config.color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'started_at',
        header: t('services.col_inicio', 'Inicio'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            {new Date(row.original.started_at).toLocaleDateString(i18n.language || 'es-AR')}
          </span>
        ),
      },
    ],
    [t, i18n.language, estadoConfig, tipoLabels]
  )

  // Cálculos Simulador Linux Flota
  const newPcCostUSD = 620
  const linuxMigrationUSD = pcCount === 1 ? 320 : 320 + (pcCount - 1) * 140
  const savedUSD = Math.max(0, pcCount * newPcCostUSD - linuxMigrationUSD)

  const newPcCostARS = 720000
  const linuxMigrationARS = pcCount === 1 ? 350000 : 350000 + (pcCount - 1) * 155000
  const savedARS = Math.max(0, pcCount * newPcCostARS - linuxMigrationARS)

  // Cálculos Cotizador Rápido Integrado
  const toggleQuoterModule = (id: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    )
  }

  const selectedModules = QUOTER_MODULES.filter((m) => selectedModuleIds.includes(m.id))
  const hasMultiDiscount = selectedModules.length >= 2
  const rawQuoterARS = selectedModules.reduce((acc, m) => acc + m.priceARS, 0)
  const rawQuoterUSD = selectedModules.reduce((acc, m) => acc + m.priceUSD, 0)
  const finalQuoterARS = hasMultiDiscount ? Math.round(rawQuoterARS * 0.9) : rawQuoterARS
  const finalQuoterUSD = hasMultiDiscount ? Math.round(rawQuoterUSD * 0.9) : rawQuoterUSD
  const estimatedDays = Math.min(
    28,
    Math.max(
      5,
      selectedModules.reduce((acc, m) => acc + m.days, 0) - (selectedModules.length - 1) * 3
    )
  )

  if (servicesLoading || catalogLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeServices = services.filter((s: TenantServiceWithDetails) => s.estado === 'activo')

  const SUB_TABS: {
    id: EcosystemSubTab
    label: string
    shortLabel: string
    icon: typeof Package
    pillBg: string
  }[] = [
    {
      id: 'active',
      label: 'Mis Servicios',
      shortLabel: 'Activos',
      icon: Package,
      pillBg: 'bg-[#4361EE] text-white shadow-sm',
    },
    {
      id: 'store',
      label: 'Tienda & Upgrades',
      shortLabel: 'Tienda',
      icon: ShoppingBag,
      pillBg: 'bg-violet-600 dark:bg-violet-500 text-white shadow-sm',
    },
    {
      id: 'linux',
      label: 'Linux POS & Flota',
      shortLabel: 'Linux',
      icon: Terminal,
      pillBg: 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-sm',
    },
    {
      id: 'quoter',
      label: 'Cotizador Rápido',
      shortLabel: 'Cotizar',
      icon: Calculator,
      pillBg: 'bg-cyan-600 dark:bg-cyan-400 text-white dark:text-slate-950 shadow-sm',
    },
  ]

  return (
    <div className="space-y-6 font-sans">
      {/* Header Unificado + Sub-Dock Interactivo + Moneda en Vivo */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5 tracking-tight">
            <Sparkles className="w-5 h-5 text-[#38BDF8]" />
            <span>Centro Unificado de Servicios, Tienda & Linux</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            {activeServices.length} servicios activos · Activá abonos, simulá flotas Linux o cotizá
            nuevos módulos sin salir de tu panel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-Dock con layoutId elástico */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-slate-100/90 dark:bg-muted/50 border border-slate-300/90 dark:border-border">
            {SUB_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = subTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubTab(tab.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? tab.id === 'linux' || tab.id === 'quoter'
                        ? 'text-white dark:text-slate-950'
                        : 'text-white'
                      : 'text-slate-600 hover:text-slate-950 dark:text-muted-foreground dark:hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ecosystem-sub-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className={`absolute inset-0 rounded-xl ${tab.pillBg}`}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  <span className="relative z-10 sm:hidden">{tab.shortLabel}</span>
                </button>
              )
            })}
          </div>

          {/* Selector de Moneda en Vivo */}
          <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-muted/50 border border-slate-300/90 dark:border-border p-1 font-mono text-xs">
            {(['ARS', 'USD'] as const).map((curr) => {
              const activeCurr = currency === curr
              return (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`relative px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeCurr
                      ? 'text-slate-950 dark:text-slate-950'
                      : 'text-slate-500 dark:text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {activeCurr && (
                    <motion.span
                      layoutId="ecosystem-currency"
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white dark:bg-emerald-400 border border-slate-300/80 dark:border-transparent shadow-2xs"
                    />
                  )}
                  <span className="relative z-10">{curr === 'ARS' ? '$ ARS' : 'u$s'}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenido Dinámico con Transición Suave Premium */}
      <AnimatePresence mode="wait">
        {/* ============================================================
            SUB-VISTA 1: SERVICIOS ACTIVOS & MÓDULOS ADICIONALES
           ============================================================ */}
        {subTab === 'active' && (
          <motion.div
            key="sub-active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-4 overflow-hidden shadow-xs">
              <DataTable
                columns={columns}
                data={services}
                searchPlaceholder={t(
                  'services.buscar_placeholder',
                  'Buscar servicio por nombre...'
                )}
                pageSize={5}
                emptyMessage={t(
                  'services.sin_servicios',
                  'No se encontraron servicios contratados.'
                )}
              />
            </div>

            {/* Accesos Directos a las Nuevas Divisiones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubTab('store')}
                className="text-left p-4 rounded-2xl border border-slate-300/85 dark:border-violet-500/25 bg-muted/30 hover:border-violet-500/60 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    CHECKOUT EN 1 CLIC
                  </span>
                  <p className="text-sm font-bold text-foreground mt-1">
                    Mejorar o Activar Abono Mensual
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Transferencia CBU o PayPal sin salir del panel.
                  </p>
                </div>
                <ShoppingBag className="w-5 h-5 text-violet-500 shrink-0" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubTab('linux')}
                className="text-left p-4 rounded-2xl border border-slate-300/85 dark:border-emerald-500/25 bg-muted/30 hover:border-emerald-500/60 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    DIVISIÓN LINUX & POS
                  </span>
                  <p className="text-sm font-bold text-foreground mt-1">
                    Simular Ahorro de Flota & Cajas
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Terminales en 4.5s y servidores LAN offline-first.
                  </p>
                </div>
                <Terminal className="w-5 h-5 text-emerald-500 shrink-0" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSubTab('quoter')}
                className="text-left p-4 rounded-2xl border border-slate-300/85 dark:border-cyan-500/25 bg-muted/30 hover:border-cyan-500/60 transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    ESCALADO A MEDIDA
                  </span>
                  <p className="text-sm font-bold text-foreground mt-1">
                    Cotizador Rápido de Módulos
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sumá Turnos, Canchas o E-Commerce al instante.
                  </p>
                </div>
                <Calculator className="w-5 h-5 text-cyan-500 shrink-0" />
              </motion.button>
            </div>

            {/* Addons Disponibles de Base de Datos */}
            {catalog.filter(
              (c: ServiceCatalog) =>
                c.tipo !== 'plan' &&
                !services.some((s: TenantServiceWithDetails) => s.service_id === c.id)
            ).length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {t('services.disponible_agregar', 'Módulos adicionales disponibles')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {catalog
                    .filter(
                      (c: ServiceCatalog) =>
                        c.tipo !== 'plan' &&
                        !services.some((s: TenantServiceWithDetails) => s.service_id === c.id)
                    )
                    .slice(0, 4)
                    .map((item: ServiceCatalog) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-300/85 dark:border-border bg-card p-5 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                              {tipoLabels[item.tipo] || item.tipo}
                            </p>
                            <p className="text-sm font-bold text-foreground mt-1">{item.nombre}</p>
                            {item.descripcion && (
                              <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">
                                {item.descripcion}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold font-mono text-foreground">
                              ${item.precio_base.toLocaleString(i18n.language || 'es-AR')}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              {item.moneda} / {getIntervalLabel(item.intervalo)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenTicket?.({
                              asunto: `Activar módulo adicional: ${item.nombre}`,
                              mensaje: `Hola equipo, quiero activar el módulo "${item.nombre}" en mi cuenta actual.`,
                              categoria: 'consulta',
                            })
                          }
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8] hover:underline w-fit cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Activar en 1 clic</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ============================================================
            SUB-VISTA 2: TIENDA DE ABONOS & CHECKOUT DIRECTO EN MODAL
           ============================================================ */}
        {subTab === 'store' && (
          <motion.div
            key="sub-store"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {storePlans.map((plan) => {
                const Icon = plan.icon
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 bg-card border ${
                      plan.popular
                        ? 'border-2 border-violet-500/60 shadow-[0_14px_34px_-12px_rgba(139,92,246,0.22)]'
                        : 'border-slate-300/90 dark:border-border shadow-xs'
                    } flex flex-col justify-between transition-all`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#38BDF8]" />
                        </div>
                        {plan.popular && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                            Más elegido
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-foreground">{plan.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {plan.description}
                      </p>

                      <motion.div
                        key={`store-price-${plan.id}-${currency}`}
                        initial={{ opacity: 0.4, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="my-4 flex items-baseline gap-1 font-mono"
                      >
                        <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                          {currency === 'ARS'
                            ? formatARS(plan.rawPriceARS)
                            : formatUSD(plan.rawPriceUSD)}
                        </span>
                        <span className="text-xs text-muted-foreground">/mes</span>
                      </motion.div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2 text-xs text-muted-foreground font-medium"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCheckoutPlan) {
                          onSelectCheckoutPlan(plan)
                        } else {
                          onOpenTicket?.({
                            asunto: `Activación / Upgrade a ${plan.title}`,
                            mensaje: `Quiero activar ${plan.title} (${currency === 'ARS' ? formatARS(plan.rawPriceARS) : formatUSD(plan.rawPriceUSD)}/mes).`,
                            categoria: 'consulta',
                          })
                        }
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        plan.popular
                          ? 'bg-[#4361EE] hover:bg-[#3854E0] text-white shadow-sm'
                          : 'bg-muted/60 hover:bg-muted text-foreground border border-slate-300 dark:border-border'
                      }`}
                    >
                      <span>Activar {plan.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Guardia Preventiva Linux Mensual Unificada */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    ADDON HARDWARE // TELEMETRÍA S.M.A.R.T. & TÚNEL SSH
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Guardia Preventiva para Terminales Linux POS & Servidores LAN
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Monitoreo predictivo de discos NVMe, parches nocturnos atómicos y asistencia
                    SSH.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-lg font-extrabold text-foreground">
                    {currency === 'ARS' ? '$32.000' : 'u$s 28'}
                    <span className="text-xs font-normal text-muted-foreground">/mes</span>
                  </div>
                </div>
                <HudButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const basicEntry = storePlans[0]
                    if (onSelectCheckoutPlan && basicEntry) {
                      onSelectCheckoutPlan({
                        ...basicEntry,
                        title: 'Guardia Linux SSH & S.M.A.R.T.',
                        description: 'Monitoreo preventivo S.M.A.R.T. y mantenimiento remoto SSH.',
                      })
                    } else {
                      onOpenTicket?.({
                        asunto: 'Activar Guardia Preventiva Linux SSH',
                        mensaje:
                          'Quiero sumar la guardia mensual S.M.A.R.T. + SSH para mis equipos.',
                        categoria: 'consulta',
                      })
                    }
                  }}
                >
                  Sumar Guardia
                </HudButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            SUB-VISTA 3: LINUX POS, SIMULADOR DE FLOTA & KERNEL TTY
           ============================================================ */}
        {subTab === 'linux' && (
          <motion.div
            key="sub-linux"
            id="linux"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Simulador Interactivo de Flota */}
            <div className="rounded-2xl border border-slate-300/90 dark:border-emerald-500/25 bg-card p-5 sm:p-6 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>SIMULADOR TCO EN VIVO // RESCATE DE HARDWARE X86_64</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    Calculá cuánto capital ahorrás blindando tus PCs actuales con Linux
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Arranque determinista en 4.5s, 480 MB de RAM en reposo, reglas fijas para
                    impresoras térmicas ESC/POS y pendrive físico de restauración en 3 minutos.
                  </p>

                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">EQUIPOS DE CAJA U OFICINA:</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                        {pcCount} {pcCount === 1 ? 'equipo' : 'equipos'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={pcCount}
                      onChange={(e) => setPcCount(Number(e.target.value))}
                      aria-label="Cantidad de PCs a migrar"
                      className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-white/10"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 space-y-3 font-mono">
                  <div className="flex justify-between text-xs pb-2 border-b border-border">
                    <span className="text-muted-foreground">Recambio + Licencias:</span>
                    <span className="text-rose-600 dark:text-rose-400 line-through font-semibold">
                      {currency === 'ARS'
                        ? formatARS(pcCount * newPcCostARS)
                        : formatUSD(pcCount * newPcCostUSD)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-border">
                    <span className="text-muted-foreground">Migración Linux:</span>
                    <span className="text-foreground font-bold">
                      {currency === 'ARS'
                        ? formatARS(linuxMigrationARS)
                        : formatUSD(linuxMigrationUSD)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
                      CAPITAL RETENIDO
                    </span>
                    <motion.div
                      key={`dash-linux-save-${currency}-${pcCount}`}
                      initial={{ opacity: 0.4, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400"
                    >
                      {currency === 'ARS' ? formatARS(savedARS) : formatUSD(savedUSD)}
                    </motion.div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenTicket?.({
                        asunto: `Despliegue Linux POS para ${pcCount} ${pcCount === 1 ? 'equipo' : 'equipos'}`,
                        mensaje: `Hola Exequiel, simulé en mi panel la migración Linux para ${pcCount} ${pcCount === 1 ? 'equipo' : 'equipos'} (estimado ${currency === 'ARS' ? formatARS(linuxMigrationARS) : formatUSD(linuxMigrationUSD)}). Quiero coordinar relevamiento.`,
                        categoria: 'consulta',
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    <span>
                      Solicitar para {pcCount} {pcCount === 1 ? 'Equipo' : 'Equipos'} en 1 clic
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Benchmark Interactivo Compacto + Nodo Servidor LAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-[#060a13] text-slate-100 p-5 font-mono space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-400">
                    BENCHMARK KERNEL (8GB RAM)
                  </span>
                  <div className="inline-flex rounded-lg bg-black/50 p-0.5 border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setOsMode('linux')}
                      className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                        osMode === 'linux' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      LINUX LTS
                    </button>
                    <button
                      type="button"
                      onClick={() => setOsMode('comercial')}
                      className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                        osMode === 'comercial' ? 'bg-rose-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      OS COMERCIAL
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">RAM en reposo</span>
                      <span
                        className={
                          osMode === 'linux'
                            ? 'text-emerald-400 font-bold'
                            : 'text-rose-400 font-bold'
                        }
                      >
                        {osMode === 'linux' ? '480 MB (5.8%)' : '4.3 GB (52.6%)'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          osMode === 'linux' ? 'w-[7%] bg-emerald-400' : 'w-[54%] bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Cold Boot → Caja activa</span>
                      <span
                        className={
                          osMode === 'linux'
                            ? 'text-cyan-400 font-bold'
                            : 'text-amber-400 font-bold'
                        }
                      >
                        {osMode === 'linux' ? '4.5 segundos' : '55 – 90 segundos'}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          osMode === 'linux' ? 'w-[9%] bg-cyan-400' : 'w-[80%] bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Inmune a ejecutables .exe, ransomware comercial y reinicios diurnos.</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-300/90 dark:border-border bg-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1">
                      <Server className="w-3.5 h-3.5" />
                      <span>CONTINUIDAD OPERATIVA LAN</span>
                    </span>
                    <span className="font-mono text-base font-extrabold text-foreground">
                      {currency === 'ARS' ? '$680.000' : 'u$s 620'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-foreground mt-2">
                    Nodo Servidor Local PostgreSQL Offline-First
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Tus cajas, comandas y stock operan a &lt;0.4ms por red local LAN aunque se corte
                    totalmente el proveedor de fibra óptica, sincronizando con la nube al volver.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTicket?.({
                      asunto: 'Evaluación Nodo Servidor Local LAN Offline-First',
                      mensaje: `Hola Exequiel, me interesa instalar un Nodo Servidor Local PostgreSQL Offline-First (${currency === 'ARS' ? '$680.000' : 'u$s 620'}) para mi operación.`,
                      categoria: 'consulta',
                    })
                  }
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-muted/60 hover:bg-muted border border-slate-300 dark:border-border text-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Solicitar Relevamiento LAN en 1 clic</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================
            SUB-VISTA 4: COTIZADOR RÁPIDO INTEGRADO (SIN SALIR DEL PANEL)
           ============================================================ */}
        {subTab === 'quoter' && (
          <motion.div
            key="sub-quoter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {QUOTER_MODULES.map((mod) => {
                const selected = selectedModuleIds.includes(mod.id)
                return (
                  <motion.button
                    key={mod.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleQuoterModule(mod.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selected
                        ? 'border-cyan-500 bg-cyan-500/[0.07] shadow-[0_8px_24px_-10px_rgba(6,182,212,0.3)]'
                        : 'border-slate-300/85 dark:border-border bg-card hover:border-cyan-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                          {mod.category}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            selected
                              ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                              : 'border-slate-300 dark:border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1.5">{mod.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {mod.detail}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-foreground">
                        {currency === 'ARS' ? formatARS(mod.priceARS) : formatUSD(mod.priceUSD)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">~{mod.days} días</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Resumen Ejecutivo de Cotización en Vivo */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-300 dark:border-cyan-500/30 bg-slate-50 dark:bg-[#060a14] p-5 space-y-4 font-mono sticky top-24">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  ARQUITECTURA SELECCIONADA ({selectedModules.length})
                </span>
                <ul className="mt-2.5 space-y-1.5 text-xs">
                  {selectedModules.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-2 text-foreground"
                    >
                      <span className="truncate font-sans font-medium">{m.title}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {currency === 'ARS' ? formatARS(m.priceARS) : formatUSD(m.priceUSD)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {hasMultiDiscount && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold flex items-center justify-between">
                  <span>Bonificación pack (-10%)</span>
                  <span>Aplicada ✓</span>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Entrega estimada:</span>
                  <span className="font-bold text-foreground">{estimatedDays} días hábiles</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                  INVERSIÓN LLAVE EN MANO (100% CÓDIGO PROPIO)
                </span>
                <motion.div
                  key={`quote-total-${currency}-${finalQuoterARS}`}
                  initial={{ opacity: 0.4, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1"
                >
                  {currency === 'ARS' ? formatARS(finalQuoterARS) : formatUSD(finalQuoterUSD)}
                </motion.div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenTicket?.({
                    asunto: `Solicitud de Presupuesto (${selectedModules.length} ${selectedModules.length === 1 ? 'módulo' : 'módulos'})`,
                    mensaje: `Hola Exequiel, armé desde mi Panel de Cliente la siguiente configuración:\n${selectedModules.map((m) => `- ${m.title}`).join('\n')}\nTotal estimado: ${currency === 'ARS' ? formatARS(finalQuoterARS) : formatUSD(finalQuoterUSD)} (entrega ~${estimatedDays} días). Quiero avanzar.`,
                    categoria: 'consulta',
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <span>Enviar Solicitud Prioritaria en 1 clic</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
