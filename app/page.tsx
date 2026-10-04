/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import dynamic from 'next/dynamic'
import { motion, useScroll, useSpring } from 'framer-motion'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SiteHeader from '@/components/layout/SiteHeader'
import OptimusScaleHero from '@/components/Hero/OptimusScaleHero'

import HowWeWorkSection from '@/components/landing/HowWeWorkSection'
import OwnershipVsSubscription from '@/components/shared/OwnershipVsSubscription'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import ContactSection from '@/components/landing/ContactSection'
import MobileLandingView from '@/components/landing/MobileLandingView'
import Footer from '@/components/layout/Footer'

const DeferredChatWidget = dynamic(() => import('@/components/chat/DeferredChatWidget'), {
  ssr: false,
})

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent text-primary-text">
        <motion.div
          className="fixed left-0 right-0 top-0 z-100 h-1 origin-left bg-linear-to-r from-accent-cyan to-accent-magenta"
          style={{ scaleX }}
        />
        <SiteHeader />

        {/* ==============================================================
            VERSIÓN MOBILE RESUMIDA (EXACTAMENTE 2 SECCIONES CON EL GLOBO 3D)
           ============================================================== */}
        <div className="block md:hidden">
          <MobileLandingView />
        </div>

        {/* ==============================================================
            VERSIÓN DESKTOP COMPLETA Y PROFUNDA (ARQUITECTURA + COMPARATIVAS)
           ============================================================== */}
        <div className="hidden md:block">
          <main id="inicio">
            <OptimusScaleHero />
            <HowWeWorkSection />
            <OwnershipVsSubscription />
            <PortfolioSection featuredOnly />
            <ContactSection />
          </main>
          <Footer />
        </div>

        <DeferredChatWidget />
      </div>
    </ErrorBoundary>
  )
}
