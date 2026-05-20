import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useSpring } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import ErrorBoundary from './components/ErrorBoundary'
import { AdSense } from './components/Auth/AdSense'
import AdSlot from './components/Ads/AdSlot'

const Products = lazy(() => import('./components/Products/Products'))
const Features = lazy(() => import('./components/Features/Features'))
const SocialProof = lazy(() => import('./components/SocialProof/SocialProof'))
const Process = lazy(() => import('./components/Process/Process'))
const FAQ = lazy(() => import('./components/FAQ/FAQ'))
const Footer = lazy(() => import('./components/Footer/Footer'))
const PremiumBackground = lazy(() => import('./components/Effects/PremiumBackground'))
const BotWidget = lazy(() => import('./components/Bot/BotWidget'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const ContactSection = lazy(() => import('./components/ContactSection'))
const CaseStudies = lazy(() => import('./components/CaseStudies/CaseStudies'))
const TechStack = lazy(() => import('./components/TechStack/TechStack'))
const Pricing = lazy(() => import('./components/Pricing/Pricing'))

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
    restDelta: 0.001
  })

  return (
    <ErrorBoundary>
      <Helmet>
<title>ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios</title>
        <meta name="description" content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones para negocios que buscan liderar." />
        <meta name="keywords" content="estudio de sistemas, automatización de negocios, software a medida, CRM, sistemas de reservas, dashboards, exesistemasweb" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
<meta property="og:title" content="ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios" />
        <meta property="og:description" content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones." />
        <meta property="og:image" content="/og-image.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ExeSistemasWEB | Estudio Premium de Sistemas y Automatización de Negocios" />
        <meta name="twitter:description" content="Estudio especializado en la creación de sistemas web a medida, software de gestión y automatización de operaciones." />
        <meta name="twitter:image" content="/og-image.webp" />
        
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
          <AdSense />
          <AdSlot />
          <Suspense fallback={<div className="h-20" />}>
            <SocialProof />
            <CaseStudies />
            <Products />
            <Features />
            <Process />
          </Suspense>
          <Suspense fallback={
            <div className="py-20 text-center text-primary-secondary">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Cargando demo...
            </div>
          }>
            <DemoZone />
          </Suspense>
          <Suspense fallback={<div className="h-20" />}>
            <TechStack />
            <Pricing />
          </Suspense>
          <Suspense fallback={
            <div className="py-20 text-center text-primary-secondary">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Cargando contacto...
            </div>
          }>
            <ContactSection />
          </Suspense>
          <Suspense fallback={<div className="h-20" />}>
            <FAQ />
          </Suspense>
        </motion.main>
        <Suspense fallback={<div className="h-20" />}>
          {loadHeavyComponents && <Footer />}
        </Suspense>
        <Suspense fallback={null}>
          {loadHeavyComponents && <BotWidget />}
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
