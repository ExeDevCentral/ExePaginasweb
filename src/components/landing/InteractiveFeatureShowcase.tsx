/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Componente: InteractiveFeatureShowcase (Super Card 4 Pasos + Ventana Animada)
 *
 * Estructura solicitada:
 * - Columna Izquierda: 4 PASOS principales con selector de alta gama y docking pointer.
 * - Columna Derecha (Ventana ImagineArt):
 *   - Dock de píldoras frosted glass estilo ImagineArt ([ 01 ] [ 02 ] ...).
 *   - Barra láser animada sincronizada y delimitada al 100%.
 *   - Layout Split cinemático inspirado en ImagineArt:
 *     - Columna Visual (Mockup interactivo / Métrica / Telemetría real).
 *     - Columna de Contenido (Badge de categoría, título de gran impacto, explicación técnica de alta seriedad y garantías).
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import {
  Sparkles,
  Zap,
  Calendar,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Play,
  Pause,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
  Check,
  Clock,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Award,
  Rocket,
  FileCode,
  Target,
  BarChart3,
  Shield,
  Database,
  Server,
  Cpu,
  Activity,
  Globe,
  ArrowUpRight,
} from 'lucide-react'
import { trackEvent } from '@/core/analytics/trackEvent'

interface MainStep {
  id: string
  number: string
  title: string
  subtitle: string
  badge: string
  accentColor: string
}

const MAIN_STEPS: MainStep[] = [
  {
    id: 'cliente-nosotros',
    number: '01',
    title: 'El Cliente y Nosotros',
    subtitle: 'Quiénes somos, metodología y tiempos',
    badge: 'ATENCIÓN DIRECTA',
    accentColor: '#06b6d4',
  },
  {
    id: 'produccion-ejecucion',
    number: '02',
    title: 'Producción y Ejecución',
    subtitle: 'Arquitectura en vivo, pagos y código puro',
    badge: 'SISTEMAS REALES',
    accentColor: '#10b981',
  },
  {
    id: 'rendimiento-garantia',
    number: '03',
    title: 'Rendimiento & Garantía',
    subtitle: '0.38s en Google y 100% propiedad tuya',
    badge: 'CERO ALQUILERES',
    accentColor: '#f59e0b',
  },
  {
    id: 'publicidad-crecimiento',
    number: '04',
    title: 'Publicidad & Crecimiento',
    subtitle: 'Campañas que convierten el doble',
    badge: 'MÁQUINAS DE VENTAS',
    accentColor: '#a855f7',
  },
]

interface SubStage {
  id: string
  number: string
  label: string
  tag: string
  accentColor: string
  icon: React.ElementType
}

const STEP_SUBSTAGES: Record<number, SubStage[]> = {
  // 0: El Cliente y Nosotros
  0: [
    {
      id: 'c1',
      number: '01',
      label: 'Relevamiento',
      tag: 'MANO A MANO',
      accentColor: '#06b6d4',
      icon: PhoneCall,
    },
    {
      id: 'c2',
      number: '02',
      label: 'Presupuesto',
      tag: '1 SOLO PAGO',
      accentColor: '#10b981',
      icon: Award,
    },
    {
      id: 'c3',
      number: '03',
      label: '7-15 Días',
      tag: 'TIEMPO RÉCORD',
      accentColor: '#f59e0b',
      icon: Clock,
    },
    {
      id: 'c4',
      number: '04',
      label: 'Pruebas',
      tag: 'LINK PRIVADO',
      accentColor: '#22c55e',
      icon: FileCode,
    },
    {
      id: 'c5',
      number: '05',
      label: 'Lanzamiento',
      tag: '100% TUYO',
      accentColor: '#a855f7',
      icon: Rocket,
    },
  ],
  // 1: Producción y Ejecución (Seriedad Técnica y Pasos Reales)
  1: [
    {
      id: 'p1',
      number: '01',
      label: 'Next.js 16',
      tag: 'CÓDIGO PURO',
      accentColor: '#10b981',
      icon: FileCode,
    },
    {
      id: 'p2',
      number: '02',
      label: 'PostgreSQL',
      tag: 'SEGURIDAD RLS',
      accentColor: '#06b6d4',
      icon: Database,
    },
    {
      id: 'p3',
      number: '03',
      label: 'Cobros CBU',
      tag: '0% COMISIÓN',
      accentColor: '#f59e0b',
      icon: CreditCard,
    },
    {
      id: 'p4',
      number: '04',
      label: 'Despacho Cloud',
      tag: 'TIEMPO REAL',
      accentColor: '#22c55e',
      icon: Activity,
    },
    {
      id: 'p5',
      number: '05',
      label: 'Edge CDN',
      tag: 'CDN BUENOS AIRES',
      accentColor: '#a855f7',
      icon: Server,
    },
  ],
  // 2: Rendimiento & Garantía Total
  2: [
    {
      id: 'r1',
      number: '01',
      label: 'Google 100',
      tag: '100/100 VITALS',
      accentColor: '#f59e0b',
      icon: Search,
    },
    {
      id: 'r2',
      number: '02',
      label: '0.38s Carga',
      tag: 'INSTANTÁNEO',
      accentColor: '#06b6d4',
      icon: Zap,
    },
    {
      id: 'r3',
      number: '03',
      label: 'SSL 256',
      tag: 'CIFRADO TOTAL',
      accentColor: '#10b981',
      icon: Lock,
    },
    {
      id: 'r4',
      number: '04',
      label: 'Código Propio',
      tag: 'SIN ATADURAS',
      accentColor: '#a855f7',
      icon: ShieldCheck,
    },
    {
      id: 'r5',
      number: '05',
      label: 'Soporte 24/7',
      tag: 'SOPORTE 24/7',
      accentColor: '#22c55e',
      icon: Award,
    },
  ],
  // 3: Publicidad & Crecimiento
  3: [
    {
      id: 'm1',
      number: '01',
      label: 'Píxel Meta',
      tag: 'TRACKING 100%',
      accentColor: '#a855f7',
      icon: Target,
    },
    {
      id: 'm2',
      number: '02',
      label: '0% Rebote',
      tag: '0% REBOTE',
      accentColor: '#06b6d4',
      icon: Zap,
    },
    {
      id: 'm3',
      number: '03',
      label: 'Embudo 1 Clic',
      tag: 'ALTA CONVERSIÓN',
      accentColor: '#10b981',
      icon: TrendingUp,
    },
    {
      id: 'm4',
      number: '04',
      label: 'Retargeting CRM',
      tag: 'AUTOMATIZADO',
      accentColor: '#22c55e',
      icon: Target,
    },
    {
      id: 'm5',
      number: '05',
      label: 'ROAS 2X',
      tag: 'MÁQUINA DE VENTAS',
      accentColor: '#f59e0b',
      icon: BarChart3,
    },
  ],
}

export const InteractiveFeatureShowcase: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  // Paso principal seleccionado en la columna izquierda (1 de 4)
  const [activeMainStep, setActiveMainStep] = useState(0)

  // Sub-etapa del circuito láser actual (1 de 5)
  const [laserIdx, setLaserIdx] = useState(0)
  const [isLaserPaused, setIsLaserPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const STEP_DURATION = 4200 // 4.2 segundos por sub-etapa

  // Timer fluido continuo que avanza por las 5 sub-etapas y al terminar la 5ta salta automáticamente al siguiente paso principal
  useEffect(() => {
    if (isLaserPaused) return

    const startTime = Date.now()

    const timer = setInterval(() => {
      const diff = Date.now() - startTime
      if (diff >= STEP_DURATION) {
        setElapsed(0)
        const total = STEP_SUBSTAGES[activeMainStep]?.length ?? 5
        setLaserIdx((prev) => {
          if (prev + 1 >= total) {
            // Completó todas las subetapas del paso principal actual -> avanza automáticamente al siguiente paso principal
            const nextStep = (activeMainStep + 1) % MAIN_STEPS.length
            setActiveMainStep(nextStep)
            return 0
          }
          return prev + 1
        })
      } else {
        setElapsed(diff)
      }
    }, 40)

    return () => clearInterval(timer)
  }, [activeMainStep, isLaserPaused, laserIdx])

  const currentMain = MAIN_STEPS[activeMainStep] ?? MAIN_STEPS[0]!
  const currentSubStages = STEP_SUBSTAGES[activeMainStep] ?? STEP_SUBSTAGES[0]!
  const totalStages = currentSubStages.length
  // Progreso continuo acumulado a lo largo de todo el circuito (0% a 100%)
  const continuousProgress = ((laserIdx + Math.min(elapsed / STEP_DURATION, 1)) / totalStages) * 100

  return (
    <section
      id="super-card-showcase"
      aria-label="Super Card de ExePaginasWeb"
      className={`relative w-full max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 select-none ${className}`}
    >
      {/* CABECERA EXPLICATIVA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Metodología & Plataformas en Vivo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Así transformamos tu negocio en{' '}
            <span className="text-cyan-600 dark:text-cyan-400">ExePaginasWeb.com</span>
          </h2>
        </div>

        <span className="hidden sm:inline-block font-mono text-xs text-neutral-400">
          Elegí un paso a la izquierda para ver su simulación interactiva
        </span>
      </div>

      {/* ==============================================================
          ESTRUCTURA PRINCIPAL: 4 PASOS (IZQUIERDA) + VENTANA IMAGINEART (DERECHA)
         ============================================================== */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#070a13] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col lg:flex-row min-h-[720px] lg:h-[750px]">
        {/* ==============================================================
            COLUMNA IZQUIERDA (36%): LOS 4 PASOS CON DISEÑO DE ALTA GAMA (MODO CLARO Y OSCURO)
           ============================================================== */}
        <div className="relative w-full lg:flex-[0_0_36%] p-6 sm:p-7 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-neutral-800/80 flex flex-col justify-between bg-[#F2ECE1] dark:bg-[#080d1a]/95 z-20">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <Logo size={26} />
                <div>
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block tracking-wide">
                    ExePaginasWeb
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-neutral-400 block">
                    // 4 PASOS PRINCIPALES
                  </span>
                </div>
              </div>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono text-xs">
                {activeMainStep + 1} DE 4 ACTIVO
              </span>
            </div>

            {MAIN_STEPS.map((step, idx) => {
              const isActive = idx === activeMainStep

              return (
                <div
                  key={step.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setActiveMainStep(idx)
                    setLaserIdx(0)
                    setElapsed(0)
                    trackEvent('main_step_selected', { step: step.id })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveMainStep(idx)
                      setLaserIdx(0)
                      setElapsed(0)
                    }
                  }}
                  className={`relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl transition-all duration-300 cursor-pointer text-left overflow-hidden ${
                    isActive
                      ? 'bg-cyan-50/90 dark:bg-[#0c2438] dark:bg-gradient-to-r dark:from-[#0c2438] dark:via-[#0c1e30] dark:to-[#08121f] border-2 border-cyan-600 dark:border-cyan-400/90 shadow-md shadow-cyan-600/10 dark:shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-600/20 dark:ring-cyan-400/20 scale-[1.01]'
                      : 'bg-white dark:bg-[#091122]/70 hover:bg-[#FAF7F2] dark:hover:bg-[#0d1830] border border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:scale-[1.005] group'
                  }`}
                >
                  {/* BARRITA DE LUZ NEÓN LATERAL CUANDO ESTÁ ACTIVO */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
                  )}

                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0 transition-all ${
                        isActive
                          ? 'bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-600 dark:border-cyan-400/60 shadow-xs'
                          : 'bg-slate-200/90 text-slate-800 dark:bg-neutral-900 dark:text-neutral-400 border border-slate-300 dark:border-neutral-800 group-hover:text-slate-900 dark:group-hover:text-neutral-200 group-hover:border-slate-400 dark:group-hover:border-neutral-700'
                      }`}
                    >
                      {step.number}
                    </span>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-base sm:text-lg font-bold tracking-tight truncate transition-colors ${
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-800 dark:text-neutral-200 group-hover:text-slate-950 dark:group-hover:text-white'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isActive ? (
                          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 text-cyan-900 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-400/40">
                            ETAPA {laserIdx + 1}/5
                          </span>
                        ) : idx < activeMainStep ? (
                          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3" /> LISTO
                          </span>
                        ) : idx === (activeMainStep + 1) % MAIN_STEPS.length ? (
                          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 dark:text-neutral-500 font-semibold">
                            SIGUIENTE
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={`text-xs sm:text-sm truncate mt-0.5 transition-colors ${
                          isActive
                            ? 'text-cyan-950 dark:text-cyan-100/90 font-medium'
                            : 'text-slate-600 dark:text-neutral-400 group-hover:text-slate-800 dark:group-hover:text-neutral-300'
                        }`}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* FLECHA INDICADORA TRIANGULAR APUNTANDO A LA VENTANA DERECHA */}
                  {isActive ? (
                    <motion.div
                      layoutId="mainActivePointerArrow"
                      className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[11px] border-y-transparent border-l-[14px] border-l-cyan-500 dark:border-l-cyan-400 z-30 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-neutral-600 group-hover:text-slate-700 dark:group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-neutral-800/80 flex items-center justify-between font-mono text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            <span>Hacé clic en cualquier paso</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentMain.badge}</span>
          </div>
        </div>

        {/* ==============================================================
            COLUMNA DERECHA (64%): LA VENTANA IMAGINEART SPLIT SHOWCASE (MODO CLARO Y OSCURO)
           ============================================================== */}
        <div
          onMouseEnter={() => setIsLaserPaused(true)}
          onMouseLeave={() => setIsLaserPaused(false)}
          className="relative w-full lg:flex-[1_1_64%] p-6 sm:p-8 lg:p-9 flex flex-col justify-between overflow-hidden bg-[#FAF7F2] dark:bg-[#070c18] bg-gradient-to-b from-[#FAF7F2] via-white to-[#F2ECE1] dark:from-[#0a0f20] dark:via-[#070c18] dark:to-[#04060c]"
        >
          {/* LUZ AMBIENTAL AMBILIGHT VIBRANTE */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full blur-[140px] opacity-25 dark:opacity-30 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 60% 40%, ${currentMain.accentColor}40, transparent 70%)`,
            }}
          />

          {/* ==============================================================
              CABECERA MINIMALISTA Y SEGMENTED CONTROL EJECUTIVO
             ============================================================== */}
          <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-neutral-800/80">
            <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: currentMain.accentColor }}
                />
                <span className="text-slate-900 dark:text-white font-bold truncate">
                  {currentMain.number} // {currentMain.title}
                </span>
                <span className="text-slate-500 dark:text-neutral-400 hidden md:inline truncate">
                  — {currentMain.subtitle}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 hidden sm:inline">
                  Paso {activeMainStep + 1} de 4
                </span>
                <button
                  type="button"
                  onClick={() => setIsLaserPaused(!isLaserPaused)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 cursor-pointer transition-colors font-sans text-xs"
                >
                  {isLaserPaused ? (
                    <Play className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Pause className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  )}
                  <span>{isLaserPaused ? 'Reanudar' : 'Pausa'}</span>
                </button>
              </div>
            </div>

            {/* SEGMENTED CONTROL DE ETAPAS CON PROGRESO INTEGRADO */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-neutral-900/80 border border-slate-200/80 dark:border-neutral-800">
                {currentSubStages.map((stg, i) => {
                  const isCurrent = i === laserIdx
                  const StgIcon = stg.icon

                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => {
                        setLaserIdx(i)
                        setElapsed(0)
                      }}
                      className={`relative flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg font-mono text-[11px] sm:text-xs transition-colors duration-150 cursor-pointer min-w-0 ${
                        isCurrent
                          ? 'bg-white text-slate-900 dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium'
                      }`}
                    >
                      <StgIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{stg.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* LÍNEA DE PROGRESO DISCRETA Y ELEGANTE */}
              <div className="w-full h-0.5 bg-slate-200 dark:bg-neutral-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-75"
                  style={{
                    width: `${Math.max(2, continuousProgress)}%`,
                    transition: isLaserPaused ? 'none' : 'width 50ms linear',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==============================================================
              SPLIT SHOWCASE CARD CINEMÁTICO ESTILO IMAGINEART
             ============================================================== */}
          <div className="my-auto py-2">
            <AnimatePresence mode="wait">
              {/* ==========================================================
                  PASO 01: EL CLIENTE Y NOSOTROS (5 SUB-ETAPAS)
                 ========================================================== */}
              {activeMainStep === 0 && (
                <motion.div
                  key={`p0-${laserIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-[#080d1a] p-5 sm:p-6 shadow-md dark:shadow-2xl"
                >
                  {laserIdx === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Lado Izquierdo: Mockup Visual ImagineArt */}
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-[#FAF7F2] dark:bg-[#09182d] dark:bg-gradient-to-br dark:from-[#09182d] dark:to-[#040d1a] p-4.5 space-y-3 shadow-inner">
                        <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-cyan-500/20">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5" />
                            Llamada Directa
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            EN VIVO
                          </span>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#071322] border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 p-1.5 relative group">
                            <Logo size={36} variant="dark" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 shadow-[0_0_8px_#34d399]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                                Exequiel Echevarria
                              </h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <p className="text-[11px] text-neutral-400 font-mono">
                              Fundador & Arquitecto de Software · ExePaginasWeb
                            </p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 text-xs font-mono space-y-1">
                          <div className="flex justify-between text-neutral-400 text-[11px]">
                            <span>Tiempo de diagnóstico:</span>
                            <span className="text-cyan-400 font-bold">15 minutos</span>
                          </div>
                          <div className="flex justify-between text-neutral-400 text-[11px]">
                            <span>Canal:</span>
                            <span className="text-emerald-400 font-bold">WhatsApp / Meet</span>
                          </div>
                        </div>
                      </div>

                      {/* Lado Derecho: Contenido Editorial y Propuesta */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 dark:border-cyan-400/30">
                          <Sparkles className="w-3.5 h-3.5" />
                          RELEVAMIENTO EXPRESS · SIN INTERMEDIARIOS
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Hablás mano a mano con quien escribe tu código
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Sin ejecutivos de ventas ni pasamanos de agencias. En 15 minutos
                          identificamos exactamente qué necesita tu negocio para vender más por
                          internet y automatizar sus reservas.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 0 Pasamanos
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Diagnóstico Claro
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-neutral-900 border border-cyan-200 dark:border-neutral-800 text-cyan-800 dark:text-cyan-300">
                            ✓ Sin Tecnicismos
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            Contrato Digital Fijo
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            CERRADO
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[11px] text-neutral-400 block">
                              DESARROLLO COMPLETO
                            </span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              1 Solo Pago Final
                            </span>
                            <span className="text-emerald-400 text-[11px] block mt-1">
                              Cero costos sorpresa
                            </span>
                          </div>
                          <div className="flex justify-between p-2 rounded-lg bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 text-[11px]">
                            <span className="text-neutral-400">Mensualidad por uso:</span>
                            <span className="text-emerald-400 font-bold">$0,00 ARS</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <Award className="w-3.5 h-3.5" />
                          TRANSPARENCIA TOTAL · SIN LETRA CHICA
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Presupuesto exacto antes de empezar la obra
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Te cotizamos un valor cerrado por la solución llave en mano. Sabés
                          exactamente cuánto invertís y qué vas a recibir, sin aumentos imprevistos
                          ni comisiones ocultas por venta.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 1 Solo Pago
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 0% Comisiones
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Factura Oficial
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-amber-500/30 bg-[#FAF7F2] dark:bg-[#241707] dark:bg-gradient-to-br dark:from-[#241707] dark:to-[#100a03] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-500/20">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Velocidad de Despliegue
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                            7 A 15 DÍAS
                          </span>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div>
                            <div className="flex justify-between text-neutral-400 text-[11px] mb-1">
                              <span>Agencias tradicionales</span>
                              <span className="text-red-400 font-bold">60 a 90 días</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                              <div className="h-full bg-red-500/70 rounded-full w-[85%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-emerald-300 text-[11px] mb-1">
                              <span className="font-bold">ExePaginasWeb</span>
                              <span className="text-emerald-400 font-bold">7 a 15 días</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[25%] shadow-[0_0_10px_#10b981]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border border-amber-500/30 dark:border-amber-400/30">
                          <Clock className="w-3.5 h-3.5" />
                          CRONOGRAMA RÉCORD · SIN DEMORAS
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Tu web funcionando en 7 a 15 días garantizados
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          No te hacemos perder meses en reuniones interminables. Usamos una
                          arquitectura de código moderna que nos permite entregar tu sistema
                          funcionando en tiempo récord.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Entregas Rápidas
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Sin Demoras
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-neutral-800 text-amber-800 dark:text-amber-300">
                            ✓ Puntualidad Total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-emerald-500/40 bg-gradient-to-br from-[#071c14] to-[#040e0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5" />
                            Entorno Staging Privado
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            PRIVADO
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                            <Globe className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="truncate">demo-privada.exepaginasweb.com</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px]">
                            <span className="text-neutral-400">Pruebas en vivo:</span>
                            <span className="text-emerald-400 font-bold">100% Calibrado</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <FileCode className="w-3.5 h-3.5" />
                          TESTING EN VIVO · ANTES DEL LANZAMIENTO
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Probás todo en tu celular antes de que salga al público
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Te enviamos un enlace privado para que toques cada botón, hagas reservas
                          de prueba y veas cómo llega el WhatsApp. No se publica hasta que estés
                          100% conforme.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Link Privado
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Pruebas Reales
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ 100% a Gusto
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-[#FAF7F2] dark:bg-[#1b0d2a] dark:bg-gradient-to-br dark:from-[#1b0d2a] dark:to-[#0c0614] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-500/20">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <Rocket className="w-3.5 h-3.5" />
                            Lanzamiento Oficial
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                            ACTIVO
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-purple-300 block">DOMINIO</span>
                            <span className="text-white font-bold block truncate mt-0.5">
                              tunegocio.com
                            </span>
                            <span className="text-[10px] text-emerald-400 block mt-1">
                              SSL 256 Activo
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-purple-300 block">COBROS</span>
                            <span className="text-emerald-400 font-bold block truncate mt-0.5">
                              Directo CBU
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              0% comisión
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30 dark:border-purple-400/30">
                          <Rocket className="w-3.5 h-3.5" />
                          LLAVE EN MANO · FACTURANDO DESDE EL PRIMER DÍA
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Te entregamos la plataforma lista para recibir clientes
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Con el dominio configurado, el panel en tu celular y los cobros
                          acreditándose directamente en tu banco. El código fuente es 100% de tu
                          propiedad para siempre.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Código Propio
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Sin Alquileres
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-neutral-900 border border-purple-200 dark:border-neutral-800 text-purple-800 dark:text-purple-300">
                            ✓ Listo para Usar
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ==========================================================
                  PASO 02: PRODUCCIÓN Y EJECUCIÓN (SERIEDAD Y PASOS REALES)
                 ========================================================== */}
              {activeMainStep === 1 && (
                <motion.div
                  key={`p1-${laserIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-[#080d1a] p-5 sm:p-6 shadow-md dark:shadow-2xl"
                >
                  {laserIdx === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            Next.js 16 Edge SSR
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            48 KB BUNDLE
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[11px] text-neutral-400 block">COMPILACIÓN</span>
                            <span className="text-slate-900 dark:text-white font-bold block mt-0.5">
                              SSR Instantáneo (Edge)
                            </span>
                            <span className="text-emerald-400 text-[11px] block mt-1">
                              60 FPS garantizados
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800 text-[11px] flex justify-between">
                            <span className="text-neutral-400">Código basura:</span>
                            <span className="text-emerald-400 font-bold">0% WordPress</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <FileCode className="w-3.5 h-3.5" />
                          ARQUITECTURA SERVER-SIDE · NEXT.JS 16
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Código puro de nivel empresarial sin plantillas basura
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Desarrollado en React 19 y Next.js 16. Tu web se compila en el servidor
                          para volar en cualquier dispositivo móvil sin demoras, eliminando plugins
                          pesados y vulnerabilidades.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Server-Side Rendering
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 0 Plugins Basura
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Máxima Velocidad
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#08182b] to-[#040e1a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-cyan-500/20">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5" />
                            PostgreSQL Supabase
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold">
                            12ms PING
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-cyan-300 block">SEGURIDAD</span>
                            <span className="text-slate-900 dark:text-white font-bold block mt-0.5">
                              RLS Activo
                            </span>
                            <span className="text-[10px] text-cyan-400 block mt-1">AES-256</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-cyan-300 block">RESPALDO</span>
                            <span className="text-emerald-400 font-bold block mt-0.5">
                              Backups 24h
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              Automático
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 dark:border-cyan-400/30">
                          <Shield className="w-3.5 h-3.5" />
                          BASE DE DATOS RELACIONAL · ALTA SEGURIDAD
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Tus clientes y reservas blindados en PostgreSQL
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Aislamiento de datos con Row Level Security y copias de seguridad
                          automáticas diarias. Nadie accede a tu información y el sistema soporta
                          alta concurrencia sin caídas.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Row Level Security
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Backups Diarios
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-neutral-900 border border-cyan-200 dark:border-neutral-800 text-cyan-800 dark:text-cyan-300">
                            ✓ Cifrado AES-256
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-amber-500/30 bg-[#FAF7F2] dark:bg-[#241707] dark:bg-gradient-to-br dark:from-[#241707] dark:to-[#100a03] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-500/20">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            Acreditación Inmediata
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            0% COMISIÓN
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-1 text-xs">
                          <span className="text-[11px] text-neutral-400 block">SEÑA RECIBIDA</span>
                          <span className="text-2xl font-black text-slate-900 dark:text-white block">
                            + $ 10.000,00{' '}
                            <span className="text-xs font-normal text-emerald-400">ARS</span>
                          </span>
                          <div className="flex justify-between pt-1 border-t border-neutral-800 text-[11px]">
                            <span className="text-neutral-400">Destino:</span>
                            <span className="text-emerald-400 font-bold">Tu CBU o Alias</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border border-amber-500/30 dark:border-amber-400/30">
                          <CreditCard className="w-3.5 h-3.5" />
                          INTEGRACIÓN BANCARIA · COBROS DIRECTOS
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Cobros y señas acreditados directo en tu cuenta bancaria
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Validación automática de transferencias y pagos con QR. El dinero va 100%
                          a tu cuenta bancaria sin retenciones de plataformas intermediarias,
                          confirmando el turno al instante.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Directo a tu CBU
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 0% Comisiones
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-neutral-800 text-amber-800 dark:text-amber-300">
                            ✓ Bloqueo en 0.2s
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            Webhook Event Dispatcher
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            EN 2s
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0b2619] border border-emerald-500/30 text-neutral-100 space-y-1 font-sans text-xs">
                          <span className="font-mono text-[10px] text-emerald-300 font-bold block">
                            Notificación Automática ✓✓
                          </span>
                          <p className="leading-relaxed">
                            «¡Hola Juan! 👋 Tu turno está <strong>CONFIRMADO</strong>. Seña
                            acreditada con éxito. Te esperamos.»
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-400/30">
                          <Activity className="w-3.5 h-3.5" />
                          EVENT-DRIVEN · CONFIRMACIÓN EN 2 SEGUNDOS
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Notificación instantánea y confirmación automática
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Conectado con la API oficial de WhatsApp. Tu cliente recibe el comprobante
                          y la ubicación en su chat en 2 segundos, reduciendo ausencias a
                          prácticamente cero.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Envío en 2s
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ WhatsApp Cloud API
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Cero Ausencias
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-[#FAF7F2] dark:bg-[#1b0d2a] dark:bg-gradient-to-br dark:from-[#1b0d2a] dark:to-[#0c0614] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-500/20">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5" />
                            Servidores Edge Globales
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                            99.99% UPTIME
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-purple-300 block">UBICACIÓN</span>
                            <span className="text-slate-900 dark:text-white font-bold block mt-0.5">
                              Buenos Aires CDN
                            </span>
                            <span className="text-[10px] text-emerald-400 block mt-1">
                              &lt; 15ms Latencia
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-purple-300 block">
                              DISPONIBILIDAD
                            </span>
                            <span className="text-emerald-400 font-bold block mt-0.5">
                              24/7 En Línea
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              Cero caídas
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30 dark:border-purple-400/30">
                          <Server className="w-3.5 h-3.5" />
                          DESPLIEGUE CLOUD · ALTA DISPONIBILIDAD
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Infraestructura en la nube que soporta miles de visitas
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Alojado en redes perimetrales (Edge CDN) con nodos en Buenos Aires. Tu web
                          no se cae en fechas de alta demanda publicitaria y responde en
                          milisegundos.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 99.99% Uptime
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Red Perimetral
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-neutral-900 border border-purple-200 dark:border-neutral-800 text-purple-800 dark:text-purple-300">
                            ✓ Resistencia al Tráfico
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ==========================================================
                  PASO 03: RENDIMIENTO & GARANTÍA TOTAL (5 SUB-ETAPAS)
                 ========================================================== */}
              {activeMainStep === 2 && (
                <motion.div
                  key={`p2-${laserIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl border border-slate-200 dark:border-amber-500/30 bg-white dark:bg-[#080d1a] p-5 sm:p-6 shadow-md dark:shadow-2xl"
                >
                  {laserIdx === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-amber-500/30 bg-[#FAF7F2] dark:bg-[#241707] dark:bg-gradient-to-br dark:from-[#241707] dark:to-[#100a03] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-500/20">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" />
                            Google Lighthouse
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            100/100
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          {[
                            { label: 'Rendimiento', val: '100/100' },
                            { label: 'Accesibilidad', val: '100/100' },
                            { label: 'Prácticas', val: '100/100' },
                            { label: 'SEO Google', val: '100/100' },
                          ].map((m) => (
                            <div
                              key={m.label}
                              className="p-2 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 flex items-center justify-between px-2.5"
                            >
                              <span className="text-[11px] text-neutral-300 truncate">
                                {m.label}
                              </span>
                              <span className="text-emerald-400 font-bold text-[11px]">
                                {m.val}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border border-amber-500/30 dark:border-amber-400/30">
                          <Award className="w-3.5 h-3.5" />
                          AUDITORÍA OFICIAL · 100/100 EN GOOGLE
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Puntaje perfecto en Google Core Web Vitals
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Auditado bajo los estándares oficiales de Google. Al no tener código
                          basura ni plantillas lentas, Google premia tu web ubicándola por encima de
                          tus competidores locales.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 100 Rendimiento
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 100 SEO Local
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-neutral-900 border border-amber-200 dark:border-neutral-800 text-amber-800 dark:text-amber-300">
                            ✓ Auditoría Pública
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#08182b] to-[#040e1a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-cyan-500/20">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Velocidad de Carga
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold">
                            0.38 SEGUNDOS
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <div className="flex justify-between text-neutral-400 text-[11px] mb-1">
                              <span>Web tradicional (WordPress)</span>
                              <span className="text-red-400 font-bold">4.8s (53% abandona)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                              <div className="h-full bg-red-500/70 rounded-full w-[90%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-emerald-300 text-[11px] mb-1">
                              <span className="font-bold">ExePaginasWeb (Next.js)</span>
                              <span className="text-emerald-400 font-bold">
                                0.38s (Instantáneo)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-[12%] shadow-[0_0_10px_#10b981]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 dark:border-cyan-400/30">
                          <Zap className="w-3.5 h-3.5" />
                          VELOCIDAD EXTREMA · APERTURA EN 0.38S
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Carga al instante en cualquier teléfono móvil
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          El usuario no experimenta pantallas en blanco ni esperas. Toca tu enlace o
                          anuncio y el catálogo o turnero ya está completamente desplegado para
                          comprar.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Carga Instantánea
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Cero Esperas
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-neutral-900 border border-cyan-200 dark:border-neutral-800 text-cyan-800 dark:text-cyan-300">
                            ✓ Retención del 99%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Certificado de Blindaje
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            SSL 256-BIT
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-neutral-400 block">ENCRIPTACIÓN</span>
                            <span className="text-slate-900 dark:text-white font-bold block mt-0.5">
                              HTTPS Bancario
                            </span>
                            <span className="text-[10px] text-emerald-400 block mt-1">
                              Candado Activo
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-neutral-400 block">FIREWALL</span>
                            <span className="text-emerald-400 font-bold block mt-0.5">
                              Anti-DDoS
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              Cero brechas
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <Lock className="w-3.5 h-3.5" />
                          SEGURIDAD SSL & BLINDAJE CONTRA ATAQUES
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Cifrado de grado bancario para tus transacciones
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Tus clientes pagan y reservan con la tranquilidad de estar bajo los
                          protocolos de cifrado más exigentes del mercado. Cero filtraciones y
                          reputación intachable.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Certificado SSL
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Firewall WAF
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Datos Blindados
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-[#FAF7F2] dark:bg-[#1b0d2a] dark:bg-gradient-to-br dark:from-[#1b0d2a] dark:to-[#0c0614] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-500/20">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Propiedad vs Alquiler
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                            100% TUYO
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30">
                            <span className="text-[10px] text-red-400 font-bold block">
                              PLATAFORMAS SAAS
                            </span>
                            <span className="text-neutral-300 block text-[11px] mt-0.5">
                              Pagás de por vida. Si no pagás, apagan tu web.
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Logo size={14} variant="dark" />
                              <span className="text-[10px] text-emerald-400 font-bold block">
                                CON EXEPAGINASWEB
                              </span>
                            </div>
                            <span className="text-emerald-200 block text-[11px]">
                              1 solo pago. Código y clientes 100% tuyos siempre.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30 dark:border-purple-400/30">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          CERO ALQUILERES · EL CÓDIGO ES TU ACTIVO
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          El software es un activo patrimonial de tu empresa
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          No alquilás una plantilla enlatada. Te entregamos el repositorio en GitHub
                          con control de versiones y la base de datos de tu negocio para que nunca
                          más dependas de mensualidades abusivas.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Repositorio GitHub
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Cero Mensualidades
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-neutral-900 border border-purple-200 dark:border-neutral-800 text-purple-800 dark:text-purple-300">
                            ✓ Libertad Total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            Garantía & Monitoreo
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            ACTIVO 24/7
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-white font-bold">
                              WhatsApp Directo con Exequiel
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 font-sans">
                            Soporte técnico directo sin tickets ni robots para cualquier ampliación
                            o consulta.
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <Award className="w-3.5 h-3.5" />
                          ACOMPAÑAMIENTO REAL · TRATO DIRECTO
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Garantía de funcionamiento y soporte continuo
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Tu negocio no se queda solo después de la entrega. Tenés mi contacto
                          directo para garantizar estabilidad técnica y resolver cualquier necesidad
                          sobre la marcha.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Soporte Directo
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Monitoreo 24/7
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Respaldo Total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ==========================================================
                  PASO 04: PUBLICIDAD & CRECIMIENTO (5 SUB-ETAPAS)
                 ========================================================== */}
              {activeMainStep === 3 && (
                <motion.div
                  key={`p3-${laserIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl border border-slate-200 dark:border-purple-500/30 bg-white dark:bg-[#080d1a] p-5 sm:p-6 shadow-md dark:shadow-2xl"
                >
                  {laserIdx === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-[#FAF7F2] dark:bg-[#1b0d2a] dark:bg-gradient-to-br dark:from-[#1b0d2a] dark:to-[#0c0614] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-500/20">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            Tracking Pixel Meta
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                            100% MEDIDO
                          </span>
                        </div>
                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="p-2 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                            <span className="text-purple-300 font-bold flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                              ViewContent
                            </span>
                            <span className="text-neutral-400 text-[10px]">Visitas</span>
                          </div>
                          <div className="p-2 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                            <span className="text-cyan-300 font-bold flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              Checkout
                            </span>
                            <span className="text-neutral-400 text-[10px]">Turnos</span>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Purchase
                            </span>
                            <span className="text-emerald-300 text-[10px] font-bold">
                              100% Señas
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30 dark:border-purple-400/30">
                          <Target className="w-3.5 h-3.5" />
                          CONFIGURACIÓN DEL PÍXEL · META & GOOGLE
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Medición científica de cada peso invertido en anuncios
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Configuramos los eventos de conversión para que el algoritmo de Meta y
                          Google aprenda quiénes son tus clientes más rentables y optimice tu costo
                          de adquisición.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Píxel de Meta
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Google Tag Manager
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-neutral-900 border border-purple-200 dark:border-neutral-800 text-purple-800 dark:text-purple-300">
                            ✓ ROI Medido
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#08182b] to-[#040e1a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-cyan-500/20">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            Retención en Publicidad
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            99.2% ACTIVA
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 space-y-1 text-xs">
                          <span className="text-[11px] text-neutral-400 block">EN WEBS LENTAS</span>
                          <span className="text-red-400 font-bold block">
                            53% abandona antes de abrir
                          </span>
                          <span className="text-emerald-400 font-bold block text-[11px] pt-1 border-t border-neutral-800">
                            En ExePaginasWeb: 0% Rebote
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 dark:border-cyan-400/30">
                          <Zap className="w-3.5 h-3.5" />
                          ATERRIZAJE EN 0.38S · CERO DINERO PERDIDO
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Tu presupuesto publicitario rinde el doble sin rebotes
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          En plataformas lentas la mitad de la gente que toca tu anuncio se va antes
                          de ver tu producto. Con nuestra apertura en 0.38s aprovechás el 100% de
                          cada clic pagado.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 0% Rebotes
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Presupuesto Eficiente
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-cyan-50 dark:bg-neutral-900 border border-cyan-200 dark:border-neutral-800 text-cyan-800 dark:text-cyan-300">
                            ✓ Rinde el Doble
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Embudo Acelerado
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            &lt; 30s
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 flex justify-between">
                            <span>1. Ve tu oferta</span>
                            <span className="text-cyan-400 font-bold">0.38s</span>
                          </div>
                          <div className="p-2 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 flex justify-between">
                            <span>2. Elige el turno</span>
                            <span className="text-amber-400 font-bold">1 clic</span>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex justify-between text-emerald-300 font-bold">
                            <span>3. Paga la seña</span>
                            <span>Directo</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 dark:border-emerald-400/30">
                          <TrendingUp className="w-3.5 h-3.5" />
                          EMBUDO EN 1 CLIC · ALTA CONVERSIÓN
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Eliminamos la fricción para que compren en el acto
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Sin registros largos ni formularios engorrosos. El usuario pasa del
                          anuncio a la confirmación de su seña en menos de 30 segundos directamente
                          en su smartphone.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ 1 Solo Clic
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Sin Fricción
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ Máxima Venta
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-[#FAF7F2] dark:bg-[#061e16] dark:bg-gradient-to-br dark:from-[#061e16] dark:to-[#030d0a] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-500/20">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            Recuperación Automática
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            +35% CIERRES
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0b2619] border border-emerald-500/30 text-neutral-100 space-y-1 font-sans text-xs">
                          <span className="font-mono text-[10px] text-emerald-300 font-bold block">
                            Mensaje Inteligente de Rescate
                          </span>
                          <p className="leading-relaxed">
                            «¡Hola Juan! Vimos que estabas reservando para el Viernes. ¿Tuviste
                            alguna duda con el pago? Avisame y te lo guardo.»
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-400/30">
                          <Target className="w-3.5 h-3.5" />
                          AUTOMATIZACIÓN CRM · RECUPERACIÓN DE CLIENTES
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Recuperamos los carritos y turnos indecisos
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Si un cliente se distrae antes de transferir la seña, el sistema envía un
                          recordatorio automático cordial por WhatsApp, recuperando hasta el 35% de
                          ventas perdidas.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Rescate Automático
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Trato Cordial
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-neutral-900 border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-300">
                            ✓ +35% Ventas
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {laserIdx === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-5 rounded-xl border border-slate-200 dark:border-purple-500/30 bg-[#FAF7F2] dark:bg-[#1b0d2a] dark:bg-gradient-to-br dark:from-[#1b0d2a] dark:to-[#0c0614] p-4.5 space-y-3 shadow-inner font-mono">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-purple-500/20">
                          <span className="text-purple-400 font-bold flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Retorno Publicitario
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                            ROAS 2.4X
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-neutral-400 block">INVERSIÓN</span>
                            <span className="text-slate-900 dark:text-white font-bold block mt-0.5">
                              $ 100.000
                            </span>
                            <span className="text-[10px] text-purple-300 block mt-1">
                              En Anuncios
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800">
                            <span className="text-[10px] text-emerald-400 block">FACTURADO</span>
                            <span className="text-emerald-400 font-bold block mt-0.5">
                              $ 240.000
                            </span>
                            <span className="text-[10px] text-emerald-300 block mt-1">
                              Multiplicador 2.4x
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-mono text-xs font-bold border border-purple-500/30 dark:border-purple-400/30">
                          <BarChart3 className="w-3.5 h-3.5" />
                          MÁQUINA DE VENTAS · RETORNO PREDECIBLE
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                          Transformamos tu sitio en un motor predecible de ingresos
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
                          Una web que carga en 0.38s, cobra directo al banco y recupera carritos por
                          WhatsApp convierte a cada visitante en cliente, amortizando la inversión
                          en pocas semanas.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ ROAS 2X a 3X
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                            ✓ Ingresos Predecibles
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-neutral-900 border border-purple-200 dark:border-neutral-800 text-purple-800 dark:text-purple-300">
                            ✓ Escala Continua
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ==============================================================
              PIE INFERIOR DE LA VENTANA DERECHA
             ============================================================== */}
          <div className="pt-3 border-t border-slate-200 dark:border-neutral-800/80 flex items-center justify-between font-mono text-xs text-slate-500 dark:text-neutral-400 pr-24 sm:pr-28">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" />
              <span>
                Etapa {laserIdx + 1} de {currentSubStages.length} ·{' '}
                {currentSubStages[laserIdx]?.tag}
              </span>
            </span>

            <span className="text-slate-500 dark:text-neutral-400 hidden sm:inline">
              {isLaserPaused ? 'Pausado' : 'Rotación continua'}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER CALL-OUT DE CONVERSIÓN & SOPORTE (MODO CLARO Y OSCURO) */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800/90 font-mono text-xs text-slate-700 dark:text-neutral-300 shadow-md dark:shadow-xl">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>¿Querés un diagnóstico inmediato de arquitectura para tu negocio?</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <Link
            href="/soluciones"
            className="text-slate-600 hover:text-slate-950 dark:text-neutral-400 dark:hover:text-white font-medium flex items-center gap-1 transition-colors hover:underline text-xs"
          >
            <span>Ver Soluciones</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/5493412799385?text=Hola%20Exequiel!%20Estuve%20viendo%20la%20Super%20Card%20interactiva%20en%20ExePaginasWeb%20y%20quiero%20cotizar%20mi%20proyecto."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('hero_cta_contact_clicked', { source: 'super_card_footer' })}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 hover:scale-105 active:scale-95"
          >
            <span>Solicitar Diagnóstico Técnico</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default InteractiveFeatureShowcase
