/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * BrandLoader: Loader de marca y pre-presentación con aceleración por hardware en GPU pura.
 * Elimina cualquier entrecortado o salto de frames durante la hidratación de React.
 */
'use client'

import React from 'react'
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
  let ringOuterClass = 'w-24 h-24'
  let ringInnerClass = 'w-20 h-20'

  if (isSmall) {
    logoSize = 36
    ringOuterClass = 'w-16 h-16'
    ringInnerClass = 'w-12 h-12'
  } else if (isLarge) {
    logoSize = 64
    ringOuterClass = 'w-32 h-32'
    ringInnerClass = 'w-28 h-28'
  }

  const content = (
    <div
      className={`relative flex flex-col items-center justify-center select-none transform-gpu ${className}`}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Contenedor concéntrico central con aceleración de GPU pura (60-120 FPS sin caídas) */}
      <div className="relative flex items-center justify-center">
        {/* 1. Aura radial holográfica con respiración fluida por CSS */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-radial from-emerald-500/20 via-teal-500/10 to-transparent dark:from-cyan-400/35 dark:via-indigo-500/20 blur-2xl rounded-full pointer-events-none animate-pulse transform-gpu"
          style={{
            width: isLarge ? 220 : 160,
            height: isLarge ? 220 : 160,
            transform: 'translate(-50%, -50%) translateZ(0)',
            top: '50%',
            left: '50%',
          }}
        />

        {/* 2. Anillo orbital exterior — Rotación fluida en hilo de GPU independiente */}
        <div
          aria-hidden="true"
          className={`absolute rounded-full border border-dashed border-emerald-600/30 dark:border-cyan-400/40 pointer-events-none transform-gpu animate-[spin_8s_linear_infinite] ${ringOuterClass}`}
          style={{ willChange: 'transform' }}
        />

        {/* 3. Anillo orbital interior — Rotación inversa en contrasentido */}
        <div
          aria-hidden="true"
          className={`absolute rounded-full border border-t-emerald-600 dark:border-t-cyan-400/80 border-r-transparent border-b-teal-500/50 dark:border-b-indigo-400/70 border-l-transparent pointer-events-none opacity-70 transform-gpu animate-[spin_5s_linear_infinite_reverse] ${ringInnerClass}`}
          style={{ willChange: 'transform' }}
        />

        {/* 4. Caja del Logo Oficial — Adaptativa en Light y Dark */}
        <div
          className="relative z-10 p-3 rounded-2xl bg-card/95 dark:bg-[#090e1a]/90 backdrop-blur-2xl border border-border dark:border-cyan-400/30 shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.2)] transform-gpu transition-all duration-300"
          style={{ transform: 'translateZ(0)' }}
        >
          <Logo size={logoSize} animated={false} />
        </div>
      </div>

      {/* Identidad y tipografía técnica */}
      <div className="mt-6 text-center transform-gpu">
        <div className="flex items-center justify-center gap-1.5 font-mono text-xs md:text-sm font-black tracking-widest uppercase text-foreground">
          <span className="bg-linear-to-r from-emerald-700 via-teal-800 to-slate-900 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-xs font-black">
            {text || 'EXEPAGINASWEB'}
          </span>
        </div>

        {subtext !== undefined ? (
          <p className="text-[11px] font-mono text-muted-foreground dark:text-slate-400 mt-1.5 tracking-wider uppercase">
            {subtext}
          </p>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-cyan-400" />
            </span>
            <p className="text-[10px] font-mono text-emerald-800 dark:text-cyan-300/85 tracking-widest uppercase font-semibold">
              ARQUITECTURA DE SOFTWARE · 2026
            </p>
          </div>
        )}
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/95 dark:bg-[#070b16]/95 backdrop-blur-3xl">
        {content}
      </div>
    )
  }

  return content
}

export default BrandLoader
