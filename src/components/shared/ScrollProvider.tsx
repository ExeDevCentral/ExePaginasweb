/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { getGlobalLenis, setGlobalLenis } from './scrollUtils'

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Respetar preferencia de accesibilidad para movimiento reducido
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false
        return (
          node.dataset.lenisPrevent !== undefined ||
          node.dataset.lenisPreventWheel !== undefined ||
          node.closest('[data-lenis-prevent]') !== null ||
          node.closest('[role="dialog"]') !== null
        )
      },
    })

    setGlobalLenis(lenis)

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (getGlobalLenis() === lenis) {
        setGlobalLenis(null)
      }
    }
  }, [])

  return <>{children}</>
}

export default ScrollProvider
