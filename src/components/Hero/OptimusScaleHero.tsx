/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Hero inspirado 100% en Optimus (v0 template LHv4frpA7Us)
 *
 * - Fondo pulcro off-white / obsidiana con viñeta suave
 * - Tipografía display monumental ("La plataforma para escalar") con barra de resalte
 * - Esfera 3D de glifos ocupando el 50% derecho de la pantalla con destellos reactivos
 * - Marquee ticker infinito en la base del Hero
 * - Consola interactiva de código con typewriter blur por carácter
 * - Sección de Capacidades con tarjetas Border Beam y Mouse Spotlight
 */
'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import HudButton from '@/components/HudButton'
import {
  CyberArrowRight,
  CyberRatingStar,
  CyberCheckMark,
  CyberMetricLightning,
  CyberMetricShield,
  CyberMetricProcessor,
  CyberSpeedGauge,
  CyberCatalogIcon,
} from '@/components/ui/MagnificentIcons'

const Grid2x2Icon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const Columns4Icon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="4" width="3.5" height="16" rx="1" />
    <rect x="8" y="4" width="3.5" height="16" rx="1" />
    <rect x="14" y="4" width="3.5" height="16" rx="1" />
    <rect x="20" y="4" width="3.5" height="16" rx="1" />
  </svg>
)

import OptimusGlyphSphere from './OptimusGlyphSphere'
import SpotlightBorderCard from '../shared/SpotlightBorderCard'
import ConvergentTypewriterSubtitle from './ConvergentTypewriterSubtitle'
import HeroNeonSignboard from './HeroNeonSignboard'
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

const CAPABILITIES = [
  {
    id: '01',
    code: '01 // MÁS VENTAS',
    titleKey: 'hero.card_1_titulo',
    defaultTitle: 'Páginas de Alta Conversión',
    descKey: 'hero.card_1_desc',
    defaultDesc:
      'Carga instantánea en 0.38s, diseño que cautiva a tus clientes y posicionamiento en Google para que te encuentren primero.',
    cta: 'Ver soluciones web',
    href: '/soluciones#paginas-web',
    ariaLabel: 'Ver soluciones web: Páginas de alta conversión',
    color: 'cyan' as const,
    delay: '0s',
    icon: CyberSpeedGauge,
    badge: 'Más Consultas',
    tech: ['Primero en Google (SEO)', 'Carga Ultra Rápida', 'Ventas desde el Celular'],
  },
  {
    id: '02',
    code: '02 // GESTIÓN MÓVIL',
    titleKey: 'hero.card_2_titulo',
    defaultTitle: 'Catálogo y Gestión Móvil',
    descKey: 'hero.card_2_desc',
    defaultDesc:
      'Tu catálogo y pedidos actualizados al instante desde tu celular. Control total de ventas, clientes y stock sin complicaciones.',
    cta: 'Ver paneles a medida',
    href: '/soluciones#gestion-movil',
    ariaLabel: 'Ver paneles a medida: Catálogo y gestión móvil',
    color: 'fuchsia' as const,
    delay: '-2.75s',
    icon: CyberCatalogIcon,
    badge: 'Control Total',
    tech: ['Gestión desde tu Celular', 'Facturación AFIP', 'Control de Stock y Clientes'],
  },
  {
    id: '03',
    code: '03 // AUTOMATIZACIÓN',
    titleKey: 'hero.card_3_titulo',
    defaultTitle: 'WhatsApp & Cobros 24/7',
    descKey: 'hero.card_3_desc',
    defaultDesc:
      'Dejá de responder precios manualmente: cobros y reservas automáticas 24/7 con tarjetas y comprobantes sin intervención humana.',
    cta: 'Calcular automatización',
    href: '/cotizador',
    ariaLabel: 'Calcular automatización de WhatsApp y cobros 24/7',
    color: 'amber' as const,
    delay: '-5.5s',
    icon: CyberMetricLightning,
    badge: 'Ventas Automáticas',
    tech: ['WhatsApp Automatizado', 'Cobro con Tarjetas/MP', 'Alertas de Ventas al Instante'],
  },
  {
    id: '04',
    code: '04 // LIBERTAD',
    titleKey: 'hero.card_4_titulo',
    defaultTitle: '100% Código Tuyo (0% Comisiones)',
    descKey: 'hero.card_4_desc',
    defaultDesc:
      'Sin pagar comisiones del 15% a plataformas terceras. El sitio, la base de clientes y los datos son 100% tuyos para siempre.',
    cta: 'Comparar planes y precios',
    href: '/precios',
    ariaLabel: 'Comparar planes y precios con 100% código propio',
    color: 'emerald' as const,
    delay: '-8.25s',
    icon: CyberMetricShield,
    badge: 'Sin Ataduras',
    tech: ['0% Comisiones por Venta', 'Sin Mensualidades Forzosas', 'Tu Base de Clientes'],
  },
]

export const OptimusScaleHero: React.FC = () => {
  const { t } = useTranslation()
  const [wordIndex, setWordIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [desktopView, setDesktopView] = useState<'grid2x2' | 'row4'>('grid2x2')
  const [activeMobileFilter, setActiveMobileFilter] = useState<'all' | '01' | '02' | '03' | '04'>(
    'all'
  )

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Opción 2: Dolly-Out Phosphor Decay del Banner (sin anclar / sin trabar el scroll)
  const heroDollyScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.95])
  const heroDollyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.85])
  const auraIntensity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.15])
  const heroDollyY = useTransform(scrollYProgress, [0, 0.75], [0, 28])

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
    <div className="relative w-full bg-transparent text-slate-900 dark:text-white transition-colors duration-300">
      {/* ========================================================
          1. HERO PRINCIPAL (ESTRUCTURA EXACTA OPTIMUS DESAHOGADA)
         ======================================================== */}
      {/* ========================================================
          1. HERO PRINCIPAL (ESTRUCTURA ALINEADA CON EL NAVBAR)
         ======================================================== */}
      <section
        ref={heroRef}
        aria-label="Hero principal"
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between pt-24 sm:pt-28 pb-4 overflow-hidden"
      >
        {/* Aura radial interactiva suave con decaimiento lumínico en scroll (Opción 2) */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: auraIntensity,
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 70%)`,
          }}
        />

        {/* CONTENEDOR CON DOLLY-OUT (OPCIÓN 2: RETROCESO SUAVE DE PERSPECTIVA SIN TRABAR SCROLL) */}
        <motion.div
          style={{
            scale: heroDollyScale,
            opacity: heroDollyOpacity,
            y: heroDollyY,
            transformOrigin: 'top center',
          }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center w-full my-auto">
            {/* COLUMNA IZQUIERDA: CONTENIDO EDITORIAL LIMPIO (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
              {/* 1. EYEBROW MONO, 1 LÍNEA, SIN CAJA */}
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>
                  {t('hero.eyebrow_plataforma') ||
                    'Arquitectura de Software & Sistemas Cloud · Escala Global'}
                </span>
              </div>

              {/* CARTEL LUMINOSO NEÓN DEL LOGO (ALTO IMPACTO: SE ACHICA Y APAGA AL BAJAR) */}
              <HeroNeonSignboard className="mt-4 mb-2" />

              {/* 2. TÍTULO H1: 100% SEO FRIENDLY PARA BUSCADORES (BRAVE, GOOGLE, BING) */}
              <h1 className="mt-2 text-3xl sm:text-5xl xl:text-6xl font-sans font-medium tracking-tight leading-[1.1] sm:leading-[1.05] text-slate-950 dark:text-white">
                <span className="sr-only">Exe Páginas Web - </span>
                <span className="block font-semibold">
                  {t('hero.titulo_prefijo') || 'Páginas web y sistemas a medida'}
                </span>

                <span className="inline-flex items-center gap-2 sm:gap-4 flex-wrap mt-1">
                  <span className="text-slate-500 dark:text-slate-400 font-light">
                    {t('hero.titulo_conector') || 'para'}
                  </span>
                  <span className="relative inline-block text-cyan-500 dark:text-cyan-400 font-bold">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIndex}
                        initial={false}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -20, opacity: 0, filter: 'blur(6px)' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block"
                      >
                        {rotatingWords[wordIndex] || ROTATING_WORDS[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              {/* 3. SUBTÍTULO HERO CON RENDERIZADO INMEDIATO PARA MÁXIMO LCP */}
              <div className="mt-5 sm:mt-6 max-w-2xl min-h-26 sm:min-h-18">
                <ConvergentTypewriterSubtitle />
              </div>

              {/* 4. BOTONES PRINCIPALES DE ACCIÓN DIRECTA DE ALTA FIDELIDAD (HUD CHAFLANADO) */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <HudButton
                  label={t('hero.cta_comenzar') || 'Hablemos de tu proyecto'}
                  href="/cotizador"
                  variant="primary"
                  onClick={() => trackEvent('hero_cta_contact_clicked', { source: 'optimus_hero' })}
                />

                <HudButton
                  label={t('hero.cta_ver_portafolio') || t('hero.cta_ver_demo') || 'Ver portafolio'}
                  href="/portafolio"
                  variant="secondary"
                  onClick={() =>
                    trackEvent('hero_cta_portfolio_clicked', { source: 'optimus_hero' })
                  }
                />
              </div>

              {/* 5. CONFIANZA: mt-8 */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <CyberRatingStar size={14} />
                    <CyberRatingStar size={14} />
                    <CyberRatingStar size={14} />
                    <CyberRatingStar size={14} />
                    <CyberRatingStar size={14} />
                  </div>
                  <span className="font-sans font-bold text-slate-900 dark:text-white">4.9/5</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {t('hero.trust_proyectos') || '(+50 proyectos)'}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-sans">
                  <CyberCheckMark size={14} />
                  <span>{t('hero.trust_sla') || 'SLA por contrato'}</span>
                </div>
                <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-sans">
                  <CyberCheckMark size={14} />
                  <span>{t('hero.trust_entrega') || 'Entrega en 7-15 días'}</span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: ESFERA 3D VIBRANTE */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end w-full py-2 lg:py-0">
              <OptimusGlyphSphere className="w-full max-w-95 sm:max-w-125 md:max-w-140 lg:max-w-155 xl:max-w-170 mx-auto lg:ml-auto" />
            </div>
          </div>

          {/* TIRA DEBAJO DEL HERO: 3 CARDS SEPARADAS POR LÍNEAS VERTICALES FINAS CON ÍCONOS MAGNÍFICOS */}
          <div className="w-full border-t border-slate-200/80 dark:border-white/10 pt-6 mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/10 gap-4 md:gap-0">
              <div className="flex items-center gap-3.5 md:px-6 first:pl-0 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] shrink-0">
                  <CyberMetricLightning size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hero.metric_carga') || '0.38s Carga'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {t('hero.metric_carga_sub') || 'Edge CDN Global'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 md:px-6 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] shrink-0">
                  <CyberMetricShield size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hero.metric_tuyo') || '100% Tuyo'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {t('hero.metric_tuyo_sub') || 'Cero ataduras o cuotas'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 md:px-6 last:pr-0 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] shrink-0">
                  <CyberMetricProcessor size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hero.metric_autonomo') || 'Autónomo 24/7'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {t('hero.metric_autonomo_sub') || 'WhatsApp & Cobros'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TICKER / MARQUEE DE MÉTRICAS EN LA BASE DEL HERO (ESTILO EXACTO OPTIMUS) */}
        <div className="relative z-10 w-full mt-8 sm:mt-10 py-4.5 border-t border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-100/60 dark:bg-black/40 backdrop-blur-xs select-none">
          <div className="flex w-max animate-marquee gap-10 sm:gap-14 items-center">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div
                key={'ticker-' + item.label + '-' + idx}
                className="flex items-center gap-3 shrink-0"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs sm:text-[13px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {item.label}{' '}
                  <strong className="text-slate-950 dark:text-[#f7f5ee] font-semibold">
                    {item.tag}
                  </strong>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 ml-2 sm:ml-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECCIÓN CAPACIDADES (DUAL: MODO CELULAR + MODO PC)
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 border-t border-slate-200/80 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-left">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-3">
              {t('hero.capacidades_eyebrow') || '— Capacidades'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight leading-tight">
              <span className="block text-slate-950 dark:text-white">
                {t('hero.capacidades_titulo') || 'Todo lo que tu empresa necesita.'}
              </span>
              <span className="block text-slate-400 dark:text-slate-500">
                {t('hero.capacidades_subtitulo') || 'Nada de plantillas genéricas.'}
              </span>
            </h2>
          </div>

          {/* SELECTOR DE VISTA EN ESCRITORIO (PC) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDesktopView('grid2x2')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                desktopView === 'grid2x2'
                  ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold shadow-xs border border-slate-200/80 dark:border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid2x2Icon className="w-3.5 h-3.5" />
              <span>Cuadrícula 2x2 Amplia</span>
            </button>
            <button
              type="button"
              onClick={() => setDesktopView('row4')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                desktopView === 'row4'
                  ? 'bg-white dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold shadow-xs border border-slate-200/80 dark:border-cyan-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns4Icon className="w-3.5 h-3.5" />
              <span>Panorámica 4x1</span>
            </button>
          </div>
        </div>

        {/* Barra táctil rápida de filtro para móviles */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1 mb-6 select-none">
          <button
            type="button"
            onClick={() => setActiveMobileFilter('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all touch-manipulation cursor-pointer ${
              activeMobileFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
            }`}
          >
            Todas (4)
          </button>
          {CAPABILITIES.map((cap) => (
            <button
              key={'mob-btn-' + cap.id}
              type="button"
              onClick={() => setActiveMobileFilter(cap.id as '01' | '02' | '03' | '04')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all touch-manipulation cursor-pointer ${
                activeMobileFilter === cap.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cap.code}
            </button>
          ))}
        </div>

        {/* UN SOLO GRID RESPONSIVO PARA MÓVIL Y ESCRITORIO (CERO DUPLICACIÓN DOM) */}
        <div
          className={`grid gap-6 sm:gap-7 xl:gap-8 ${
            desktopView === 'row4'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {CAPABILITIES.filter(
            (cap) => activeMobileFilter === 'all' || activeMobileFilter === cap.id
          ).map((cap) => {
            const Icon = cap.icon
            const colorTextClass =
              cap.color === 'cyan'
                ? 'text-cyan-600 dark:text-cyan-400'
                : cap.color === 'fuchsia'
                  ? 'text-fuchsia-600 dark:text-fuchsia-400'
                  : cap.color === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'

            const colorHoverText =
              cap.color === 'cyan'
                ? 'group-hover:text-cyan-500 dark:group-hover:text-cyan-300'
                : cap.color === 'fuchsia'
                  ? 'group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300'
                  : cap.color === 'amber'
                    ? 'group-hover:text-amber-500 dark:group-hover:text-amber-300'
                    : 'group-hover:text-emerald-500 dark:group-hover:text-emerald-300'

            return (
              <Link
                key={'cap-card-' + cap.id}
                href={cap.href}
                aria-label={cap.ariaLabel}
                className="block cursor-pointer group active:scale-[0.99] transition-transform"
              >
                <SpotlightBorderCard
                  activeBeam={true}
                  colorVariant={cap.color}
                  animationDelay={cap.delay}
                  className="h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${colorTextClass}`}>
                        {cap.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                        {cap.badge}
                      </span>
                    </div>
                    <div className="relative w-9 h-9 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-all duration-300 shrink-0">
                      <Icon
                        className={`w-4.5 h-4.5 ${colorTextClass} transition-transform duration-300`}
                      />
                    </div>
                  </div>

                  <h3
                    className={`text-xl xl:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 transition-colors ${colorHoverText}`}
                  >
                    {t(cap.titleKey) || cap.defaultTitle}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                    {t(cap.descKey) || cap.defaultDesc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {cap.tech.map((techItem) => (
                      <span
                        key={'cap-tech-' + cap.id + '-' + techItem}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-400 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-colors"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-xs font-mono font-bold ${colorTextClass} group-hover:translate-x-1.5 transition-transform duration-300`}
                  >
                    <span>{cap.cta}</span>
                    <CyberArrowRight size={15} />
                  </div>
                </SpotlightBorderCard>
              </Link>
            )
          })}
        </div>
      </section>

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
