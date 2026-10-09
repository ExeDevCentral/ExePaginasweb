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
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // 1.4 segundos de pre-presentación del logo para carga tranquila y sólida
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="brand-intro-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            filter: 'blur(8px)',
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#060913] backdrop-blur-3xl select-none"
        >
          <BrandLoader size="lg" text="EXEPAGINASWEB" subtext="ARQUITECTURA DE SOFTWARE · 2025" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
