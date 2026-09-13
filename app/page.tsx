'use client'

import dynamic from 'next/dynamic'
import { motion, useScroll, useSpring } from 'framer-motion'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SiteHeader from '@/components/layout/SiteHeader'
import Hero from '@/components/Hero/Hero'
import OwnershipVsSubscription from '@/components/shared/OwnershipVsSubscription'
import PortfolioSection from '@/components/Portfolio/PortfolioSection'
import ContactSection from '@/components/landing/ContactSection'

const Footer = dynamic(() => import('@/components/layout/Footer'), { loading: () => <div className="h-20" /> })

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent text-primary-text">
        <motion.div
          className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-accent-cyan to-accent-magenta"
          style={{ scaleX }}
        />
        <SiteHeader />
        <main>
          <Hero />
          <OwnershipVsSubscription />
          <PortfolioSection featuredOnly />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
