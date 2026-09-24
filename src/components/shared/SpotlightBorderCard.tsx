/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * SpotlightBorderCard:
 * 1. Haz de luz cometa nítido de 50° con núcleo blanco láser intenso
 * 2. Órbita cadenciosa en reposo (4.8s) y aceleración fluida en hover (1.8s) sin saltos de fase
 * 3. Variantes cromáticas distintivas: Cian, Fucsia, Ámbar, Esmeralda y Azul
 * 4. Desfase temporal armónico para que cada tarjeta tenga su propio cuadrante
 * 5. Trazo perimetral ultra nítido (p-[1.5px] con clip estricto) sin manchas borrosas
 * 6. Spotlight radial interactivo que sigue las coordenadas exactas del cursor
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
  slowDuration?: string // Por defecto 4.8s (cadencioso, elegante, claramente visible)
  fastDuration?: string // Por defecto 1.8s (aceleración reactiva al posar el mouse)
  animationDelay?: string // Desfase temporal armónico (0s, -1.2s, -2.4s, -3.6s)
}

const COLOR_CONFIGS: Record<
  SpotlightCardVariant,
  {
    gradient: string
    hoverGradient: string
    spotlight: string
    innerSpotlight: string
    glowClass: string
    dotColor: string
  }
> = {
  cyan: {
    // Haz concentrado de 50° (de 310° a 360°) con cola cian y núcleo blanco brillante
    gradient:
      'conic-gradient(from 0deg, transparent 0 310deg, rgba(6, 182, 212, 0.12) 322deg, rgba(6, 182, 212, 0.6) 342deg, #06b6d4 352deg, #67e8f9 357deg, #ffffff 360deg)',
    hoverGradient:
      'conic-gradient(from 0deg, transparent 0 300deg, rgba(6, 182, 212, 0.2) 315deg, rgba(6, 182, 212, 0.8) 340deg, #38bdf8 352deg, #ffffff 360deg)',
    spotlight: 'rgba(6, 182, 212, 0.45)',
    innerSpotlight: 'rgba(6, 182, 212, 0.08)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(6,182,212,0.25)] hover:shadow-cyan-500/15',
    dotColor: 'bg-cyan-500',
  },
  fuchsia: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 310deg, rgba(217, 70, 239, 0.12) 322deg, rgba(217, 70, 239, 0.6) 342deg, #d946ef 352deg, #f472b6 357deg, #ffffff 360deg)',
    hoverGradient:
      'conic-gradient(from 0deg, transparent 0 300deg, rgba(217, 70, 239, 0.2) 315deg, rgba(217, 70, 239, 0.8) 340deg, #f472b6 352deg, #ffffff 360deg)',
    spotlight: 'rgba(217, 70, 239, 0.45)',
    innerSpotlight: 'rgba(217, 70, 239, 0.08)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(217,70,239,0.25)] hover:shadow-fuchsia-500/15',
    dotColor: 'bg-fuchsia-500',
  },
  amber: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 310deg, rgba(245, 158, 11, 0.12) 322deg, rgba(245, 158, 11, 0.6) 342deg, #f59e0b 352deg, #fbbf24 357deg, #ffffff 360deg)',
    hoverGradient:
      'conic-gradient(from 0deg, transparent 0 300deg, rgba(245, 158, 11, 0.2) 315deg, rgba(245, 158, 11, 0.8) 340deg, #fbbf24 352deg, #ffffff 360deg)',
    spotlight: 'rgba(245, 158, 11, 0.45)',
    innerSpotlight: 'rgba(245, 158, 11, 0.08)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(245,158,11,0.25)] hover:shadow-amber-500/15',
    dotColor: 'bg-amber-500',
  },
  emerald: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 310deg, rgba(16, 185, 129, 0.12) 322deg, rgba(16, 185, 129, 0.6) 342deg, #10b981 352deg, #34d399 357deg, #ffffff 360deg)',
    hoverGradient:
      'conic-gradient(from 0deg, transparent 0 300deg, rgba(16, 185, 129, 0.2) 315deg, rgba(16, 185, 129, 0.8) 340deg, #34d399 352deg, #ffffff 360deg)',
    spotlight: 'rgba(16, 185, 129, 0.45)',
    innerSpotlight: 'rgba(16, 185, 129, 0.08)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(16,185,129,0.25)] hover:shadow-emerald-500/15',
    dotColor: 'bg-emerald-500',
  },
  blue: {
    gradient:
      'conic-gradient(from 0deg, transparent 0 310deg, rgba(59, 130, 246, 0.12) 322deg, rgba(59, 130, 246, 0.6) 342deg, #3b82f6 352deg, #60a5fa 357deg, #ffffff 360deg)',
    hoverGradient:
      'conic-gradient(from 0deg, transparent 0 300deg, rgba(59, 130, 246, 0.2) 315deg, rgba(59, 130, 246, 0.8) 340deg, #60a5fa 352deg, #ffffff 360deg)',
    spotlight: 'rgba(59, 130, 246, 0.45)',
    innerSpotlight: 'rgba(59, 130, 246, 0.08)',
    glowClass: 'dark:hover:shadow-[0_14px_44px_rgba(59,130,246,0.25)] hover:shadow-blue-500/15',
    dotColor: 'bg-blue-500',
  },
}

export const SpotlightBorderCard: React.FC<SpotlightBorderCardProps> = ({
  children,
  className = '',
  colorVariant = 'cyan',
  customGradient,
  spotlightColor,
  activeBeam = true,
  slowDuration = '4.8s',
  fastDuration = '1.8s',
  animationDelay = '0s',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const config = COLOR_CONFIGS[colorVariant] || COLOR_CONFIGS.cyan
  const activeGradient = customGradient || config.gradient
  const activeHoverGradient = customGradient || config.hoverGradient
  const activeSpotlight = spotlightColor || config.spotlight

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
      className={`group relative rounded-2xl p-[1.5px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${config.glowClass} ${className}`}
    >
      {/* 1. HAZ DE LUZ COMETA GIRATORIO QUE RECORRE EL BORDE (BORDER BEAM) */}
      {activeBeam && (
        <>
          {/* Capa 1: Órbita cadenciosa en reposo (4.8s) */}
          <div
            className="absolute -inset-[150%] pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
            style={{
              background: activeGradient,
              animation: `borderSpin ${slowDuration} linear infinite`,
              animationDelay,
            }}
          />
          {/* Capa 2: Órbita reactiva de alta velocidad (1.8s) que se funde en hover sin saltos de fase */}
          <div
            className="absolute -inset-[150%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: activeHoverGradient,
              animation: `borderSpin ${fastDuration} linear infinite`,
              animationDelay,
            }}
          />
        </>
      )}

      {/* 2. SPOTLIGHT RADIAL DINÁMICO EN EL BORDE (Sigue exactamente el cursor) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, ${activeSpotlight}, transparent 70%)`
            : undefined,
        }}
      />

      {/* 3. CUERPO DE CRISTAL / FONDO INTERIOR */}
      <div className="relative h-full w-full rounded-[14.5px] bg-white/95 dark:bg-[#070914]/96 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-[#0b0e20]">
        {/* Spotlight interior suave al posar el mouse */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[14.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isHovered
              ? `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, ${config.innerSpotlight}, transparent 80%)`
              : undefined,
          }}
        />

        {/* Micro-indicador HUD de estado en esquina superior */}
        <div className="pointer-events-none absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
        </div>

        {/* Contenido de la tarjeta */}
        <div className="relative z-10">{children}</div>
      </div>
    </section>
  )
}

export default SpotlightBorderCard
