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
import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'

export async function checkRateLimit(key, windowSeconds, maxRequests) {
  if (process.env.NODE_ENV === 'test') {
    return { allowed: true, retryAfterSeconds: windowSeconds }
  }

  if (!isSupabaseAdminConfigured()) {
    throw new Error('Rate limiting is not configured')
  }

  const { data, error } = await supabaseAdmin.rpc('check_api_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  })

  if (error) throw error

  const result = Array.isArray(data) ? data[0] : data
  return {
    allowed: _optionalChain([result, 'optionalAccess', (_) => _.allowed]) === true,
    retryAfterSeconds: Number(
      _nullishCoalesce(
        _optionalChain([result, 'optionalAccess', (_2) => _2.retry_after_seconds]),
        () => windowSeconds
      )
    ),
  }
}

export function clientIp(request) {
  return (
    request.headers.get('x-real-ip') ||
    _optionalChain([
      request,
      'access',
      (_3) => _3.headers,
      'access',
      (_4) => _4.get,
      'call',
      (_5) => _5('x-forwarded-for'),
      'optionalAccess',
      (_6) => _6.split,
      'call',
      (_7) => _7(','),
      'access',
      (_8) => _8.at,
      'call',
      (_9) => _9(-1),
      'optionalAccess',
      (_10) => _10.trim,
      'call',
      (_11) => _11(),
    ]) ||
    'unknown'
  )
}
