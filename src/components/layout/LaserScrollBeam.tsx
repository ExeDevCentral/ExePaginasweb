/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * LaserScrollBeam: Haz láser de progreso de lectura superior con física spring,
 * gradiente policromático de alta fidelidad y cabeza cometaria con resplandor cuántico.
 */
'use client'

import React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export interface LaserScrollBeamProps {
  className?: string
}

export default function LaserScrollBeam({ className = '' }: Readonly<LaserScrollBeamProps>) {
  const { scrollYProgress, scrollY } = useScroll()

  // Física de resorte cinematográfica ultra-suave
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.0008,
  })

  // Desvanecimiento suave cuando el usuario está exactamente al tope de la página
  const beamOpacity = useTransform(scrollY, [0, 25], [0, 1])

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: beamOpacity }}
      className={`fixed top-0 left-0 right-0 z-100 pointer-events-none select-none h-[2.5px] ${className}`}
    >
      {/* 1. Línea base tenue que marca el carril de lectura */}
      <div className="absolute inset-0 bg-slate-900/10 dark:bg-white/5" />

      {/* 2. Haz láser activo con gradiente de alta definición */}
      <motion.div
        style={{ scaleX }}
        className="relative w-full h-full origin-left bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(6,182,212,0.65)]"
      >
        {/* Halo difuso de dispersión fotónica */}
        <div className="absolute inset-x-0 -bottom-1 h-2 bg-linear-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/40 blur-xs" />

        {/* 3. Cabeza de cometa incandescente en el extremo derecho del progreso */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#38bdf8,0_0_18px_#ec4899] transform translate-x-1" />
      </motion.div>
    </motion.div>
  )
}
