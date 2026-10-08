/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * HeroProductShowcase: Pantalla interactiva de alta fidelidad que muestra
 * sitios reales en acción (E-Commerce, Turnos, Gestión) y reproduce video demo.
 * Destruye la sensación de "PDF abstracto" y genera CONFIANZA inmediata.
 */
'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, ShieldCheck, CheckCircle2 } from 'lucide-react'

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
    badge: 'DEMO EN VIVO',
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
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentTab: TabConfig = TABS.find((t) => t.id === activeTab) ?? (TABS[0] as TabConfig)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      void videoRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  return (
    <div
      data-product-showcase="true"
      className={`relative w-full max-w-xl lg:max-w-2xl mx-auto ${className}`}
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute -inset-2 bg-linear-to-r from-emerald-500/20 via-cyan-500/20 to-brand/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Chasis de la Pantalla / Ventana de Navegador */}
      <div className="relative rounded-2xl bg-[#070b14]/95 border border-white/15 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Barra superior de navegador estilo Chrome/Safari */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#0a0f1d] border-b border-white/10 font-mono text-xs">
          {/* Botones de ventana */}
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-md bg-black/50 border border-white/10 text-[11px] text-slate-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="truncate max-w-50">{currentTab.url}</span>
            </div>
          </div>

          {/* Badge de estado en vivo */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {currentTab.badge}
            </span>
          </div>
        </div>

        {/* Pestañas de selector de solución */}
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
                    ? 'bg-white/10 text-white font-bold shadow-sm'
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
                className="relative w-full h-full flex items-center justify-center bg-slate-950"
              >
                <video
                  ref={videoRef}
                  src="/assets/videos/hero-bg.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => {
                    setVideoLoaded(true)
                    setVideoError(false)
                  }}
                  onError={() => {
                    setVideoLoaded(false)
                    setVideoError(true)
                  }}
                  className={`w-full h-full object-cover ${videoError ? 'hidden' : 'block'}`}
                />

                {/* Si no hay video en la carpeta aún, mostramos el reel interactivo de proyectos */}
                {videoError && (
                  <div className="relative w-full h-full flex flex-col justify-between p-6 bg-linear-to-br from-slate-950 via-[#0a1226] to-slate-900 text-left">
                    <Image
                      src="/assets/noema-consultora.webp"
                      alt="Demostración de sistemas a medida"
                      fill
                      priority
                      className="object-cover opacity-45 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-black/60 border border-white/20 text-cyan-300 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
                        REEL DE SISTEMAS EN PRODUCCIÓN
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> LISTO PARA USAR
                      </span>
                    </div>

                    <div className="relative z-10 space-y-2">
                      <h4 className="text-xl sm:text-2xl font-bold font-montserrat text-white tracking-tight drop-shadow-md">
                        Tu Próxima Web: Rápida, Exclusiva y Optimizada para Vender
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed drop-shadow">
                        Desarrollo a medida con cobros directos, reservas automáticas y diseño que
                        refleja la verdadera calidad de tu marca.
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-slate-400">
                      <span>Colocá tu video en /public/assets/videos/hero-bg.mp4</span>
                      <span className="text-cyan-400 font-bold">100% RESPONSIVE</span>
                    </div>
                  </div>
                )}

                {/* Controles de reproducción si el video existe */}
                {!videoError && videoLoaded && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                    className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-black hover:scale-105 transition-all cursor-pointer backdrop-blur-md"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                )}
              </motion.div>
            )}

            {/* PESTAÑA 2: TIENDA ONLINE REAL (CELSTORE) */}
            {activeTab === 'ecommerce' && (
              <motion.div
                key="tab-ecommerce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src="/portfolio/celstore.webp"
                  alt="Catálogo y tienda online de alta conversión"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 p-3 rounded-xl border border-white/15 backdrop-blur-md">
                  <div>
                    <div className="font-bold text-emerald-400">E-Commerce de Alta Velocidad</div>
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

            {/* PESTAÑA 3: TURNOS & CITAS (SPORTMANAGER) */}
            {activeTab === 'turnos' && (
              <motion.div
                key="tab-turnos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src="/portfolio/sportmanager.webp"
                  alt="Sistema de reservas y turnos automáticos"
                  fill
                  className="object-cover"
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

            {/* PESTAÑA 4: GESTIÓN GASTRONÓMICA & SERVICIOS (RESTOAI) */}
            {activeTab === 'gestion' && (
              <motion.div
                key="tab-gestion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src="/portfolio/restoai.webp"
                  alt="Panel de control para gastronomía y servicios"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 p-3 rounded-xl border border-white/15 backdrop-blur-md">
                  <div>
                    <div className="font-bold text-amber-400">Panel Operativo en Tiempo Real</div>
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
  )
}
