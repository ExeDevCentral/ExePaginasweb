import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exepaginasweb.com'

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
