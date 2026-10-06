/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * BackToTopButton: Botón flotante HUD para volver arriba de todo con scroll suave coordinado (Lenis).
 * Especialmente optimizado para modo celular cuando el usuario baja en la página.
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { getGlobalLenis } from '@/components/shared/scrollUtils'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollY > 320)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    const lenis = getGlobalLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.85 })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-40 select-none"
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Volver arriba de todo"
            title="Volver arriba de todo"
            className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0a0f1d]/90 dark:bg-[#070914]/95 text-cyan-400 border border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)] backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-95 touch-manipulation"
          >
            {/* Anillo de resplandor sutil */}
            <span className="absolute -inset-0.5 rounded-full bg-linear-to-r from-cyan-500/30 to-emerald-400/30 opacity-40 group-hover:opacity-100 blur-xs transition-opacity duration-300 pointer-events-none" />

            {/* Ícono de flecha hacia arriba */}
            <ArrowUp
              size={19}
              className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
