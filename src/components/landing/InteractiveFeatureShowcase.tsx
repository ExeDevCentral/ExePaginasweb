/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Componente: InteractiveFeatureShowcase
 *
 * Master Cards estilo Graphite.com:
 * - Altura fija compacta (evita estirar la página verticalmente).
 * - Izquierda (58%): Canvas visual con esquinas (+) y simulador interactivo real de cada solución.
 * - Derecha (42%): Acordeón vertical con tabs colapsables (h-[60px] cerrados) y barra de progreso sincronizada.
 */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ShoppingBag,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Check,
  CreditCard,
  MessageCircle,
  WifiOff,
  Zap,
  RotateCcw,
} from 'lucide-react'
import { trackEvent } from '@/core/analytics/trackEvent'

export interface ShowcaseFeature {
  id: 'turnos' | 'ecommerce' | 'pos' | 'speed'
  title: string
  shortDescription: string
  tag: string
  accentColor: string
  accentGlow: string
  ctaText: string
  ctaHref: string
}

const FEATURES: ShowcaseFeature[] = [
  {
    id: 'turnos',
    title: 'Turnos y reservas 24/7 sin intermediarios',
    shortDescription:
      'Tus clientes reservan solos desde el celular. Cobrá señas automáticas que van directo a tu banco sin pagar comisiones por turno.',
    tag: 'SportManager · Pádel y Turnos en Vivo',
    accentColor: '#06b6d4', // Cyan
    accentGlow: 'rgba(6, 182, 212, 0.35)',
    ctaText: 'Probar SportManager en vivo',
    ctaHref: 'https://sportmanager-playhub.vercel.app',
  },
  {
    id: 'ecommerce',
    title: 'Tienda online con cobro en 1 clic',
    shortDescription:
      'Catálogo rápido y moderno. Tus clientes compran sin registrarse en formularios eternos, con sincronización de stock y facturación al instante.',
    tag: 'CelStore · Tienda con Visor 3D',
    accentColor: '#10b981', // Emerald
    accentGlow: 'rgba(16, 185, 129, 0.35)',
    ctaText: 'Ver CelStore en acción',
    ctaHref: 'https://multi-tiendas-celphone.vercel.app',
  },
  {
    id: 'pos',
    title: 'Terminal de caja y POS Linux anti-caídas',
    shortDescription:
      'Software de mostrador para locales y gastronomía. Funciona 100% offline si se corta internet, arranca en 4 segundos y no paga licencias.',
    tag: 'RestoIA · Comandas y POS Offline',
    accentColor: '#f59e0b', // Amber
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    ctaText: 'Explorar RestoIA en vivo',
    ctaHref: 'https://kobe-sand.vercel.app/',
  },
  {
    id: 'speed',
    title: 'Páginas web con Google Lighthouse 100/100',
    shortDescription:
      'Carga instantánea en 0.38 segundos. Cero plantillas pesadas de WordPress: programadas desde cero en Next.js para vender más y posicionar primero.',
    tag: 'Core Web Vitals · 0.38s Carga Real',
    accentColor: '#a855f7', // Purple
    accentGlow: 'rgba(168, 85, 247, 0.35)',
    ctaText: 'Cotizar desarrollo a medida',
    ctaHref: '/cotizador',
  },
]

const AUTOPLAY_TIME = 7000

export const InteractiveFeatureShowcase: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Estados interactivos para simulación dentro del mockup
  const [selectedTurno, setSelectedTurno] = useState('20:00 hs')
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'paid'>('idle')
  const [activeTable, setActiveTable] = useState<'mesa4' | 'mesa7' | 'barra'>('mesa4')
  const [isAuditing, setIsAuditing] = useState(false)

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length)
    }, AUTOPLAY_TIME)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeIndex, isPaused])

  const activeFeature = FEATURES[activeIndex] ?? FEATURES[0]!

  return (
    <section
      aria-label="Showcase de soluciones"
      className={`relative w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 select-none ${className}`}
    >
      {/* CABECERA COMPACTA Y DIRECTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Sistemas en Producción
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Soluciones reales para tu negocio.{' '}
            <span className="text-muted-foreground dark:text-slate-400 font-normal">
              Sin vueltas ni código confuso.
            </span>
          </h2>
        </div>

        <span className="hidden sm:inline-block font-mono text-xs text-slate-500">
          Auto-play {isPaused ? '(Pausado)' : '7s'} · Toca para interactuar
        </span>
      </div>

      {/* CONTENEDOR PRINCIPAL MASTER CARD ESTILO GRAPHITE */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative rounded-2xl border border-slate-200/90 dark:border-neutral-800 bg-slate-950 p-4 sm:p-5 shadow-2xl overflow-hidden min-h-[520px] lg:h-[530px] flex flex-col lg:flex-row gap-5"
      >
        {/* ==============================================================
            COLUMNA IZQUIERDA: CANVAS MOCKUP REAL Y ENTENDIBLE (58%)
           ============================================================== */}
        <div className="relative w-full lg:flex-[1_1_58%] rounded-xl border border-neutral-800/80 bg-[#0c1017] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          {/* Esquinas blueprint (+) */}
          <span className="absolute top-2.5 left-2.5 font-mono text-neutral-600 text-xs pointer-events-none">
            +
          </span>
          <span className="absolute top-2.5 right-2.5 font-mono text-neutral-600 text-xs pointer-events-none">
            +
          </span>
          <span className="absolute bottom-2.5 left-2.5 font-mono text-neutral-600 text-xs pointer-events-none">
            +
          </span>
          <span className="absolute bottom-2.5 right-2.5 font-mono text-neutral-600 text-xs pointer-events-none">
            +
          </span>

          {/* LUZ AMBIENTAL AMBILIGHT VIBRANTE */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeFeature.accentGlow}, transparent 70%)`,
            }}
          />

          {/* BARRA SUPERIOR DE SIMULADOR DE APP */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-neutral-400">
                app.exepaginasweb.com
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
              style={{
                color: activeFeature.accentColor,
                backgroundColor: `${activeFeature.accentColor}18`,
                border: `1px solid ${activeFeature.accentColor}35`,
              }}
            >
              ● EN VIVO
            </span>
          </div>

          {/* CONTENIDO VISUAL REAL SEGÚN EL MÓDULO ACTIVO */}
          <div className="my-auto py-2">
            <AnimatePresence mode="wait">
              {activeFeature.id === 'turnos' && (
                <motion.div
                  key="turnos-mockup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  {/* Tarjeta de Reserva */}
                  <div className="rounded-xl border border-cyan-500/30 bg-neutral-950/90 p-4 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm sm:text-base">
                            Cancha 1 (Cristal Tech) · Pádel
                          </h4>
                          <p className="text-xs text-cyan-300 font-mono">
                            Viernes {selectedTurno} — Turno 90 min
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0">
                        <Check className="w-3.5 h-3.5" /> Seña Pagada
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          Seña: <strong>$10.000</strong> directa a tu banco
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-300">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Notificación por WhatsApp enviada</span>
                      </div>
                    </div>
                  </div>

                  {/* Selector interactivo de turnos */}
                  <div className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800 text-xs">
                    <span className="text-neutral-400 block mb-2 font-mono text-[11px]">
                      ELIGE UN TURNO DISPONIBLE PARA PROBAR:
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded bg-neutral-800/60 text-neutral-500 line-through">
                        18:30 hs
                      </span>
                      {['20:00 hs', '21:30 hs', '23:00 hs'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTurno(slot)}
                          className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                            selectedTurno === slot
                              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 font-bold shadow-xs'
                              : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
                          }`}
                        >
                          {slot} {selectedTurno === slot ? '✓' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeature.id === 'ecommerce' && (
                <motion.div
                  key="ecommerce-mockup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="rounded-xl border border-emerald-500/30 bg-neutral-950/90 p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm sm:text-base">
                            Remera Oversize Black Edition
                          </h4>
                          <p className="text-xs text-neutral-400">
                            Talle L · Stock descontado en tiempo real
                          </p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-mono text-base font-bold">
                        $28.500
                      </span>
                    </div>

                    <div className="mt-3.5 p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <span className="text-neutral-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {checkoutStep === 'paid'
                          ? '¡Pago acreditado en tu Mercado Pago!'
                          : 'Checkout Express sin registro forzado'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(checkoutStep === 'paid' ? 'idle' : 'paid')}
                        className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer text-xs"
                      >
                        {checkoutStep === 'paid' ? 'Reiniciar prueba' : 'Simular cobro en 1 clic'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] font-mono">
                        COMISIÓN PLATAFORMA:
                      </span>
                      <span className="text-white font-bold text-sm">
                        $0 (Tu dinero es 100% tuyo)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800">
                      <span className="text-neutral-400 block text-[10px] font-mono">
                        FACTURA ELECTRÓNICA:
                      </span>
                      <span className="text-emerald-400 font-bold text-sm">
                        Automática (AFIP API)
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeature.id === 'pos' && (
                <motion.div
                  key="pos-mockup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="rounded-xl border border-amber-500/30 bg-neutral-950/90 p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm sm:text-base">
                            {activeTable === 'mesa4' && 'Comanda Mesa 4 · Café Especial'}
                            {activeTable === 'mesa7' && 'Comanda Mesa 7 · Cena Burger'}
                            {activeTable === 'barra' && 'Comanda Barra 1 · Tragos'}
                          </h4>
                          <p className="text-xs text-neutral-400">
                            {activeTable === 'mesa4' && '2x Doble Espresso + 1x Toast Avocado'}
                            {activeTable === 'mesa7' && '1x Smash Burger Doble + 1x IPA'}
                            {activeTable === 'barra' && '1x Negroni Clásico Especial'}
                          </p>
                        </div>
                      </div>
                      <span className="text-amber-400 font-mono text-base font-bold">
                        {activeTable === 'mesa4' && '$9.200'}
                        {activeTable === 'mesa7' && '$14.500'}
                        {activeTable === 'barra' && '$6.000'}
                      </span>
                    </div>

                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                        <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong>100% Offline:</strong> Cobra si se corta internet
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Boot en 4s:</strong> Cero cuelgues de Windows
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-mono text-[11px]">
                      COMANDAS ACTIVAS:
                    </span>
                    <div className="flex gap-1.5">
                      {(['mesa4', 'mesa7', 'barra'] as const).map((tId) => (
                        <button
                          key={tId}
                          type="button"
                          onClick={() => setActiveTable(tId)}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                            activeTable === tId
                              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 font-bold'
                              : 'bg-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {tId.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeature.id === 'speed' && (
                <motion.div
                  key="speed-mockup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="rounded-xl border border-purple-500/30 bg-neutral-950/90 p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-neutral-400">
                        AUDITORÍA GOOGLE LIGHTHOUSE OFICIAL:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuditing(true)
                          setTimeout(() => setIsAuditing(false), 800)
                        }}
                        className="flex items-center gap-1 text-[11px] font-mono text-purple-300 hover:text-purple-200 cursor-pointer"
                      >
                        <RotateCcw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                        <span>Re-testear</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Rendimiento', val: 100 },
                        { label: 'Accesibilidad', val: 100 },
                        { label: 'Prácticas', val: 100 },
                        { label: 'SEO Google', val: 100 },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40"
                        >
                          <div className="w-9 h-9 mx-auto rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-sm">
                            {isAuditing ? '...' : item.val}
                          </div>
                          <span className="text-[10px] text-neutral-300 mt-1 block">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-950/50 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Velocidad en red móvil (Rosario):</span>
                    <span className="text-purple-300 font-mono font-bold">
                      0.38 segundos (Instantáneo)
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PILL INFERIOR DE IDENTIFICACIÓN */}
          <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Código Propio Sin Plantillas
            </span>
            <span
              className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
              style={{
                color: activeFeature.accentColor,
                backgroundColor: `${activeFeature.accentColor}15`,
              }}
            >
              {activeFeature.tag}
            </span>
          </div>
        </div>

        {/* ==============================================================
            COLUMNA DERECHA: ACORDEÓN COMPACTO ESTILO GRAPHITE (42%)
           ============================================================== */}
        <div className="relative w-full lg:flex-[1_1_42%] flex flex-col justify-between gap-2.5">
          {FEATURES.map((feat, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={feat.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveIndex(index)
                  trackEvent('demo_interactive_used', { feature: feat.id })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveIndex(index)
                    trackEvent('demo_interactive_used', { feature: feat.id })
                  }
                }}
                className={`relative cursor-pointer rounded-xl border transition-all duration-200 text-left overflow-hidden ${
                  isActive
                    ? 'border-neutral-700 bg-neutral-900/95 flex-1 p-4 sm:p-5 flex flex-col justify-between shadow-lg'
                    : 'border-neutral-850 bg-neutral-950/60 hover:bg-neutral-900/40 hover:border-neutral-800 h-[60px] px-4 sm:px-5 flex items-center'
                }`}
              >
                {/* LÍNEA DE PROGRESO VERTICAL EN EL BORDE IZQUIERDO */}
                <div className="absolute left-3 top-3 bottom-3 w-1 bg-neutral-800 rounded-full overflow-hidden">
                  {isActive && (
                    <motion.div
                      className="w-full bg-white rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{
                        duration: AUTOPLAY_TIME / 1000,
                        ease: 'linear',
                      }}
                      key={`timer-${feat.id}-${activeIndex}`}
                    />
                  )}
                </div>

                <div className="pl-4 w-full">
                  {/* TÍTULO */}
                  <h3
                    className={`text-sm sm:text-base font-semibold transition-colors ${
                      isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {feat.title}
                  </h3>

                  {/* DESCRIPCIÓN Y CTA SÓLO CUANDO ESTÁ ACTIVO */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2"
                      >
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                          {feat.shortDescription}
                        </p>

                        <div className="mt-3 pt-2">
                          <a
                            href={feat.ctaHref}
                            target={feat.ctaHref.startsWith('http') ? '_blank' : undefined}
                            rel={
                              feat.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              trackEvent('hero_cta_demo_clicked', {
                                feature: feat.id,
                                href: feat.ctaHref,
                              })
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-cyan-300 transition-colors group"
                          >
                            <span>{feat.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default InteractiveFeatureShowcase
