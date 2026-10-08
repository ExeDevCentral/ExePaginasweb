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
/**
 * URL canónica del sitio. En localhost o desarrollo local usa siempre window.location.origin.
 * En producción (Vercel) usa NEXT_PUBLIC_SITE_URL o window.location.origin para la callback de OAuth.
 */
export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    // En desarrollo local (localhost / 127.0.0.1) usar siempre el origin local real
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin
    }
  }

  const configured = _optionalChain([
    process,
    'access',
    (_) => _.env,
    'access',
    (_2) => _2.NEXT_PUBLIC_SITE_URL,
    'optionalAccess',
    (_3) => _3.trim,
    'call',
    (_4) => _4(),
  ])
  if (configured) return configured.replace(/\/$/, '')

  if (typeof window !== 'undefined') return window.location.origin

  return 'https://exepaginasweb.com'
}

export function getAuthRedirectUrl(path = '/dashboard') {
  const base = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * Accept only an internal application path. Query strings are preserved, but
 * absolute URLs, protocol-relative URLs and backslash variants are rejected.
 */
export function sanitizeInternalPath(value, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback
  }

  try {
    const parsed = new URL(value, 'https://internal.invalid')
    if (parsed.origin !== 'https://internal.invalid') return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || fallback
  } catch (e) {
    return fallback
  }
}

export function isLocalDashboardPreview(searchParams) {
  return (
    process.env.NODE_ENV !== 'production' &&
    (searchParams.get('preview') === 'true' || searchParams.get('demo') === '1')
  )
}

export function hasAuthCallbackInUrl() {
  if (typeof window === 'undefined') return false
  const { hash, search } = window.location
  return (
    hash.includes('access_token') ||
    hash.includes('error=') ||
    search.includes('code=') ||
    search.includes('error=')
  )
}
