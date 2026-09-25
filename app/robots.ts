/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === 'production'
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  const baseUrl =
    isProd && (!envUrl || envUrl.includes('localhost'))
      ? 'https://exepaginasweb.com'
      : envUrl || 'https://exepaginasweb.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/admin/', '/auth/callback'],
      },
      {
        userAgent: 'Bravebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
