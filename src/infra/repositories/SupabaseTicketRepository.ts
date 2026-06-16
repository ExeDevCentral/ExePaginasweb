import { supabase } from '../../core/infra/supabase/client'
import type { Notificacion, Ticket, TicketPrioridad } from '../../core/domain/entities/Ticket'

export type CreateTicketInput = {
  clienteId: string
  asunto: string
  mensaje: string
  categoria: string
  prioridad: TicketPrioridad
  planSlug: string | null
}

export class SupabaseTicketRepository {
  async listByClienteId(clienteId: string): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return (data ?? []) as Ticket[]
  }

  async countOpenByClienteId(clienteId: string): Promise<number> {
    const { count, error } = await supabase
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('cliente_id', clienteId)
      .in('estado', ['abierto', 'en_progreso'])

    if (error) throw error
    return count ?? 0
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        cliente_id: input.clienteId,
        asunto: input.asunto,
        mensaje: input.mensaje,
        categoria: input.categoria,
        prioridad: input.prioridad,
        plan_slug: input.planSlug,
        estado: 'abierto',
      })
      .select('*')
      .single()

    if (error) throw error
    return data as Ticket
  }

  async createNotificationForTicket(clienteId: string, ticket: Ticket): Promise<void> {
    // La notificación es creada automáticamente por el trigger `on_ticket_created` en Supabase.
    // Este método se mantiene por compatibilidad pero ya no hace nada desde el frontend.
    void clienteId
    void ticket
  }

  async listNotifications(clienteId: string): Promise<Notificacion[]> {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return (data ?? []) as Notificacion[]
  }

  async markNotificationRead(id: string): Promise<void> {
    await supabase.from('notificaciones').update({ leida: true }).eq('id', id)
  }
}
