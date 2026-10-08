/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabase } from '../supabase/client'

export class SupabaseAdminDashboardRepository {
  async getAdminOverview() {
    const [clientesRes, suscripcionesRes, pagosRes, ticketsRes] = await Promise.all([
      supabase
        .from('clientes')
        .select('id, full_name, email, avatar_url, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('suscripciones').select('*').order('created_at', { ascending: false }),
      supabase.from('pagos').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
    ])

    if (clientesRes.error) throw clientesRes.error
    if (suscripcionesRes.error) throw suscripcionesRes.error
    if (pagosRes.error) throw pagosRes.error
    if (ticketsRes.error) throw ticketsRes.error

    return {
      clientes: clientesRes.data || [],
      suscripciones: suscripcionesRes.data || [],
      pagos: pagosRes.data || [],
      tickets: ticketsRes.data || [],
    }
  }
}
