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
}

import { getBearerToken } from '@/lib/server/apiAuth'
import { supabaseAdmin } from '@/lib/supabase/admin'

const VALID_ROLES = ['admin', 'manager', 'staff', 'customer', 'anonymous']

function normalizeRole(role) {
  const r = _optionalChain([role, 'optionalAccess', (_) => _.toLowerCase, 'call', (_2) => _2()])
  if (VALID_ROLES.includes(r)) {
    return r
  }
  return 'anonymous'
}

export async function resolveAiUserContext(req) {
  const token = getBearerToken(req)
  if (!token) {
    return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
  }

  try {
    const { data } = await supabaseAdmin.auth.getUser(token)
    const user = _optionalChain([data, 'optionalAccess', (_3) => _3.user])
    if (!_optionalChain([user, 'optionalAccess', (_4) => _4.id])) {
      return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
    }

    const roleResult = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    const role = normalizeRole(
      roleResult.error ? null : _optionalChain([roleResult.data, 'optionalAccess', (_5) => _5.role])
    )

    const tenantResult = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('dueno_id', user.id)
      .limit(1)
      .maybeSingle()
    const tenantId =
      !tenantResult.error && tenantResult.data
        ? _nullishCoalesce(tenantResult.data.id, () => null)
        : null

    return {
      userId: user.id,
      email: _nullishCoalesce(user.email, () => null),
      role,
      clienteId: user.id,
      tenantId,
    }
  } catch (e) {
    return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
  }
}
