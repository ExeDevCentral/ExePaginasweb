export type PlanTier = 'basico' | 'avanzado' | 'premium' | 'none'

/** IDs de la tienda (/tienda) — misma fuente que StorePage */
export const STORE_PLAN_IDS = [
  'mantenimiento-basico',
  'mantenimiento-avanzado',
  'mantenimiento-premium',
] as const

export type StorePlanId = (typeof STORE_PLAN_IDS)[number]

export type PlanCatalogEntry = {
  id: StorePlanId
  tier: Exclude<PlanTier, 'none'>
  nombre: string
  precioUsd: number
}

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  { id: 'mantenimiento-basico', tier: 'basico', nombre: 'Abono Básico', precioUsd: 10 },
  { id: 'mantenimiento-avanzado', tier: 'avanzado', nombre: 'Abono Avanzado', precioUsd: 25 },
  { id: 'mantenimiento-premium', tier: 'premium', nombre: 'Abono Premium', precioUsd: 50 },
]

export function tierFromStorePlanId(planId: string | null | undefined): PlanTier {
  const entry = PLAN_CATALOG.find((p) => p.id === planId)
  return entry?.tier ?? 'none'
}

export function tierFromPlanLabel(label: string | null | undefined): PlanTier {
  if (!label) return 'none'
  const n = label
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')

  if (n.includes('premium') || n.includes('enterprise')) return 'premium'
  if (n.includes('avanzado') || n.includes('pro')) return 'avanzado'
  if (n.includes('basico')) return 'basico'

  const byNombre = PLAN_CATALOG.find((p) => n.includes(p.nombre.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')))
  return byNombre?.tier ?? 'none'
}

export function catalogEntryById(planId: string | null | undefined): PlanCatalogEntry | undefined {
  return PLAN_CATALOG.find((p) => p.id === planId)
}
