import { supabase } from '../supabase/client'
import { Suscripcion } from '../../domain/entities/Suscripcion'
import { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository'

type SubscriptionRow = Pick<
  Suscripcion,
  'id' | 'cliente_id' | 'plan_slug' | 'estado' | 'fecha_inicio'
>

type PlanRow = {
  slug: string
  nombre: string | null
  precio: number | null
  caracteristicas: string | null
}

export class SupabaseSubscriptionRepository implements ISubscriptionRepository {
  async getByClienteId(clienteId: string): Promise<Suscripcion[]> {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('id, cliente_id, plan_slug, estado, fecha_inicio')
      .eq('cliente_id', clienteId)
      .order('fecha_inicio', { ascending: false })

    if (error) throw error

    const subs = (data ?? []) as unknown as SubscriptionRow[]

    const slugs = [...new Set(subs.map((s) => s.plan_slug).filter(Boolean))]
    const { data: planes, error: planesError } =
      slugs.length > 0
        ? await supabase
            .from('planes')
            .select('slug, nombre, precio, caracteristicas')
            .in('slug', slugs)
        : { data: [], error: null }

    if (planesError) throw planesError

    const planMap = new Map((planes ?? ([] as PlanRow[])).map((p) => [p.slug, p]))

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
