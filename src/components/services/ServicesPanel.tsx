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
import { useTenantServices } from '../../hooks/useServices'
import { useServiceCatalog } from '../../hooks/useServices'
import type { TenantServiceWithDetails } from '../../core/domain/entities/TenantService'
import type { ServiceCatalog } from '../../core/domain/entities/ServiceCatalog'

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
  const { data: services = [], isLoading } = useTenantServices(tenantId)
  const { data: catalog = [] } = useServiceCatalog()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeServices = services.filter((s: TenantServiceWithDetails) => s.estado === 'activo')
  const inactiveServices = services.filter((s: TenantServiceWithDetails) => s.estado !== 'activo')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-accent-cyan" />
          Mis Servicios
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {activeServices.length} servicios activos
        </p>
      </div>

      {/* Active Services */}
      {activeServices.length > 0 && (
        <div className="space-y-3">
          {activeServices.map((service: TenantServiceWithDetails, i: number) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
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

      {/* Inactive Services */}
      {inactiveServices.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Servicios inactivos
          </h3>
          <div className="space-y-2">
            {inactiveServices.map((service: TenantServiceWithDetails) => (
              <div
                key={service.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 opacity-60"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {service.service?.nombre || 'Servicio'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {service.service?.descripcion || ''}
                  </p>
                </div>
                <span className="text-xs text-red-400 font-bold uppercase">
                  {ESTADO_CONFIG[service.estado]?.label || service.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && (
        <div className="text-center py-12">
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
    </div>
  )
}

function ServiceCard({ service, index }: { service: TenantServiceWithDetails; index: number }) {
  const config = ESTADO_CONFIG[service.estado] || ESTADO_CONFIG.activo
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-border bg-card/50 p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {service.service?.nombre || 'Servicio'}
              </h3>
              <span className={`flex items-center gap-1 text-xs font-bold ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
              </span>
            </div>
            {service.service?.descripcion && (
              <p className="text-xs text-muted-foreground mt-0.5">{service.service.descripcion}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Desde {new Date(service.started_at).toLocaleDateString('es-AR')}
              </span>
              {service.ends_at && (
                <span>Hasta {new Date(service.ends_at).toLocaleDateString('es-AR')}</span>
              )}
              {service.auto_renew && (
                <span className="text-emerald-400">Renovación automática</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            ${service.precio_actual.toLocaleString('es-AR')}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">{service.moneda}</p>
        </div>
      </div>
    </motion.div>
  )
}
