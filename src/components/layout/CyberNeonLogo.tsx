'use client'

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * CyberNeonLogo: Animación cinemática nativa en SVG/GPU para el isotipo de marca.
 * - Basado en los vectores matemáticos exactos de public/logo.svg (E, X, E + punto rojo).
 * - Ciclo orgánico de 6 segundos: 4.6s de reposo nítido + 1.4s de ignición por trazo láser y neón.
 * - Cero pérdida de calidad en pantallas Retina y 60 FPS garantizados por CSS GPU.
 */
import React from 'react'

interface CyberNeonLogoProps {
  size?: number
  className?: string
  alt?: string
}

export const CyberNeonLogo: React.FC<CyberNeonLogoProps> = ({
  size = 44,
  className = '',
  alt = 'ExePaginasWeb Cyber Logo',
}) => {
  // Ratio nativo de public/logo.svg: 535 x 200
  const width = size * (535 / 200)
  const height = size

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      role="img"
      aria-label={alt}
    >
      <svg
        viewBox="0 0 535 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transform-gpu"
        style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.35))' }}
      >
        <defs>
          {/* Gradiente electromagnético para el haz del láser */}
          <linearGradient id="cyberLaser" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0.9" />
          </linearGradient>

          {/* Filtro de resplandor de neón */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ==============================================================
            CAPA 1: CUERPO PRINCIPAL DEL LOGO (SÓLIDO, BLANCO Y AMBAR)
           ============================================================== */}
        <g className="transition-opacity duration-300">
          {/* E Izquierda */}
          <path
            d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
            className="fill-slate-900 dark:fill-white"
          />
          {/* X Central */}
          <path
            d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
            className="fill-yellow-500 dark:fill-yellow-400"
          />
          {/* E Derecha (Espejada) */}
          <path
            d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
            className="fill-slate-900 dark:fill-white"
          />
          {/* Cuadrado Rojo de Acento */}
          <rect
            x="493"
            y="165"
            width="35"
            height="35"
            rx="3"
            className="fill-red-500 animate-[cyberRedPulse_6s_ease-in-out_infinite]"
          />
        </g>

        {/* ==============================================================
            CAPA 2: LÁSER DE NEÓN SOBRE EL CONTORNO (SE ACTIVA CADA 6 SEGUNDOS)
           ============================================================== */}
        <g filter="url(#neonGlow)" className="pointer-events-none">
          {/* E Izquierda: Trazo neón */}
          <path
            d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
            stroke="url(#cyberLaser)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-cyan-400 animate-[laserSweep_6s_cubic-bezier(0.16,1,0.3,1)_infinite]"
            style={{ strokeDasharray: '600', strokeDashoffset: '600' }}
          />

          {/* X Central: Trazo neón dorado */}
          <path
            d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
            stroke="#facc15"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[laserSweepX_6s_cubic-bezier(0.16,1,0.3,1)_infinite]"
            style={{ strokeDasharray: '700', strokeDashoffset: '700' }}
          />

          {/* E Derecha: Trazo neón */}
          <path
            d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
            stroke="url(#cyberLaser)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-cyan-400 animate-[laserSweep_6s_cubic-bezier(0.16,1,0.3,1)_infinite]"
            style={{ strokeDasharray: '600', strokeDashoffset: '600' }}
          />
        </g>
      </svg>
    </div>
  )
}

export default CyberNeonLogo
