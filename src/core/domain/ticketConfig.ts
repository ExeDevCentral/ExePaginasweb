import type { PlanTier } from './planCatalog'

export const TICKET_CATEGORIES: Record<Exclude<PlanTier, 'none'>, { id: string; label: string }[]> = {
  basico: [
    { id: 'consulta', label: 'Consulta general' },
    { id: 'sitio', label: 'Problema en el sitio' },
    { id: 'ssl', label: 'Dominio / SSL' },
    { id: 'contenido', label: 'Cambio de contenido' },
  ],
  avanzado: [
    { id: 'consulta', label: 'Consulta general' },
    { id: 'sitio', label: 'Problema en el sitio' },
    { id: 'reservas', label: 'Reservas / turnos' },
    { id: 'pagos', label: 'Pagos / Mercado Pago' },
    { id: 'database', label: 'Base de datos' },
    { id: 'bug', label: 'Error o bug' },
  ],
  premium: [
    { id: 'consulta', label: 'Consulta general' },
    { id: 'estrategia', label: 'Consultoría estratégica' },
    { id: 'feature', label: 'Nueva funcionalidad' },
    { id: 'urgente', label: 'Urgente — producción caída' },
    { id: 'reservas', label: 'Reservas / operaciones' },
    { id: 'pagos', label: 'Pagos / integraciones' },
  ],
}

export function priorityForTier(tier: Exclude<PlanTier, 'none'>): 'baja' | 'normal' | 'alta' | 'urgente' {
  if (tier === 'premium') return 'alta'
  if (tier === 'avanzado') return 'normal'
  return 'baja'
}

export const SLA_BY_TIER: Record<Exclude<PlanTier, 'none'>, string> = {
  basico: 'Respuesta estimada: 24–48 h hábiles',
  avanzado: 'Respuesta estimada: menos de 4 h',
  premium: 'Respuesta prioritaria: menos de 1 h',
}
