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
import { supabaseAdmin as db } from '@/lib/supabase/admin'

export function getBearerToken(req) {
  const value = req.headers.get('authorization')
  const match = _optionalChain([
    value,
    'optionalAccess',
    (_) => _.match,
    'call',
    (_2) => _2(/^Bearer\s+(.+)$/i),
  ])
  return (
    _optionalChain([
      match,
      'optionalAccess',
      (_3) => _3[1],
      'optionalAccess',
      (_4) => _4.trim,
      'call',
      (_5) => _5(),
    ]) || null
  )
}

export async function requireAuthUser(req) {
  const accessToken = getBearerToken(req)
  if (!accessToken) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Autenticación requerida.' }, { status: 401 }),
    }
  }

  const { data, error } = await db.auth.getUser(accessToken)
  if (
    error ||
    !_optionalChain([data, 'optionalAccess', (_6) => _6.user, 'optionalAccess', (_7) => _7.id]) ||
    !data.user.email
  ) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 }),
    }
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      user_metadata:
        typeof data.user.user_metadata === 'object' && data.user.user_metadata !== null
          ? data.user.user_metadata
          : {},
    },
    error: null,
  }
}
