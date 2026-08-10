export type TicketEstado = 'abierto' | 'en_progreso' | 'resuelto' | 'cerrado'
export type TicketPrioridad = 'baja' | 'normal' | 'alta' | 'urgente'

export interface Ticket {
  id: string
  cliente_id: string
  asunto: string
  mensaje: string
  categoria: string
  prioridad: TicketPrioridad
  estado: TicketEstado
  plan_slug: string | null
  created_at: string
  updated_at: string
}

export interface Notificacion {
  id: string
  cliente_id: string
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  ref_ticket_id: string | null
  created_at: string
}
