import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Products from './components/Products/Products'
import Features from './components/Features/Features'
import ErrorBoundary from './components/ErrorBoundary'

const BotWidget = lazy(() => import('./components/Bot/BotWidget'))
const DemoZone = lazy(() => import('./components/DemoZone/DemoZone'))
const ContactSection = lazy(() => import('./components/ContactSection'))

function App() {
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
      <div className="min-h-screen bg-primary-bg text-primary-text">

        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <Products />
          <Features />
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
        </motion.main>
        <Suspense fallback={null}>
          <BotWidget />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
