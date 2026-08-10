export type RenewalEstado = 'pendiente' | 'procesando' | 'completada' | 'fallida' | 'cancelada'

export interface RenewalSchedule {
  id: string
  tenant_id: string
  tenant_service_id: string
  fecha_renovacion: string
  monto_esperado: number
  moneda: string
  estado: RenewalEstado
  intentos: number
  max_intentos: number
  notificado: boolean
  created_at: string
  updated_at: string
}
