'use client'

/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * CyberNeonLogo: Animación cinemática nativa en SVG/GPU para el isotipo de marca.
 * - Basado en los vectores matemáticos exactos de public/logo.svg (E, X, E + punto rojo).
 * - Ciclo orgánico de 6 segundos: 4.6s de reposo nítido + 1.4s de ignición por trazo láser y neón.
 * - Cero pérdida de calidad en pantallas Retina y 60 FPS garantizados por CSS GPU.
 */
import React, { useId } from 'react'

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
  const uid = useId().replace(/:/g, '')
  const laserId = `cyberLaser-${uid}`
  const laserXId = `cyberLaserX-${uid}`
  const glowId = `neonGlow-${uid}`
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
          <linearGradient id={laserId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={laserXId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="55%" stopColor="#facc15" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Filtro de resplandor de neón */}
          <filter id={glowId} x="-25%" y="-35%" width="150%" height="170%">
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
            style={{ transformOrigin: '510.5px 182.5px' }}
            className="fill-red-500 animate-[cyberRedPulse_4.8s_ease-in-out_infinite]"
          />
        </g>

        {/* ==============================================================
            CAPA 2: LÁSER DE NEÓN RECORRIENDO Y SALTANDO E -> X -> E -> .
           ============================================================== */}
        <g filter={`url(#${glowId})`} className="pointer-events-none">
          {/* 1. E Izquierda */}
          <path
            d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
            pathLength={100}
            stroke={`url(#${laserId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[laserHopE1_4.8s_linear_infinite]"
            style={{ strokeDasharray: '26 74', strokeDashoffset: 100 }}
          />

          {/* Salto 1: Arco eléctrico de E -> X */}
          <path
            d="M 148 4 Q 164 -28 178 4"
            pathLength={100}
            stroke="#22d3ee"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-[laserJump1_4.8s_ease-out_infinite]"
            style={{ strokeDasharray: '35 65', strokeDashoffset: 100 }}
          />

          {/* 2. X Central */}
          <path
            d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
            pathLength={100}
            stroke={`url(#${laserXId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[laserHopX_4.8s_linear_infinite]"
            style={{ strokeDasharray: '26 74', strokeDashoffset: 100 }}
          />

          {/* Salto 2: Arco eléctrico de X -> E */}
          <path
            d="M 322 4 Q 338 -28 352 4"
            pathLength={100}
            stroke="#facc15"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-[laserJump2_4.8s_ease-out_infinite]"
            style={{ strokeDasharray: '35 65', strokeDashoffset: 100 }}
          />

          {/* 3. E Derecha */}
          <path
            d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
            pathLength={100}
            stroke={`url(#${laserId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-[laserHopE2_4.8s_linear_infinite]"
            style={{ strokeDasharray: '26 74', strokeDashoffset: 100 }}
          />

          {/* Salto 3: Arco eléctrico de E -> Punto Rojo */}
          <path
            d="M 476 188 Q 492 150 508 170"
            pathLength={100}
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-[laserJump3_4.8s_ease-out_infinite]"
            style={{ strokeDasharray: '35 65', strokeDashoffset: 100 }}
          />
        </g>
      </svg>
    </div>
  )
}

export default CyberNeonLogo
