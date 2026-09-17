/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabaseAdmin } from '@/lib/supabase/admin'
import { AiUserContext } from '@/core/ai/types'
import { AiContextBundle, IContextProvider, buildContextSummary } from '@/core/ai/context'

interface ClienteRow {
  full_name: string | null
  email: string | null
}

interface RoleRow {
  role: string
}

interface TenantRow {
  id: string
  slug: string
  nombre: string
  plan_id: string | null
  plan_nombre: string | null
}

export class SupabaseAiContextProvider implements IContextProvider {
  async getContext(userContext: AiUserContext): Promise<AiContextBundle> {
    const userId = userContext.userId
    if (!userId || !supabaseAdmin) {
      return { user: null, tenant: null, summary: '' }
    }

    const [clienteResult, roleResult, tenantResult] = await Promise.allSettled([
      supabaseAdmin
        .from('clientes')
        .select('full_name, email')
        .eq('id', userId)
        .maybeSingle()
        .then((r) => r.data as ClienteRow | null),
      supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()
        .then((r) => r.data as RoleRow | null),
      supabaseAdmin
        .from('tenants')
        .select('id, slug, nombre, plan_id')
        .eq('dueno_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(async (r) => {
          const tenant = r.data?.[0] as TenantRow | undefined
          if (!tenant) return null
          if (tenant.plan_id) {
            const plan = await supabaseAdmin
              .from('planes')
              .select('nombre')
              .eq('id', tenant.plan_id)
              .maybeSingle()
            return {
              ...tenant,
              plan_nombre: (plan.data as { nombre: string } | null)?.nombre ?? null,
            }
          }
          return tenant
        }),
    ])

    const cliente = clienteResult.status === 'fulfilled' ? clienteResult.value : null
    const role = roleResult.status === 'fulfilled' ? roleResult.value?.role : null
    const tenant = tenantResult.status === 'fulfilled' ? tenantResult.value : null

    const bundle: AiContextBundle = {
      user: cliente
        ? {
            name: cliente.full_name,
            email: cliente.email ?? userContext.email,
            role: role ?? userContext.role,
          }
        : null,
      tenant: tenant
        ? {
            id: tenant.id,
            slug: tenant.slug,
            nombre: tenant.nombre,
            plan: tenant.plan_nombre ?? null,
          }
        : null,
      summary: '',
    }

    bundle.summary = buildContextSummary(bundle)
    return bundle
  }
}
