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
    // 1.8s de pre-presentación continua y fluida para estabilizar todo el árbol de componentes
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1800)

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
            scale: 1.015,
            filter: 'blur(12px)',
          }}
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-[#070b16] select-none pointer-events-auto"
        >
          <BrandLoader size="lg" text="EXEPAGINASWEB" subtext="ARQUITECTURA DE SOFTWARE · 2025" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
