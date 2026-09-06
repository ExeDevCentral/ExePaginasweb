import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IAdminDashboardRepository } from '../core/domain/repositories/IAdminDashboardRepository'
import { SupabaseAdminDashboardRepository } from '../core/infra/repositories/SupabaseAdminDashboardRepository'
import { computeAdminStats } from '../core/domain/financial/computeAdminStats'
import {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
  DEFAULT_ADMIN_STATS,
} from '../core/domain/entities/AdminDashboard'

export type {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
} from '../core/domain/entities/AdminDashboard'

export interface UseAdminDashboardOptions {
  enabled?: boolean
  userId?: string
  repo?: IAdminDashboardRepository
}

export interface AdminDashboardData {
  clientes: AdminCliente[]
  suscripciones: AdminSuscripcion[]
  pagos: AdminPago[]
  tickets: AdminTicket[]
  stats: AdminStats
}

export async function fetchAdminDashboard(
  repo: IAdminDashboardRepository
): Promise<AdminDashboardData> {
  const overview = await repo.getAdminOverview()
  const stats = computeAdminStats(
    overview.clientes,
    overview.suscripciones,
    overview.pagos,
    overview.tickets
  )
  return { ...overview, stats }
}

const defaultAdminDashboardRepo = new SupabaseAdminDashboardRepository()

export function useAdminDashboard(options: UseAdminDashboardOptions = {}) {
  const { enabled = true, userId, repo = defaultAdminDashboardRepo } = options
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard', userId ?? null],
    enabled,
    staleTime: 1000 * 60 * 2,
    queryFn: () => fetchAdminDashboard(repo),
  })

  const clientes = useMemo(() => data?.clientes ?? [], [data?.clientes])
  const suscripciones = useMemo(() => data?.suscripciones ?? [], [data?.suscripciones])
  const pagos = useMemo(() => data?.pagos ?? [], [data?.pagos])
  const tickets = useMemo(() => data?.tickets ?? [], [data?.tickets])
  const stats = data?.stats ?? DEFAULT_ADMIN_STATS

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', userId ?? null] })
  }

  return {
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : 'Error cargando datos de administrador'
      : null,
    clientes,
    suscripciones,
    pagos,
    tickets,
    stats,
    refresh: handleRefresh,
  }
}
