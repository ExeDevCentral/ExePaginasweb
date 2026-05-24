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

  async createNotificationForTicket(
    clienteId: string,
    ticket: Ticket
  ): Promise<void> {
    const { error } = await supabase.from('notificaciones').insert({
      cliente_id: clienteId,
      titulo: 'Ticket recibido',
      mensaje: `Tu solicitud "${ticket.asunto}" fue registrada. Te respondemos según tu plan.`,
      tipo: 'ticket',
      ref_ticket_id: ticket.id,
    })
    if (error) console.warn('[tickets] notificación:', error.message)
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
