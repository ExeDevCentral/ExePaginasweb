/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * SpotlightGlass: Gradiente radial que sigue al cursor con useMotionValue y useMotionTemplate (0 re-renders).
 */
'use client'

import React from 'react'
import { motion, useMotionTemplate, type MotionValue } from 'framer-motion'

export interface SpotlightGlassProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  radius?: number
  opacity?: number
}

export default function SpotlightGlass({
  mouseX,
  mouseY,
  radius = 160,
  opacity = 0.22,
}: SpotlightGlassProps) {
  // Interpolación CSS pura sin disparar ciclo de render en React
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, ${opacity}), rgba(250, 204, 21, 0.08) 45%, transparent 80%)`

  return (
    <motion.div
      aria-hidden="true"
      style={{ background }}
      className="pointer-events-none absolute inset-0 rounded-full z-0 transition-opacity duration-300"
    />
  )
}
