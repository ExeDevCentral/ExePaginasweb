import { motion } from 'framer-motion'
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
      </div>
    </ErrorBoundary>
  )
}

export default App
