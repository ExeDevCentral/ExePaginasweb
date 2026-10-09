/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * LiveSystemLauncherButton: Botón futurista, minimalista y táctil para lanzar
 * aplicaciones y sistemas reales en producción directamente (sin pasar por el portafolio).
 * Estética: Cyber-HUD de precisión, cápsula de telemetría limpia, micro-diodo láser y feedback háptico.
 */
'use client'

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CyberRocketLaunch } from '@/components/ui/MagnificentIcons'

export interface LiveSystemLauncherButtonProps {
  label: string
  sublabel?: string | undefined
  href: string
  icon?: React.ReactNode | undefined
  color?: ('emerald' | 'cyan' | 'amber' | 'fuchsia') | undefined
  className?: string | undefined
  compact?: boolean | undefined
  variant?: ('tactical' | 'pill' | 'arcade') | undefined
}

const COLOR_STYLES = {
  emerald: {
    border: 'border-emerald-400/40 hover:border-emerald-300',
    bg: 'bg-emerald-950/50 hover:bg-emerald-900/60',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  cyan: {
    border: 'border-cyan-400/40 hover:border-cyan-300',
    bg: 'bg-cyan-950/50 hover:bg-cyan-900/60',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
  },
  amber: {
    border: 'border-amber-400/40 hover:border-amber-300',
    bg: 'bg-amber-950/50 hover:bg-amber-900/60',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  fuchsia: {
    border: 'border-fuchsia-400/40 hover:border-fuchsia-300',
    bg: 'bg-fuchsia-950/50 hover:bg-fuchsia-900/60',
    glow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(217,70,239,0.35)]',
    text: 'text-fuchsia-300',
    dot: 'bg-fuchsia-400',
  },
}

export default function LiveSystemLauncherButton({
  label,
  sublabel,
  href,
  icon,
  color = 'cyan',
  className = '',
  compact = false,
}: Readonly<LiveSystemLauncherButtonProps>) {
  const theme = COLOR_STYLES[color] ?? COLOR_STYLES.cyan

  // Micro-audio sintetizado háptico (cero archivos externos, oscilador Web Audio puro)
  const playTactileBeep = useCallback((freq = 1050) => {
    try {
      if (typeof window === 'undefined') return
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.035)
      gain.gain.setValueAtTime(0.02, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.035)
    } catch {
      // Ignorar si el navegador bloquea audio por falta de interacción
    }
  }, [])

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-live-launcher="true"
      data-target-url={href}
      title={sublabel ?? label}
      onMouseEnter={() => playTactileBeep(1100)}
      onClick={() => playTactileBeep(1350)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center gap-2.5 rounded-lg border ${theme.border} ${theme.bg} ${theme.glow} backdrop-blur-xl transition-all duration-300 cursor-pointer select-none overflow-hidden ${
        compact ? 'px-3 py-1.5' : 'px-4 py-2'
      } ${className}`}
    >
      {/* 1. Micro-haz láser de barrido cinético al hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-linear-to-r from-transparent via-white/15 to-transparent" />

      {/* 2. Micro-diodo de telemetría activa */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.dot}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.dot}`} />
      </span>

      {/* 3. Icono vectorial temático */}
      <span className="flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
        {icon ?? <CyberRocketLaunch size={14} className={theme.text} />}
      </span>

      {/* 4. Etiqueta limpia y técnica en tipografía mono */}
      <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white/95 group-hover:text-white transition-colors truncate">
        {label}
      </span>

      {/* 5. Micro-flecha HUD de acceso exterior */}
      <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
    </motion.a>
  )
}
