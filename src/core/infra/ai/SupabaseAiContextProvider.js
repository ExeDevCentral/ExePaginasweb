function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { supabaseAdmin } from '@/lib/supabase/admin'

import { buildContextSummary } from '@/core/ai/context'

export class SupabaseAiContextProvider {
  async getContext(userContext) {
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
        .then((r) => r.data),
      supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()
        .then((r) => r.data),
      supabaseAdmin
        .from('tenants')
        .select('id, slug, nombre, plan_id')
        .eq('dueno_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(async (r) => {
          const tenant = _optionalChain([
            r,
            'access',
            (_) => _.data,
            'optionalAccess',
            (_2) => _2[0],
          ])
          if (!tenant) return null
          if (tenant.plan_id) {
            const plan = await supabaseAdmin
              .from('planes')
              .select('nombre')
              .eq('id', tenant.plan_id)
              .maybeSingle()
            return {
              ...tenant,
              plan_nombre: _nullishCoalesce(
                _optionalChain([plan.data, 'optionalAccess', (_3) => _3.nombre]),
                () => null
              ),
            }
          }
          return tenant
        }),
    ])

    const cliente = clienteResult.status === 'fulfilled' ? clienteResult.value : null
    const role =
      roleResult.status === 'fulfilled'
        ? _optionalChain([
            roleResult,
            'access',
            (_4) => _4.value,
            'optionalAccess',
            (_5) => _5.role,
          ])
        : null
    const tenant = tenantResult.status === 'fulfilled' ? tenantResult.value : null

    const bundle = {
      user: cliente
        ? {
            name: cliente.full_name,
            email: _nullishCoalesce(cliente.email, () => userContext.email),
            role: _nullishCoalesce(role, () => userContext.role),
          }
        : null,
      tenant: tenant
        ? {
            id: tenant.id,
            slug: tenant.slug,
            nombre: tenant.nombre,
            plan: _nullishCoalesce(tenant.plan_nombre, () => null),
          }
        : null,
      summary: '',
    }

    bundle.summary = buildContextSummary(bundle)
    return bundle
  }
}
