/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Cartel Luminoso Neón de Alto Impacto para el Hero Banner Principal
 *
 * Características:
 * - Estética física de cartel/marquesina de neón cyber-boutique con soporte de cristal ahumado y brackets metálicos
 * - Encendido realista con chispazos de gas neón al cargar (Ignition Flicker)
 * - Luz ambiental volumétrica difusa que baña el fondo del banner
 * - Scroll Reactivo (Opción 2):
 *   1) Se achica notoriamente de 100% a 60% (scale: 1 -> 0.62) conforme se baja en la página
 *   2) Se apaga gradualmente como un cartel que pierde tensión/se enfría el filamento (brightness, drop-shadow y halos caen a cero)
 *   3) Sin anclarlo: Fluye libremente en el documento hacia el primer div sin trabar el scroll
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import Logo from '@/components/layout/Logo'

interface HeroNeonSignboardProps {
  className?: string
}

export const HeroNeonSignboard: React.FC<HeroNeonSignboardProps> = ({ className = '' }) => {
  const { scrollY } = useScroll()

  // 1. ACHIQUE PROGRESIVO AL BAJAR (de escala 1.0 a 0.62, anclado a la izquierda para evitar layout shift)
  const signScale = useTransform(scrollY, [0, 260], [1, 0.62])
  const signY = useTransform(scrollY, [0, 260], [0, 10])

  // 2. APAGADO GRADUAL DEL CARTEL LUMINOSO (Decaimiento térmico y pérdida de voltaje)
  const glowMultiplier = useTransform(scrollY, [0, 80, 180, 260], [1, 0.85, 0.25, 0])
  const ambientOpacity = useTransform(scrollY, [0, 120, 240], [0.9, 0.35, 0])
  const signBrightness = useTransform(scrollY, [0, 100, 220], [1.35, 1.05, 0.6])
  const tubeBorderGlow = useTransform(scrollY, [0, 160], [1, 0])
  const isPoweredOn = useTransform(scrollY, (v) => v < 160)

  // Estado para el encendido inicial (Chispazo de gas neón en mount)
  const [flickerState, setFlickerState] = useState<
    'igniting' | 'flicker-off' | 'full' | 'stabilized'
  >('igniting')
  const [powerLabel, setPowerLabel] = useState('220V ON AIR')

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

  // Suscripción al scroll para actualizar etiqueta técnica de potencia
  useEffect(() => {
    return isPoweredOn.on('change', (on) => {
      setPowerLabel(on ? '220V ON AIR' : 'POWER OFF / STANDBY')
    })
  }, [isPoweredOn])

  // Filtro de drop-shadow dinámico para simular el apagado progresivo del tubo
  const amberGlow = useMotionTemplate`drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 12)}px rgba(250, 204, 21, ${useTransform(glowMultiplier, (v) => v * 0.95)})) drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 28)}px rgba(250, 204, 21, ${useTransform(glowMultiplier, (v) => v * 0.45)}))`
  const cyanGlow = useMotionTemplate`drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 10)}px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 22)}px rgba(6, 182, 212, 0.4))`
  const logoNeonGlow = useMotionTemplate`drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 14)}px rgba(250, 204, 21, ${useTransform(glowMultiplier, (v) => v * 0.9)})) drop-shadow(0 0 ${useTransform(glowMultiplier, (v) => v * 30)}px rgba(6, 182, 212, ${useTransform(glowMultiplier, (v) => v * 0.55)}))`

  // Opacidad del encendido inicial
  const ignitionOpacity =
    flickerState === 'flicker-off' ? 0.25 : flickerState === 'igniting' ? 0.7 : 1

  return (
    <div className={`relative select-none my-2 sm:my-3 ${className}`}>
      {/* 1. LUZ AMBIENTAL DIFUSA VOLUMÉTRICA (Baña la pared trasera con fotones cálidos/cian al inicio) */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: ambientOpacity }}
        className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-3xl bg-radial from-amber-400/25 via-cyan-500/15 to-transparent blur-3xl -z-10 transform-gpu"
      />

      {/* 2. ESTRUCTURA SUSPENDIDA CON ACHIQUE DE ESCALA Y APAGADO TÉRMICO */}
      <motion.div
        style={{
          scale: signScale,
          y: signY,
          transformOrigin: 'left center',
          filter: useMotionTemplate`brightness(${signBrightness})`,
        }}
        className="relative inline-flex flex-col items-start group will-change-transform"
      >
        {/* Soportes metálicos / brackets industriales superiores del cartel */}
        <div className="flex items-center gap-12 sm:gap-16 pl-6 -mb-1 z-20 pointer-events-none">
          <div className="w-3.5 h-2 rounded-t-sm bg-linear-to-b from-slate-300 to-slate-600 dark:from-slate-600 dark:to-slate-800 border-t border-x border-white/40 shadow-xs" />
          <div className="w-3.5 h-2 rounded-t-sm bg-linear-to-b from-slate-300 to-slate-600 dark:from-slate-600 dark:to-slate-800 border-t border-x border-white/40 shadow-xs" />
        </div>

        {/* Chasis principal del cartel: Vidrio ahumado de alta gama con ribete neón perimetral */}
        <motion.div
          animate={{ opacity: ignitionOpacity }}
          transition={{ duration: 0.04 }}
          className="relative inline-flex items-center gap-3 sm:gap-4.5 px-4 sm:px-5.5 py-2.5 sm:py-3.5 rounded-2xl bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10 overflow-hidden"
        >
          {/* Tubo de neón perimetral reactivo al scroll (se apaga junto con el cartel) */}
          <motion.div
            style={{ opacity: tubeBorderGlow }}
            className="pointer-events-none absolute inset-0 rounded-2xl border border-amber-400/40 dark:border-cyan-400/40 shadow-[inset_0_0_12px_rgba(250,204,21,0.25)]"
          />

          {/* Destello de brillo especular sobre el vidrio del cartel */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-60" />

          {/* A. LOGO CON TUBO DE NEÓN LUMINOSO */}
          <motion.div
            style={{ filter: logoNeonGlow }}
            className="relative shrink-0 flex items-center justify-center"
          >
            {/* Halo de fósforo activo */}
            <motion.div
              style={{ opacity: glowMultiplier }}
              className="absolute -inset-2 rounded-full bg-amber-400/20 blur-md pointer-events-none"
            />
            <Logo
              size={46}
              variant="dark"
              className="relative z-10 transition-transform duration-300"
            />
          </motion.div>

          {/* Divisor vertical sutil de estilo arquitectónico */}
          <div className="h-8 w-px bg-white/15 dark:bg-white/10 shrink-0" />

          {/* B. TIPOGRAFÍA EN TUBO DE NEÓN: EXE // PAGINASWEB.COM */}
          <div className="flex flex-col items-start leading-none">
            {/* Fila del rótulo luminoso */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono font-black tracking-widest text-lg sm:text-2xl uppercase">
              {/* EXE en fósforo ámbar brillante */}
              <motion.span
                style={{ filter: amberGlow }}
                className="text-amber-300 dark:text-amber-400 drop-shadow-xs transition-colors duration-200"
              >
                EXE
              </motion.span>

              {/* // en cian eléctrico */}
              <motion.span
                style={{ filter: cyanGlow }}
                className="text-cyan-400 font-light opacity-90"
              >
                //
              </motion.span>

              {/* PAGINASWEB en blanco puro de alta incandescencia */}
              <motion.span style={{ filter: amberGlow }} className="text-white drop-shadow-xs">
                PAGINASWEB
              </motion.span>

              {/* .COM distintivo */}
              <motion.span
                style={{ filter: cyanGlow }}
                className="text-cyan-400 text-xs sm:text-sm font-semibold font-mono tracking-wider ml-0.5"
              >
                .COM
              </motion.span>
            </div>

            {/* Micro-telemetría de estado del cartel (indica voltaje y modo) */}
            <div className="flex items-center gap-2 mt-1 font-mono text-[9px] sm:text-[10px] tracking-wider text-slate-400 select-none">
              <motion.span
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: useTransform(isPoweredOn, (on) => (on ? '#34d399' : '#64748b')),
                }}
                className="w-1.5 h-1.5 rounded-full shrink-0 shadow-xs"
              />
              <span className="text-slate-400 dark:text-slate-400 font-medium">{powerLabel}</span>
              <span className="text-white/20">•</span>
              <span className="text-slate-500 uppercase">ESTUDIO WEB A MEDIDA</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HeroNeonSignboard
