'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { useTenantServices, useServiceCatalog } from '../../hooks/useServices'
import { useTranslation } from 'react-i18next'
import type {
  TenantServiceWithDetails,
  TenantServiceEstado,
} from '../../core/domain/entities/TenantService'
import type { ServiceCatalog } from '../../core/domain/entities/ServiceCatalog'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Props {
  tenantId: string
  onOpenTicket?: () => void
}

function getIntervalLabel(intervalo: string | null | undefined) {
  if (intervalo === 'mensual') return 'mes'
  if (intervalo === 'anual') return 'año'
  return 'único'
}

export default function ServicesPanel({ tenantId, onOpenTicket }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: dbServices = [], isLoading: servicesLoading } = useTenantServices(tenantId)
  const { data: catalog = [], isLoading: catalogLoading } = useServiceCatalog()

  // Default core services fallback if no DB records yet
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

  const estadoConfig = useMemo<
    Record<TenantServiceEstado, { color: string; label: string; icon: typeof CheckCircle }>
  >(
    () => ({
      activo: {
        color: 'text-emerald-400',
        label: t('services.estado_activo', 'Activo'),
        icon: CheckCircle,
      },
      suspendido: {
        color: 'text-amber-400',
        label: t('services.estado_suspendido', 'Suspendido'),
        icon: Clock,
      },
      pausado: {
        color: 'text-amber-400',
        label: t('services.estado_pausado', 'Pausado'),
        icon: Clock,
      },
      cancelado: {
        color: 'text-rose-400',
        label: t('services.estado_cancelado', 'Cancelado'),
        icon: XCircle,
      },
      vencido: {
        color: 'text-rose-400',
        label: t('services.estado_vencido', 'Vencido'),
        icon: XCircle,
      },
      pendiente: {
        color: 'text-sky-400',
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
            <span className="font-bold text-white text-xs sm:text-sm">
              {row.original.service?.nombre || 'Servicio General'}
            </span>
            {row.original.service?.descripcion && (
              <p className="text-[11px] text-[#8C9BB0] truncate max-w-xs mt-0.5 font-medium">
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
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#1C2438] text-[#38BDF8] border border-[#232D42] uppercase tracking-wider">
            {tipoLabels[row.original.service?.tipo || ''] || row.original.service?.tipo || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'precio_actual',
        header: t('services.col_precio', 'Precio'),
        cell: ({ row }) => (
          <div className="font-bold font-mono text-white text-xs sm:text-sm">
            ${row.original.precio_actual.toLocaleString(i18n.language || 'es-AR')}
            <span className="ml-1 text-[10px] text-[#64748B] font-sans font-normal">
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
          <span className="text-xs text-[#8C9BB0] flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
            {new Date(row.original.started_at).toLocaleDateString(i18n.language || 'es-AR')}
          </span>
        ),
      },
    ],
    [t, i18n.language, estadoConfig, tipoLabels]
  )

  if (servicesLoading || catalogLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeServices = services.filter((s: TenantServiceWithDetails) => s.estado === 'activo')

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#38BDF8]" />
            <span>{t('services.titulo', 'Servicios y Servidores')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8C9BB0] mt-1 font-medium">
            {activeServices.length} {t('services.servidores_online', 'Servicios Activos')}
          </p>
        </div>

        {onOpenTicket ? (
          <button
            type="button"
            onClick={onOpenTicket}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer w-fit"
          >
            <span>Consultar Soporte</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Infraestructura Online</span>
          </span>
        )}
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-[#1E2638] bg-[#111622] p-4 overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={services}
          searchPlaceholder={t('services.buscar_placeholder', 'Buscar servicio por nombre...')}
          pageSize={5}
          emptyMessage={t('services.sin_servicios', 'No se encontraron servicios contratados.')}
        />
      </div>

      {/* Available Addons */}
      <div className="pt-4 border-t border-[#1E2638]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C9BB0] mb-4">
          {t('services.disponible_agregar', 'Disponible para agregar')}
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
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#1E2638] bg-[#111622] p-5 hover:border-[#2C3852] transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      {tipoLabels[item.tipo] || item.tipo}
                    </p>
                    <p className="text-sm font-bold text-white mt-1">{item.nombre}</p>
                    {item.descripcion && (
                      <p className="text-xs text-[#8C9BB0] mt-1 font-medium leading-relaxed">
                        {item.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold font-mono text-white">
                      ${item.precio_base.toLocaleString(i18n.language || 'es-AR')}
                    </p>
                    <p className="text-[10px] text-[#64748B] uppercase font-bold">
                      {item.moneda} / {getIntervalLabel(item.intervalo)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenTicket) onOpenTicket()
                    else window.location.href = '/tienda'
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8] hover:underline w-fit cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('services.solicitar', 'Solicitar Activación')}</span>
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
