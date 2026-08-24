'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import Header from '@/components/layout/Header'
import Hero from '@/components/Hero/Hero'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import ScrollProvider from '@/components/shared/ScrollProvider'
import MouseSpotlight from '@/components/shared/MouseSpotlight'

import BrandLoader from '@/components/layout/BrandLoader'

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
    <div className="py-24 text-center flex justify-center items-center">
      <BrandLoader size="sm" text="EXESISTEMASWEB" subtext="Cargando contacto..." />
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
  <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center">
    <BrandLoader size="sm" />
    <div className="w-full max-w-4xl mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-40">
      {[1, 2, 3].map((i) => (
        <SkeletonBlock key={i} className="h-44 rounded-2xl" />
      ))}
    </div>
  </div>
)

const WaveDivider = ({ flip = false }: { flip?: boolean; color?: string }) => (
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
