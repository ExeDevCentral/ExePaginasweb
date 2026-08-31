'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export interface SectionDividerProps {
  /** Variant style of the divider */
  variant?: 'glow' | 'cyber' | 'minimal' | 'wave' | 'beam' | 'dots'
  /** Color accent theme */
  accent?: 'cyan' | 'magenta' | 'purple' | 'amber' | 'mixed'
  /** Invert or flip orientation */
  flip?: boolean
  /** Whether to render the central node */
  withNode?: boolean
  /** Optional micro-badge text in the center */
  label?: string
  /** Optional icon in the center */
  icon?: React.ReactNode
  /** Additional custom classNames */
  className?: string
  /** Animated travelling spark */
  animated?: boolean
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'glow',
  accent = 'cyan',
  flip = false,
  withNode = true,
  label,
  icon,
  className = '',
  animated = true,
}) => {
  // Theme color mappings
  const accentGradients = {
    cyan: {
      line: 'from-transparent via-cyan-400/60 dark:via-cyan-400/70 to-transparent',
      glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      core: 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]',
      border: 'border-cyan-400/40 dark:border-cyan-400/50',
      badgeText: 'text-cyan-400 dark:text-cyan-300',
      badgeBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300',
      spark: 'from-transparent via-cyan-300 to-transparent',
    },
    magenta: {
      line: 'from-transparent via-fuchsia-500/60 dark:via-fuchsia-400/70 to-transparent',
      glow: 'from-fuchsia-500/20 via-pink-500/10 to-transparent',
      core: 'bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.8)]',
      border: 'border-fuchsia-400/40 dark:border-fuchsia-400/50',
      badgeText: 'text-fuchsia-400 dark:text-fuchsia-300',
      badgeBg: 'bg-fuchsia-950/60 border-fuchsia-500/30 text-fuchsia-300',
      spark: 'from-transparent via-fuchsia-300 to-transparent',
    },
    purple: {
      line: 'from-transparent via-indigo-500/60 dark:via-indigo-400/70 to-transparent',
      glow: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      core: 'bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]',
      border: 'border-indigo-400/40 dark:border-indigo-400/50',
      badgeText: 'text-indigo-400 dark:text-indigo-300',
      badgeBg: 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300',
      spark: 'from-transparent via-indigo-300 to-transparent',
    },
    amber: {
      line: 'from-transparent via-amber-400/60 dark:via-amber-400/70 to-transparent',
      glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      core: 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]',
      border: 'border-amber-400/40 dark:border-amber-400/50',
      badgeText: 'text-amber-400 dark:text-amber-300',
      badgeBg: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
      spark: 'from-transparent via-amber-300 to-transparent',
    },
    mixed: {
      line: 'from-transparent via-cyan-400/70 via-fuchsia-500/70 to-transparent',
      glow: 'from-cyan-500/20 via-purple-500/15 to-transparent',
      core: 'bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]',
      border: 'border-cyan-400/40 dark:border-fuchsia-400/40',
      badgeText: 'text-cyan-400 dark:text-cyan-300',
      badgeBg: 'bg-slate-950/80 border-cyan-500/30 text-cyan-300',
      spark: 'from-transparent via-white to-transparent',
    },
  }

  const theme = accentGradients[accent] || accentGradients.cyan

  // Render wave variant
  if (variant === 'wave') {
    return (
      <div
        className={`relative w-full h-12 sm:h-16 -my-2 z-10 pointer-events-none flex items-center justify-center overflow-hidden ${
          flip ? 'rotate-180' : ''
        } ${className}`}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full opacity-30 dark:opacity-40 text-cyan-400"
        >
          <defs>
            <linearGradient id={`wave-grad-${accent}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="25%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="75%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C300,90 600,0 900,90 C1050,135 1150,45 1200,60 L1200,62 L0,62 Z"
            fill="none"
            stroke={`url(#wave-grad-${accent})`}
            strokeWidth="1.5"
          />
        </svg>

        {/* Ambient Blur */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-3xl h-8 bg-gradient-to-r ${theme.glow} blur-xl opacity-60`}
        />
      </div>
    )
  }

  // Render cyber variant with tech badge & micro-coordinates
  if (variant === 'cyber') {
    return (
      <div
        className={`relative w-full py-6 sm:py-8 z-10 pointer-events-none flex items-center justify-center ${className}`}
      >
        {/* Soft atmospheric backlight halo */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-4xl h-12 bg-gradient-to-r ${theme.glow} blur-2xl opacity-50 dark:opacity-75`}
        />

        <div
          className={`relative w-full max-w-7xl px-4 sm:px-6 flex items-center justify-center ${
            flip ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Left Laser Line */}
          <div className="relative flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-cyan-400/70 dark:via-cyan-400/50 dark:to-cyan-400">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-cyan-400/60 blur-[1px]" />
          </div>

          {/* Left decorative tick marks */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 text-cyan-400/40 select-none text-[10px] font-mono tracking-widest">
            <span className="w-1 h-1 rounded-full bg-cyan-400/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            <span>&lt;EXE&gt;</span>
          </div>

          {/* Center Cyber Emblem / Chip */}
          {withNode && (
            <div className="relative mx-2 sm:mx-4 flex items-center justify-center">
              <div
                className={`relative px-3 py-1 rounded-full bg-card/90 dark:bg-[#090a12]/90 border ${theme.border} shadow-[0_0_18px_rgba(6,182,212,0.25)] backdrop-blur-md flex items-center gap-2`}
              >
                <div className="relative flex items-center justify-center">
                  <span className={`w-2 h-2 rounded-full ${theme.core} animate-pulse`} />
                  <span
                    className={`absolute inset-0 w-2 h-2 rounded-full ${theme.core} animate-ping opacity-75`}
                  />
                </div>
                {label ? (
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider ${theme.badgeText}`}
                  >
                    {label}
                  </span>
                ) : (
                  icon || <Cpu className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-300" />
                )}
              </div>
            </div>
          )}

          {/* Right decorative tick marks */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 text-fuchsia-400/40 select-none text-[10px] font-mono tracking-widest">
            <span>&lt;/SYS&gt;</span>
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/60" />
            <span className="w-1 h-1 rounded-full bg-fuchsia-400/40" />
          </div>

          {/* Right Laser Line */}
          <div className="relative flex-1 h-px bg-gradient-to-r from-fuchsia-500/70 via-fuchsia-500/40 to-transparent dark:from-fuchsia-400 dark:via-fuchsia-400/50">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-fuchsia-400/60 blur-[1px]" />
          </div>
        </div>

        {/* Traveling light particle */}
        {animated && (
          <motion.div
            className={`absolute h-[2px] w-24 bg-gradient-to-r ${theme.spark} blur-[1px]`}
            initial={{ left: '-10%', opacity: 0 }}
            animate={{
              left: ['0%', '100%'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 2,
            }}
          />
        )}
      </div>
    )
  }

  // Render minimal variant (Ultra-clean laser line)
  if (variant === 'minimal') {
    return (
      <div
        className={`relative w-full py-4 sm:py-6 z-10 pointer-events-none flex items-center justify-center overflow-hidden ${className}`}
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-3xl h-6 bg-gradient-to-r ${theme.glow} blur-lg opacity-40`}
        />
        <div className="relative w-full max-w-6xl px-4 flex items-center justify-center">
          <div className={`w-full h-px bg-gradient-to-r ${theme.line}`} />
          {withNode && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${theme.core}`}
            />
          )}
        </div>
      </div>
    )
  }

  // Render beam variant (Dynamic Laser with dual pulses)
  if (variant === 'beam') {
    return (
      <div
        className={`relative w-full py-6 sm:py-8 z-10 pointer-events-none flex items-center justify-center overflow-hidden ${className}`}
      >
        {/* Ambient atmospheric flare */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-4xl h-10 bg-gradient-to-r ${theme.glow} blur-xl opacity-60 dark:opacity-80`}
        />

        <div
          className={`relative w-full max-w-7xl px-4 sm:px-8 flex items-center justify-center ${
            flip ? 'flex-row-reverse' : ''
          }`}
        >
          {/* Main Laser Core Line */}
          <div className={`w-full h-px bg-gradient-to-r ${theme.line}`} />

          {/* Central Laser Flare Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div
              className={`w-12 sm:w-20 h-1 bg-gradient-to-r ${theme.line} blur-[2px] opacity-80`}
            />
            <div className={`w-2.5 h-2.5 rounded-full ${theme.core} animate-pulse`} />
            <div className="absolute w-6 h-6 rounded-full bg-cyan-400/20 dark:bg-cyan-400/30 blur-sm animate-ping" />
          </div>
        </div>

        {/* Dynamic Energy sweep */}
        {animated && (
          <motion.div
            className={`absolute h-[2px] w-32 bg-gradient-to-r ${theme.spark} blur-[1px]`}
            initial={{ left: '-15%', opacity: 0 }}
            animate={{
              left: ['0%', '100%'],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 1.5,
            }}
          />
        )}
      </div>
    )
  }

  // Default: GLOW variant (Laser beam with premium diamond center node & micro-details)
  return (
    <div
      className={`relative w-full py-5 sm:py-7 z-10 pointer-events-none flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* 1. Large Ambient Radial Halo */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-4xl h-10 bg-gradient-to-r ${theme.glow} blur-xl opacity-50 dark:opacity-80`}
      />

      {/* 2. Precision Laser Beam Line */}
      <div
        className={`relative w-full max-w-7xl px-4 sm:px-8 flex items-center justify-center ${
          flip ? 'flex-row-reverse' : ''
        }`}
      >
        {/* Left segment */}
        <div
          className={`flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-cyan-400/80 dark:via-cyan-400/60 dark:to-cyan-300`}
        />

        {/* Micro-tick Left */}
        <div className="hidden sm:flex items-center gap-1 mx-2 text-cyan-400/50">
          <span className="w-1 h-1 rounded-full bg-cyan-400/40" />
          <span className="w-3 h-px bg-cyan-400/40" />
        </div>

        {/* Centerpiece Node */}
        {withNode && (
          <div className="relative mx-2 sm:mx-3 flex items-center justify-center">
            {/* Center Diamond / Orb Node */}
            <div
              className={`relative w-6 h-6 rounded-lg rotate-45 flex items-center justify-center bg-card/90 dark:bg-[#070710]/95 border ${theme.border} shadow-[0_0_15px_rgba(6,182,212,0.35)] backdrop-blur-sm`}
            >
              <div className={`w-2 h-2 rounded-full ${theme.core} -rotate-45 animate-pulse`} />
            </div>

            {/* Subtle soft ambient glow behind diamond */}
            <div className="absolute w-10 h-10 rounded-full bg-cyan-400/15 blur-md pointer-events-none" />
          </div>
        )}

        {/* Micro-tick Right */}
        <div className="hidden sm:flex items-center gap-1 mx-2 text-cyan-400/50">
          <span className="w-3 h-px bg-cyan-400/40" />
          <span className="w-1 h-1 rounded-full bg-cyan-400/40" />
        </div>

        {/* Right segment */}
        <div
          className={`flex-1 h-px bg-gradient-to-r from-cyan-400/80 via-cyan-400/40 to-transparent dark:from-cyan-300 dark:via-cyan-400/60`}
        />
      </div>

      {/* 3. Subtle animated photon spark traversing the beam */}
      {animated && (
        <motion.div
          className={`absolute h-[2px] w-28 bg-gradient-to-r ${theme.spark} blur-[1px]`}
          initial={{ left: '-10%', opacity: 0 }}
          animate={{
            left: ['-5%', '105%'],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 2.5,
          }}
        />
      )}
    </div>
  )
}

export default SectionDivider
