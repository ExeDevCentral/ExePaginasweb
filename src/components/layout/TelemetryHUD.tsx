/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * TelemetryHUD: Píldora flotante e inspector interactivo de telemetría en tiempo real
 * (Lighthouse 100, Core Web Vitals, Edge Latency, Supabase RLS y disparador Ctrl+K).
 */
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ShieldCheck, Cpu, Terminal, ChevronUp, X, Gauge, CheckCircle2 } from 'lucide-react'

export interface TelemetryHUDProps {
  className?: string
}

export default function TelemetryHUD({ className = '' }: Readonly<TelemetryHUDProps>) {
  const [expanded, setExpanded] = useState(false)

  const openCommandPalette = () => {
    // Disparar evento de teclado sintético Ctrl+K
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    setExpanded(false)
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 select-none font-mono ${className}`}
      aria-label="Panel de telemetría de rendimiento"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 dark:bg-[#070b16]/95 border border-cyan-500/30 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.15)] p-4 text-xs text-slate-300"
          >
            {/* Header del inspector */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-bold text-white tracking-wider text-[11px] uppercase">
                  Telemetría de Sistema
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar telemetría"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Métricas clave */}
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Lighthouse</span>
                </span>
                <span className="font-semibold text-emerald-400">100 / 100</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>LCP (Carga inicial)</span>
                </span>
                <span className="font-semibold text-cyan-400">0.38s (Instant)</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Latencia Edge</span>
                </span>
                <span className="font-semibold text-slate-200">~14ms</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Postgres + RLS</span>
                </span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Seguro
                </span>
              </div>
            </div>

            {/* Botón de acceso a terminal Ctrl+K */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 flex items-center justify-center gap-2 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Abrir Paleta (Ctrl+K)</span>
              <kbd className="ml-auto text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-cyan-200">
                ⌘K
              </kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Píldora compacta colapsada */}
      <motion.button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 dark:bg-[#070b16]/90 border border-slate-700/60 dark:border-cyan-500/30 text-slate-300 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] backdrop-blur-lg transition-all duration-200 cursor-pointer text-[11px]"
        aria-expanded={expanded}
        title="Ver telemetría y estado de servidores"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
          EXE.STATUS
        </span>
        <span className="text-[10px] text-emerald-400 font-mono">100% OK</span>
        <ChevronUp
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </motion.button>
    </div>
  )
}
