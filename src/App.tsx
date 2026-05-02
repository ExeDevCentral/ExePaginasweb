import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useSpring } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Products from './components/Products/Products'
import Features from './components/Features/Features'
import ErrorBoundary from './components/ErrorBoundary'
import PremiumBackground from './components/Effects/PremiumBackground'
import SocialProof from './components/SocialProof/SocialProof'
import Process from './components/Process/Process'
import FAQ from './components/FAQ/FAQ'
import Footer from './components/Footer/Footer'

const BotWidget = lazy(() => import('./components/Bot/BotWidget'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const ContactSection = lazy(() => import('./components/ContactSection'))

function App() {
  // Capturamos el progreso del scroll (0 a 1)
  const { scrollYProgress } = useScroll()
  
  // Aplicamos un efecto de resorte (Spring) para que el movimiento sea ultra fluido
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <ErrorBoundary>
      <Helmet>
<title>ExeSistemasWEB | Sistemas Web para Negocios Locales</title>
        <meta name="description" content="Sistemas web a medida para canchas de pádel, kioscos, veterinarias y más. Reservas online, gestión de stock, CRM y automatizaciones." />
        <meta name="keywords" content="sistemas web, reservas online, gestión de negocios, CRM, automatización, exepaginasweb, canchas de pádel, kioscos, veterinarias" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
<meta property="og:title" content="ExeSistemasWEB | Sistemas Web para Negocios Locales" />
        <meta property="og:description" content="Sistemas web a medida para canchas de pádel, kioscos, veterinarias y más. Reservas online, gestión de stock y CRM." />
        <meta property="og:image" content="/og-image.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ExeSistemasWEB | Sistemas Web para Negocios Locales" />
        <meta name="twitter:description" content="Sistemas web a medida para canchas de pádel, kioscos, veterinarias y más. Reservas online, gestión de stock y CRM." />
        <meta name="twitter:image" content="/og-image.webp" />
        
        <link rel="canonical" href="https://exepaginasweb.com" />
      </Helmet>
      <div className="min-h-screen bg-transparent text-primary-text relative">
        <PremiumBackground />

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
          <SocialProof />
          <Products />
          <Features />
          <Process />
          <Suspense fallback={
            <div className="py-20 text-center text-primary-secondary">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Cargando demo...
            </div>
          }>
            <DemoZone />
          </Suspense>
          <Suspense fallback={
            <div className="py-20 text-center text-primary-secondary">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Cargando contacto...
            </div>
          }>
            <ContactSection />
          </Suspense>
          <FAQ />
        </motion.main>
        <Footer />
        <Suspense fallback={null}>
          <BotWidget />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
