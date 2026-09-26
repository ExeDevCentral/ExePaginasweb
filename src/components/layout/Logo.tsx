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
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  alt = 'ExePaginasWeb Logo',
  size = 40,
  variant = 'auto',
  showText = false,
  textClassName = 'text-white text-base font-black tracking-widest uppercase font-mono',
  animated = false,
}) => {
  const sizeStyle = { width: `${size}px`, height: `${size}px` }

  const renderLogoImage = () => {
    const isSmall = size <= 64
    const darkSrc = isSmall ? '/logo-dark-sm.webp' : '/logo-dark.webp'
    const lightSrc = isSmall ? '/logo-light-sm.webp' : '/logo-light.webp'

    const commonImgStyle: React.CSSProperties = {
      maxWidth: size ? `${size}px` : '100%',
      maxHeight: size ? `${size}px` : '100%',
      width: size ? `${size}px` : 'auto',
      height: size ? `${size}px` : 'auto',
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
          className="object-contain filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] relative z-10 shrink-0"
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
          className="object-contain filter drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-all duration-300 group-hover:scale-110 relative z-10 shrink-0"
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
          className="object-contain dark:hidden filter drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-all duration-300 group-hover:scale-110 relative z-10 shrink-0"
        />
        <img
          src={darkSrc}
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          style={commonImgStyle}
          className="object-contain hidden dark:block filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] relative z-10 shrink-0"
        />
      </>
    )
  }

  const logoImg = (
    <motion.div
      style={sizeStyle}
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      {...(animated
        ? {
            animate: { y: [0, -3, 0] },
            transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const },
          }
        : {})}
    >
      {animated && (
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
