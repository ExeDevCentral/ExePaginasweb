import { Plan } from './Plan'

export interface Suscripcion {
  id: string
  cliente_id: string
  plan_id: string
  fecha_inicio: string | null
  plan: Plan | null
}