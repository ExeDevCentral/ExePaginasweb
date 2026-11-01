/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import {
  getGlobalLenis,
  resetScrollToTop,
  resolveAnchorElement,
  setGlobalLenis,
} from './scrollUtils'

const NAVBAR_SCROLL_OFFSET = -92

function scrollElementIntoClearView(el: HTMLElement) {
  const lenis = getGlobalLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: NAVBAR_SCROLL_OFFSET, duration: 0.75 })
  } else {
    const top = el.getBoundingClientRect().top + (window.scrollY || 0) + NAVBAR_SCROLL_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
}

function scheduleHashScrollWithRetry(rawHash: string): () => void {
  const cleanId = decodeURIComponent(rawHash.replace(/^#/, '')).trim()
  if (!cleanId || typeof document === 'undefined') return () => {}

  let cancelled = false
  let attempts = 0
  let timerId: ReturnType<typeof setTimeout> | null = null
  let settleTimerId: ReturnType<typeof setTimeout> | null = null
  let rafId: number | null = null

  const tryScroll = () => {
    if (cancelled) return
    const target = resolveAnchorElement(cleanId)
    if (target && target.getBoundingClientRect().height > 0) {
      rafId = requestAnimationFrame(() => {
        if (cancelled) return
        scrollElementIntoClearView(target)
        // Re-estabilización suave si animaciones de entrada o chunks dinámicos desplazan el layout
        settleTimerId = setTimeout(() => {
          if (cancelled) return
          const settled = resolveAnchorElement(cleanId)
          if (settled && settled.getBoundingClientRect().height > 0) {
            const deltaFromDesired = Math.abs(
              settled.getBoundingClientRect().top + NAVBAR_SCROLL_OFFSET
            )
            if (deltaFromDesired > 28) {
              scrollElementIntoClearView(settled)
            }
          }
        }, 380)
      })
      return
    }

    attempts += 1
    if (attempts < 35) {
      timerId = setTimeout(tryScroll, 80)
    }
  }

  // Primer intento tras el pintado inicial de la ruta
  timerId = setTimeout(tryScroll, 30)

  return () => {
    cancelled = true
    if (timerId !== null) clearTimeout(timerId)
    if (settleTimerId !== null) clearTimeout(settleTimerId)
    if (rafId !== null) cancelAnimationFrame(rafId)
  }
}

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const prevPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // Respetar preferencia de accesibilidad para movimiento reducido y evitar secuestro de scroll en pantallas táctiles móviles
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
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

  // Sincronización de scroll al cambiar de ruta o aterrizar con #hash (incluyendo componentes lazy/dynamic)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentHash = window.location.hash
    const prevPath = prevPathnameRef.current
    prevPathnameRef.current = pathname

    if (currentHash && currentHash.length > 1) {
      return scheduleHashScrollWithRetry(currentHash)
    }

    if (prevPath !== null && prevPath !== pathname) {
      resetScrollToTop()
    }
    return undefined
  }, [pathname])

  // Delegación universal para clics en anchors (#id o /ruta#id en la misma ruta) y cambios de historial
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const normalizePath = (p: string) => p.replace(/\/+$/, '') || '/'

    const handleDocumentClick = (e: MouseEvent) => {
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const targetNode = e.target as Element | null
      const anchor = targetNode?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        anchor.dataset.customScroll === 'true'
      ) {
        return
      }

      const rawHref = anchor.getAttribute('href')
      if (
        !rawHref ||
        rawHref === '#' ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        return
      }

      let resolved: URL
      try {
        resolved = new URL(rawHref, window.location.origin)
      } catch {
        return
      }

      if (resolved.origin !== window.location.origin || resolved.hash.length <= 1) {
        return
      }

      if (normalizePath(resolved.pathname) === normalizePath(window.location.pathname)) {
        const cleanId = decodeURIComponent(resolved.hash.slice(1)).trim()
        const targetEl = cleanId ? resolveAnchorElement(cleanId) : null
        if (targetEl) {
          if (!e.defaultPrevented) {
            e.preventDefault()
          }
          const nextUrl = resolved.pathname + resolved.search + resolved.hash
          if (
            window.location.pathname + window.location.search + window.location.hash !==
            nextUrl
          ) {
            window.history.pushState(null, '', nextUrl)
          }
          scheduleHashScrollWithRetry(resolved.hash)
        }
      }
    }

    const handleHashChange = () => {
      if (window.location.hash && window.location.hash.length > 1) {
        scheduleHashScrollWithRetry(window.location.hash)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return <>{children}</>
}

export default ScrollProvider
