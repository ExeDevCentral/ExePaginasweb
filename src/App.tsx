import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useSpring } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import Header from './components/layout/Header'
import Hero from './components/Hero/Hero'
import ErrorBoundary from './components/layout/ErrorBoundary'
const Products = lazy(() => import('./components/Products/Products'))
const Features = lazy(() => import('./components/Features/Features'))
const SocialProof = lazy(() => import('./components/SocialProof/SocialProof'))
const Process = lazy(() => import('./components/Process/Process'))
const FAQ = lazy(() => import('./components/FAQ/FAQ'))
const Footer = lazy(() => import('./components/layout/Footer'))
const PremiumBackground = lazy(() => import('./components/Effects/PremiumBackground'))
const ChatbaseWidget = lazy(() => import('./components/chat/ChatbaseWidget'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const ContactSection = lazy(() => import('./components/landing/ContactSection'))
const CaseStudies = lazy(() => import('./components/CaseStudies/CaseStudies'))
const TechStack = lazy(() => import('./components/TechStack/TechStack'))
const Pricing = lazy(() => import('./components/Pricing/Pricing'))
const BookingDemo = lazy(() => import('./components/BookingDemo/BookingDemo'))
const AutomationAudit = lazy(() => import('./components/Audit/AutomationAudit'))

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
      <Helmet>
        <title>ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios</title>
        <meta
          name="description"
          content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones para negocios que buscan liderar."
        />
        <meta
          name="keywords"
          content="estudio de sistemas, automatización de negocios, software a medida, CRM, sistemas de reservas, dashboards, exesistemasweb"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios"
        />
        <meta
          property="og:description"
          content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones."
        />
        <meta property="og:image" content="/logo.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios"
        />
        <meta
          name="twitter:description"
          content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones."
        />
        <meta name="twitter:image" content="/logo.webp" />

        <link rel="canonical" href="https://exepaginasweb.com" />
      </Helmet>
      <div className="min-h-screen bg-transparent text-primary-text relative">
        <Suspense fallback={null}>
          <PremiumBackground />
        </Suspense>

        {/* Barra de progreso de lectura */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-magenta origin-left z-[100]"
          style={{ scaleX }}
        />

        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <WaveDivider />
          <Suspense fallback={<SectionSkeleton />}>
            <SocialProof />
            <CaseStudies />
            <Products />
            <Features />
            <AutomationAudit />
            <Process />
          </Suspense>
          <WaveDivider flip />
          <Suspense
            fallback={
              <div className="py-20 text-center text-primary-secondary">
                <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                Cargando demo...
              </div>
            }
          >
            <DemoZone />
          </Suspense>
          <WaveDivider />
          <Suspense fallback={<SectionSkeleton />}>
            <BookingDemo />
          </Suspense>
          <WaveDivider flip />
          <Suspense fallback={<SectionSkeleton />}>
            <TechStack />
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
        </motion.main>
        <Suspense fallback={<div className="h-20" />}>{loadHeavyComponents && <Footer />}</Suspense>
        <Suspense fallback={null}>{loadHeavyComponents && <ChatbaseWidget />}</Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
