/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * SpotlightBorderCard — Optimizado para GPU y Cero Layout Thrashing
 * 1. Haz de luz cometa ultra-nítido con cabeza blanca láser y cola difusa
 * 2. Rotación permanente fluida y continua acelerada 100% por CSS/GPU (cero bucles JS)
 * 3. Doble halo: halo ambiental exterior difuminado (glow) + haz perimetral ultra-nítido
 * 4. Cacheo de bounding rect en mouseenter: CERO forced reflow / layout thrashing
 * 5. Spotlight radial interactivo con aceleración por hardware
 */
'use client'

import React, { useRef, useState } from 'react'

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
  const rectRef = useRef<{ left: number; top: number } | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const config = COLOR_CONFIGS[colorVariant] || COLOR_CONFIGS.cyan
  const activeGradient = customGradient || config.gradient
  const activeSpotlight = spotlightColor || config.spotlight

  const currentDuration = isHovered ? fastDuration : slowDuration

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      rectRef.current = { left: rect.left, top: rect.top }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      rectRef.current = { left: rect.left, top: rect.top }
    }
    if (rectRef.current) {
      setMousePos({
        x: e.clientX - rectRef.current.left,
        y: e.clientY - rectRef.current.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rectRef.current = null
  }

  return (
    <section
      ref={cardRef}
      aria-label="Tarjeta de capacidad"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${config.glowClass} ${className}`}
    >
      {/* 1. HALO AMBIENTAL EXTERIOR (Proyecta aura luminosa difusa detrás de la tarjeta) */}
      {activeBeam && (
        <div className="absolute -inset-1.5 rounded-2xl pointer-events-none opacity-40 group-hover:opacity-90 transition-opacity duration-500 blur-xl overflow-hidden -z-10">
          <div
            className="card-beam-spinner absolute top-1/2 left-1/2 w-[350%] aspect-square pointer-events-none"
            style={{
              background: activeGradient,
              animationDuration: currentDuration,
              animationDelay,
            }}
          />
        </div>
      )}

      {/* 2. CONTENEDOR DEL BORDE ULTRA NÍTIDO (Bordes visibles de alto contraste en dark mode) */}
      <div className="relative h-full w-full rounded-2xl p-[2px] overflow-hidden border border-slate-300 dark:border-white/20 bg-slate-200/60 dark:bg-white/10 shadow-lg dark:shadow-2xl">
        {/* HAZ DE LUZ COMETA GIRATORIO NÍTIDO CON MINI DESTELLOS */}
        {activeBeam && (
          <div
            className="card-beam-spinner absolute top-1/2 left-1/2 w-[350%] aspect-square pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]"
            style={{
              background: activeGradient,
              animationDuration: currentDuration,
              animationDelay,
            }}
          />
        )}

        {/* 3. SPOTLIGHT RADIAL DINÁMICO EN EL BORDE (Sigue el cursor sin layout thrashing) */}
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

      <style jsx>{`
        .card-beam-spinner {
          transform: translate(-50%, -50%);
          animation-name: cardBorderSpin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @keyframes cardBorderSpin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .card-beam-spinner {
            animation: none;
            transform: translate(-50%, -50%) rotate(45deg);
          }
        }
      `}</style>
    </section>
  )
}

export default SpotlightBorderCard
