'use client'

import { useSearchParams } from 'next/navigation'
import type { Cliente } from '../core/domain/entities/Cliente'
import type { Suscripcion } from '../core/domain/entities/Suscripcion'
import type { Pago } from '../core/domain/entities/Pago'
import type { PlanTier } from '../core/domain/planCatalog'

const VALID_TIERS: PlanTier[] = ['basico', 'avanzado', 'premium']

export interface EffectiveTenant {
  id: string
  nombre: string
  slug: string
}

export interface UseDemoDataOptions {
  cliente?: Cliente | null
  planTier?: PlanTier | null
  suscripciones?: Suscripcion[]
  pagos?: Pago[]
  currentTenant?: EffectiveTenant | null
}

export interface DemoDataResult {
  isPreview: boolean
  effectiveCliente: Cliente | null
  effectiveTier: PlanTier | null
  effectiveSuscripciones: Suscripcion[]
  effectivePagos: Pago[]
  effectiveTenantId: string
  currentTenant: EffectiveTenant | null
}

export const DEMO_TENANT: EffectiveTenant = {
  id: 'demo-tenant-1',
  nombre: 'Workspace ExeSistemasWEB',
  slug: 'exesistemasweb-ws',
}

const DEMO_CLIENTE: Cliente = {
  id: 'demo-user-1',
  full_name: 'John Carter',
  email: 'john.carter@dashdark.io',
}

const DEMO_SUSCRIPCIONES: Suscripcion[] = [
  {
    id: 'demo-sub',
    cliente_id: 'demo-user-1',
    plan_slug: 'avanzado',
    plan_id: 'plan-avanzado',
    estado: 'activa',
    fecha_inicio: '2025-01-15T00:00:00Z',
    plan: {
      slug: 'avanzado',
      nombre: 'Plan Avanzado',
      precio: 144.6,
    },
  },
]

const DEMO_PAGOS: Pago[] = [
  {
    id: 'demo-pago-1',
    monto: 144.6,
    moneda: 'USD',
    estado: 'aprobado',
    plan_nombre: 'Plan Avanzado',
    plan_slug: 'avanzado',
    created_at: '2025-02-01T00:00:00Z',
  },
]

export function useDemoData(options: UseDemoDataOptions = {}): DemoDataResult {
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true' || searchParams.get('demo') === '1'

  const effectiveCliente = isPreview ? DEMO_CLIENTE : (options.cliente ?? null)
  const tierParam = searchParams.get('tier')
  const effectiveTier: PlanTier | null = isPreview
    ? VALID_TIERS.includes(tierParam as PlanTier)
      ? (tierParam as PlanTier)
      : 'avanzado'
    : (options.planTier ?? null)

  const currentTenant = isPreview ? DEMO_TENANT : (options.currentTenant ?? null)
  const effectiveTenantId = currentTenant?.id ?? DEMO_TENANT.id

  return {
    isPreview,
    effectiveCliente,
    effectiveTier,
    effectiveSuscripciones: isPreview ? DEMO_SUSCRIPCIONES : (options.suscripciones ?? []),
    effectivePagos: isPreview ? DEMO_PAGOS : (options.pagos ?? []),
    effectiveTenantId,
    currentTenant,
  }
}
