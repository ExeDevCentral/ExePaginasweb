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
    }, 850)

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
            y: -25,
            scale: 1.02,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05060f] select-none pointer-events-auto"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-fuchsia-500/10 blur-[90px] pointer-events-none -z-10" />

          {/* Center Content Box */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Logo Badge Container */}
            <div className="relative p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex items-center justify-center mb-6">
              <span className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-30 blur-md pointer-events-none" />
              <Logo size={52} className="relative z-10" />
            </div>

            {/* Brand Title */}
            <div className="flex items-baseline gap-1.5 font-sans select-none mb-4">
              <span className="text-white text-lg font-black tracking-tight font-montserrat">
                EXE
              </span>
              <span className="text-yellow-400 font-black text-sm">{'//'}</span>
              <span className="text-white text-lg font-extrabold tracking-tight font-montserrat">
                PAGINASWEB
              </span>
              <span className="text-cyan-400 font-bold text-xs">.COM</span>
            </div>

            {/* Progress line */}
            <div className="w-44 h-1 bg-slate-800/80 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400"
              />
            </div>

            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2.5">
              Cargando experiencia...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
