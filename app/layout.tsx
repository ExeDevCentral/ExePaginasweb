import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://exepaginasweb.com'),
  title: {
    default: 'ExePaginasWeb | Desarrollo Web a Medida y Sistemas SaaS',
    template: '%s | ExePaginasWeb',
  },
  description:
    'Creamos páginas web, tiendas online y sistemas de software SaaS a medida con código propio de alto rendimiento.',
  keywords: [
    'desarrollo web a medida',
    'sistemas saas',
    'páginas web',
    'tiendas online',
    'e-commerce',
    'aplicaciones web',
    'código propio',
    'ExePaginasWeb',
    'Rosario',
    'Argentina',
  ],
  authors: [{ name: 'ExeSistemasWEB' }],
  creator: 'ExeSistemasWEB',
  publisher: 'ExeSistemasWEB',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://exepaginasweb.com/',
    siteName: 'ExePaginasWeb',
    title: 'ExePaginasWeb | Desarrollo Web a Medida y Sistemas SaaS',
    description:
      'Creamos páginas web, tiendas online y sistemas de software SaaS a medida con código propio.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExePaginasWeb - Estudio de Desarrollo Web',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExePaginasWeb | Desarrollo Web a Medida',
    description:
      'Creamos páginas web, tiendas online y sistemas de software SaaS a medida con código propio.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://exepaginasweb.com/#organization',
    name: 'ExePaginasWeb',
    url: 'https://exepaginasweb.com/',
    logo: 'https://exepaginasweb.com/logo.png',
    image: 'https://exepaginasweb.com/og-image.png',
    email: 'Contacto@exepaginasweb.com',
    description:
      'Desarrollo de páginas web, tiendas online y aplicaciones web a medida con código propio.',
    serviceType: ['Desarrollo Web', 'Diseño Web', 'E-commerce', 'Aplicaciones Web', 'SaaS'],
    areaServed: {
      '@type': 'City',
      name: 'Rosario',
      containedInPlace: {
        '@type': 'Country',
        name: 'Argentina',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rosario',
      addressRegion: 'Santa Fe',
      addressCountry: 'AR',
    },
    priceRange: '$$',
  }

  return (
    <html
      lang="es"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-rose-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
