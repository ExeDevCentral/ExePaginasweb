'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  CheckCircle,
  XCircle,
  Pause,
  Calendar,
  CreditCard,
  ExternalLink,
} from 'lucide-react'
import { useTenantServices, useServiceCatalog } from '../../hooks/useServices'
import { useTranslation } from 'react-i18next'
import type { TenantServiceWithDetails } from '../../core/domain/entities/TenantService'
import type { ServiceCatalog } from '../../core/domain/entities/ServiceCatalog'
import { DataTable } from '../shared/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Props {
  tenantId: string
}

function getIntervalLabel(
  intervalo: string | null | undefined,
  t: (key: string, def: string) => string
) {
  if (intervalo === 'monthly') return t('services.mes', 'mes')
  if (intervalo === 'annual') return t('services.anio', 'año')
  return t('services.unico', 'único')
}

export default function ServicesPanel({ tenantId }: Readonly<Props>) {
  const { t, i18n } = useTranslation()
  const { data: services = [], isLoading } = useTenantServices(tenantId)
  const { data: catalog = [] } = useServiceCatalog()

  const estadoConfig = useMemo<
    Record<string, { icon: typeof CheckCircle; color: string; label: string }>
  >(
    () => ({
      activo: {
        icon: CheckCircle,
        color: 'text-emerald-500 dark:text-emerald-400',
        label: t('services.estado_activo', 'Activo'),
      },
      pausado: {
        icon: Pause,
        color: 'text-amber-500 dark:text-yellow-400',
        label: t('services.estado_pausado', 'Pausado'),
      },
      cancelado: {
        icon: XCircle,
        color: 'text-rose-500 dark:text-red-400',
        label: t('services.estado_cancelado', 'Cancelado'),
      },
      vencido: {
        icon: XCircle,
        color: 'text-rose-500 dark:text-red-400',
        label: t('services.estado_vencido', 'Vencido'),
      },
    }),
    [t]
  )

  const tipoLabels = useMemo<Record<string, string>>(
    () => ({
      plan: t('services.tipo_plan', 'Plan'),
      addon: t('services.tipo_addon', 'Complemento'),
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
            <span className="font-bold text-slate-900 dark:text-white">
              {row.original.service?.nombre || 'Servicio General'}
            </span>
            {row.original.service?.descripcion && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
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
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
            {tipoLabels[row.original.service?.tipo || ''] || row.original.service?.tipo || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'precio_actual',
        header: t('services.col_precio', 'Precio'),
        cell: ({ row }) => (
          <div className="font-black font-mono text-slate-900 dark:text-white">
            ${row.original.precio_actual.toLocaleString(i18n.language || 'es-AR')}
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 font-normal font-sans">
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
            <span className={`inline-flex items-center gap-1.5 text-xs font-black ${config.color}`}>
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
          <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {new Date(row.original.started_at).toLocaleDateString(i18n.language || 'es-AR')}
          </span>
        ),
      },
    ],
    [t, i18n.language, estadoConfig, tipoLabels]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeServices = services.filter((s: TenantServiceWithDetails) => s.estado === 'activo')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Package className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          {t('services.titulo', 'Servicios y Servidores')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          {activeServices.length} {t('services.servidores_online', 'Servicios Activos')}
        </p>
      </div>

      {/* Services Table */}
      {services.length > 0 ? (
        <DataTable
          columns={columns}
          data={services}
          searchPlaceholder={t('services.buscar_placeholder', 'Buscar servicio por nombre...')}
          pageSize={5}
          emptyMessage={t('services.sin_servicios', 'No se encontraron servicios contratados.')}
        />
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/15 bg-white/90 dark:bg-slate-950/80 rounded-3xl p-8 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {t('services.sin_servicios_activos', 'Sin servicios activos')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto font-medium">
            {t(
              'services.sin_servicios_desc',
              'Elegí un plan o servicio para empezar a usar la plataforma.'
            )}
          </p>
          <a
            href="/tienda"
            className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-2xl bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-black hover:opacity-90 transition-opacity shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            {t('services.ver_planes', 'Ver planes')}
          </a>
        </div>
      )}

      {/* Available Addons */}
      <div>
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
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
            .map((item: ServiceCatalog) => {
              const waAddonMsg = encodeURIComponent(
                `¡Hola ExePaginasWeb! Quisiera solicitar contratar el complemento/servicio: "${item.nombre}" ($${item.precio_base.toLocaleString('es-AR')} ${item.moneda}).`
              )
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-950/80 p-5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {tipoLabels[item.tipo] || item.tipo}
                      </p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {item.nombre}
                      </p>
                      {item.descripcion && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                          {item.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        ${item.precio_base.toLocaleString(i18n.language || 'es-AR')}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                        {item.moneda} / {getIntervalLabel(item.intervalo, t)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/5493416874786?text=${waAddonMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline w-fit cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t('services.solicitar', 'Solicitar')}</span>
                  </a>
                </motion.div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
