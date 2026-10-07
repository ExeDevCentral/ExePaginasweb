/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Cartel Luminoso Neón de Alto Impacto para el Hero Banner Principal
 *
 * Características:
 * - Estética física de cartel/marquesina de neón cyber-boutique con soporte de cristal ahumado y brackets metálicos
 * - Encendido realista con chispazos de gas neón al cargar (Ignition Flicker)
 * - Luz ambiental volumétrica difusa que baña el fondo del banner
 * - Renderizado acelerado por hardware (GPU) sin listeners de scroll continuos que sobrecarguen el hilo principal
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from '@/components/layout/Logo'

interface HeroNeonSignboardProps {
  className?: string
}

export const HeroNeonSignboard: React.FC<HeroNeonSignboardProps> = ({ className = '' }) => {
  // Estado para el encendido inicial (Chispazo de gas neón en mount)
  const [flickerState, setFlickerState] = useState<
    'igniting' | 'flicker-off' | 'full' | 'stabilized'
  >('igniting')

  useEffect(() => {
    // Secuencia de chispazos analógicos de encendido de tubo de neón
    const t1 = setTimeout(() => setFlickerState('flicker-off'), 90)
    const t2 = setTimeout(() => setFlickerState('igniting'), 140)
    const t3 = setTimeout(() => setFlickerState('flicker-off'), 200)
    const t4 = setTimeout(() => setFlickerState('full'), 270)
    const t5 = setTimeout(() => setFlickerState('stabilized'), 420)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  // Opacidad del encendido inicial
  let ignitionOpacity = 1
  if (flickerState === 'flicker-off') {
    ignitionOpacity = 0.25
  } else if (flickerState === 'igniting') {
    ignitionOpacity = 0.7
  }

  return (
    <div className={`relative select-none my-2 sm:my-3 ${className}`}>
      {/* 1. LUZ AMBIENTAL DIFUSA VOLUMÉTRICA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-3xl bg-radial from-amber-400/20 via-cyan-500/10 to-transparent blur-3xl -z-10 opacity-75 transform-gpu"
      />

      {/* 2. ESTRUCTURA SUSPENDIDA */}
      <div className="relative inline-flex flex-col items-start group">
        {/* Soportes metálicos / brackets industriales superiores del cartel */}
        <div className="flex items-center gap-12 sm:gap-16 pl-6 -mb-1 z-20 pointer-events-none">
          <div className="w-3.5 h-2 rounded-t-sm bg-linear-to-b from-slate-300 to-slate-600 dark:from-slate-600 dark:to-slate-800 border-t border-x border-white/40 shadow-xs" />
          <div className="w-3.5 h-2 rounded-t-sm bg-linear-to-b from-slate-300 to-slate-600 dark:from-slate-600 dark:to-slate-800 border-t border-x border-white/40 shadow-xs" />
        </div>

        {/* Chasis principal del cartel: Vidrio ahumado de alta gama con ribete neón perimetral */}
        <motion.div
          animate={{ opacity: ignitionOpacity }}
          transition={{ duration: 0.04 }}
          className="relative inline-flex items-center gap-3 sm:gap-4.5 px-4 sm:px-5.5 py-2.5 sm:py-3.5 rounded-2xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10 overflow-hidden transform-gpu"
        >
          {/* Tubo de neón perimetral */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-amber-400/35 dark:border-cyan-400/35 shadow-[inset_0_0_12px_rgba(250,204,21,0.2)]" />

          {/* Destello de brillo especular sobre el vidrio del cartel */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-60" />

          {/* A. LOGO CON TUBO DE NEÓN LUMINOSO */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="absolute -inset-2 rounded-full bg-amber-400/25 blur-md pointer-events-none shadow-[0_0_16px_rgba(250,204,21,0.6)]" />
            <Logo
              size={46}
              variant="dark"
              className="relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Divisor vertical sutil de estilo arquitectónico */}
          <div className="h-8 w-px bg-white/15 dark:bg-white/10 shrink-0" />

          {/* B. TIPOGRAFÍA EN TUBO DE NEÓN: EXE // PAGINASWEB.COM */}
          <div className="flex flex-col items-start leading-none">
            {/* Fila del rótulo luminoso */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono font-black tracking-widest text-lg sm:text-2xl uppercase">
              {/* EXE en fósforo ámbar brillante */}
              <span className="relative text-amber-300 dark:text-amber-400 transition-colors duration-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]">
                EXE
              </span>

              {/* Separador de corte cyber en cian eléctrico */}
              <span className="text-cyan-400 font-light opacity-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                {'//'}
              </span>

              {/* PAGINASWEB en blanco puro de alta incandescencia */}
              <span className="text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]">
                PAGINASWEB
              </span>

              {/* .COM distintivo */}
              <span className="text-cyan-400 text-xs sm:text-sm font-semibold font-mono tracking-wider ml-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                .COM
              </span>
            </div>

            {/* Micro-telemetría de estado del cartel (indica voltaje y modo) */}
            <div className="flex items-center gap-2 mt-1 font-mono text-[9px] sm:text-[10px] tracking-wider text-slate-400 select-none">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-slate-300 dark:text-slate-400 font-medium">220V ON AIR</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-500 uppercase">ESTUDIO WEB A MEDIDA</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroNeonSignboard
