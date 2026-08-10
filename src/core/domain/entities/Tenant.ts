export type TenantEstado = 'activo' | 'suspendido' | 'cancelado' | 'trial'

export interface Tenant {
  id: string
  slug: string
  nombre: string
  plan_id: string | null
  dueno_id: string
  estado: TenantEstado
  trial_ends_at: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TenantWithPlan extends Tenant {
  plan?: {
    id: string
    slug: string
    nombre: string
    precio: number
    moneda: string
  } | null
}
