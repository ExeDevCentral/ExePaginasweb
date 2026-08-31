'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

export default function BrandIntroSplash() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, salir de inmediato
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setVisible(false)
    }, 480)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="brand-intro-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -12,
            scale: 1.02,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05060f] select-none pointer-events-auto px-4"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-cyan-500/15 blur-[60px] sm:blur-[90px] pointer-events-none -z-10" />
          <div className="absolute w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-fuchsia-500/10 blur-[50px] sm:blur-[80px] pointer-events-none -z-10" />

          {/* Center Glass Card Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] max-w-[270px] sm:max-w-xs w-full text-center"
          >
            {/* Logo Badge Container */}
            <div className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex items-center justify-center mb-3 sm:mb-4">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-25 blur-sm pointer-events-none" />
              <Logo size={38} className="w-9 h-9 sm:w-10 sm:h-10 relative z-10" />
            </div>

            {/* Brand Title */}
            <div className="flex items-baseline justify-center gap-1 font-sans select-none mb-3">
              <span className="text-white text-sm sm:text-base font-black tracking-tight font-montserrat">
                EXE
              </span>
              <span className="text-yellow-400 font-black text-xs sm:text-sm">{'//'}</span>
              <span className="text-white text-sm sm:text-base font-extrabold tracking-tight font-montserrat">
                PAGINASWEB
              </span>
              <span className="text-cyan-400 font-bold text-[10px] sm:text-xs">.COM</span>
            </div>

            {/* Progress line */}
            <div className="w-28 sm:w-36 h-1 bg-slate-800/80 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400"
              />
            </div>

            <p className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2">
              Cargando experiencia...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
