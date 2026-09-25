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

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
// Íconos SVG puros para máxima velocidad y cero problemas de bundling
const ArrowRightIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const PlayIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
)

const GaugeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
    />
  </svg>
)

const CpuIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9" y="9" width="6" height="6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"
    />
  </svg>
)

const ZapIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const ShieldCheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12c0 5-4.5 8.5-9 9.5C7.5 20.5 3 17 3 12V5l9-3 9 3v7z"
    />
  </svg>
)
const StarIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const CheckCircleIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
import OptimusGlyphSphere from './OptimusGlyphSphere'
import SpotlightBorderCard from '../shared/SpotlightBorderCard'
import InteractiveAnimatedTabs from './InteractiveAnimatedTabs'
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
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between pt-24 sm:pt-28 pb-4 overflow-hidden"
      >
        {/* Aura radial interactiva suave */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-40 dark:opacity-60"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 70%)`,
          }}
        />

        {/* CONTENEDOR EXACTO ALINEADO CON NAVBAR: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center w-full my-auto">
            {/* COLUMNA IZQUIERDA: CONTENIDO EDITORIAL LIMPIO (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
              {/* 1. EYEBROW MONO, 1 LÍNEA, SIN CAJA */}
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>
                  {t('hero.eyebrow_plataforma') ||
                    'Desarrollo Web & Sistemas SaaS · Rosario & Global'}
                </span>
              </div>

              {/* 2. TÍTULO H1: 100% SEO FRIENDLY PARA BUSCADORES (BRAVE, GOOGLE, BING) */}
              <h1 className="mt-4 text-4xl sm:text-6xl xl:text-7xl font-sans font-medium tracking-tight leading-[1.1] sm:leading-[1.05] text-slate-950 dark:text-white">
                <span className="block text-2xl sm:text-3xl xl:text-4xl font-mono font-bold tracking-tight text-cyan-600 dark:text-cyan-400 mb-2">
                  Exe Páginas Web
                </span>
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

              {/* 3. SUBTÍTULO CON EFECTO MÁQUINA DE ESCRIBIR CONVERGENTE (DE ADELANTE Y DE ATRÁS SE JUNTAN EN EL MEDIO) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 sm:mt-6 max-w-2xl min-h-[6.5rem] sm:min-h-[4.5rem]"
              >
                <ConvergentTypewriterSubtitle />
              </motion.div>

              {/* 4. BOTONES PRINCIPALES DE ACCIÓN DIRECTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/cotizador"
                  onClick={() => trackEvent('hero_cta_contact_clicked', { source: 'optimus_hero' })}
                  className="group relative inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-full font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 transform-gpu active:scale-95 shrink-0"
                >
                  <span>{t('hero.cta_comenzar') || 'Comenzar mi proyecto'}</span>
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/portafolio"
                  onClick={() =>
                    trackEvent('hero_cta_portfolio_clicked', { source: 'optimus_hero' })
                  }
                  className="group inline-flex items-center justify-center gap-2.5 h-[52px] px-8 rounded-full border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 text-slate-800 dark:text-white font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 shrink-0"
                >
                  <PlayIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  <span>
                    {t('hero.cta_ver_portafolio') || t('hero.cta_ver_demo') || 'Ver portafolio'}
                  </span>
                </Link>
              </motion.div>

              {/* 5. CONFIANZA: mt-8 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-slate-600 dark:text-slate-400"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    <StarIcon className="w-3.5 h-3.5" />
                    <StarIcon className="w-3.5 h-3.5" />
                    <StarIcon className="w-3.5 h-3.5" />
                    <StarIcon className="w-3.5 h-3.5" />
                    <StarIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans font-bold text-slate-900 dark:text-white">4.9/5</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {t('hero.trust_proyectos') || '(+50 proyectos)'}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-sans">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('hero.trust_sla') || 'SLA por contrato'}</span>
                </div>
                <span className="text-slate-300 dark:text-white/20 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 font-sans">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{t('hero.trust_entrega') || 'Entrega en 7-15 días'}</span>
                </div>
              </motion.div>
            </div>

            {/* COLUMNA DERECHA: ESFERA 3D VIBRANTE */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end w-full py-4 lg:py-0">
              <OptimusGlyphSphere className="w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[560px] ml-auto" />
            </div>
          </div>

          {/* TIRA DEBAJO DEL HERO: 3 CARDS SEPARADAS POR LÍNEAS VERTICALES FINAS */}
          <div className="w-full border-t border-slate-200/80 dark:border-white/10 pt-6 mt-12 sm:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/10 gap-4 md:gap-0">
              <div className="flex items-center gap-3 md:px-6 first:pl-0 py-2 md:py-0">
                <ZapIcon className="w-4 h-4 text-cyan-500 shrink-0" />
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hero.metric_carga') || '0.38s Carga'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {t('hero.metric_carga_sub') || 'Edge CDN Global'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 md:px-6 py-2 md:py-0">
                <ShieldCheckIcon className="w-4 h-4 text-cyan-500 shrink-0" />
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('hero.metric_tuyo') || '100% Tuyo'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {t('hero.metric_tuyo_sub') || 'Cero ataduras o cuotas'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 md:px-6 last:pr-0 py-2 md:py-0">
                <CpuIcon className="w-4 h-4 text-cyan-500 shrink-0" />
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
        </div>

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
          2. CONSOLA INTERACTIVA: ANIMATED TABS (DEMO EN VIVO)
         ======================================================== */}
      <section
        id="demo"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full py-16 scroll-mt-20"
      >
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 font-semibold">
            {t('hero.console_eyebrow') || '— Consola de Desarrollo & Arquitectura'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {t('hero.console_title') || 'Mira cómo construimos cada sistema'}
          </h2>
        </div>

        <InteractiveAnimatedTabs />
      </section>

      {/* ========================================================
          3. SECCIÓN CAPACIDADES (ESTILO OPTIMUS ROWS CON BORDER BEAM)
         ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 border-t border-slate-200/80 dark:border-white/10">
        <div className="mb-14 text-left">
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

        {/* 4 FILAS / TARJETAS CON HAZ DE LUZ QUE RECORRE EL BORDE Y SPOTLIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link href="/soluciones" className="block cursor-pointer group">
            <SpotlightBorderCard activeBeam={true} colorVariant="cyan" animationDelay="0s">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  01 // DESPLIEGUE
                </span>
                <GaugeIcon className="w-4 h-4 text-cyan-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                {t('hero.card_1_titulo') || 'Páginas de Alta Conversión'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {t('hero.card_1_desc') ||
                  'Carga instantánea en 0.38s con Edge CDN global, diseño responsivo y posicionamiento SEO 100/100 en Google.'}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-500 group-hover:translate-x-1 transition-transform">
                <span>Ver soluciones web</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </SpotlightBorderCard>
          </Link>

          <Link href="/soluciones" className="block cursor-pointer group">
            <SpotlightBorderCard activeBeam={true} colorVariant="fuchsia" animationDelay="-2.75s">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  02 // GESTIÓN
                </span>
                <CpuIcon className="w-4 h-4 text-fuchsia-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.6)] transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-300 transition-colors">
                {t('hero.card_2_titulo') || 'Sistemas Cloud & Paneles'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {t('hero.card_2_desc') ||
                  'Control total de ventas, inventario, clientes y facturación electrónica a medida de tu operación diaria.'}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-fuchsia-500 group-hover:translate-x-1 transition-transform">
                <span>Ver paneles SaaS</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </SpotlightBorderCard>
          </Link>

          <Link href="/cotizador" className="block cursor-pointer group">
            <SpotlightBorderCard activeBeam={true} colorVariant="amber" animationDelay="-5.5s">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  03 // AUTOMATIZACIÓN
                </span>
                <ZapIcon className="w-4 h-4 text-amber-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                {t('hero.card_3_titulo') || 'WhatsApp & Cobros 24/7'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {t('hero.card_3_desc') ||
                  'Conexión directa con webhooks para notificar pedidos, cobrar con tarjetas y emitir comprobantes sin intervención humana.'}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                <span>Calcular automatización</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </SpotlightBorderCard>
          </Link>

          <Link href="/precios" className="block cursor-pointer group">
            <SpotlightBorderCard activeBeam={true} colorVariant="emerald" animationDelay="-8.25s">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  04 // LIBERTAD
                </span>
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                {t('hero.card_4_titulo') || '100% Código Propio'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {t('hero.card_4_desc') ||
                  'El software y la base de datos te pertenecen para siempre. Cero comisiones por venta y cero cuotas mensuales obligatorias.'}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                <span>Comparar planes y precios</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </div>
            </SpotlightBorderCard>
          </Link>
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
