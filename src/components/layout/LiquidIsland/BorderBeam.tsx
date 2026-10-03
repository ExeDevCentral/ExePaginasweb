/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * BorderBeam: Haz de luz perimetral animado con conic-gradient cian -> amarillo.
 */
'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export interface BorderBeamProps {
  duration?: number
  className?: string
}

export default function BorderBeam({ duration = 6, className = '' }: Readonly<BorderBeamProps>) {
  const reduceMotion = Boolean(useReducedMotion())

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-cyan-400/30 dark:border-cyan-400/20"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-px rounded-full overflow-hidden p-px [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-exclude ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'linear',
        }}
        className="absolute inset-[-150%] aspect-square bg-[conic-gradient(from_0deg,transparent_0_310deg,#22d3ee_330deg,#facc15_360deg)] opacity-70"
      />
    </div>
  )
}
