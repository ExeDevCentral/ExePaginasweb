'use client'

import { useEffect } from 'react'

/**
 * AnimatedFavicon:
 * Micro-animación de respiración lumínica para el favicon en la pestaña del navegador.
 * Alterna de forma sutil el brillo del haz amarillo de marca cada 2.5 segundos.
 * Se pausa automáticamente cuando la pestaña pasa a segundo plano para consumo cero de batería.
 */
export default function AnimatedFavicon() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let isPulsing = false
    const interval = setInterval(() => {
      if (document.hidden) return

      const svgLink = document.querySelector<HTMLLinkElement>(
        'link[rel*="icon"][type="image/svg+xml"]'
      )
      if (svgLink) {
        isPulsing = !isPulsing
        svgLink.href = isPulsing ? '/favicon.svg?glow=1' : '/favicon.svg'
      }
    }, 2400)

    return () => clearInterval(interval)
  }, [])

  return null
}
