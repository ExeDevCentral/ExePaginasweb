export type TenantServiceEstado = 'activo' | 'pausado' | 'cancelado' | 'vencido'

export interface TenantService {
  id: string
  tenant_id: string
  service_id: string
  estado: TenantServiceEstado
  precio_actual: number
  moneda: string
  started_at: string
  ends_at: string | null
  auto_renew: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantServiceWithDetails extends TenantService {
  service?: {
    id: string
    slug: string
    nombre: string
    descripcion: string | null
    tipo: string
    intervalo: string
  } | null
}
