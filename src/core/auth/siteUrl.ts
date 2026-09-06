/**
 * URL canónica del sitio. En localhost o desarrollo local usa siempre window.location.origin.
 * En producción (Vercel) usa NEXT_PUBLIC_SITE_URL o window.location.origin para la callback de OAuth.
 */
export function getSiteUrl(): string {
  if (typeof window !== 'undefined') {
    // En desarrollo local (localhost / 127.0.0.1) usar siempre el origin local real
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin
    }
  }

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  if (typeof window !== 'undefined') return window.location.origin

  return 'https://exepaginasweb.com'
}

export function getAuthRedirectUrl(path = '/dashboard'): string {
  const base = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * Accept only an internal application path. Query strings are preserved, but
 * absolute URLs, protocol-relative URLs and backslash variants are rejected.
 */
export function sanitizeInternalPath(
  value: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback
  }

  try {
    const parsed = new URL(value, 'https://internal.invalid')
    if (parsed.origin !== 'https://internal.invalid') return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || fallback
  } catch {
    return fallback
  }
}

export function isLocalDashboardPreview(searchParams: URLSearchParams): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    (searchParams.get('preview') === 'true' || searchParams.get('demo') === '1')
  )
}

export function hasAuthCallbackInUrl(): boolean {
  if (typeof window === 'undefined') return false
  const { hash, search } = window.location
  return (
    hash.includes('access_token') ||
    hash.includes('error=') ||
    search.includes('code=') ||
    search.includes('error=')
  )
}
