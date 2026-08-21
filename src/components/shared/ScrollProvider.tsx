'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

export function scrollToElement(
  target: string | HTMLElement,
  options?: Parameters<Lenis['scrollTo']>[1]
) {
  if (globalLenis) {
    globalLenis.scrollTo(target, { duration: 1.0, ...options })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
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

    lenis.on('scroll', ScrollTrigger.update)

    const updateRaf = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateRaf)
    gsap.ticker.lagSmoothing(1000, 16)

    return () => {
      gsap.ticker.remove(updateRaf)
      lenis.destroy()
      if (globalLenis === lenis) {
        globalLenis = null
      }
    }
  }, [])

  return <>{children}</>
}

export default ScrollProvider
