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
    // No inicializar smooth scroll en dispositivos con preferencia de movimiento reducido o táctiles (móvil)
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      infinite: false,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false
        return (
          node.dataset.lenisPrevent !== undefined ||
          node.dataset.lenisPreventWheel !== undefined ||
          node.classList.contains('overflow-y-auto') ||
          node.classList.contains('overflow-auto') ||
          node.classList.contains('overflow-x-auto') ||
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

    // Prevenir el autoscroll brusco del botón central del mouse (ruedita)
    // que satura el compositor y ralentiza las animaciones al combatir con el scroll snap y Lenis,
    // pero manteniendo la apertura de enlaces en una nueva pestaña (a[href]).
    const handleMiddleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        const target = e.target as HTMLElement | null
        const isLink = target?.closest('a[href]') !== null
        if (!isLink) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('mousedown', handleMiddleMouseDown)

    return () => {
      window.removeEventListener('mousedown', handleMiddleMouseDown)
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
