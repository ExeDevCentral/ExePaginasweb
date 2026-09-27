/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * SpotlightBorderCard:
 * 1. Haz de luz cometa ultra-nítido con cabeza blanca láser y cola difusa
 * 2. Rotación permanente fluida y continua con Framer Motion (cero bloqueos por CSS/estado)
 * 3. Doble halo: halo ambiental exterior difuminado (glow) + haz perimetral ultra-nítido
 * 4. Geometría perfectamente centrada que recorre armónicamente los 4 bordes
 * 5. Desfase temporal armónico para que cada tarjeta tenga su propio cuadrante activo
 * 6. Spotlight radial interactivo que sigue las coordenadas exactas del mouse
 */
'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export type SpotlightCardVariant = 'cyan' | 'fuchsia' | 'amber' | 'emerald' | 'blue'

interface SpotlightBorderCardProps {
  children: React.ReactNode
  className?: string
  colorVariant?: SpotlightCardVariant
  customGradient?: string
  spotlightColor?: string
  activeBeam?: boolean
  slowDuration?: string // Por defecto 11s (cadencioso, elegante)
  fastDuration?: string // Por defecto 2.4s (aceleración reactiva)
  animationDelay?: string // Desfase temporal armónico (0s, -2.75s, -5.5s, -8.25s)
}

const COLOR_CONFIGS: Record<
  SpotlightCardVariant,
  {
    gradient: string
    spotlight: string
    innerSpotlight: string
    glowClass: string
    dotColor: string
  }
> = {
  cyan: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 150deg, rgba(6, 182, 212, 0.15) 190deg, rgba(6, 182, 212, 0.75) 280deg, #06b6d4 335deg, #67e8f9 352deg, #ffffff 359deg, transparent 360deg)',
    spotlight: 'rgba(6, 182, 212, 0.45)',
    innerSpotlight: 'rgba(6, 182, 212, 0.1)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(6,182,212,0.32)] hover:shadow-cyan-500/25',
    dotColor: 'bg-cyan-400',
  },
  fuchsia: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 150deg, rgba(217, 70, 239, 0.15) 190deg, rgba(217, 70, 239, 0.75) 280deg, #d946ef 335deg, #f472b6 352deg, #ffffff 359deg, transparent 360deg)',
    spotlight: 'rgba(217, 70, 239, 0.45)',
    innerSpotlight: 'rgba(217, 70, 239, 0.1)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(217,70,239,0.32)] hover:shadow-fuchsia-500/25',
    dotColor: 'bg-fuchsia-400',
  },
  amber: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 150deg, rgba(245, 158, 11, 0.15) 190deg, rgba(245, 158, 11, 0.75) 280deg, #f59e0b 335deg, #fbbf24 352deg, #ffffff 359deg, transparent 360deg)',
    spotlight: 'rgba(245, 158, 11, 0.45)',
    innerSpotlight: 'rgba(245, 158, 11, 0.1)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(245,158,11,0.32)] hover:shadow-amber-500/25',
    dotColor: 'bg-amber-400',
  },
  emerald: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 150deg, rgba(16, 185, 129, 0.15) 190deg, rgba(16, 185, 129, 0.75) 280deg, #10b981 335deg, #34d399 352deg, #ffffff 359deg, transparent 360deg)',
    spotlight: 'rgba(16, 185, 129, 0.45)',
    innerSpotlight: 'rgba(16, 185, 129, 0.1)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(16,185,129,0.32)] hover:shadow-emerald-500/25',
    dotColor: 'bg-emerald-400',
  },
  blue: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 150deg, rgba(59, 130, 246, 0.15) 190deg, rgba(59, 130, 246, 0.75) 280deg, #3b82f6 335deg, #60a5fa 352deg, #ffffff 359deg, transparent 360deg)',
    spotlight: 'rgba(59, 130, 246, 0.45)',
    innerSpotlight: 'rgba(59, 130, 246, 0.1)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(59,130,246,0.32)] hover:shadow-blue-500/25',
    dotColor: 'bg-blue-400',
  },
}

export const SpotlightBorderCard: React.FC<SpotlightBorderCardProps> = ({
  children,
  className = '',
  colorVariant = 'cyan',
  customGradient,
  spotlightColor,
  activeBeam = true,
  slowDuration = '11s',
  fastDuration = '2.4s',
  animationDelay = '0s',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const config = COLOR_CONFIGS[colorVariant] || COLOR_CONFIGS.cyan
  const activeGradient = customGradient || config.gradient
  const activeSpotlight = spotlightColor || config.spotlight

  // Desfase en grados para que cada tarjeta tenga su propio cuadrante activo de forma instantánea
  const parsedDelay = parseFloat(animationDelay.replace('s', '')) || 0
  const startDeg = (parsedDelay / 11) * 360

  // Duración reactiva al posar el cursor
  const duration = isHovered
    ? parseFloat(fastDuration.replace('s', '')) || 2.4
    : parseFloat(slowDuration.replace('s', '')) || 11

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section
      ref={cardRef}
      aria-label="Tarjeta de capacidad"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${config.glowClass} ${className}`}
    >
      {/* 1. HALO AMBIENTAL EXTERIOR (Proyecta aura luminosa difusa detrás de la tarjeta) */}
      {activeBeam && (
        <div className="absolute -inset-1.5 rounded-2xl pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity duration-500 blur-xl overflow-hidden -z-10">
          <motion.div
            animate={{ rotate: [startDeg, startDeg + 360] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] aspect-square pointer-events-none"
            style={{
              background: activeGradient,
            }}
          />
        </div>
      )}

      {/* 2. CONTENEDOR DEL BORDE ULTRA NÍTIDO (Bordes visibles de alto contraste en dark mode) */}
      <div className="relative h-full w-full rounded-2xl p-[2px] overflow-hidden border border-slate-300 dark:border-white/20 bg-slate-200/60 dark:bg-white/10 shadow-lg dark:shadow-2xl">
        {/* HAZ DE LUZ COMETA GIRATORIO NÍTIDO CON MINI DESTELLOS */}
        {activeBeam && (
          <motion.div
            animate={{ rotate: [startDeg, startDeg + 360] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] aspect-square pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
            style={{
              background: activeGradient,
            }}
          />
        )}

        {/* 3. SPOTLIGHT RADIAL DINÁMICO EN EL BORDE (Sigue el cursor) */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isHovered
              ? `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, ${activeSpotlight}, transparent 70%)`
              : undefined,
          }}
        />

        {/* 4. CUERPO INTERIOR DE ALTO CONTRASTE (Nunca se pierde en el fondo) */}
        <div className="relative h-full w-full rounded-[14.5px] bg-[#fcfbf9]/98 dark:bg-[#0c0f1d] border border-transparent dark:border-white/10 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-[#12162a]">
          {/* Spotlight interior suave al posar el mouse */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[14.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: isHovered
                ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${config.innerSpotlight}, transparent 80%)`
                : undefined,
            }}
          />

          {/* Micro-indicador HUD de estado en esquina superior con luz activa */}
          <div className="pointer-events-none absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${config.dotColor} shadow-[0_0_8px_currentColor] animate-pulse`}
            />
          </div>

          {/* Contenido de la tarjeta */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </section>
  )
}

export default SpotlightBorderCard
