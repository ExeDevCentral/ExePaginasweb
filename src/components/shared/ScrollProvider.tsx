'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

let globalLenis: Lenis | null = null

export function getGlobalLenis() {
  return globalLenis
}

export function resetScrollToTop() {
  window.scrollTo(0, 0)
  if (globalLenis) {
    globalLenis.scrollTo(0, { immediate: true })
  }
}

export function navigateToSection(
  targetId: string,
  options?: {
    offset?: number
  }
) {
  const cleanId = targetId.replace(/^#/, '')
  const el = document.getElementById(cleanId)
  if (!el) {
    if (typeof window !== 'undefined') {
      window.location.href = '/#' + cleanId
    }
    return false
  }

  const offset = options?.offset ?? 72
  const elementPosition = el.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  const performJump = () => {
    if (globalLenis) {
      globalLenis.scrollTo(offsetPosition, { immediate: true })
    } else {
      window.scrollTo({ top: offsetPosition, behavior: 'instant' })
    }
  }

  // Si el navegador soporta View Transitions (Chrome, Edge, Safari 18+), hace un crossfade de seda
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    ;(document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(
      () => {
        performJump()
      }
    )
  } else {
    performJump()
  }

  return true
}

export function scrollToElement(
  target: string | HTMLElement,
  options?: Parameters<Lenis['scrollTo']>[1]
) {
  if (globalLenis) {
    globalLenis.scrollTo(target, { duration: 0.9, ...options })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // No inicializar smooth scroll en dispositivos con preferencia de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
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

    globalLenis = lenis

    // Sincronizar ScrollTrigger con Lenis sin lagSmoothing conflictivo
    lenis.on('scroll', ScrollTrigger.update)

    let rafId: number
    const updateRaf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(updateRaf)
    }
    rafId = requestAnimationFrame(updateRaf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (globalLenis === lenis) {
        globalLenis = null
      }
    }
  }, [])

  return <>{children}</>
}

export default ScrollProvider
