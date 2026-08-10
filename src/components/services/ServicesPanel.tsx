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

const ESTADO_CONFIG: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  activo: { icon: CheckCircle, color: 'text-emerald-400', label: 'Activo' },
  pausado: { icon: Pause, color: 'text-yellow-400', label: 'Pausado' },
  cancelado: { icon: XCircle, color: 'text-red-400', label: 'Cancelado' },
  vencido: { icon: XCircle, color: 'text-red-400', label: 'Vencido' },
}

const TIPO_LABELS: Record<string, string> = {
  plan: 'Plan',
  addon: 'Complemento',
  professional: 'Servicio Profesional',
  one_time: 'Pago Único',
}

interface Props {
  tenantId: string
}

export default function ServicesPanel({ tenantId }: Props) {
  const { t } = useTranslation()
  const { data: services = [], isLoading } = useTenantServices(tenantId)
  const { data: catalog = [] } = useServiceCatalog()

  const columns = useMemo<ColumnDef<TenantServiceWithDetails, any>[]>(
    () => [
      {
        accessorKey: 'service.nombre',
        header: 'Servicio',
        cell: ({ row }) => (
          <div>
            <span className="font-bold text-foreground">
              {row.original.service?.nombre || 'Servicio General'}
            </span>
            {row.original.service?.descripcion && (
              <p className="text-xs text-muted-foreground truncate max-w-xs">
                {row.original.service.descripcion}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'service.tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan uppercase">
            {TIPO_LABELS[row.original.service?.tipo || ''] || row.original.service?.tipo || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'precio_actual',
        header: 'Precio',
        cell: ({ row }) => (
          <div className="font-bold text-foreground">
            ${row.original.precio_actual.toLocaleString('es-AR')}
            <span className="ml-1 text-xs text-muted-foreground font-normal">
              {row.original.moneda}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
          const config = ESTADO_CONFIG[row.original.estado] || ESTADO_CONFIG.activo
          const Icon = config.icon
          return (
            <span className={`inline-flex items-center gap-1 text-xs font-bold ${config.color}`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'started_at',
        header: 'Inicio',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            {new Date(row.original.started_at).toLocaleDateString('es-AR')}
          </span>
        ),
      },
    ],
    []
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeServices = services.filter((s: TenantServiceWithDetails) => s.estado === 'activo')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-accent-cyan" />
          {t('services.titulo')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {activeServices.length} {t('services.servidores_online')}
        </p>
      </div>

      {/* Services Table */}
      {services.length > 0 ? (
        <DataTable
          columns={columns}
          data={services}
          searchPlaceholder="Buscar servicio por nombre..."
          pageSize={5}
          emptyMessage="No se encontraron servicios contratados."
        />
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl p-6">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground">Sin servicios activos</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Elegí un plan o servicio para empezar a usar la plataforma.
          </p>
          <a
            href="/tienda"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-accent-cyan text-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <CreditCard className="w-4 h-4" />
            Ver planes
          </a>
        </div>
      )}

      {/* Available Addons */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Disponible para agregar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="rounded-xl border border-dashed border-border p-4 hover:border-accent-cyan/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                      {TIPO_LABELS[item.tipo] || item.tipo}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1">{item.nombre}</p>
                    {item.descripcion && (
                      <p className="text-xs text-muted-foreground mt-1">{item.descripcion}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      ${item.precio_base.toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {item.moneda} /{' '}
                      {item.intervalo === 'monthly'
                        ? 'mes'
                        : item.intervalo === 'annual'
                          ? 'año'
                          : 'único'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3 h-3" />
                  <span>Solicitar</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
