/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * BrandIntroSplash: Pantalla de pre-presentación del logo oficial de la marca.
 * Ejecuta una secuencia de bienvenida cinemática y tranquila, dando tiempo a que el DOM,
 * fuentes, WebGL y Navbar estabilicen sus colores sin saltos ni transiciones sucias.
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLoader from './BrandLoader'

export default function BrandIntroSplash() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return !sessionStorage.getItem('exe_splash_seen')
      } catch {
        return false
      }
    }
    return true
  })

  useEffect(() => {
    if (!showSplash) return
    try {
      sessionStorage.setItem('exe_splash_seen', 'true')
    } catch {
      // Storage might be restricted in private/sandbox mode
    }

    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 450)

    return () => clearTimeout(timer)
  }, [showSplash])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="brand-intro-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            filter: 'blur(8px)',
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-background dark:bg-[#070b16] select-none pointer-events-none transition-colors"
        >
          <BrandLoader size="lg" text="EXEPAGINASWEB" subtext="ARQUITECTURA DE SOFTWARE · 2026" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
