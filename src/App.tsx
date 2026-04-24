import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import DemoZone from './components/DemoZone/DemoZone'
import BotWidget from './components/Bot/BotWidget'
import ContactSection from './components/ContactSection'

import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Helmet>
        <title>ExepaginasWeb | Diseño Web Premium & AI Automation</title>
        <meta name="description" content="Elevamos tu presencia digital con diseño web de alta gama, automatizaciones con IA y experiencias interactivas que convierten." />
        <meta name="keywords" content="diseño web, inteligencia artificial, automatización, premium landing page, desarrollo web, exepaginasweb" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ExepaginasWeb | Diseño Web Premium" />
        <meta property="og:description" content="Diseño web premium y automatizaciones con IA para potenciar tu negocio." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ExepaginasWeb | Diseño Web Premium" />
        <meta name="twitter:description" content="Diseño web premium y automatizaciones con IA para potenciar tu negocio." />
        <meta name="twitter:image" content="/og-image.png" />
        
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
          <Features />
          <DemoZone />
          <ContactSection />
        </motion.main>
        <BotWidget />
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  )
}

export default App
