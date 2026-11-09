/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import SiteHeader from '@/components/layout/SiteHeader'
import BrandIntroSplash from '@/components/layout/BrandIntroSplash'
import MobileLandingView from '@/components/landing/MobileLandingView'
import DesktopLandingView from '@/components/landing/DesktopLandingView'
import BackToTopButton from '@/components/layout/BackToTopButton'

const DeferredChatWidget = dynamic(() => import('@/components/chat/DeferredChatWidget'), {
  ssr: false,
})

type ViewportMode = 'ssr' | 'mobile' | 'desktop'

export default function HomePage() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('ssr')

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mql = window.matchMedia('(min-width: 768px)')
    const syncViewport = (matches: boolean) => {
      setViewportMode(matches ? 'desktop' : 'mobile')
    }

    syncViewport(mql.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewport(event.matches)
    }

    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  const showMobile = viewportMode === 'ssr' || viewportMode === 'mobile'
  const showDesktop = viewportMode === 'ssr' || viewportMode === 'desktop'

  return (
    <ErrorBoundary>
      <BrandIntroSplash />
      <div className="min-h-screen bg-transparent text-primary-text">
        <SiteHeader />

        {/* Punto de referencia principal accesible (Landmark main) */}
        <main id="inicio">
          {/* ==============================================================
              VERSIÓN MOBILE RESUMIDA (DESMONTA DESKTOP EN VIEWPORT MÓVIL)
             ============================================================== */}
          {showMobile && (
            <div className="block md:hidden">
              <MobileLandingView />
            </div>
          )}

          {/* ==============================================================
              VERSIÓN DESKTOP PROFUNDA (DESMONTA MOBILE EN VIEWPORT ESCRITORIO)
             ============================================================== */}
          {showDesktop && (
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
