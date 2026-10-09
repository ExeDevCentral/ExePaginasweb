/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * NavLogo: Logo oficial nítido y adaptable (auto light/dark) con Phosphor Decay y micro-flicker de neón.
 */
'use client'

import React from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useTheme } from '@/core/theme/ThemeContext'
import { MatrixWordmark } from '@/components/Effects/MatrixText'
import Logo from '../Logo'

export interface NavLogoProps {
  scrollY: MotionValue<number>
  isCompact: boolean
  reduceMotion?: boolean
}

export default function NavLogo({
  scrollY,
  isCompact,
  reduceMotion = false,
}: Readonly<NavLogoProps>) {
  const { theme } = useTheme()
  const light = theme === 'light'

  // 1. Dolly-Out Phosphor Decay continuo de 0 a 300px
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.88], { clamp: true })

  return (
    <div className="flex items-center gap-2 shrink-0 select-none">
      {/* Contenedor del logo oficial de la marca: nítido tanto en light como en dark */}
      <motion.div
        className="relative flex items-center justify-center shrink-0 origin-left"
        style={{
          scale: reduceMotion ? 0.9 : logoScale,
        }}
        layout="position"
      >
        <Logo size={34} variant="auto" />
      </motion.div>

      {/* Wordmark: colapsa suavemente con layout="position" en modo compact */}
      <motion.div
        layout="position"
        animate={{
          opacity: isCompact ? 0 : 1,
          width: isCompact ? 0 : 'auto',
          marginLeft: isCompact ? -8 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 26,
          mass: 0.9,
        }}
        className="overflow-hidden whitespace-nowrap hidden sm:flex items-center"
      >
        <MatrixWordmark
          parts={[
            { text: 'EXE', color: light ? '#0f172a' : '#ffffff' },
            { text: '//', color: light ? '#b45309' : '#facc15' },
            { text: 'PAGINASWEB', color: light ? '#0f172a' : '#ffffff' },
            { text: '.', color: light ? '#0e7490' : '#22d3ee' },
            { text: 'COM', color: light ? '#0e7490' : '#22d3ee' },
          ]}
          className="text-xs font-black tracking-tight"
        />
      </motion.div>
    </div>
  )
}
