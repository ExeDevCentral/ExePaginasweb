/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import React from 'react'
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
  const sizeStyle = { width: `${size}px`, height: `${size}px` }

  const renderLogoImage = () => {
    // Usar siempre los assets de alta definición nativos (767x768) con image-rendering de precisión
    // para evitar que se pixel o pierda nitidez en pantallas Retina / móviles de alta densidad
    const darkSrc = '/logo-dark.webp'
    const lightSrc = '/logo-light.webp'

    const commonImgStyle: React.CSSProperties = {
      maxWidth: size ? `${size}px` : '100%',
      maxHeight: size ? `${size}px` : '100%',
      width: size ? `${size}px` : 'auto',
      height: size ? `${size}px` : 'auto',
      imageRendering: 'crisp-edges',
    }

    if (variant === 'dark') {
      return (
        <img
          src={darkSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          style={commonImgStyle}
          className="object-contain filter drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] transition-transform duration-300 group-hover:scale-105 relative z-10 shrink-0 select-none"
        />
      )
    }

    if (variant === 'light') {
      return (
        <img
          src={lightSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          style={commonImgStyle}
          className="object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105 relative z-10 shrink-0 select-none"
        />
      )
    }

    return (
      <>
        <img
          src={lightSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          style={commonImgStyle}
          className="object-contain dark:hidden filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105 relative z-10 shrink-0 select-none"
        />
        <img
          src={darkSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          style={commonImgStyle}
          className="object-contain hidden dark:block filter drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] transition-transform duration-300 group-hover:scale-105 relative z-10 shrink-0 select-none"
        />
      </>
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
