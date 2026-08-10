import { supabase } from '../supabase/client'
import { Suscripcion } from '../../domain/entities/Suscripcion'

export class SupabaseSubscriptionRepository {
  async getByClienteId(clienteId: string): Promise<Suscripcion[]> {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('id, cliente_id, plan_slug, estado, fecha_inicio')
      .eq('cliente_id', clienteId)
      .order('fecha_inicio', { ascending: false })

    if (error) throw error

    const subs = (data ?? []) as any[]

    const slugs = [...new Set(subs.map((s) => s.plan_slug).filter(Boolean))]
    const { data: planes } =
      slugs.length > 0
        ? await supabase
            .from('planes')
            .select('slug, nombre, precio, caracteristicas')
            .in('slug', slugs)
        : { data: [] }

    const planMap = new Map((planes || []).map((p) => [p.slug, p]))

    return subs.map((s) => ({
      ...s,
      plan_id: s.plan_slug,
      plan: planMap.get(s.plan_slug) || {
        slug: s.plan_slug,
        nombre: s.plan_slug,
        precio: null,
        caracteristicas: null,
      },
    })) as unknown as Suscripcion[]
  }
}
