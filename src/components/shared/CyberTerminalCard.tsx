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
    border: 'border-cyan-500/40 hover:border-cyan-400',
    glow: 'rgba(6, 182, 212, 0.22)',
    accent: 'text-cyan-400',
    badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    led: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    line: 'from-cyan-500/60 to-transparent',
  },
  fuchsia: {
    border: 'border-fuchsia-500/40 hover:border-fuchsia-400',
    glow: 'rgba(217, 70, 239, 0.22)',
    accent: 'text-fuchsia-400',
    badge: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-500/40',
    led: 'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]',
    line: 'from-fuchsia-500/60 to-transparent',
  },
  amber: {
    border: 'border-amber-500/40 hover:border-amber-400',
    glow: 'rgba(245, 158, 11, 0.22)',
    accent: 'text-amber-400',
    badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    led: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    line: 'from-amber-500/60 to-transparent',
  },
  emerald: {
    border: 'border-emerald-500/40 hover:border-emerald-400',
    glow: 'rgba(16, 185, 129, 0.22)',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    led: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    line: 'from-emerald-500/60 to-transparent',
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
      data-cyber-chassis="true"
      data-cyber-color={color}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePos({ x: -500, y: -500 })
      }}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#050811]/90 dark:bg-[#03060d]/95 border ${theme.border} backdrop-blur-2xl transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden ${className}`}
      style={{
        boxShadow: isHovered ? `0 0 35px ${theme.glow}` : undefined,
      }}
    >
      {/* 1. Fondo de pistas de circuito PCB y resplandor reactivo al cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${theme.glow}, transparent 70%)`,
        }}
      />

      {/* Trazado vectorial sutil de circuito impreso (PCB) */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
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
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/5 mb-5 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          {/* Diodo LED pulsante */}
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme.led}`}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${theme.led}`} />
          </span>
          <span className="tracking-wider uppercase text-slate-300 font-semibold">{code}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded-xs">
            SYS_ONLINE
          </span>
          {badge && (
            <span
              className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}
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
              className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${theme.accent} shadow-inner transition-transform duration-300 group-hover:scale-110`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-slate-300/90 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* 4. Especificaciones técnicas (Tech chips) */}
      {tech.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-white/5">
          {tech.map((item) => (
            <span
              key={item}
              className="text-[11px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5 transition-colors group-hover:border-white/20"
            >
              <span className={`w-1 h-1 rounded-full ${theme.led}`} />
              {item}
            </span>
          ))}
        </div>
      )}

      {/* 5. Disparador poco convencional de Sistema en Vivo */}
      {liveLauncher && (
        <div className="relative z-10 pt-4 border-t border-white/10 dark:border-white/5">
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
        <div className="relative z-10 pt-3 border-t border-white/10 dark:border-white/5 flex items-center justify-between">
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
