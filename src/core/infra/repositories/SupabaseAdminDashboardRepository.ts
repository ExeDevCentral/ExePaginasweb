import { supabase } from '../supabase/client'
import {
  AdminOverview,
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
} from '../../domain/entities/AdminDashboard'
import { IAdminDashboardRepository } from '../../domain/repositories/IAdminDashboardRepository'

export class SupabaseAdminDashboardRepository implements IAdminDashboardRepository {
  async getAdminOverview(): Promise<AdminOverview> {
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
      clientes: (clientesRes.data || []) as unknown as AdminCliente[],
      suscripciones: (suscripcionesRes.data || []) as unknown as AdminSuscripcion[],
      pagos: (pagosRes.data || []) as unknown as AdminPago[],
      tickets: (ticketsRes.data || []) as unknown as AdminTicket[],
    }
  }
}
