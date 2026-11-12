/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Hero inspirado 100% en Optimus (v0 template LHv4frpA7Us)
 *
 * - Fondo pulcro off-white / obsidiana con viñeta suave
 * - Tipografía display monumental ("La plataforma para escalar") con barra de resalte
 * - Esfera 3D de glifos ocupando el 50% derecho de la pantalla con destellos reactivos
 * - Marquee ticker infinito en la base del Hero
 * - Consola interactiva de código con typewriter blur por carácter
 * - Sección de Capacidades con soporte dual: Cards Cyber Clásicas (Producción) + Master Cards V2 (?showcase=v2)
 */
'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Badge } from '@astryxdesign/core'
import HudButton from '@/components/HudButton'
import {
  CyberMetricLightning,
  CyberMetricShield,
  CyberMetricProcessor,
} from '@/components/ui/MagnificentIcons'

import HeroProductShowcase from './HeroProductShowcase'
import InteractiveFeatureShowcase from '@/components/landing/InteractiveFeatureShowcase'
import ConvergentTypewriterSubtitle from './ConvergentTypewriterSubtitle'
import { trackEvent } from '@/core/analytics/trackEvent'

const ROTATING_WORDS = ['escalar', 'vender 24/7', 'automatizar', 'innovar']

const TICKER_ITEMS = [
  { value: '0%', label: 'comisiones por ventas', tag: 'GANANCIA 100% TUYA' },
  { value: '< 1s', label: 'velocidad de carga móvil', tag: 'CERO CLIENTES PERDIDOS' },
  { value: '24/7', label: 'turnos y cobros automáticos', tag: 'SEÑAS DIRECTAS A TU BANCO' },
  { value: '100%', label: 'código propio sin plantillas', tag: 'DISEÑO EXCLUSIVO' },
  { value: '+85%', label: 'más consultas calificadas', tag: 'CIERRES POR WHATSAPP' },
  { value: '7 a 15', label: 'días puesta en marcha', tag: 'ENTREGA LLAVE EN MANO' },
]

export const OptimusScaleHero: React.FC = () => {
  const { t } = useTranslation()
  const [wordIndex, setWordIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })

  const safeT = (key: string, fallback: string): string => {
    const res = t(key, fallback)
    if (!res || res === key || res.startsWith('hero.')) {
      return fallback
    }
    return res
  }

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Aura interactiva de fondo
  const auraIntensity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.15])

  const rotatingWords = useMemo(() => {
    const list = t('hero.palabras_rotativas', { returnObjects: true })
    if (Array.isArray(list) && list.length > 0) return list as string[]
    return ROTATING_WORDS
  }, [t])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [rotatingWords.length])

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="relative z-10 w-full bg-transparent text-foreground transition-colors duration-300">
      {/* ========================================================
          1. HERO PRINCIPAL (ESTRUCTURA ALINEADA CON EL NAVBAR)
         ======================================================== */}
      <section
        id="hero"
        ref={heroRef}
        aria-label="Hero principal"
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between pt-24 sm:pt-28 pb-24 overflow-hidden"
      >
        {/* Aura radial interactiva suave con decaimiento lumínico en scroll y máscara vertical sin cortes */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: auraIntensity,
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 70%)`,
            maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
          }}
        />

        {/* CONTENEDOR PRINCIPAL DEL HERO */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full my-auto">
            {/* COLUMNA IZQUIERDA: CONTENIDO EDITORIAL */}
            <div className="lg:col-span-6 min-w-0 flex flex-col items-start text-left z-20">
              {/* Eyebrow editorial con Badge de Astryx */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-md shadow-2xs select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300 font-medium">
                  {t('hero.eyebrow_plataforma') ||
                    'ESTUDIO DE DESARROLLO WEB // ATENCIÓN DIRECTA CON EXEQUIEL'}
                </span>
                <Badge label="2025" variant="success" />
              </div>

              {/* Título H1 */}
              <h1 className="mt-6 text-4xl sm:text-5xl xl:text-[3.55rem] font-display font-semibold tracking-[-0.025em] leading-[1.06] text-foreground">
                <span className="sr-only">Exe Páginas Web - </span>
                <span className="block">
                  {safeT('hero.titulo_prefijo', 'Páginas web y sistemas a medida')}
                </span>

                <span className="mt-1.5 inline-flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="font-normal text-muted-foreground">
                    {safeT('hero.titulo_sufijo', 'para')}
                  </span>
                  <span className="relative inline-block overflow-hidden py-0.5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatingWords[wordIndex]}
                        initial={{ y: 22, opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -22, opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block bg-linear-to-r from-cyan-600 via-emerald-600 to-cyan-500 dark:from-cyan-400 dark:via-emerald-400 dark:to-cyan-300 bg-clip-text text-transparent font-semibold"
                      >
                        {rotatingWords[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              {/* Bajada con typewriter */}
              <ConvergentTypewriterSubtitle className="mt-5 text-base sm:text-lg text-muted-foreground dark:text-muted-foreground max-w-[54ch] leading-relaxed" />

              {/* CTA principal */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-full">
                <HudButton
                  label={safeT('hero.cta_casos', 'Ver Portafolio en Vivo')}
                  href="/portafolio"
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    trackEvent('hero_cta_portfolio_clicked', { source: 'optimus_hero' })
                  }
                  ariaLabel="Explorar portafolio de sistemas en producción"
                  className="w-full sm:w-auto max-w-full"
                />
              </div>
            </div>

            {/* COLUMNA DERECHA: CINEMA DISPLAY */}
            <div className="lg:col-span-6 min-w-0 w-full flex items-center justify-center z-10 mt-4 lg:mt-0">
              <HeroProductShowcase className="w-full max-w-2xl" />
            </div>
          </div>
        </div>

        {/* MÉTRICAS DE PIE DE HERO (Banda de especificación limpia) */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 mt-10 sm:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/65 dark:bg-white/[0.02] backdrop-blur-md px-5 py-4 md:px-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 md:px-6 first:md:pl-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <CyberMetricLightning
                  size={16}
                  className="text-cyan-600 dark:text-cyan-400 shrink-0"
                />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {safeT('hero.metric_velocidad', '0.38s Carga')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {safeT('hero.metric_velocidad_sub', '100% Core Web Vitals')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:px-6 md:border-l md:border-slate-200/70 dark:md:border-white/[0.07]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CyberMetricShield
                  size={16}
                  className="text-emerald-600 dark:text-emerald-400 shrink-0"
                />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {safeT('hero.metric_tuyo', '100% Tuyo')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {safeT('hero.metric_tuyo_sub', 'Cero ataduras o cuotas')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:px-6 md:border-l md:border-slate-200/70 dark:md:border-white/[0.07]">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <CyberMetricProcessor
                  size={16}
                  className="text-cyan-600 dark:text-cyan-400 shrink-0"
                />
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {safeT('hero.metric_autonomo', 'Autónomo 24/7')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {safeT('hero.metric_autonomo_sub', 'Gestión Cloud & Pagos')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TICKER / MARQUEE DE MÉTRICAS */}
        <div
          className="relative z-10 w-full mt-8 sm:mt-10 py-3.5 border-y border-slate-200/50 dark:border-white/[0.05] overflow-hidden bg-slate-100/25 dark:bg-white/[0.01] backdrop-blur-xs select-none"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="flex w-max animate-marquee gap-10 sm:gap-14 items-center">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div
                key={'ticker-' + item.label + '-' + idx}
                className="flex items-center gap-2.5 shrink-0"
              >
                <span className="text-xl sm:text-2xl font-semibold text-foreground tracking-[-0.03em] tabular-nums">
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {item.label}{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {item.tag}
                  </strong>
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20 ml-3 sm:ml-5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SUPER CARD INTERACTIVA UNIFICADA (PASO A PASO Y SISTEMAS EN VIVO)
         ======================================================== */}
      <InteractiveFeatureShowcase />

      {/* ESTILOS CSS PARA EL MARQUEE TICKER INFINITO */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default OptimusScaleHero
