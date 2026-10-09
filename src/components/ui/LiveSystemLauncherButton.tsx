/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * LiveSystemLauncherButton: Botón poco convencional, táctil y divertido para lanzar
 * aplicaciones y sistemas reales en producción directamente (sin pasar por el portafolio).
 * Incluye telemetría en vivo, haz de plasma giratorio, diodo orbital y micro-sonido sintetizado Web Audio.
 */
'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Radio, Sparkles } from 'lucide-react'
import { CyberRocketLaunch } from '@/components/ui/MagnificentIcons'

export interface LiveSystemLauncherButtonProps {
  label: string
  sublabel?: string | undefined
  href: string
  icon?: React.ReactNode | undefined
  color?: 'emerald' | 'cyan' | 'amber' | 'fuchsia' | undefined
  className?: string | undefined
  compact?: boolean | undefined
  variant?: ('tactical' | 'pill' | 'arcade') | undefined
}

const COLOR_STYLES = {
  emerald: {
    border: 'border-emerald-400/60 hover:border-emerald-300',
    glow: 'rgba(16, 185, 129, 0.55)',
    bg: 'bg-emerald-950/85 hover:bg-emerald-900/90',
    text: 'text-emerald-300',
    accent: 'bg-emerald-400 text-slate-950',
    radar: 'bg-emerald-400 shadow-[0_0_12px_#34d399]',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  cyan: {
    border: 'border-cyan-400/60 hover:border-cyan-300',
    glow: 'rgba(6, 182, 212, 0.55)',
    bg: 'bg-cyan-950/85 hover:bg-cyan-900/90',
    text: 'text-cyan-300',
    accent: 'bg-cyan-400 text-slate-950',
    radar: 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  amber: {
    border: 'border-amber-400/60 hover:border-amber-300',
    glow: 'rgba(245, 158, 11, 0.55)',
    bg: 'bg-amber-950/85 hover:bg-amber-900/90',
    text: 'text-amber-300',
    accent: 'bg-amber-400 text-slate-950',
    radar: 'bg-amber-400 shadow-[0_0_12px_#fbbf24]',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  fuchsia: {
    border: 'border-fuchsia-400/60 hover:border-fuchsia-300',
    glow: 'rgba(217, 70, 239, 0.55)',
    bg: 'bg-fuchsia-950/85 hover:bg-fuchsia-900/90',
    text: 'text-fuchsia-300',
    accent: 'bg-fuchsia-400 text-slate-950',
    radar: 'bg-fuchsia-400 shadow-[0_0_12px_#e879f9]',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  },
}

export default function LiveSystemLauncherButton({
  label,
  sublabel = 'ABRIR APP EN VIVO // SIN FILTROS',
  href,
  icon,
  color = 'cyan',
  className = '',
  compact = false,
}: Readonly<LiveSystemLauncherButtonProps>) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = COLOR_STYLES[color] ?? COLOR_STYLES.cyan

  // Micro-audio sintetizado háptico (cero archivos externos, oscilador Web Audio puro)
  const playTactileBeep = useCallback((freq = 980) => {
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
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04)
      gain.gain.setValueAtTime(0.025, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // Ignorar si el navegador bloquea audio por falta de foco
    }
  }, [])

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-live-launcher="true"
      data-target-url={href}
      onMouseEnter={() => {
        setIsHovered(true)
        playTactileBeep(1050)
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => playTactileBeep(1400)}
      whileHover={{ scale: 1.035, y: -2 }}
      whileTap={{ scale: 0.96, y: 1 }}
      className={`group relative inline-flex items-center gap-3 rounded-2xl border ${theme.border} ${theme.bg} backdrop-blur-2xl transition-all duration-300 shadow-2xl cursor-pointer select-none overflow-hidden ${
        compact ? 'px-3 py-2 text-xs' : 'px-4 sm:px-5 py-3'
      } ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 0 35px ${theme.glow}, inset 0 0 15px ${theme.glow}`
          : '0 10px 30px rgba(0,0,0,0.6)',
      }}
    >
      {/* 1. Haz de luz líquido que barre el botón al hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(150px circle at 50% 50%, ${theme.glow}, transparent 70%)`,
        }}
      />

      {/* 2. Shimmer sweep continuo */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* 3. Diodo Radar Orbital con pulso de vida táctico */}
      <div className="relative flex items-center justify-center shrink-0">
        <span className="relative flex h-3 w-3">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${theme.radar}`}
          />
          <span className={`relative inline-flex rounded-full h-3 w-3 ${theme.radar}`} />
        </span>
      </div>

      {/* 4. Icono temático de alta ingeniería con micro-rotación dinámica */}
      <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 shrink-0 filter drop-shadow">
        {icon ?? <CyberRocketLaunch size={compact ? 16 : 20} className={theme.text} />}
      </span>

      {/* 5. Textos de lanzamiento poco convencionales */}
      <div className="flex flex-col text-left leading-tight min-w-0">
        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-slate-300 group-hover:text-white transition-colors">
          <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">{sublabel}</span>
        </div>
        <span
          className={`font-sans font-black text-xs sm:text-sm tracking-tight text-white group-hover:text-cyan-100 transition-colors drop-shadow-md truncate`}
        >
          {label}
        </span>
      </div>

      {/* 6. Tag de Live Stream / Producción */}
      <div
        className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-widest ${theme.badgeBg} shrink-0`}
      >
        <Sparkles
          className="w-2.5 h-2.5 text-amber-300 animate-spin"
          style={{ animationDuration: '4s' }}
        />
        <span>PROD</span>
      </div>

      {/* 7. Flecha de propulsión orbital */}
      <div
        className={`ml-auto flex items-center justify-center w-7 h-7 rounded-xl ${theme.accent} transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shadow-lg shrink-0`}
      >
        <ArrowUpRight className="w-4 h-4 stroke-[2.75]" />
      </div>

      {/* Micro-anclajes tácticos de esquina */}
      <div className="pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/50" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/50" />
    </motion.a>
  )
}
