function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseTicketRepository {
  async listByClienteId(clienteId) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async countOpenByClienteId(clienteId) {
    const { count, error } = await supabase
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('cliente_id', clienteId)
      .in('estado', ['abierto', 'en_progreso'])

    if (error) throw error
    return _nullishCoalesce(count, () => 0)
  }

  async create(input) {
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

    try {
      await supabase.rpc('auto_assign_ticket', { ticket_id: data.id })
    } catch (assignErr) {
      console.warn('[SupabaseTicketRepository] auto_assign_ticket failed:', assignErr)
    }

    return data
  }

  async createNotificationForTicket(clienteId, ticket) {
    // La notificación es creada automáticamente por el trigger `on_ticket_created` en Supabase.
    // Este método se mantiene por compatibilidad pero ya no hace nada desde el frontend.
    void clienteId
    void ticket
  }

  async listNotifications(clienteId) {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return _nullishCoalesce(data, () => [])
  }

  async markNotificationRead(id) {
    await supabase.from('notificaciones').update({ leida: true }).eq('id', id)
  }
}
