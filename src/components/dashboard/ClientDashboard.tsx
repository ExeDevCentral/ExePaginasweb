/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import PlanDashboardView from './PlanDashboardView'
import DashboardFree from './DashboardFree'
import type { PlanTier } from './resolvePlanTier'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../hooks/useDashboard'
import type { DashboardView } from './DashboardView'
import type { EcosystemSubTab } from '../services/ServicesPanel'
import type { TicketDraft } from './SupportTicketPanel'
import type { PlanData } from '../store/PlanCard'

type ClientDashboardProps = {
  planTier: PlanTier
  cliente: Cliente | null
  suscripciones: Suscripcion[]
  pagos: Pago[]
  onRefresh: () => void
  refreshing: boolean
  onLogout: () => void
  onNavigate?: ((tab: DashboardView) => void) | undefined
  onOpenEcosystemSubTab?: ((subTab: EcosystemSubTab) => void) | undefined
  onOpenTicketModal?: ((draft?: TicketDraft) => void) | undefined
  onSelectCheckoutPlan?: ((plan: PlanData) => void) | undefined
}

export default function ClientDashboard(props: Readonly<ClientDashboardProps>) {
  const { planTier, ...rest } = props

  if (planTier === 'none') {
    return <DashboardFree {...rest} />
  }

  return <PlanDashboardView tier={planTier} {...rest} />
}
