export default function robots() {
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
