/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * MagneticCTA: Botón HUD Chaflanado con atracción magnética hacia el cursor.
 */
'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import HudButton from '@/components/HudButton'

export interface MagneticCTAProps {
  label: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  className?: string
}

export default function MagneticCTA({
  label,
  href = '/cotizador',
  onClick,
  className = '',
}: Readonly<MagneticCTAProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = Boolean(useReducedMotion())

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring de retorno elástico suave
  const springConfig = { stiffness: 260, damping: 18, mass: 0.6 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Desplazamiento máximo de 8px hacia el cursor
    const distanceX = (e.clientX - centerX) * 0.28
    const distanceY = (e.clientY - centerY) * 0.28

    const clampedX = Math.max(-8, Math.min(8, distanceX))
    const clampedY = Math.max(-8, Math.min(8, distanceY))

    x.set(clampedX)
    y.set(clampedY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      style={{
        x: reduceMotion ? 0 : springX,
        y: reduceMotion ? 0 : springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex shrink-0 select-none"
    >
      <HudButton
        label={label}
        href={href}
        variant="primary"
        size="sm"
        icon={<span className="text-xs font-semibold">→</span>}
        {...(onClick ? { onClick: (e) => onClick(e as React.MouseEvent<HTMLAnchorElement>) } : {})}
        className={className}
      />
    </motion.div>
  )
}
