/**
 * URL canónica del sitio. En Vercel conviene definir VITE_SITE_URL
 * (ej. https://exepaginasweb.com) para que OAuth use siempre el dominio de producción.
 */
export function getSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim()

  // Si Vercel no provee VITE_SITE_URL (o llega vacío), caemos a la URL real.
  if (configured) return configured.replace(/\/$/, '')

  // Hardcode temporal (fallback) para OAuth/callbacks.
  const hardcoded = 'https://exepaginasweb.com'

  // En navegador siempre podemos derivar el origin real.
  if (typeof window !== 'undefined') return window.location.origin

  // Fallback en SSR / entorno no navegador.
  return hardcoded
}



export function getAuthRedirectUrl(path = '/dashboard'): string {
  const base = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
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
