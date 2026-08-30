'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import Header from '@/components/layout/Header'
import Hero from '@/components/Hero/Hero'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import ScrollProvider from '@/components/shared/ScrollProvider'
import MouseSpotlight from '@/components/shared/MouseSpotlight'

import OwnershipVsSubscription from '@/components/shared/OwnershipVsSubscription'
import SocialProof from '@/components/SocialProof/SocialProof'
import Products from '@/components/Products/Products'
import CaseStudies from '@/components/CaseStudies/CaseStudies'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import DemoZone from '@/components/DemoZone/DemoZone'
import Process from '@/components/Process/Process'
import Pricing from '@/components/Pricing/Pricing'
import ContactSection from '@/components/landing/ContactSection'
import FaqSection from '@/components/FAQ/FAQ'

// Componentes secundarios pesados diferidos tras la carga inicial
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-20" />,
})
const AIChatWidget = dynamic(() => import('@/components/chat/AIChatWidget'), {
  ssr: false,
})

const WaveDivider = ({ flip = false }: { flip?: boolean }) => (
  <div
    className={`relative w-full h-8 sm:h-12 -my-1 z-10 pointer-events-none flex items-center justify-center overflow-hidden ${flip ? 'rotate-180' : ''}`}
  >
    <div className="w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-accent-cyan/25 to-transparent" />
  </div>
)

export default function HomePage() {
  const [loadHeavyComponents, setLoadHeavyComponents] = useState(false)

  // Diferir la carga de componentes pesados como el Bot que no son críticos para LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadHeavyComponents(true)
    }, 2500)

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

  // Progreso de lectura con interpolación ultra fluida
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <ErrorBoundary>
      <ScrollProvider>
        <div className="min-h-screen bg-transparent text-primary-text relative">
          <MouseSpotlight />

          {/* Barra de progreso de scroll */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-magenta origin-left z-[100]"
            style={{ scaleX }}
          />

          <Header />
          <main>
            <Hero />
            <WaveDivider />
            <OwnershipVsSubscription />
            <SocialProof />
            <Products />
            <CaseStudies />
            <PortfolioSection />
            <DemoZone />
            <Process />
            <WaveDivider flip />
            <Pricing />
            <WaveDivider />
            <ContactSection />
            <FaqSection />
          </main>

          {loadHeavyComponents && <Footer />}
          {loadHeavyComponents && <AIChatWidget />}
        </div>
      </ScrollProvider>
    </ErrorBoundary>
  )
}
