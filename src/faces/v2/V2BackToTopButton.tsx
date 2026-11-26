/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Botón de retorno superior para V2: discreto, claro, visible en mobile/desktop.
 */
'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getGlobalLenis } from '@/components/shared/scrollUtils'

export function V2BackToTopButton() {
  const [visible, setVisible] = useState(false)

  // guardrail-ok(useEffect): suscripción a scroll para mostrar el botón tras bajar 320px
  useEffect(() => {
    let prev = false
    const onScroll = () => {
      const next = (window.scrollY || document.documentElement.scrollTop) > 320
      if (next !== prev) {
        prev = next
        setVisible(next)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = getGlobalLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: prefersReduced ? 0 : 0.85 })
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="fixed end-4 z-[44] inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white/95 text-[#334155] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur-md transition-[transform,border-color,color,background-color] duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:text-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] active:translate-y-0 print:hidden [bottom:calc(52px+1rem)] sm:[bottom:calc(52px+1rem)]"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}

export default V2BackToTopButton
