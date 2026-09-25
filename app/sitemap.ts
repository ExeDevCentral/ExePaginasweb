/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const isProd = process.env.NODE_ENV === 'production'
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const baseUrl =
    isProd && (!envUrl || envUrl.includes('localhost'))
      ? 'https://exepaginasweb.com'
      : envUrl || 'https://exepaginasweb.com'

  const routes = [
    '',
    '/soluciones',
    '/portafolio',
    '/demos',
    '/precios',
    '/tienda',
    '/cotizador',
    '/privacidad',
    '/terminos',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/portafolio' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/privacidad' || route === '/terminos' ? 0.4 : 0.8,
  }))
}
