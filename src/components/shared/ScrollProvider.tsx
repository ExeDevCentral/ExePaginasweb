'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getGlobalLenis, setGlobalLenis } from './scrollUtils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
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

    // Sincronizar ScrollTrigger con Lenis
    lenis.on('scroll', ScrollTrigger.update)

    // Conectar el ticker de GSAP a Lenis para sincronización frame a frame y evitar tirones
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      if (getGlobalLenis() === lenis) {
        setGlobalLenis(null)
      }
    }
  }, [])

  return <>{children}</>
}

export default ScrollProvider
