/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest } from 'next/server'
import { AiUserContext } from '@/core/ai/types'
import { getBearerToken } from '@/lib/server/apiAuth'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface RoleRow {
  role: string
}

const VALID_ROLES = ['admin', 'manager', 'staff', 'customer', 'anonymous'] as const

function normalizeRole(role: string | null | undefined): AiUserContext['role'] {
  const r = role?.toLowerCase()
  if (VALID_ROLES.includes(r as (typeof VALID_ROLES)[number])) {
    return r as AiUserContext['role']
  }
  return 'anonymous'
}

export async function resolveAiUserContext(req: NextRequest): Promise<AiUserContext> {
  const token = getBearerToken(req)
  if (!token) {
    return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
  }

  try {
    const { data } = await supabaseAdmin.auth.getUser(token)
    const user = data?.user
    if (!user?.id) {
      return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
    }

    const roleResult = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    const role = normalizeRole(roleResult.error ? null : (roleResult.data as RoleRow | null)?.role)

    const tenantResult = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('dueno_id', user.id)
      .limit(1)
      .maybeSingle()
    const tenantId =
      !tenantResult.error && tenantResult.data
        ? ((tenantResult.data as { id: string }).id ?? null)
        : null

    return {
      userId: user.id,
      email: user.email ?? null,
      role,
      clienteId: user.id,
      tenantId,
    }
  } catch {
    return { userId: null, email: null, role: 'anonymous', clienteId: null, tenantId: null }
  }
}
