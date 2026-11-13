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
import CyberNeonLogo from '../CyberNeonLogo'

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

  // Mantener escala nítida y visible (1 a 0.94x en scroll profundo)
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.94], { clamp: true })

  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      {/* Contenedor del logo oficial: tamaño aumentado a 42px para máxima presencia y nitidez */}
      <motion.div
        className="relative flex items-center justify-center shrink-0 origin-left"
        style={{
          scale: reduceMotion ? 1 : logoScale,
        }}
        layout="position"
      >
        <CyberNeonLogo size={32} />
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
        <span aria-hidden="true">
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
        </span>
      </motion.div>
    </div>
  )
}
