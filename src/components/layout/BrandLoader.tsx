'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Logo from './Logo'

interface BrandLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  text?: string
  subtext?: string
  className?: string
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  size = 'md',
  text,
  subtext,
  className = '',
}) => {
  const isFullscreen = size === 'fullscreen'
  const isLarge = size === 'lg' || isFullscreen
  const isSmall = size === 'sm'

  let logoSize = 48
  let ringOuterClass = 'w-20 h-20'
  let ringInnerClass = 'w-16 h-16'

  if (isSmall) {
    logoSize = 36
    ringOuterClass = 'w-14 h-14'
    ringInnerClass = 'w-12 h-12'
  } else if (isLarge) {
    logoSize = 64
    ringOuterClass = 'w-28 h-28 border-accent-cyan/50'
    ringInnerClass = 'w-24 h-24'
  }

  const content = (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer ambient glow */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing neon radial aura */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/40 via-yellow-400/30 to-accent-magenta/30 blur-2xl rounded-full pointer-events-none"
        />

        {/* Orbiting cyber ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className={`absolute rounded-full border border-dashed border-accent-cyan/40 pointer-events-none ${ringOuterClass}`}
        />

        {/* Inner reverse spin ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className={`absolute rounded-full border border-t-accent-cyan border-r-transparent border-b-accent-magenta border-l-transparent pointer-events-none opacity-60 ${ringInnerClass}`}
        />

        {/* Center Logo Box */}
        <motion.div
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: 'easeInOut',
          }}
          className="relative z-10 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/15 shadow-xl shadow-accent-cyan/10"
        >
          <Logo size={logoSize} animated={false} />
        </motion.div>
      </div>

      {/* Brand Text / Subtext */}
      <div className="mt-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-1.5 font-mono text-xs md:text-sm font-black tracking-widest uppercase text-foreground"
        >
          <span className="bg-gradient-to-r from-accent-cyan via-amber-300 to-accent-magenta bg-clip-text text-transparent">
            {text || 'EXESISTEMASWEB'}
          </span>
        </motion.div>

        {subtext !== undefined ? (
          <p className="text-[11px] font-mono text-muted-foreground mt-1 tracking-wider uppercase animate-pulse">
            {subtext}
          </p>
        ) : (
          <div className="flex items-center justify-center gap-1 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Cargando experiencia...
            </p>
          </div>
        )}
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl">
        {content}
      </div>
    )
  }

  return content
}

export default BrandLoader
