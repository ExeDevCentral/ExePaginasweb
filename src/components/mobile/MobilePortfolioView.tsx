/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobilePortfolioView:
 * Portafolio móvil limpio, escaneable y sin muros de texto (< 768px).
 * - Filtros por rubro en píldoras horizontales
 * - Tarjetas visuales con capturas reales .webp y enlace directo en 1 toque
 * - Bottom Sheet técnico con highlights al tocar cualquier proyecto
 */
'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check, X } from 'lucide-react'
import { INITIAL_PROJECTS, type Project } from '@/data/projects'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'saas', label: 'SaaS' },
  { id: 'turnos', label: 'Turnos' },
  { id: 'ecommerce', label: 'Tienda' },
  { id: 'web', label: 'Web' },
] as const

export default function MobilePortfolioView() {
  const [category, setCategory] = useState<string>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const projects = useMemo(
    () =>
      category === 'all'
        ? INITIAL_PROJECTS
        : INITIAL_PROJECTS.filter((project) => project.category === category),
    [category]
  )

  return (
    <div
      data-mobile-portfolio="true"
      className="relative z-10 min-h-screen bg-transparent text-foreground pt-20 pb-28 px-4 overflow-x-clip"
    >
      <div className="max-w-sm mx-auto space-y-4">
        {/* Cabecera */}
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
            Casos en producción ({INITIAL_PROJECTS.length})
          </p>
          <h1 className="text-2xl font-display font-bold tracking-tight mt-0.5">
            Sistemas reales en vivo
          </h1>
        </div>

        {/* Filtros compactos */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const active = category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                  active
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Tarjetas limpias */}
        <div className="space-y-3.5">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 shadow-xs"
            >
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="w-full text-left block cursor-pointer"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#090e1a]/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-semibold text-emerald-400 border border-white/12">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="p-3.5 pb-2">
                  <h2 className="text-sm font-bold text-foreground leading-snug line-clamp-1">
                    {project.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </button>

              <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Ver detalles
                </button>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('demo_interactive_used', { demoId: project.id })}
                    className="h-9 px-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs inline-flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>Probar en vivo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Sheet de Detalle */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              aria-hidden="true"
              className="fixed inset-0 z-[58] bg-black/70 backdrop-blur-md"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[60] max-h-[84dvh] flex flex-col rounded-t-3xl bg-white dark:bg-[#090e1a] border-t border-slate-200 dark:border-white/12 shadow-2xl overflow-hidden"
            >
              <div className="px-5 pt-3 pb-3 border-b border-slate-200/80 dark:border-white/8 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {selected.categoryLabel}
                  </p>
                  <h3 className="text-sm font-bold text-foreground truncate">{selected.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar detalle"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/8 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-4 space-y-4">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full aspect-[16/9] object-cover object-top rounded-xl border border-slate-200 dark:border-white/10"
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selected.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-[10px] font-mono text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2">
                  {selected.highlights.slice(0, 4).map((hl) => (
                    <li
                      key={hl}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-200/80 dark:border-white/8 grid grid-cols-2 gap-2.5 shrink-0 bg-white dark:bg-[#090e1a]">
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span>Ver en vivo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={getWhatsAppUrl(
                    `¡Hola Exequiel! Me gustó el proyecto ${selected.title} y quiero algo similar para mi negocio.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <span>Quiero algo así</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
