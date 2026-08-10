import PlanDashboardView from './PlanDashboardView'
import DashboardFree from './DashboardFree'
import type { PlanTier } from './resolvePlanTier'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'

type ClientDashboardProps = {
  planTier: PlanTier
  cliente: Cliente | null
  suscripciones: Suscripcion[]
  pagos: Pago[]
  onRefresh: () => void
  refreshing: boolean
  onLogout: () => void
}

export default function ClientDashboard(props: ClientDashboardProps) {
  const { planTier, ...rest } = props

  if (planTier === 'none') {
    return <DashboardFree cliente={rest.cliente} onLogout={rest.onLogout} />
  }

  return <PlanDashboardView tier={planTier} {...rest} />
}
