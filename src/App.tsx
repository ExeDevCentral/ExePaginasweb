import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useSpring } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/Hero/Hero'
import ErrorBoundary from './components/layout/ErrorBoundary'
import ScrollProvider from './components/shared/ScrollProvider'
const SocialProof = lazy(() => import('./components/SocialProof/SocialProof'))
const Process = lazy(() => import('./components/Process/Process'))
const FAQ = lazy(() => import('./components/FAQ/FAQ'))
const Footer = lazy(() => import('./components/layout/Footer'))
const AIChatWidget = lazy(() => import('./components/chat/AIChatWidget'))
const ContactSection = lazy(() => import('./components/landing/ContactSection'))
const Pricing = lazy(() => import('./components/Pricing/Pricing'))
const OwnershipVsSubscription = lazy(() => import('./components/shared/OwnershipVsSubscription'))
const PortfolioSection = lazy(() => import('./components/Portfolio/PortfolioSection'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const Products = lazy(() => import('./components/Products/Products'))
import MouseSpotlight from './components/shared/MouseSpotlight'

const CaseStudies = lazy(() => import('./components/CaseStudies/CaseStudies'))

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-muted/60" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
)

const SectionSkeleton = () => (
  <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex flex-col items-center gap-4 mb-16">
      <SkeletonBlock className="h-3 w-32 rounded-full" />
      <SkeletonBlock className="h-10 w-80 rounded-2xl max-w-full" />
      <SkeletonBlock className="h-4 w-64 rounded-lg max-w-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <SkeletonBlock key={i} className="h-56 rounded-2xl" />
      ))}
    </div>
  </div>
)

const WaveDivider = ({
  flip = false,
  color = 'var(--background)',
}: {
  flip?: boolean
  color?: string
}) => (
  <div
    className={`relative w-full h-16 sm:h-24 -my-1 z-10 pointer-events-none ${flip ? 'rotate-180' : ''}`}
  >
    <svg
      viewBox="0 0 1440 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        d="M0 64L48 58.7C96 53.3 192 42.7 288 37.3C384 32 480 32 576 37.3C672 42.7 768 53.3 864 58.7C960 64 1056 64 1152 58.7C1248 53.3 1344 42.7 1392 37.3L1440 32V96H1392C1344 96 1248 96 1152 96C1056 96 960 96 864 96C768 96 672 96 576 96C480 96 384 96 288 96C192 96 96 96 48 96H0V64Z"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 74.7C960 80 1056 80 1152 74.7C1248 69.3 1344 58.7 1392 53.3L1440 48V96H1392C1344 96 1248 96 1152 96C1056 96 960 96 864 96C768 96 672 96 576 96C480 96 384 96 288 96C192 96 96 96 48 96H0V80Z"
        fill={color}
      />
    </svg>
  </div>
)

function App() {
  const [loadHeavyComponents, setLoadHeavyComponents] = useState(false)

  // Diferir la carga de componentes pesados como el Bot que no son críticos para LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadHeavyComponents(true)
    }, 3500)

    // Si el usuario hace scroll antes, los cargamos
    const handleScroll = () => {
      setLoadHeavyComponents(true)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Capturamos el progreso del scroll (0 a 1)
  const { scrollYProgress } = useScroll()

  // Aplicamos un efecto de resorte (Spring) para que el movimiento sea ultra fluido
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <ErrorBoundary>
      <ScrollProvider>
        <Helmet>
          <title>ExePaginasWeb | Desarrollo Web a Medida</title>
          <meta
            name="description"
            content="Creamos páginas web, tiendas online y aplicaciones web modernas con código propio."
          />
          <meta
            name="keywords"
            content="desarrollo web a medida, páginas web, tiendas online, e-commerce, aplicaciones web, código propio, ExePaginasWeb"
          />

          {/* Open Graph / Facebook */}
          <meta property="og:site_name" content="ExePaginasWeb" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://exepaginasweb.com/" />
          <meta property="og:title" content="ExePaginasWeb | Desarrollo Web a Medida" />
          <meta
            property="og:description"
            content="Creamos páginas web, tiendas online y aplicaciones web modernas con código propio."
          />
          <meta property="og:image" content="https://exepaginasweb.com/og-image.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter / X */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="ExePaginasWeb | Desarrollo Web a Medida" />
          <meta
            name="twitter:description"
            content="Creamos páginas web, tiendas online y aplicaciones web modernas con código propio."
          />
          <meta name="twitter:image" content="https://exepaginasweb.com/og-image.png" />

          <link rel="canonical" href="https://exepaginasweb.com/" />
          <script type="application/ld+json">
            {JSON.stringify({
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
              serviceType: ['Desarrollo Web', 'Diseño Web', 'E-commerce', 'Aplicaciones Web'],
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
              sameAs: [],
            })}
          </script>
        </Helmet>
        <div className="min-h-screen bg-transparent text-primary-text relative">
          <MouseSpotlight />
          {/* Barra de progreso de lectura */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-magenta origin-left z-[100]"
            style={{ scaleX }}
          />

          <Header />
          <main>
            <Hero />
            <WaveDivider />
            <Suspense fallback={<SectionSkeleton />}>
              <OwnershipVsSubscription />
              <SocialProof />
              <Products />
              <CaseStudies />
              <PortfolioSection />
              <DemoZone />
              <Process />
            </Suspense>
            <WaveDivider flip />
            <Suspense fallback={<SectionSkeleton />}>
              <Pricing />
            </Suspense>
            <WaveDivider />
            <Suspense
              fallback={
                <div className="py-20 text-center text-primary-secondary">
                  <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  Cargando contacto...
                </div>
              }
            >
              <ContactSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <FAQ />
            </Suspense>
          </main>
          <Suspense fallback={<div className="h-20" />}>
            {loadHeavyComponents && <Footer />}
          </Suspense>
          <Suspense fallback={null}>{loadHeavyComponents && <AIChatWidget />}</Suspense>
        </div>
      </ScrollProvider>
    </ErrorBoundary>
  )
}

export default App
