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
  className = 'h-10 w-auto',
  alt = 'ExePaginasWeb Logo',
  size = 40,
  variant = 'auto',
  showText = false,
  textClassName = 'text-white text-base font-black tracking-widest uppercase font-mono',
  animated = false,
}) => {
  const isDark = variant === 'dark'
  const isLight = variant === 'light'

  const logoImg = (
    <motion.div
      className={`relative inline-flex items-center justify-center shrink-0 group ${className}`}
      animate={animated ? { y: [0, -3, 0] } : undefined}
      transition={animated ? { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } : undefined}
    >
      {/* Background ambient glowing aura */}
      {animated && (
        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse pointer-events-none" />
      )}

      {isDark ? (
        <img
          src="/logo-dark.webp"
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          className="h-full w-auto object-contain filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] relative z-10"
        />
      ) : isLight ? (
        <img
          src="/logo-light.webp"
          alt={alt}
          loading="eager"
          fetchPriority="high"
          width={size}
          height={size}
          className="h-full w-auto object-contain filter drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-all duration-300 group-hover:scale-110 relative z-10"
        />
      ) : (
        <>
          <img
            src="/logo-light.webp"
            alt={alt}
            loading="eager"
            fetchPriority="high"
            width={size}
            height={size}
            className="h-full w-auto object-contain dark:hidden filter drop-shadow-[0_0_10px_rgba(250,204,21,0.4)] transition-all duration-300 group-hover:scale-110 relative z-10"
          />
          <img
            src="/logo-dark.webp"
            alt={alt}
            loading="eager"
            fetchPriority="high"
            width={size}
            height={size}
            className="h-full w-auto object-contain hidden dark:block filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] relative z-10"
          />
        </>
      )}
    </motion.div>
  )

  if (!showText) return logoImg

  return (
    <div className="inline-flex items-center gap-2.5">
      {logoImg}
      <span className={textClassName}>
        EXE<span className="text-yellow-400 font-light">//</span>PAGINASWEB
        <span className="text-slate-400 font-light text-xs">.COM</span>
      </span>
    </div>
  )
}

export default Logo
