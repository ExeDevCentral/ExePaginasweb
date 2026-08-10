export type SLANivel = 'basico' | 'avanzado' | 'premium' | 'enterprise'

export interface SLAContract {
  id: string
  tenant_id: string
  nombre: string
  nivel: SLANivel
  tiempo_respuesta_minutos: number
  tiempo_resolucion_minutos: number
  horas_por_mes: number
  penalizacion_por_incumplimiento: number
  activo: boolean
  fecha_inicio: string
  fecha_fin: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SLABreach {
  ticket_id: string
  asunto: string
  prioridad: string
  created_at: string
  minutos_transcurridos: number
  tiempo_limite_minutos: number
  estado_sla: 'ok' | 'warning' | 'breach'
}
