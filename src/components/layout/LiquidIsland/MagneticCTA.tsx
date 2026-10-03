/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * MagneticCTA: Botón dominante con atracción magnética hacia el cursor (hasta 8px) y brillo en hover.
 */
'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

export interface MagneticCTAProps {
  label: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  className?: string
}

export default function MagneticCTA({
  label,
  href = '/cotizador',
  onClick,
  className = '',
}: MagneticCTAProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const reduceMotion = Boolean(useReducedMotion())

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring de retorno elástico suave
  const springConfig = { stiffness: 260, damping: 18, mass: 0.6 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
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
      style={{
        x: reduceMotion ? 0 : springX,
        y: reduceMotion ? 0 : springY,
      }}
      className="inline-flex shrink-0 select-none"
    >
      <Link
        ref={buttonRef}
        href={href}
        {...(onClick ? { onClick } : {})}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative inline-flex items-center gap-2 px-4 py-1.5 sm:px-4.5 sm:py-2 rounded-full font-bold text-xs uppercase tracking-wider overflow-hidden transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 shadow-md shadow-cyan-500/20 bg-linear-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 hover:shadow-cyan-400/40 hover:brightness-105 ${className}`}
      >
        {/* Shimmer sweep animado en hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out" />

        {/* Ambient halo glow */}
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-cyan-400/30 blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Sparkles size={13} className="shrink-0 text-slate-950 animate-pulse" />
        <span className="relative z-10 whitespace-nowrap">{label}</span>
        <ArrowRight
          size={13}
          className="relative z-10 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.div>
  )
}
