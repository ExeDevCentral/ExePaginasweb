/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SiteHeader from '@/components/layout/SiteHeader'
import BrandIntroSplash from '@/components/layout/BrandIntroSplash'
import MobileLandingView from '@/components/landing/MobileLandingView'
import BackToTopButton from '@/components/layout/BackToTopButton'

const DesktopLandingView = dynamic(() => import('@/components/landing/DesktopLandingView'), {
  ssr: false,
})

const DeferredChatWidget = dynamic(() => import('@/components/chat/DeferredChatWidget'), {
  ssr: false,
})

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <ErrorBoundary>
      <BrandIntroSplash />
      <div className="min-h-screen bg-transparent text-primary-text">
        <SiteHeader />

        {/* Punto de referencia principal accesible (Landmark main) */}
        <main id="inicio">
          {/* ==============================================================
              VERSIÓN MOBILE RESUMIDA (EXACTAMENTE 2 SECCIONES CON EL GLOBO 3D)
             ============================================================== */}
          {!isDesktop && (
            <div className="block md:hidden">
              <MobileLandingView />
            </div>
          )}

          {/* ==============================================================
              VERSIÓN DESKTOP COMPLETA Y PROFUNDA (CARGA DIFERIDA 0 DOM EN MÓVIL)
             ============================================================== */}
          {isDesktop && (
            <div className="hidden md:block">
              <DesktopLandingView />
            </div>
          )}
        </main>

        <BackToTopButton />
        <DeferredChatWidget />
      </div>
    </ErrorBoundary>
  )
}
