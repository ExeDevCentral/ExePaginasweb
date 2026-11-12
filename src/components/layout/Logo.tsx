/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import React, { useId } from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  alt?: string
  size?: number
  variant?: 'auto' | 'light' | 'dark'
  showText?: boolean
  textClassName?: string
  animated?: boolean
  /** Ciclo cinemático suave de 6s con destello holográfico y respiración de micro-escala */
  pulseCycle?: boolean
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  alt = 'ExePaginasWeb Logo',
  size = 40,
  variant = 'auto',
  showText = false,
  textClassName = 'text-white text-base font-black tracking-widest uppercase font-mono',
  animated = false,
  pulseCycle = false,
}) => {
  const uid = useId().replace(/:/g, '')
  const laserId = `logoLaser-${uid}`
  const laserXId = `logoLaserX-${uid}`
  const showLaser = size >= 40
  const logoWidth = size
  const logoHeight = Math.max(10, Math.round(size * (200 / 535)))
  const sizeStyle = { width: `${logoWidth}px`, height: `${logoHeight}px` }

  const renderLogoImage = () => {
    // Isotipo vectorial unificado (mismos trazos exactos de public/logo.svg y CyberNeonLogo)
    const colorClass =
      variant === 'dark'
        ? 'text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]'
        : variant === 'light'
          ? 'text-slate-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
          : 'text-slate-900 dark:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]'

    return (
      <svg
        viewBox="0 0 535 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
        width={logoWidth}
        height={logoHeight}
        className={`w-full h-full overflow-visible transition-transform duration-300 group-hover:scale-105 relative z-10 shrink-0 select-none ${colorClass}`}
      >
        {showLaser && (
          <defs>
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
          </defs>
        )}
        {/* Left E */}
        <path
          d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
          fill="currentColor"
        />
        {/* Middle X */}
        <path
          d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
          fill="currentColor"
        />
        {/* Right E (Mirrored) */}
        <path
          d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
          fill="currentColor"
        />
        {/* Red Square Dot */}
        <rect
          x="493"
          y="165"
          width="35"
          height="35"
          fill="#EF4444"
          rx="4"
          style={showLaser ? { transformOrigin: '510.5px 182.5px' } : undefined}
          className={showLaser ? 'animate-[cyberRedPulse_4.8s_ease-in-out_infinite]' : undefined}
        />
        {showLaser && (
          <g className="pointer-events-none">
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
            <path
              d="M 148 4 Q 164 -28 178 4"
              pathLength={100}
              stroke="#22d3ee"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-[laserJump1_4.8s_ease-out_infinite]"
              style={{ strokeDasharray: '35 65', strokeDashoffset: 100 }}
            />
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
            <path
              d="M 322 4 Q 338 -28 352 4"
              pathLength={100}
              stroke="#facc15"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-[laserJump2_4.8s_ease-out_infinite]"
              style={{ strokeDasharray: '35 65', strokeDashoffset: 100 }}
            />
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
        )}
      </svg>
    )
  }

  const logoImg = (
    <motion.div
      style={sizeStyle}
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      {...(pulseCycle
        ? {
            animate: {
              scale: [1, 1, 1.08, 1.02, 1, 1],
              filter: [
                'drop-shadow(0 0 0px rgba(6,182,212,0))',
                'drop-shadow(0 0 0px rgba(6,182,212,0))',
                'drop-shadow(0 0 16px rgba(6,182,212,0.75))',
                'drop-shadow(0 0 8px rgba(250,204,21,0.5))',
                'drop-shadow(0 0 0px rgba(6,182,212,0))',
                'drop-shadow(0 0 0px rgba(6,182,212,0))',
              ],
            },
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.3, 0.45, 0.58, 0.72, 1],
            },
          }
        : animated
          ? {
              animate: { y: [0, -3, 0] },
              transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const },
            }
          : {})}
    >
      {pulseCycle && (
        <motion.div
          animate={{
            opacity: [0, 0, 0.8, 0.3, 0, 0],
            scale: [0.8, 0.8, 1.35, 1.15, 0.9, 0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.3, 0.45, 0.58, 0.72, 1],
          }}
          className="absolute inset-0 bg-radial from-cyan-400/40 via-amber-400/25 to-transparent blur-lg rounded-full pointer-events-none"
        />
      )}
      {animated && !pulseCycle && (
        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse pointer-events-none" />
      )}
      {renderLogoImage()}
    </motion.div>
  )

  if (!showText) return logoImg

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {logoImg}
      <span
        className={
          textClassName ||
          'text-slate-900 dark:text-white text-base font-black tracking-widest uppercase font-mono'
        }
      >
        EXE<span className="text-yellow-500 dark:text-yellow-400 font-light">{'//'}</span>PAGINASWEB
        <span className="text-slate-600 dark:text-slate-400 font-light text-xs">.COM</span>
      </span>
    </div>
  )
}

export default Logo
