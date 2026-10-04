/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
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
    default: 'Exe Páginas Web | Desarrollo Web a Medida y Sistemas SaaS',
    template: '%s | Exe Páginas Web',
  },
  description:
    'Exe Páginas Web — Arquitectura de software de alto perfil, plataformas cloud y sistemas web a medida con 100% código propio para empresas que no pueden permitirse fallar a escala global.',
  keywords: [
    'exe paginas web',
    'exe páginas web',
    'exepaginasweb',
    'exepaginasweb.com',
    'arquitectura de software',
    'desarrollo web a medida',
    'sistemas saas',
    'tiendas online',
    'e-commerce',
    'aplicaciones web',
    'código propio',
    'ExeSistemasWEB',
    'Exequiel Echevarria',
    'desarrollo web internacional',
    'software boutique',
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Exe Páginas Web' }, { name: 'Exequiel Echevarria' }],
  creator: 'Exe Páginas Web',
  publisher: 'Exe Páginas Web',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    siteName: 'Exe Páginas Web',
    title: 'Exe Páginas Web | Desarrollo Web a Medida y Sistemas SaaS',
    description:
      'Exe Páginas Web — Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Control total, cero dependencias.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exe Páginas Web | Desarrollo Web a Medida',
    description:
      'Exe Páginas Web — Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Control total, cero dependencias.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://exepaginasweb.com/#website',
        url: 'https://exepaginasweb.com/',
        name: 'Exe Páginas Web',
        alternateName: [
          'ExePaginasWeb',
          'Exe Paginas Web',
          'ExeSistemasWEB',
          'exepaginasweb.com',
          'Exe Sistemas Web Global',
        ],
        description:
          'Estudio boutique de arquitectura de software, plataformas cloud y desarrollo web a medida con 100% código propio y alcance global.',
        inLanguage: 'es',
        publisher: {
          '@id': 'https://exepaginasweb.com/#organization',
        },
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': 'https://exepaginasweb.com/#organization',
        name: 'Exe Páginas Web',
        alternateName: ['ExePaginasWeb', 'ExeSistemasWEB', 'Exe Páginas Web'],
        url: 'https://exepaginasweb.com/',
        logo: 'https://exepaginasweb.com/logo.png',
        image: 'https://exepaginasweb.com/og-image.png',
        email: 'Contacto@exepaginasweb.com',
        description:
          'Exe Páginas Web ofrece arquitectura de software, plataformas cloud y aplicaciones a medida con 100% código propio para empresas y organizaciones a escala global.',
        serviceType: [
          'Arquitectura de Software',
          'Desarrollo de Páginas Web',
          'Diseño Web de Alta Gama',
          'E-commerce y Plataformas Cloud',
          'Aplicaciones Web a Medida',
          'Sistemas SaaS',
        ],
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Global',
        },
        priceRange: '$$',
        sameAs: ['https://github.com/ExeDevCentral'],
        knowsAbout: [
          'Desarrollo web a medida',
          'Páginas web',
          'Sistemas SaaS',
          'Tiendas online',
          'Automatización de negocios',
        ],
      },
    ],
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
