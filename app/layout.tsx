/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import Providers from './providers'
import '@astryxdesign/theme-neutral/theme.css'
import '@astryxdesign/core/astryx.css'
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

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#047857',
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
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://exepaginasweb.com/',
    siteName: 'Exe Páginas Web',
    title: 'Exe Páginas Web | Desarrollo Web a Medida y Sistemas SaaS',
    description:
      'Exe Páginas Web — Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Control total, cero dependencias.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Exe Páginas Web — Desarrollo Web a Medida y Sistemas SaaS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exe Páginas Web | Desarrollo Web a Medida',
    description:
      'Exe Páginas Web — Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Control total, cero dependencias.',
    images: ['/og-image.png'],
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
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://exepaginasweb.com/soluciones?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': 'https://exepaginasweb.com/#organization',
        name: 'Exe Páginas Web',
        alternateName: ['ExePaginasWeb', 'ExeSistemasWEB', 'Exe Páginas Web'],
        url: 'https://exepaginasweb.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://exepaginasweb.com/logo.png',
          width: 512,
          height: 512,
        },
        image: 'https://exepaginasweb.com/og-image.png',
        email: 'Contacto@exepaginasweb.com',
        founder: {
          '@type': 'Person',
          name: 'Exequiel Echevarria',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Rosario',
          addressRegion: 'Santa Fe',
          addressCountry: 'AR',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'Contacto@exepaginasweb.com',
          contactType: 'sales',
          availableLanguage: ['Spanish', 'English', 'Portuguese'],
        },
        description:
          'Exe Páginas Web ofrece arquitectura de software, plataformas cloud y aplicaciones a medida con 100% código propio para empresas y organizaciones a escala global.',
        serviceType: [
          'Arquitectura de Software',
          'Desarrollo de Páginas Web',
          'Diseño Web de Alta Gama',
          'E-commerce y Plataformas Cloud',
          'Aplicaciones Web a Medida',
          'Sistemas SaaS',
          'Terminales Linux POS',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Soluciones Web y Sistemas SaaS',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sistema para Peluquerías & Barbershops',
                url: 'https://exepaginasweb.com/soluciones#peluqueria',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sistema para Panaderías & Cafeterías',
                url: 'https://exepaginasweb.com/soluciones#panaderia',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sistema para Locales de Ropa & Moda',
                url: 'https://exepaginasweb.com/soluciones#indumentaria',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Sistema para Canchas & Clubes Deportivos',
                url: 'https://exepaginasweb.com/soluciones#canchas',
              },
            },
          ],
        },
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

  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const primaryTagId = gaId || googleAdsId

  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-white">
        {primaryTagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${gaId ? `gtag('config', '${gaId}');` : ''}
${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}`}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
