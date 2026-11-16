/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import type { Metadata } from 'next'
import LinuxPage from '@/components/linux/LinuxPage'

export const metadata: Metadata = {
  title: 'Servicios Linux Empresariales | Terminales POS, Migración de PCs y Servidores Locales',
  description:
    'Aprovisionamiento de terminales Linux POS en modo quiosco (arranque en 4.5s), rescate de flotas de PCs lentas con $0 en licencias y nodos servidores locales PostgreSQL Offline-First.',
  keywords: [
    'servicios linux empresariales',
    'terminales linux pos',
    'punto de venta linux',
    'modo quiosco linux',
    'rescate de pc linux',
    'servidor local linux postgresql',
    'offline first pos',
    'migracion linux empresas argentina',
    'exepaginasweb linux',
  ],
  alternates: { canonical: '/linux' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://exepaginasweb.com/linux',
    siteName: 'Exe Páginas Web',
    title: 'Servicios Linux Empresariales | Terminales POS y Servidores Locales',
    description:
      'Terminales Linux POS en modo quiosco, rescate de flotas de PCs con $0 en licencias y nodos servidores locales PostgreSQL Offline-First.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Exe Páginas Web — Servicios Linux Empresariales y Terminales POS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios Linux Empresariales | Terminales POS y Servidores Locales',
    description:
      'Terminales Linux POS en modo quiosco (4.5s), rescate de PCs con $0 en licencias y servidores locales PostgreSQL Offline-First.',
    images: ['/og-image.png'],
  },
}

const linuxJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: 'https://exepaginasweb.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Servicios Linux Empresariales',
          item: 'https://exepaginasweb.com/linux',
        },
      ],
    },
    {
      '@type': 'Service',
      '@id': 'https://exepaginasweb.com/linux#service',
      name: 'Infraestructura Linux Empresarial: Terminales POS, Flotas y Servidores Locales',
      serviceType: 'Linux Infrastructure & POS Provisioning',
      provider: {
        '@id': 'https://exepaginasweb.com/#organization',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Global',
      },
      url: 'https://exepaginasweb.com/linux',
      description:
        'Aprovisionamiento de terminales Linux POS en modo quiosco con arranque en 4.5s, recuperación de hardware existente con $0 en licencias y servidores LAN PostgreSQL Offline-First.',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Catálogo de Servicios Linux',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Terminales Linux POS en Modo Quiosco',
              description:
                'Estaciones de cobro blindadas con 480 MB de RAM base, arranque en 4.5s y soporte nativo para impresoras térmicas ESC/POS.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Rescate y Migración de Flotas de PCs',
              description:
                'Recuperación de computadoras de mostrador u oficina sin costo de licencias ni telemetría invasiva.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Servidores Locales PostgreSQL Offline-First',
              description:
                'Nodos LAN con replicación automática para seguir facturando aunque se corte internet.',
            },
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Se pierden ventas o datos si se corta internet en una terminal Linux POS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Los nodos locales PostgreSQL Offline-First siguen registrando ventas y tickets en la red local y sincronizan automáticamente al volver la conexión.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Sirve para computadoras viejas con poca memoria RAM?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. El entorno mínimo optimizado consume alrededor de 480 MB de RAM en reposo y arranca en pocos segundos, recuperando PCs con 4 GB de RAM.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué incluye el soporte de impresoras térmicas y lectores?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Integración nativa USB/Ethernet para impresoras térmicas ESC/POS de 58mm y 80mm, lectores de código de barras y cajones de dinero.',
          },
        },
      ],
    },
  ],
}

export default function LinuxRoutePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(linuxJsonLd) }}
      />
      <LinuxPage />
    </>
  )
}
