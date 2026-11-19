/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileDemosView:
 * Lanzador móvil directo de demos en producción (< 768px).
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { INITIAL_PROJECTS } from '@/data/projects'
import { trackEvent } from '@/core/analytics/trackEvent'

const FEATURED_DEMO_IDS = ['restoai', 'sportmanager', 'celstore', 'pelu-rosario', 'fixi'] as const

export default function MobileDemosView() {
  const demos = FEATURED_DEMO_IDS.map((id) => INITIAL_PROJECTS.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  )

  return (
    <div
      data-mobile-demos="true"
      className="relative z-10 min-h-screen bg-transparent text-foreground pt-20 pb-28 px-4 overflow-x-clip"
    >
      <div className="max-w-sm mx-auto space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
              Demos interactivas
            </p>
            <h1 className="text-2xl font-display font-bold tracking-tight mt-0.5">
              Tocá y probalos hoy
            </h1>
          </div>
          <Link
            href="/portafolio"
            className="text-xs font-semibold text-emerald-600 dark:text-cyan-400 inline-flex items-center gap-0.5 shrink-0"
          >
            <span>Todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 shadow-xs"
            >
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                <img
                  src={demo.image}
                  alt={demo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#090e1a]/80 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-mono font-semibold text-emerald-400 border border-white/12">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EN VIVO
                </span>
              </div>
              <div className="p-3.5 space-y-2.5">
                <div>
                  <h2 className="text-sm font-bold text-foreground line-clamp-1">{demo.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {demo.description}
                  </p>
                </div>
                {demo.link && (
                  <a
                    href={demo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('demo_interactive_used', { demoId: demo.id })}
                    className="w-full h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                  >
                    <span>Abrir demo en producción</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
