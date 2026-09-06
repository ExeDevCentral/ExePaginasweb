'use client'

import { Sparkles } from 'lucide-react'

export interface CraftedBySignatureProps {
  /**
   * Visual theme of the badge.
   * - `dark`:  for dark/charcoal backgrounds (default)
   * - `light`: for light/cream backgrounds
   */
  variant?: 'light' | 'dark'
  /** Additional classes for positioning or spacing in the host site. */
  className?: string
  /** Renders the full-width bar with the top accent line, like Noema's footer. */
  showBar?: boolean
}

/**
 * Reusable "Crafted with precision by Exepaginasweb.com" signature badge.
 *
 * Deep module: encapsulates the animation, accessibility and theme logic.
 * The host only decides variant, layout and whether to show the top bar.
 */
export default function CraftedBySignature({
  variant = 'dark',
  className = '',
  showBar = false,
}: CraftedBySignatureProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`
        relative flex items-center justify-center overflow-hidden
        ${showBar ? 'py-6' : ''}
        ${className}
      `}
    >
      {showBar && (
        <div
          className={`
            absolute top-0 left-1/2 -translate-x-1/2 h-px w-80
            bg-gradient-to-r from-transparent via-amber-500/60 to-transparent
            ${isDark ? '' : 'via-amber-600/50'}
          `}
        />
      )}

      <a
        href="https://exepaginasweb.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Diseño & Desarrollo por Exepaginasweb.com"
        className={`
          group relative inline-flex items-center gap-2
          px-4 py-2 rounded-full
          text-[11px] font-semibold uppercase tracking-[0.18em]
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          border
          ${
            isDark
              ? 'bg-white/[0.03] text-slate-300/75 border-amber-500/15 hover:border-amber-500/45 hover:bg-amber-500/[0.09] hover:text-slate-100'
              : 'bg-slate-900/[0.03] text-slate-600/85 border-amber-700/20 hover:border-amber-700/45 hover:bg-amber-700/[0.07] hover:text-slate-900'
          }
          hover:-translate-y-px
          hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.28)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
        `}
      >
        {/* Subtle ambient glow behind the badge */}
        <span
          className={`
            pointer-events-none absolute inset-0 rounded-full blur-md
            animate-signature-glow
            ${isDark ? 'bg-amber-500/10' : 'bg-amber-600/10'}
          `}
        />

        {/* Shimmer sweep on hover */}
        <span
          className={`
            pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
            bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]
            bg-[length:200%_100%] animate-signature-shimmer
            transition-opacity duration-500
          `}
        />

        <span className="relative z-10 opacity-80">Crafted with precision by</span>

        <span
          className={`
            relative z-10 font-bold bg-clip-text text-transparent
            ${
              isDark
                ? 'bg-gradient-to-r from-amber-200 to-amber-400'
                : 'bg-gradient-to-r from-amber-700 to-rose-700'
            }
          `}
        >
          Exepaginasweb.com
        </span>

        <Sparkles
          size={13}
          className={`
            relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:rotate-180 group-hover:scale-125
            ${isDark ? 'text-amber-300' : 'text-amber-600'}
          `}
        />
      </a>
    </div>
  )
}
