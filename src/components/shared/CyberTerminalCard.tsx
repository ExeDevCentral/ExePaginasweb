/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * CyberTerminalCard: Chasis de ingeniería cibernética con biselado táctico,
 * telemetría de consola, diodo LED pulsante y disparador directo de apps en producción.
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CyberArrowRight } from '@/components/ui/MagnificentIcons'
import LiveSystemLauncherButton from '@/components/ui/LiveSystemLauncherButton'

export interface LiveLauncherConfig {
  label: string
  sublabel?: string | undefined
  href: string
  icon?: React.ReactNode | undefined
  color?: ('cyan' | 'fuchsia' | 'amber' | 'emerald') | undefined
}

export interface CyberTerminalCardProps {
  id?: string
  code?: string
  title: string
  desc: string
  badge?: string
  tech?: string[]
  cta?: string
  href?: string
  liveLauncher?: LiveLauncherConfig
  color?: 'cyan' | 'fuchsia' | 'amber' | 'emerald'
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  ariaLabel?: string
}

const COLOR_MAP = {
  cyan: {
    border:
      'border-cyan-500/35 dark:border-cyan-500/40 hover:border-cyan-500 dark:hover:border-cyan-400',
    laser: 'via-cyan-500/90 dark:via-cyan-400',
    glow: 'rgba(6, 182, 212, 0.16)',
    glowLight: 'rgba(6, 182, 212, 0.24)',
    glowWide: 'rgba(6, 182, 212, 0.32)',
    pcbText: 'text-cyan-600/30 dark:text-cyan-400/20',
    accent: 'text-cyan-700 dark:text-cyan-400',
    badge:
      'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/40',
    led: 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    line: 'from-cyan-500/60 to-transparent',
    iconStyle:
      'bg-linear-to-b from-cyan-50 to-cyan-100/80 dark:from-cyan-950/40 dark:to-cyan-900/20 border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 shadow-[0_4px_14px_rgba(6,182,212,0.18)]',
  },
  fuchsia: {
    border:
      'border-fuchsia-500/35 dark:border-fuchsia-500/40 hover:border-fuchsia-500 dark:hover:border-fuchsia-400',
    laser: 'via-fuchsia-500/90 dark:via-fuchsia-400',
    glow: 'rgba(217, 70, 239, 0.16)',
    glowLight: 'rgba(217, 70, 239, 0.24)',
    glowWide: 'rgba(217, 70, 239, 0.32)',
    pcbText: 'text-fuchsia-600/30 dark:text-fuchsia-400/20',
    accent: 'text-fuchsia-700 dark:text-fuchsia-400',
    badge:
      'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-500/40',
    led: 'bg-fuchsia-500 dark:bg-fuchsia-400 shadow-[0_0_8px_#e879f9]',
    line: 'from-fuchsia-500/60 to-transparent',
    iconStyle:
      'bg-linear-to-b from-fuchsia-50 to-fuchsia-100/80 dark:from-fuchsia-950/40 dark:to-fuchsia-900/20 border-fuchsia-300 dark:border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-400 shadow-[0_4px_14px_rgba(217,70,239,0.18)]',
  },
  amber: {
    border:
      'border-amber-500/35 dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-400',
    laser: 'via-amber-500/90 dark:via-amber-400',
    glow: 'rgba(245, 158, 11, 0.16)',
    glowLight: 'rgba(245, 158, 11, 0.24)',
    glowWide: 'rgba(245, 158, 11, 0.32)',
    pcbText: 'text-amber-600/30 dark:text-amber-400/20',
    accent: 'text-amber-700 dark:text-amber-400',
    badge:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/40',
    led: 'bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    line: 'from-amber-500/60 to-transparent',
    iconStyle:
      'bg-linear-to-b from-amber-50 to-amber-100/80 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 shadow-[0_4px_14px_rgba(245,158,11,0.18)]',
  },
  emerald: {
    border:
      'border-emerald-500/35 dark:border-emerald-500/40 hover:border-emerald-500 dark:hover:border-emerald-400',
    laser: 'via-emerald-500/90 dark:via-emerald-400',
    glow: 'rgba(16, 185, 129, 0.16)',
    glowLight: 'rgba(16, 185, 129, 0.24)',
    glowWide: 'rgba(16, 185, 129, 0.32)',
    pcbText: 'text-emerald-600/30 dark:text-emerald-400/20',
    accent: 'text-emerald-700 dark:text-emerald-400',
    badge:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40',
    led: 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#34d399]',
    line: 'from-emerald-500/60 to-transparent',
    iconStyle:
      'bg-linear-to-b from-emerald-50 to-emerald-100/80 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 shadow-[0_4px_14px_rgba(16,185,129,0.18)]',
  },
}

export default function CyberTerminalCard({
  code = 'CORE // 01',
  title,
  desc,
  badge,
  tech = [],
  cta,
  href,
  liveLauncher,
  color = 'cyan',
  icon: Icon,
  className = '',
  ariaLabel,
}: Readonly<CyberTerminalCardProps>) {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 })
  const [isHovered, setIsHovered] = useState(false)

  const theme = COLOR_MAP[color] ?? COLOR_MAP.cyan

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      role="region"
      aria-label={title}
      data-cyber-chassis="true"
      data-cyber-color={color}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: -500, y: -500 })
      }}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-[#0c1224]/90 border ${theme.border} backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden ${className}`}
      style={{
        boxShadow: isHovered
          ? `0 24px 50px -12px ${theme.glowWide}, 0 0 35px ${theme.glowLight}`
          : undefined,
      }}
    >
      {/* Haz láser perimetral superior con color propio de la tarjeta */}
      <div
        className={`pointer-events-none absolute top-0 inset-x-0 h-0.75 bg-linear-to-r from-transparent ${theme.laser} to-transparent group-hover:h-1 transition-all duration-300`}
      />

      {/* 1. Fondo de pistas de circuito PCB y resplandor reactivo al cursor calibrado para ambos temas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.glowLight}, transparent 70%)`,
        }}
      />

      {/* Trazado vectorial sutil de circuito impreso (PCB) visible y nítido */}
      <svg
        className={`pointer-events-none absolute inset-0 w-full h-full opacity-35 dark:opacity-15 group-hover:opacity-60 dark:group-hover:opacity-30 transition-opacity duration-500 ${theme.pcbText}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <pattern id={`pcb-grid-${color}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
          <path d="M 20 20 L 35 20 L 40 25" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#pcb-grid-${color})`} />
      </svg>

      {/* 2. Cabecera táctica superior (Telemetría de Consola & LED) */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/5 mb-5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Diodo LED pulsante */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.led}`}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.led}`} />
          </span>
          <span className="tracking-wider uppercase text-slate-700 dark:text-slate-300 font-semibold">
            {code}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 px-1.5 py-0.5 rounded-xs font-semibold">
            SYS_ONLINE
          </span>
          {badge && (
            <span
              className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border ${theme.badge} font-semibold`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* 3. Cuerpo de contenido: Icono, Título y Descripción */}
      <div className="relative z-10 space-y-4 mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`p-2.5 rounded-xl border ${theme.iconStyle} transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950 dark:text-white tracking-tight group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300/90 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* 4. Especificaciones técnicas (Tech chips) */}
      {tech.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-slate-200/80 dark:border-white/5">
          {tech.map((item) => (
            <span
              key={item}
              className="text-[11px] font-mono px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors group-hover:border-slate-300 dark:group-hover:border-white/20 font-medium"
            >
              <span className={`w-1 h-1 rounded-full ${theme.led}`} />
              {item}
            </span>
          ))}
        </div>
      )}

      {/* 5. Disparador poco convencional de Sistema en Vivo */}
      {liveLauncher && (
        <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/5">
          <LiveSystemLauncherButton
            label={liveLauncher.label}
            sublabel={liveLauncher.sublabel}
            href={liveLauncher.href}
            icon={liveLauncher.icon}
            color={liveLauncher.color || color}
            compact
            className="w-full justify-between"
          />
        </div>
      )}

      {/* 6. Pie de Chasis con Enlace Secundario CTA (si no hay liveLauncher o como acceso complementario) */}
      {cta && href && !liveLauncher && (
        <div className="relative z-10 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
          {href.startsWith('http') ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel || cta}
              className={`inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase ${theme.accent} hover:brightness-125 transition-all group/link`}
            >
              <span>{cta}</span>
              <CyberArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
            </a>
          ) : (
            <Link
              href={href}
              aria-label={ariaLabel || cta}
              className={`inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase ${theme.accent} hover:brightness-125 transition-all group/link`}
            >
              <span>{cta}</span>
              <CyberArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          )}

          {/* Micro-anclaje táctico perimetral */}
          <span className="text-[10px] font-mono text-slate-500 select-none">[EXE_MODULE]</span>
        </div>
      )}
    </div>
  )
}
