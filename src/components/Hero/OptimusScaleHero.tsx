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
import HudButton from '@/components/HudButton'
import {
  CyberMetricLightning,
  CyberMetricShield,
  CyberMetricProcessor,
  CyberSpeedGauge,
  CyberCatalogIcon,
  CyberPitchRadarIcon,
  CyberShopBagIcon,
  RestoiaEngineIcon,
} from '@/components/ui/MagnificentIcons'

import HeroProductShowcase from './HeroProductShowcase'
import CyberTerminalCard from '../shared/CyberTerminalCard'
import InteractiveFeatureShowcase from '@/components/landing/InteractiveFeatureShowcase'
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
    code: '01 // PÁDEL & TURNOS',
    titleKey: 'hero.card_1_titulo',
    defaultTitle: 'Pádel SaaS & Reservas 24/7',
    descKey: 'hero.card_1_desc',
    defaultDesc:
      'Carga en 0.38s, reservas automáticas de canchas con seña a tu banco y calendario multi-espacio en tiempo real sin comisiones.',
    cta: 'Lanzar SportManager en vivo',
    href: 'https://sportmanager-playhub.vercel.app',
    liveLauncher: {
      label: 'PROBAR SPORTMANAGER (PÁDEL)',
      sublabel: 'RESERVAS Y CANCHAS REALES',
      href: 'https://sportmanager-playhub.vercel.app',
      icon: <CyberPitchRadarIcon size={18} />,
      color: 'cyan' as const,
    },
    ariaLabel: 'Probar SportManager Pádel en vivo sin filtros',
    color: 'cyan' as const,
    delay: '0s',
    icon: CyberSpeedGauge,
    badge: 'Canchas & Pádel',
    tech: ['Pádel & Canchas 24/7', 'Señas a tu Banco', 'Cero Comisiones'],
  },
  {
    id: '02',
    code: '02 // E-COMMERCE 3D',
    titleKey: 'hero.card_2_titulo',
    defaultTitle: 'Tienda CelStore con Visor 3D',
    descKey: 'hero.card_2_desc',
    defaultDesc:
      'Catálogo interactivo con renderizado 3D en GPU, checkout directo con Mercado Pago y stock atómico sin cuotas cautivas.',
    cta: 'Lanzar CelStore 3D en vivo',
    href: 'https://multi-tiendas-celphone.vercel.app',
    liveLauncher: {
      label: 'PROBAR TIENDA CELSTORE 3D',
      sublabel: 'CATÁLOGO 3D & CHECKOUT',
      href: 'https://multi-tiendas-celphone.vercel.app',
      icon: <CyberShopBagIcon size={18} />,
      color: 'fuchsia' as const,
    },
    ariaLabel: 'Probar CelStore E-Commerce en vivo sin filtros',
    color: 'fuchsia' as const,
    delay: '-2.75s',
    icon: CyberCatalogIcon,
    badge: 'Visor 3D GPU',
    tech: ['Visor 3D Three.js', 'Cobro Mercado Pago', '0% Comisiones'],
  },
  {
    id: '03',
    code: '03 // GASTRONOMÍA & POS',
    titleKey: 'hero.card_3_titulo',
    defaultTitle: 'Suite RESTOia & Comandas',
    descKey: 'hero.card_3_desc',
    defaultDesc:
      'Mapa interactivo de mesas, comandas de cocina 100% offline ante microcortes, arqueo blindado y cobros sin intermediarios.',
    cta: 'Lanzar RESTOia en vivo',
    href: 'https://kobe-sand.vercel.app/',
    liveLauncher: {
      label: 'PROBAR RESTOIA EN VIVO',
      sublabel: 'KOBE ENGINE · 100% OFFLINE',
      href: 'https://kobe-sand.vercel.app/',
      icon: <RestoiaEngineIcon size={18} />,
      color: 'amber' as const,
    },
    ariaLabel: 'Probar RESTOia gastronómico en vivo sin filtros',
    color: 'amber' as const,
    delay: '-5.5s',
    icon: CyberMetricLightning,
    badge: '100% Offline',
    tech: ['Comandas 100% Offline', 'KDS Cocina en Vivo', 'Arqueo Ciego Z'],
  },
  {
    id: '04',
    code: '04 // LINUX POS & TERMINALES',
    titleKey: 'hero.card_4_titulo',
    defaultTitle: 'Estaciones Linux POS para Negocios',
    descKey: 'hero.card_4_desc',
    defaultDesc:
      'Transformamos las PCs actuales de tu mostrador o caja en terminales Linux dedicadas: arranque en 4s, cero virus, modo quiosco blindado y $0 en licencias.',
    cta: 'Ver Terminales Linux para Comercios',
    href: '#sistemas-linux',
    liveLauncher: {
      label: 'VER TERMINALES LINUX POS',
      sublabel: '0% LICENCIAS · ANTI-CUELGUES',
      href: '#sistemas-linux',
      icon: <CyberMetricProcessor size={18} />,
      color: 'emerald' as const,
    },
    ariaLabel: 'Ver terminales Linux POS para negocios y comercios',
    color: 'emerald' as const,
    delay: '-8.25s',
    icon: CyberMetricProcessor,
    badge: 'Cero Cuelgues',
    tech: ['Arranque en 4 Seg', 'Revive PCs Lentas', '$0 Licencias & Virus'],
  },
]

export const OptimusScaleHero: React.FC = () => {
  const { t } = useTranslation()
  const [wordIndex, setWordIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [showcaseV2, setShowcaseV2] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Permite activar la Master Card V2 pasando ?showcase=v2 en la URL mientras se termina
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('showcase') === 'v2') {
        setShowcaseV2(true)
      }
    }
  }, [])

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
    <div className="relative w-full bg-transparent text-foreground text-foreground transition-colors duration-300">
      {/* ========================================================
          1. HERO PRINCIPAL (ESTRUCTURA ALINEADA CON EL NAVBAR)
         ======================================================== */}
      <section
        id="hero"
        ref={heroRef}
        aria-label="Hero principal"
        onMouseMove={handleHeroMouseMove}
        className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between pt-24 sm:pt-28 pb-4 overflow-hidden"
      >
        {/* Aura radial interactiva suave con decaimiento lumínico en scroll */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: auraIntensity,
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 70%)`,
          }}
        />

        {/* CONTENEDOR PRINCIPAL DEL HERO */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center w-full my-auto">
            {/* COLUMNA IZQUIERDA: CONTENIDO EDITORIAL */}
            <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground dark:text-muted-foreground select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {t('hero.eyebrow_plataforma') ||
                    'ESTUDIO DE DESARROLLO WEB // ATENCIÓN DIRECTA CON EXEQUIEL'}
                </span>
              </div>

              {/* Cartel neón */}
              <HeroNeonSignboard className="mt-4 mb-2" />

              {/* Título H1 */}
              <h1 className="mt-2 text-3xl sm:text-5xl xl:text-6xl font-display font-medium tracking-tight leading-[1.1] sm:leading-[1.05] text-foreground text-foreground">
                <span className="sr-only">Exe Páginas Web - </span>
                <span className="block font-semibold">
                  {t('hero.titulo_prefijo') || 'Páginas web y sistemas a medida'}
                </span>

                <span className="inline-flex items-center gap-2 sm:gap-4 flex-wrap mt-1">
                  <span>{t('hero.titulo_sufijo') || 'para'}</span>
                  <span className="relative inline-block overflow-hidden py-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatingWords[wordIndex]}
                        initial={{ y: 28, opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -28, opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block text-cyan-600 dark:text-cyan-400 font-bold drop-shadow-[0_0_24px_rgba(6,182,212,0.4)]"
                      >
                        {rotatingWords[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              {/* Bajada con typewriter */}
              <ConvergentTypewriterSubtitle className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground dark:text-muted-foreground max-w-xl leading-relaxed" />

              {/* CTAs principales */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <HudButton
                  label={t('hero.cta_cotizar') || 'Pedir Presupuesto por WhatsApp'}
                  href="https://wa.me/5493412799385?text=Hola%20Exequiel!%20Quiero%20cotizar%20un%20proyecto%20web%20para%20mi%20negocio"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  icon={<CyberArrowRight size={17} />}
                  onClick={() => trackEvent('hero_cta_contact_clicked', { source: 'optimus_hero' })}
                  ariaLabel="Pedir presupuesto de desarrollo web por WhatsApp directo con Exequiel"
                  className="w-full sm:w-auto shadow-lg shadow-cyan-500/15"
                />

                <HudButton
                  label={t('hero.cta_casos') || 'Ver Portafolio en Vivo'}
                  href="/portafolio"
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    trackEvent('hero_cta_portfolio_clicked', { source: 'optimus_hero' })
                  }
                  ariaLabel="Explorar portafolio de sistemas en producción"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

            {/* COLUMNA DERECHA: CINEMA DISPLAY */}
            <div className="lg:col-span-6 w-full flex items-center justify-center z-10 mt-4 lg:mt-0">
              <HeroProductShowcase className="w-full max-w-2xl" />
            </div>
          </div>
        </div>

        {/* MÉTRICAS DE PIE DE HERO */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 sm:mt-12">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 backdrop-blur-md shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-white/10">
              <div className="flex items-center gap-3.5 md:px-6 first:pl-0 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs shrink-0">
                  <CyberMetricLightning size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {t('hero.metric_velocidad') || '0.38s Carga'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {t('hero.metric_velocidad_sub') || '100% Lighthouse'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 md:px-6 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs shrink-0">
                  <CyberMetricShield size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {t('hero.metric_tuyo') || '100% Tuyo'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {t('hero.metric_tuyo_sub') || 'Cero ataduras o cuotas'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 md:px-6 last:pr-0 py-2 md:py-0">
                <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-xs shrink-0">
                  <CyberMetricProcessor size={19} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {t('hero.metric_autonomo') || 'Autónomo 24/7'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {t('hero.metric_autonomo_sub') || 'WhatsApp & Cobros'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TICKER / MARQUEE DE MÉTRICAS */}
        <div className="relative z-10 w-full mt-8 sm:mt-10 py-4.5 border-t border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-100/60 dark:bg-black/40 backdrop-blur-xs select-none">
          <div className="flex w-max animate-marquee gap-10 sm:gap-14 items-center">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div
                key={'ticker-' + item.label + '-' + idx}
                className="flex items-center gap-3 shrink-0"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs sm:text-[13px] font-mono uppercase tracking-wider text-muted-foreground">
                  {item.label}{' '}
                  <strong className="text-foreground dark:text-[#f7f5ee] font-semibold">
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
          3. SECCIÓN CAPACIDADES: DUAL (ESTABLE POR DEFECTO / V2 CON ?showcase=v2)
         ======================================================== */}
      {showcaseV2 ? (
        <InteractiveFeatureShowcase className="border-t border-slate-200/80 dark:border-white/10" />
      ) : (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div className="text-left">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                {t('hero.capacidades_eyebrow') || '— Capacidades'}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight leading-tight">
                <span className="block text-foreground">
                  {t('hero.capacidades_titulo') || 'Todo lo que tu empresa necesita.'}
                </span>
                <span className="block text-muted-foreground">
                  {t('hero.capacidades_subtitulo') || 'Nada de plantillas genéricas.'}
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 xl:gap-8">
            {CAPABILITIES.map((cap) => (
              <CyberTerminalCard
                key={'cap-card-' + cap.id}
                id={cap.id}
                code={cap.id === '04' ? t('hero.card_4_code', cap.code) : cap.code}
                title={t(cap.titleKey) || cap.defaultTitle}
                desc={t(cap.descKey) || cap.defaultDesc}
                badge={cap.id === '04' ? t('hero.card_4_badge', cap.badge) : cap.badge}
                tech={
                  cap.id === '04'
                    ? [
                        t('hero.card_4_tech_1', 'Arranque en 4 Seg'),
                        t('hero.card_4_tech_2', 'Revive PCs Lentas'),
                        t('hero.card_4_tech_3', '$0 Licencias & Virus'),
                      ]
                    : cap.tech
                }
                cta={cap.id === '04' ? t('hero.card_4_cta', cap.cta) : cap.cta}
                href={cap.href}
                liveLauncher={
                  cap.id === '04'
                    ? {
                        ...cap.liveLauncher,
                        label: t('hero.card_4_launcher_label', cap.liveLauncher.label),
                        sublabel: t('hero.card_4_launcher_sub', cap.liveLauncher.sublabel),
                      }
                    : cap.liveLauncher
                }
                color={cap.color}
                icon={cap.icon}
                ariaLabel={cap.ariaLabel}
                className="h-full"
              />
            ))}
          </div>
        </section>
      )}

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

const CyberArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default OptimusScaleHero
