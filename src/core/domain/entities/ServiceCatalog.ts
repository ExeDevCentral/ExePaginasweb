export type ServiceTipo = 'plan' | 'addon' | 'professional' | 'one_time'
export type ServiceIntervalo = 'one_time' | 'monthly' | 'quarterly' | 'annual'

export interface ServiceCatalog {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  tipo: ServiceTipo
  precio_base: number
  moneda: string
  intervalo: ServiceIntervalo
  activo: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}
