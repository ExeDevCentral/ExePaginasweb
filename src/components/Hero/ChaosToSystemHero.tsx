/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * ChaosToSystemHero: "Del Caos al Sistema"
 *
 * High-impact, scroll-driven visual narrative in 3 Acts:
 * Act 1: Caos & Deuda Técnica (Amber / Warning / Scattered Nodes)
 * Act 2: Reestructuración & Síntesis (Transition / Aligning vectors)
 * Act 3: Ciudad de Servidores (Cyan / Isometric Grid / High-Velocity System)
 *
 * Style: Dark, sleek, high-contrast, Vercel/Linear COMPUTE aesthetic.
 */

'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  Server,
  Sparkles,
  Database,
  Terminal,
  Gauge,
  Workflow,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'

type ActNumber = 1 | 2 | 3

interface ChaosNode {
  id: string
  label: string
  sub: string
  // Stage coordinates (relative to stage center)
  chaos: { x: number; y: number; rotate: number; scale: number }
  transition: { x: number; y: number; rotate: number; scale: number }
  system: { x: number; y: number; rotate: number; scale: number }
  icon: React.ComponentType<{ className?: string }>
  badgeText: string
  metricChaos: string
  metricSystem: string
}

const NODES: ChaosNode[] = [
  {
    id: 'node-1',
    label: 'Carga & Latencia',
    sub: 'LCP 7.8s → Edge CDN 0.18s',
    chaos: { x: -160, y: -120, rotate: -14, scale: 0.95 },
    transition: { x: -130, y: -90, rotate: -4, scale: 0.98 },
    system: { x: -140, y: -100, rotate: 0, scale: 1 },
    icon: Gauge,
    badgeText: 'WEB VITALS',
    metricChaos: 'CRITICAL 8.4s',
    metricSystem: '99/100 SPEED',
  },
  {
    id: 'node-2',
    label: 'UX & Conversión',
    sub: 'Fugas de Checkout → Flow 1-Click',
    chaos: { x: 150, y: -130, rotate: 16, scale: 0.92 },
    transition: { x: 130, y: -90, rotate: 4, scale: 0.98 },
    system: { x: 140, y: -100, rotate: 0, scale: 1 },
    icon: Activity,
    badgeText: 'CONVERSIÓN',
    metricChaos: '-42% DROP-OFF',
    metricSystem: '+180% CONV.',
  },
  {
    id: 'node-3',
    label: 'Arquitectura Backend',
    sub: 'Monolito Lento → Micro-APIs Edge',
    chaos: { x: -180, y: 15, rotate: 12, scale: 0.94 },
    transition: { x: -130, y: 10, rotate: 2, scale: 0.98 },
    system: { x: -140, y: 10, rotate: 0, scale: 1 },
    icon: Server,
    badgeText: 'RUNTIME',
    metricChaos: 'SPAGHETTI V1',
    metricSystem: 'EDGE RUNTIME',
  },
  {
    id: 'node-4',
    label: 'Base de Datos',
    sub: 'Deadlocks → Cache Distribuido',
    chaos: { x: 170, y: 20, rotate: -15, scale: 0.93 },
    transition: { x: 130, y: 10, rotate: -2, scale: 0.98 },
    system: { x: 140, y: 10, rotate: 0, scale: 1 },
    icon: Database,
    badgeText: 'DATA CLUSTER',
    metricChaos: 'TIMEOUTS 504',
    metricSystem: '0ms REPLICA',
  },
  {
    id: 'node-5',
    label: 'Seguridad & Uptime',
    sub: 'Brechas SSL → Zero-Trust Shield',
    chaos: { x: -150, y: 140, rotate: -10, scale: 0.92 },
    transition: { x: -130, y: 110, rotate: -1, scale: 0.98 },
    system: { x: -140, y: 120, rotate: 0, scale: 1 },
    icon: ShieldCheck,
    badgeText: 'SEGURIDAD',
    metricChaos: 'UNPROTECTED',
    metricSystem: '99.99% SLA',
  },
  {
    id: 'node-6',
    label: 'CI/CD Automatizado',
    sub: 'Deploys Manuales → Pipeline Atómico',
    chaos: { x: 160, y: 145, rotate: 18, scale: 0.94 },
    transition: { x: 130, y: 110, rotate: 3, scale: 0.98 },
    system: { x: 140, y: 120, rotate: 0, scale: 1 },
    icon: Workflow,
    badgeText: 'PIPELINE',
    metricChaos: 'MANUAL DEPLOY',
    metricSystem: 'AUTO ATOMIC',
  },
]

export interface ChaosToSystemHeroProps {
  onPrimaryCtaClick?: () => void
  onSecondaryCtaClick?: () => void
  primaryCtaText?: string
  secondaryCtaText?: string
}

export const ChaosToSystemHero: React.FC<ChaosToSystemHeroProps> = ({
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  primaryCtaText = 'Construir Mi Sistema',
  secondaryCtaText = 'Explorar Arquitectura',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeAct, setActiveAct] = useState<ActNumber>(1)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Track window size for mobile adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll driven animation progression
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth out scroll progression with spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 22,
    restDelta: 0.001,
  })

  // Map progress to acts
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      if (latest < 0.33) {
        setActiveAct(1)
      } else if (latest < 0.68) {
        setActiveAct(2)
      } else {
        setActiveAct(3)
      }
    })
  }, [smoothProgress])

  // Interpolated visual values
  const bgAmberOpacity = useTransform(smoothProgress, [0, 0.35, 0.65], [0.22, 0.08, 0])
  const bgCyanOpacity = useTransform(smoothProgress, [0.35, 0.7, 1], [0.05, 0.2, 0.35])
  const stageRotateX = useTransform(smoothProgress, [0, 0.5, 1], [0, 18, 38])
  const stageRotateZ = useTransform(smoothProgress, [0, 0.5, 1], [0, -6, -14])

  // Interactive tab switcher
  const jumpToAct = (act: ActNumber) => {
    setActiveAct(act)
    if (containerRef.current && !isMobile) {
      const containerTop = containerRef.current.offsetTop
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight
      const targetScroll = containerTop + containerHeight * ((act - 1) / 2)
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#030308] text-white selection:bg-cyan-500/30 selection:text-cyan-200 ${
        isMobile ? 'min-h-screen pb-16' : 'h-[300vh]'
      }`}
    >
      {/* --- BACKGROUND TECH GRID (Clean SVG, ZERO NOISE) --- */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 60% at 50% 40%, black 20%, transparent 85%)',
        }}
      />

      {/* --- AMBIENT GLOWS --- */}
      <motion.div
        style={{ opacity: bgAmberOpacity }}
        className="pointer-events-none fixed -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-amber-500/20 blur-[140px] transform-gpu"
      />
      <motion.div
        style={{ opacity: bgCyanOpacity }}
        className="pointer-events-none fixed -bottom-20 -right-20 h-[600px] w-[600px] rounded-full bg-cyan-500/25 blur-[160px] transform-gpu"
      />
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[700px] rounded-full bg-indigo-500/10 blur-[130px]" />

      {/* --- VIEWPORT CONTAINER --- */}
      <div
        className={`${isMobile ? 'relative' : 'sticky top-0 min-h-screen'} w-full flex flex-col justify-between pt-4 sm:pt-6`}
      >
        {/* --- TOP STATUS BAR --- */}
        <header className="relative z-30 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
          {/* Brand Tag */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-slate-300">
                <span>EXEPAGINASWEB</span>
                <span className="text-cyan-400">CORE v4.0</span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Architecture Lab // Next-Gen Systems
              </p>
            </div>
          </div>

          {/* 3 Acts Nav Scrubber */}
          <nav
            aria-label="Progreso narrativo"
            className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-[#090b14]/90 p-1.5 backdrop-blur-xl shadow-xl"
          >
            {[
              {
                num: 1 as ActNumber,
                label: '01 // CAOS',
                activeClass:
                  'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
              },
              {
                num: 2 as ActNumber,
                label: '02 // SÍNTESIS',
                activeClass:
                  'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
              },
              {
                num: 3 as ActNumber,
                label: '03 // SISTEMA',
                activeClass:
                  'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_18px_rgba(6,182,212,0.4)]',
              },
            ].map((act) => {
              const isActive = activeAct === act.num
              return (
                <button
                  key={act.num}
                  type="button"
                  onClick={() => jumpToAct(act.num)}
                  className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-mono text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? act.activeClass
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive
                        ? act.num === 1
                          ? 'bg-amber-400 animate-ping'
                          : act.num === 2
                            ? 'bg-indigo-400 animate-ping'
                            : 'bg-cyan-400 animate-ping'
                        : 'bg-slate-600'
                    }`}
                  />
                  <span>{act.label}</span>
                </button>
              )
            })}
          </nav>
        </header>

        {/* --- MAIN HERO CONTENT (2-COLUMN BALANCED LAYOUT) --- */}
        <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: CONFIDENT HEADLINE & CTAS (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Dynamic Act Eyebrow Chip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAct}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-wider uppercase mb-5 backdrop-blur-md ${
                  activeAct === 1
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : activeAct === 2
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                {activeAct === 1 && (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    <span>Fase 01: El coste del caos técnico</span>
                  </>
                )}
                {activeAct === 2 && (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Fase 02: Reestructuración y Enlace</span>
                  </>
                )}
                {activeAct === 3 && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Fase 03: Ciudad de Servidores</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Confident Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-5 font-['Space_Grotesk',sans-serif]">
              Del{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                Caos
              </span>{' '}
              al{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                Sistema
              </span>
              .
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-lg">
              Eliminamos la deuda técnica, las interfaces lentas y las fugas de conversión.
              Diseñamos{' '}
              <span className="text-white font-semibold underline decoration-cyan-500/60 underline-offset-4">
                plataformas web ultra veloces
              </span>
              , escalables y orientadas a facturar.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                type="button"
                onClick={onPrimaryCtaClick}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-bold text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform" />
                <Zap className="w-4 h-4 fill-black text-black" />
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onSecondaryCtaClick}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-mono text-sm font-semibold text-slate-300 border border-slate-700/80 bg-slate-900/50 hover:bg-slate-800/80 hover:text-white hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Layers className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>{secondaryCtaText}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Dynamic Status Metric Card */}
            <div className="w-full max-w-lg p-3.5 rounded-xl border border-white/10 bg-[#090b14]/70 backdrop-blur-md flex items-center justify-between font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${activeAct === 1 ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}
                />
                <span className="text-slate-200 font-semibold">
                  {activeAct === 1
                    ? 'Deuda Técnica: ALTA'
                    : activeAct === 2
                      ? 'Optimizando Nodos...'
                      : 'Arquitectura: EDGE READY'}
                </span>
              </div>
              <span
                className={`font-bold ${activeAct === 1 ? 'text-amber-400' : 'text-emerald-400'}`}
              >
                {activeAct === 1 ? 'LCP: 8.4s' : activeAct === 2 ? 'LCP: 1.2s' : 'LCP: 0.18s'}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: DEDICATED VISUAL STAGE (7 Cols) */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px] w-full rounded-2xl border border-white/10 bg-[#060813]/60 backdrop-blur-xl p-4 sm:p-6 overflow-hidden shadow-2xl">
            {/* Subtle Stage Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, ${activeAct === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.25)'} 1px, transparent 1px),
                                  linear-gradient(to bottom, ${activeAct === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.25)'} 1px, transparent 1px)`,
                backgroundSize: '36px 36px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
              }}
            />

            {/* Connecting Laser Vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {activeAct >= 2 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <line
                    x1="25%"
                    y1="25%"
                    x2="75%"
                    y2="25%"
                    stroke="url(#laserGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="25%"
                    y1="50%"
                    x2="75%"
                    y2="50%"
                    stroke="url(#laserGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="25%"
                    y1="75%"
                    x2="75%"
                    y2="75%"
                    stroke="url(#laserGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="50%"
                    y1="20%"
                    x2="50%"
                    y2="80%"
                    stroke="url(#laserGrad)"
                    strokeWidth="1.5"
                  />
                </motion.g>
              )}
            </svg>

            {/* Isometric 3D Transforming Plane */}
            <motion.div
              style={
                !isMobile
                  ? {
                      rotateX: stageRotateX,
                      rotateZ: stageRotateZ,
                    }
                  : {
                      rotateX: activeAct === 3 ? 20 : 0,
                      rotateZ: activeAct === 3 ? -8 : 0,
                    }
              }
              className="relative w-full h-full flex items-center justify-center perspective-[1000px] transform-gpu transition-transform duration-500"
            >
              {/* Central Core Reactor in Act 3 */}
              <AnimatePresence>
                {activeAct === 3 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute z-10 flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.5)] backdrop-blur-xl"
                  >
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-400 to-teal-300 text-black shadow-md">
                      <Cpu className="h-4 w-4 animate-spin" />
                      <div className="absolute -inset-1 rounded-lg bg-cyan-400/40 blur-sm -z-10 animate-ping" />
                    </div>
                    <span className="mt-1 font-mono text-[9px] font-bold text-cyan-300">
                      EXE CORE
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transforming Nodes */}
              {NODES.map((node) => {
                const IconComponent = node.icon
                const target =
                  activeAct === 1 ? node.chaos : activeAct === 2 ? node.transition : node.system

                const isChaos = activeAct === 1
                const isSystem = activeAct === 3

                return (
                  <motion.div
                    key={node.id}
                    animate={{
                      x: isMobile ? target.x * 0.72 : target.x,
                      y: isMobile ? target.y * 0.75 : target.y,
                      rotate: isMobile ? target.rotate * 0.5 : target.rotate,
                      scale: isMobile ? target.scale * 0.9 : target.scale,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 85,
                      damping: 16,
                      mass: 0.7,
                    }}
                    className={`absolute z-20 w-48 sm:w-52 p-3 rounded-xl border backdrop-blur-xl transition-all duration-500 shadow-xl ${
                      isChaos
                        ? 'bg-[#181109]/90 border-amber-500/50 shadow-[0_8px_25px_rgba(245,158,11,0.15)] hover:border-amber-400'
                        : isSystem
                          ? 'bg-[#06111f]/95 border-cyan-500/60 shadow-[0_8px_30px_rgba(6,182,212,0.22)] hover:border-cyan-300'
                          : 'bg-[#0f1124]/90 border-indigo-500/50 shadow-[0_8px_25px_rgba(99,102,241,0.15)]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                          isChaos
                            ? 'bg-amber-500/20 text-amber-300'
                            : isSystem
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {node.badgeText}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isChaos
                            ? 'bg-amber-400 animate-ping'
                            : isSystem
                              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                              : 'bg-indigo-400'
                        }`}
                      />
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`p-1.5 rounded-lg border shrink-0 ${
                          isChaos
                            ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                            : isSystem
                              ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              : 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-['Space_Grotesk',sans-serif] text-xs font-bold text-white truncate">
                          {node.label}
                        </h4>
                        <p className="text-[9px] text-slate-400 truncate font-mono">{node.sub}</p>
                      </div>
                    </div>

                    {/* Metric */}
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">MÉTRICA:</span>
                      <span
                        className={`font-bold ${
                          isChaos
                            ? 'text-amber-400'
                            : isSystem
                              ? 'text-emerald-400 flex items-center gap-1'
                              : 'text-indigo-300'
                        }`}
                      >
                        {isSystem && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {isChaos ? node.metricChaos : node.metricSystem}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* --- BOTTOM TELEMETRY FOOTER --- */}
        <footer className="relative z-30 pb-4 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2.5 px-5 rounded-xl border border-white/10 bg-[#090b14]/80 backdrop-blur-md font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
                {!isMobile
                  ? 'Desplázate hacia abajo para evolucionar la arquitectura'
                  : 'Navega los 3 actos con los botones superiores'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div>
                <span className="text-slate-500">LATENCIA: </span>
                <span className="text-emerald-400 font-bold">&lt; 120ms</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-slate-500">SLA: </span>
                <span className="text-cyan-400 font-bold">99.99%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">ESTADO: </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-300 font-semibold border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ChaosToSystemHero
