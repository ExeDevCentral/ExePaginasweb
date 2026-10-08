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

export class SupabaseSubscriptionRepository {
  async getByClienteId(clienteId) {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('id, cliente_id, plan_slug, estado, fecha_inicio')
      .eq('cliente_id', clienteId)
      .order('fecha_inicio', { ascending: false })

    if (error) throw error

    const subs = _nullishCoalesce(data, () => [])

    const slugs = [...new Set(subs.map((s) => s.plan_slug).filter(Boolean))]
    const { data: planes, error: planesError } =
      slugs.length > 0
        ? await supabase
            .from('planes')
            .select('slug, nombre, precio, caracteristicas')
            .in('slug', slugs)
        : { data: [], error: null }

    if (planesError) throw planesError

    const planMap = new Map(_nullishCoalesce(planes, () => []).map((p) => [p.slug, p]))

    return subs.map((s) => ({
      ...s,
      plan_id: s.plan_slug,
      plan: planMap.get(s.plan_slug) || {
        slug: s.plan_slug,
        nombre: s.plan_slug,
        precio: null,
        caracteristicas: null,
      },
    }))
  }
}
