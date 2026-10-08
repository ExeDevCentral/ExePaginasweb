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
import { NextResponse } from 'next/server'
import { isSupabaseAdminConfigured, supabaseAdmin as supabase } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured' },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
    )
  }

  const authHeader = req.headers.get('authorization')
  const token = _optionalChain([
    authHeader,
    'optionalAccess',
    (_) => _.match,
    'call',
    (_2) => _2(/^Bearer\s+(.+)$/i),
    'optionalAccess',
    (_3) => _3[1],
    'optionalAccess',
    (_4) => _4.trim,
    'call',
    (_5) => _5(),
  ])
  if (!token) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ admin: false }, { status: 401 })
  }

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (roleError) {
    return NextResponse.json({ error: 'Unable to verify role' }, { status: 503 })
  }

  const isAdmin = _optionalChain([role, 'optionalAccess', (_6) => _6.role]) === 'admin'
  return NextResponse.json(
    { admin: isAdmin },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
