export interface PlanJoin {
  slug?: string
  nombre?: string | null
  precio?: number | null
  caracteristicas?: string | null
}

export interface Suscripcion {
  id: string
  cliente_id: string
  plan_slug: string
  plan_id?: string
  estado?: string
  fecha_inicio: string | null
  plan: PlanJoin | null
}
