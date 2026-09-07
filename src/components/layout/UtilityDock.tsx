'use client'

import { motion } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

interface UtilityDockProps {
  className?: string
}

export default function UtilityDock({ className = '' }: UtilityDockProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      className={`
        relative flex items-center gap-0.5 p-0.5 rounded-full
        bg-slate-100/90 dark:bg-[#0e101c]/90
        border border-slate-200/80 dark:border-white/10
        backdrop-blur-md
        shadow-[0_2px_16px_-4px_rgba(6,182,212,0.15)]
        hover:shadow-[0_4px_28px_-4px_rgba(6,182,212,0.3)]
        hover:border-cyan-400/40 dark:hover:border-cyan-400/35
        transition-all duration-300
        shrink-0
        ${className}
      `}
    >
      {/* Subtle ambient glow */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/8 via-transparent to-violet-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <LanguageSwitcher />

      <span className="w-px h-4 bg-slate-300/70 dark:bg-white/10" />

      <ThemeToggle />
    </motion.div>
  )
}
