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
const OwnershipVsSubscription = dynamic(
  () => import('@/components/shared/OwnershipVsSubscription'),
  {
    loading: () => <div className="min-h-125 w-full" />,
  }
)

const PortfolioSection = dynamic(() => import('@/components/Portfolio/PortfolioSection'), {
  loading: () => <div className="min-h-125 w-full" />,
})

const ContactSection = dynamic(() => import('@/components/landing/ContactSection'), {
  loading: () => <div className="min-h-125 w-full" />,
})

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-20" />,
})

const AIChatWidget = dynamic(() => import('@/components/chat/AIChatWidget'), {
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
        <main id="inicio">
          <OptimusScaleHero />
          <OwnershipVsSubscription />
          <PortfolioSection featuredOnly />
          <ContactSection />
        </main>
        <Footer />
        <AIChatWidget />
      </div>
    </ErrorBoundary>
  )
}
