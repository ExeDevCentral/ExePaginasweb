/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * NavLink con indicador líquido elástico compartido (nav-blob + trail spring lenta).
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export interface NavLinkProps {
  href: string
  label: string
  isActive?: boolean
  isHovered?: boolean
  onHover?: () => void
  onLeave?: () => void
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children?: React.ReactNode
  className?: string
  ariaExpanded?: boolean
  ariaControls?: string
}

export default function NavLink({
  href,
  label,
  isActive = false,
  isHovered = false,
  onHover,
  onLeave,
  onClick,
  children,
  className = '',
  ariaExpanded,
  ariaControls,
}: Readonly<NavLinkProps>) {
  const reduceMotion = Boolean(useReducedMotion())
  const showBlob = isHovered || isActive

  return (
    <Link
      href={href}
      {...(onClick ? { onClick } : {})}
      {...(onHover ? { onMouseEnter: onHover, onFocus: onHover } : {})}
      {...(onLeave ? { onMouseLeave: onLeave, onBlur: onLeave } : {})}
      {...(typeof ariaExpanded === 'boolean' ? { 'aria-expanded': ariaExpanded } : {})}
      {...(ariaControls ? { 'aria-controls': ariaControls } : {})}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${
        showBlob
          ? 'text-cyan-600 dark:text-cyan-300 font-bold'
          : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
      } ${className}`}
    >
      {/* 1. Estela elástica retardada (Liquid Trail con spring más lento que se estira al viajar) */}
      {showBlob && !reduceMotion && (
        <motion.span
          layoutId="nav-blob-trail"
          className="pointer-events-none absolute inset-0 rounded-full bg-cyan-400/15 dark:bg-cyan-400/10 blur-xs -z-10"
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 24,
            mass: 1.2,
          }}
        />
      )}

      {/* 2. Blob principal ágil (layoutId compartido entre links) */}
      {showBlob && (
        <motion.span
          {...(!reduceMotion ? { layoutId: 'nav-blob' } : {})}
          className="pointer-events-none absolute inset-0 rounded-full bg-cyan-500/10 dark:bg-white/10 border border-cyan-500/25 dark:border-cyan-400/20 shadow-xs -z-10"
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}

      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {children && <span className="relative z-10 flex items-center">{children}</span>}
    </Link>
  )
}
