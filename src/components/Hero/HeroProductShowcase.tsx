/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * HeroProductShowcase: Cinema Display 100% Estable y Sólido.
 * Incorpora los 3 Efectos Premium:
 * 1. Haz de Luz Perimetral (Border Beam giratorio continuo).
 * 2. Aura Ambilight Respirante Fija (OLED Ambient Glow sin tambaleos).
 * 3. Micro-Enfoque Cinemático Interno (Zoom óptico suave del 3% al posar el mouse).
 */
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react'

type ShowcaseTab = 'video' | 'ecommerce' | 'turnos' | 'gestion'

interface TabConfig {
  id: ShowcaseTab
  label: string
  icon: string
  url: string
  badge: string
}

const TABS: TabConfig[] = [
  {
    id: 'video',
    label: 'Video Demo',
    icon: '🎬',
    url: 'https://exepaginasweb.com/demo-en-accion',
    badge: 'DEMO CINEMÁTICA',
  },
  {
    id: 'ecommerce',
    label: 'Tienda Online',
    icon: '🛒',
    url: 'https://celstore.com/catalogo',
    badge: '0% COMISIONES',
  },
  {
    id: 'turnos',
    label: 'Turnos & Citas',
    icon: '📅',
    url: 'https://sportmanager.app/reservas',
    badge: 'COBROS 24/7',
  },
  {
    id: 'gestion',
    label: 'Sistema a Medida',
    icon: '📊',
    url: 'https://restoai.com/panel-control',
    badge: 'CONTROL TOTAL',
  },
]

export default function HeroProductShowcase({ className = '' }: Readonly<{ className?: string }>) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('video')
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isCinemaMode, setIsCinemaMode] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [duration, setDuration] = useState('00:15')

  const videoRef = useRef<HTMLVideoElement>(null)

  const currentTab: TabConfig = TABS.find((t) => t.id === activeTab) ?? (TABS[0] as TabConfig)

  // 1. Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      void videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isPlaying])

  // 2. Mute / Unmute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }, [isMuted])

  // 3. Time Update & Scrubbing
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime
    const dur = videoRef.current.duration || 15
    setProgress((cur / dur) * 100)

    const curM = Math.floor(cur / 60)
    const curS = Math.floor(cur % 60)
    const durM = Math.floor(dur / 60)
    const durS = Math.floor(dur % 60)

    setCurrentTime(`${curM.toString().padStart(2, '0')}:${curS.toString().padStart(2, '0')}`)
    if (!Number.isNaN(dur)) {
      setDuration(`${durM.toString().padStart(2, '0')}:${durS.toString().padStart(2, '0')}`)
    }
  }

  // Cerrar Modo Cine con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCinemaMode])

  // Autoplay del video al montar o cambiar de pestaña
  useEffect(() => {
    if (activeTab === 'video' && videoRef.current) {
      videoRef.current.defaultMuted = true
      videoRef.current.muted = isMuted
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true)
            setVideoError(false)
          })
          .catch(() => {
            // Autoplay esperando interacción del usuario
          })
      }
    }
  }, [activeTab, isMuted])

  return (
    <>
      {/* Contenedor principal: 100% ESTABLE Y SÓLIDO (Cero tambaleos) */}
      <div
        data-product-showcase="true"
        className={`group relative w-full max-w-xl lg:max-w-2xl mx-auto ${className}`}
      >
        {/* EFECTO 1: AURA AMBILIGHT RESPIRANTE FIJA (Ambient Glow suave sin movimiento) */}
        <div
          data-ambilight="true"
          className="absolute -inset-5 sm:-inset-7 rounded-3xl blur-3xl opacity-60 pointer-events-none transition-all duration-1000 animate-pulse"
          style={{
            animationDuration: '4s',
            background:
              activeTab === 'ecommerce'
                ? 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.35), rgba(6,182,212,0.15), transparent 70%)'
                : activeTab === 'turnos'
                  ? 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.35), rgba(59,130,246,0.15), transparent 70%)'
                  : activeTab === 'gestion'
                    ? 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.35), rgba(217,70,239,0.15), transparent 70%)'
                    : 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.4), rgba(6,182,212,0.2), transparent 70%)',
          }}
        />

        {/* EFECTO 2: BORDER BEAM (Haz de luz perimetral continuo en movimiento) */}
        <div className="relative rounded-2xl p-[1.5px] overflow-hidden shadow-[0_25px_65px_rgba(0,0,0,0.85)]">
          {/* Haz láser girando por el perímetro */}
          <div
            className="absolute -inset-[150%] animate-[spin_5s_linear_infinite] pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 310deg, rgba(16,185,129,0.9) 340deg, rgba(6,182,212,1) 360deg)',
            }}
          />

          {/* Chasis Interior Fijo de Titanio / Cristal */}
          <div className="relative rounded-[15px] bg-[#060a14] overflow-hidden">
            {/* Barra superior de navegador estilo Chrome/Safari */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#0a0f1d] border-b border-white/10 font-mono text-xs select-none">
              {/* Botones de ventana */}
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </span>
                <div className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-50">{currentTab.url}</span>
                </div>
              </div>

              {/* Badges y Modo Cine */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentTab.badge}
                </span>

                {/* Botón de Modo Cine */}
                <button
                  type="button"
                  onClick={() => setIsCinemaMode(true)}
                  title="Modo Cine a Pantalla Completa"
                  className="hidden sm:flex items-center gap-1 p-1 px-2 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 text-cyan-400" />
                  <span>Cine</span>
                </button>
              </div>
            </div>

            {/* Selector de Soluciones / Pestañas */}
            <div className="grid grid-cols-4 bg-black/60 p-1 border-b border-white/10 text-xs font-mono">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 rounded-lg ${
                      isActive
                        ? 'bg-white/15 text-white font-bold shadow-md shadow-black/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline text-[11px]">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Área de Visualización Principal (16:10) */}
            <div className="relative aspect-16/10 bg-black overflow-hidden">
              <AnimatePresence mode="wait">
                {/* PESTAÑA 1: VIDEO DEMO */}
                {activeTab === 'video' && (
                  <motion.div
                    key="tab-video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden"
                  >
                    {/* EFECTO 3: MICRO-ENFOQUE CINEMÁTICO (El video hace zoom suave al pasar el mouse, el marco no se mueve) */}
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedData={() => {
                        setVideoLoaded(true)
                        setVideoError(false)
                      }}
                      onCanPlay={() => {
                        setVideoLoaded(true)
                        setVideoError(false)
                      }}
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                        videoError ? 'hidden' : 'block'
                      }`}
                    >
                      <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
                      <source
                        src="/assets/videos/coverr-a-businessman-working-on-a-stock-market-trading-platform-4862-1080p.mp4"
                        type="video/mp4"
                      />
                    </video>

                    {/* Fallback si el video no carga */}
                    {videoError && (
                      <div className="relative w-full h-full flex flex-col justify-between p-6 bg-linear-to-br from-slate-950 via-[#071022] to-slate-900 text-left overflow-hidden">
                        <Image
                          src="/assets/noema-consultora.webp"
                          alt="Demostración de sistemas a medida"
                          fill
                          priority
                          className="object-cover opacity-45 mix-blend-luminosity transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded bg-black/70 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span>SISTEMA EN TIEMPO REAL // 60 FPS</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> LISTO PARA TU MARCA
                          </span>
                        </div>

                        <div className="relative z-10 space-y-2">
                          <div className="inline-flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>+$1,399 USD Cobro Aprobado · Directo a tu banco</span>
                          </div>

                          <h4 className="text-xl sm:text-2xl font-bold font-montserrat text-white tracking-tight drop-shadow-md">
                            Tu Próxima Web: Rápida, Exclusiva y Optimizada para Vender
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed drop-shadow">
                            Desarrollo a medida sin cuotas de alquiler mensual.
                          </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                          <span>/public/assets/videos/hero-bg.mp4</span>
                          <span className="text-cyan-400 font-bold">4K READY</span>
                        </div>
                      </div>
                    )}

                    {/* Controles cinemáticos flotantes & ecualizador */}
                    {!videoError && videoLoaded && (
                      <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-4 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
                        {/* Barra de progreso de video */}
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-emerald-400 to-cyan-400 transition-all duration-150"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-white">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={togglePlay}
                              aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                              {isPlaying ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 ml-0.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={toggleMute}
                              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                              className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                              {isMuted ? (
                                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                              {!isMuted && isPlaying && (
                                <span className="flex items-end gap-0.5 h-3">
                                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" />
                                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                                </span>
                              )}
                            </button>

                            <span className="text-[11px] text-slate-300">
                              {currentTime} / {duration}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-bold">
                              ULTRA HD
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsCinemaMode(true)}
                              aria-label="Pantalla completa"
                              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PESTAÑA 2: TIENDA ONLINE REAL */}
                {activeTab === 'ecommerce' && (
                  <motion.div
                    key="tab-ecommerce"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full overflow-hidden"
                  >
                    <Image
                      src="/portfolio/celstore.webp"
                      alt="Catálogo y tienda online de alta conversión"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 p-3 rounded-xl border border-white/15 backdrop-blur-md">
                      <div>
                        <div className="font-bold text-emerald-400">
                          E-Commerce de Alta Velocidad
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Catálogo, variantes y carrito instantáneo
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                        0% COMISIÓN
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 3: TURNOS & CITAS */}
                {activeTab === 'turnos' && (
                  <motion.div
                    key="tab-turnos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full overflow-hidden"
                  >
                    <Image
                      src="/portfolio/sportmanager.webp"
                      alt="Sistema de reservas y turnos automáticos"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 p-3 rounded-xl border border-white/15 backdrop-blur-md">
                      <div>
                        <div className="font-bold text-cyan-400">Sistema de Turnos & Clientes</div>
                        <div className="text-[11px] text-slate-300">
                          Reservas 24/7 con seña directa a tu banco
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-cyan-400 text-slate-950 font-bold text-[10px]">
                        AUTÓNOMO
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* PESTAÑA 4: GESTIÓN GASTRONÓMICA & SERVICIOS */}
                {activeTab === 'gestion' && (
                  <motion.div
                    key="tab-gestion"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full overflow-hidden"
                  >
                    <Image
                      src="/portfolio/restoai.webp"
                      alt="Panel de control para gastronomía y servicios"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 p-3 rounded-xl border border-white/15 backdrop-blur-md">
                      <div>
                        <div className="font-bold text-amber-400">
                          Panel Operativo en Tiempo Real
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Mesas, comandas y métricas desde iPad o celular
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">
                        TIEMPO REAL
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pie de la pantalla con mensaje de confianza */}
            <div className="px-4 py-2.5 bg-[#070b14] border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Explorá interfaces reales de negocios en producción</span>
              </span>
              <span className="text-emerald-400 font-semibold">ExePaginasWeb © 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE MODO CINE A PANTALLA COMPLETA */}
      <AnimatePresence>
        {isCinemaMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl"
          >
            <div className="relative w-full max-w-5xl rounded-2xl bg-[#070b14] border border-white/20 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-[#0a0f1d] border-b border-white/10 font-mono text-xs">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  MODO CINE // DEMOSTRACIÓN DE SOFTWARE
                </span>
                <button
                  type="button"
                  onClick={() => setIsCinemaMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 font-mono text-xs cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Salir (ESC)</span>
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                {activeTab === 'video' ? (
                  <video
                    autoPlay
                    loop
                    controls
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
                    <source
                      src="/assets/videos/coverr-a-businessman-working-on-a-stock-market-trading-platform-4862-1080p.mp4"
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <Image
                    src={
                      activeTab === 'ecommerce'
                        ? '/portfolio/celstore.webp'
                        : activeTab === 'turnos'
                          ? '/portfolio/sportmanager.webp'
                          : activeTab === 'gestion'
                            ? '/portfolio/restoai.webp'
                            : '/assets/noema-consultora.webp'
                    }
                    alt="Demostración a pantalla completa"
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
