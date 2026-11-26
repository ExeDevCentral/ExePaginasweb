/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Face Classic: Wraps the existing HomePage without touching business logic or integrations.
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
import { FaceReturnDock } from '@/shared/FaceReturnDock'

const DeferredChatWidget = dynamic(() => import('@/components/chat/DeferredChatWidget'), {
  ssr: false,
})

type ViewportMode = 'ssr' | 'mobile' | 'desktop'

export default function ClassicFaceView() {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('ssr')

  // guardrail-ok(useEffect): garantiza inicio limpio en el borde superior (y=0) al entrar desde el umbral salvo navegación por ancla
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [])

  // guardrail-ok(useEffect): sincroniza rama móvil vs escritorio mediante matchMedia para montar un único árbol activo
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
      <div data-face="classic" className="min-h-screen bg-transparent text-primary-text">
        <BrandIntroSplash />
        <SiteHeader />

        <main id="inicio">
          {showMobile && (
            <div className="block md:hidden">
              <MobileLandingView />
            </div>
          )}

          {showDesktop && (
            <div className="hidden md:block">
              <DesktopLandingView />
            </div>
          )}
        </main>

        {/* Umbral de versiones: doble hover para volver a elegir Classic o V2 */}
        <FaceReturnDock currentFace="classic" />

        <BackToTopButton />
        <DeferredChatWidget />
      </div>
    </ErrorBoundary>
  )
}
