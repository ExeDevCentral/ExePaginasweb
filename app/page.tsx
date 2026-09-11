'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import Header from '@/components/layout/Header'
import Hero from '@/components/Hero/Hero'
import BrandIntroSplash from '@/components/layout/BrandIntroSplash'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import ScrollProvider from '@/components/shared/ScrollProvider'
import MouseSpotlight from '@/components/shared/MouseSpotlight'
import SectionDivider from '@/components/shared/SectionDivider'

import OwnershipVsSubscription from '@/components/shared/OwnershipVsSubscription'
import SocialProof from '@/components/SocialProof/SocialProof'

import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import Process from '@/components/Process/Process'
import Pricing from '@/components/Pricing/Pricing'
import ContactSection from '@/components/landing/ContactSection'
import FaqSection from '@/components/FAQ/FAQ'
import MobileLanding from '@/components/Hero/MobileLanding'

// Componentes secundarios pesados diferidos tras la carga inicial
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-20" />,
})
const AIChatWidget = dynamic(() => import('@/components/chat/AIChatWidget'), {
  ssr: false,
})

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
      <BrandIntroSplash />
      <ScrollProvider>
        <div className="min-h-screen bg-transparent text-primary-text relative">
          <MouseSpotlight />

          {/* Barra de progreso de scroll */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-magenta origin-left z-[100]"
            style={{ scaleX }}
          />

          <Header />

          {/* Versión móvil optimizada (solo celulares) */}
          <main className="md:hidden">
            <MobileLanding />
          </main>

          {/* Sitio completo (solo PC y tablet) */}
          <main className="hidden md:block">
            <Hero />
            <SectionDivider variant="glow" accent="cyan" />
            <OwnershipVsSubscription />
            <SectionDivider variant="minimal" accent="cyan" />
            <SocialProof />
            <SectionDivider variant="cyber" accent="mixed" label="SOLUCIONES" />
            <SectionDivider variant="glow" accent="purple" />
            <PortfolioSection />
            <SectionDivider variant="minimal" accent="cyan" />
            <Process />
            <SectionDivider variant="cyber" accent="mixed" label="PLANES & INVERSIÓN" />
            <Pricing />
            <SectionDivider variant="glow" accent="magenta" />
            <ContactSection />
            <SectionDivider variant="beam" accent="cyan" />
            <FaqSection />
          </main>

          {loadHeavyComponents && (
            <div className="hidden md:block">
              <Footer />
            </div>
          )}
          {loadHeavyComponents && <AIChatWidget />}
        </div>
      </ScrollProvider>
    </ErrorBoundary>
  )
}
