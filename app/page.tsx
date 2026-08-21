'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import Header from '@/components/layout/Header'
import Hero from '@/components/Hero/Hero'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import ScrollProvider from '@/components/shared/ScrollProvider'
import MouseSpotlight from '@/components/shared/MouseSpotlight'

// Dynamic components for high performance and SSR safety
const SocialProof = dynamic(() => import('@/components/SocialProof/SocialProof'), {
  loading: () => <SectionSkeleton />,
})
const Process = dynamic(() => import('@/components/Process/Process'), {
  loading: () => <SectionSkeleton />,
})
const FaqSection = dynamic(() => import('@/components/FAQ/FAQ'), {
  loading: () => <SectionSkeleton />,
})
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-20" />,
})
const AIChatWidget = dynamic(() => import('@/components/chat/AIChatWidget'), {
  ssr: false,
})
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'), {
  loading: () => (
    <div className="py-20 text-center text-primary-secondary">
      <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      Cargando contacto...
    </div>
  ),
})
const Pricing = dynamic(() => import('@/components/Pricing/Pricing'), {
  loading: () => <SectionSkeleton />,
})
const OwnershipVsSubscription = dynamic(
  () => import('@/components/shared/OwnershipVsSubscription'),
  { loading: () => <SectionSkeleton /> }
)
const PortfolioSection = dynamic(() => import('@/components/Portfolio/PortfolioSection'), {
  loading: () => <SectionSkeleton />,
})
const DemoZone = dynamic(() => import('@/components/DemoZone/DemoZone'), {
  loading: () => <SectionSkeleton />,
})
const Products = dynamic(() => import('@/components/Products/Products'), {
  loading: () => <SectionSkeleton />,
})
const CaseStudies = dynamic(() => import('@/components/CaseStudies/CaseStudies'), {
  loading: () => <SectionSkeleton />,
})

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-muted/60" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
)

const SectionSkeleton = () => (
  <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex flex-col items-center gap-4 mb-16">
      <SkeletonBlock className="h-3 w-32 rounded-full" />
      <SkeletonBlock className="h-10 w-80 rounded-2xl max-w-full" />
      <SkeletonBlock className="h-4 w-64 rounded-lg max-w-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <SkeletonBlock key={i} className="h-56 rounded-2xl" />
      ))}
    </div>
  </div>
)

const WaveDivider = ({
  flip = false,
  color = 'var(--background)',
}: {
  flip?: boolean
  color?: string
}) => (
  <div
    className={`relative w-full h-16 sm:h-24 -my-1 z-10 pointer-events-none ${flip ? 'rotate-180' : ''}`}
  >
    <svg
      viewBox="0 0 1440 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        d="M0 64L48 58.7C96 53.3 192 42.7 288 37.3C384 32 480 32 576 37.3C672 42.7 768 53.3 864 58.7C960 64 1056 64 1152 58.7C1248 53.3 1344 42.7 1392 37.3L1440 32V96H1392C1344 96 1248 96 1152 96C1056 96 960 96 864 96C768 96 672 96 576 96C480 96 384 96 288 96C192 96 96 96 48 96H0V64Z"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 74.7C960 80 1056 80 1152 74.7C1248 69.3 1344 58.7 1392 53.3L1440 48V96H1392C1344 96 1248 96 1152 96C1056 96 960 96 864 96C768 96 672 96 576 96C480 96 384 96 288 96C192 96 96 96 48 96H0V80Z"
        fill={color}
      />
    </svg>
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
