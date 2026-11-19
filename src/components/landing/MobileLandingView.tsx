/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileLandingView:
 * Experiencia móvil moderna, pragmática y libre de ruido visual (< 768px).
 * - Hero focal centrado en el Globo 3D Holográfico interactivo (OptimusGlyphSphere)
 * - Showcase interactivo por pestañas de sistemas reales en producción
 * - Precios transparentes con selector ARS/USD y planes compactos
 * - Comparativa directa 1 Solo Pago vs Alquiler + acceso rápido a Linux POS
 * - Cierre directo por WhatsApp y pie compacto adaptado al MobileBottomNav
 */
'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowUpRight,
  Calculator,
  Check,
  ChevronRight,
  Compass,
  Layers,
  Terminal,
  X,
} from 'lucide-react'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

const OptimusGlyphSphere = dynamic(() => import('../Hero/OptimusGlyphSphere'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="relative w-full aspect-square flex items-center justify-center rounded-full bg-emerald-500/5 dark:bg-cyan-500/5 border border-emerald-500/20 dark:border-cyan-400/20 pointer-events-none transform-gpu"
    >
      <div className="w-3/4 h-3/4 rounded-full border border-dashed border-emerald-400/30 dark:border-cyan-400/30 animate-[spin_14s_linear_infinite]" />
    </div>
  ),
})

const WhatsAppVectorIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.484 2 12.018c0 1.907.534 3.69 1.464 5.215L2 22l4.914-1.424A9.972 9.972 0 0012.031 22c5.536 0 10.031-4.484 10.031-10.018C22.062 6.484 17.567 2 12.031 2zm0 18.286c-1.636 0-3.18-.45-4.524-1.233l-.324-.19-2.923.848.868-2.846-.21-.334a8.23 8.23 0 01-1.282-4.513c0-4.568 3.717-8.284 8.29-8.284 4.572 0 8.289 3.716 8.289 8.284 0 4.569-3.717 8.286-8.29 8.286zm4.545-6.208c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.124-1.052-.388-2.003-1.237-.741-.66-1.241-1.476-1.386-1.725-.145-.249-.015-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.125-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.756 2.68 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.071 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.291z" />
  </svg>
)

interface MobileDemo {
  readonly id: string
  readonly tab: string
  readonly title: string
  readonly summary: string
  readonly image: string
  readonly metrics: readonly [string, string]
  readonly href: string
}

const LIVE_DEMOS: readonly MobileDemo[] = [
  {
    id: 'restoai',
    tab: 'RESTOia',
    title: 'Suite Gastronómica & KDS',
    summary: 'Salón, cocina en vivo, operación 100% offline y auditoría SHA-256.',
    image: '/portfolio/restoai.webp',
    metrics: ['100% Offline', 'Motor KOBE'],
    href: 'https://kobe-sand.vercel.app/',
  },
  {
    id: 'sportmanager',
    tab: 'Deportes',
    title: 'SportManager / PlayHub',
    summary: 'Reservas de canchas 24/7 con señas por Mercado Pago y bloqueo anti-solapamiento.',
    image: '/portfolio/sportmanager.webp',
    metrics: ['Turnos 24/7', 'Multi-Tenant'],
    href: 'https://sportmanager-playhub.vercel.app',
  },
  {
    id: 'celstore',
    tab: 'Tienda 3D',
    title: 'CelStore E-Commerce 3D',
    summary: 'Catálogo interactivo en Three.js, stock atómico y cobros sin comisiones.',
    image: '/portfolio/celstore.webp',
    metrics: ['Visor 3D', '0% Comisión'],
    href: 'https://multi-tiendas-celphone.vercel.app',
  },
]

interface QuickPlan {
  readonly id: 'landing' | 'ecommerce' | 'linux'
  readonly tab: string
  readonly name: string
  readonly setupARS: string
  readonly setupUSD: string
  readonly monthlyARS: string
  readonly monthlyUSD: string
  readonly highlights: readonly [string, string, string]
  readonly quoteHref: string
}

const QUICK_PLANS: readonly QuickPlan[] = [
  {
    id: 'landing',
    tab: 'Landing',
    name: 'Landing & Web Profesional',
    setupARS: '$450.000',
    setupUSD: 'u$s 380',
    monthlyARS: '$15.000/mes',
    monthlyUSD: 'u$s 25/mes',
    highlights: [
      'Diseño a medida + carga ultrarrápida',
      'WhatsApp directo, SEO técnico y dominio',
      'Código fuente 100% de tu propiedad',
    ],
    quoteHref: '/cotizador?plan=landing',
  },
  {
    id: 'ecommerce',
    tab: 'Tienda / App',
    name: 'E-Commerce o Turnos',
    setupARS: '$750.000',
    setupUSD: 'u$s 850',
    monthlyARS: '$35.000/mes',
    monthlyUSD: 'u$s 60/mes',
    highlights: [
      'Catálogo, carrito o agenda de turnos 24/7',
      'Cobros Mercado Pago / transferencia (0% fee)',
      'Panel de administración y base PostgreSQL',
    ],
    quoteHref: '/cotizador?plan=ecommerce',
  },
  {
    id: 'linux',
    tab: 'Linux POS',
    name: 'Terminal Linux POS',
    setupARS: '$350.000',
    setupUSD: 'u$s 320',
    monthlyARS: '$18.000/mes',
    monthlyUSD: 'u$s 30/mes',
    highlights: [
      'Revive PCs lentas de caja (arranque en 4.5s)',
      'Modo quiosco blindado · $0 en licencias',
      'Impresoras térmicas ESC/POS + USB rescate',
    ],
    quoteHref: '/cotizador?plan=linux',
  },
]

export default function MobileLandingView() {
  const { t } = useTranslation()
  const [activeDemoIdx, setActiveDemoIdx] = useState(0)
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [activePlanIdx, setActivePlanIdx] = useState(1)

  const activeDemo = LIVE_DEMOS[activeDemoIdx] ?? LIVE_DEMOS[0]!
  const activePlan = QUICK_PLANS[activePlanIdx] ?? QUICK_PLANS[0]!

  const whatsappHeroUrl = getWhatsAppUrl(
    '¡Hola Exequiel! Vi tu web desde el celular y quiero cotizar mi proyecto.'
  )
  const whatsappCloseUrl = getWhatsAppUrl(
    '¡Hola Exequiel! Quiero consultar por un desarrollo web / sistema a medida.'
  )

  return (
    <div
      data-mobile-landing="true"
      className="relative z-10 w-full flex flex-col bg-transparent text-foreground overflow-x-clip pb-24"
    >
      {/* ==============================================================
          1. HERO FOCAL CON PLANETA 3D (LIMPIO, MODERNO, SIN RUIDO)
         ============================================================== */}
      <section
        id="hero-mobile"
        className="relative min-h-[calc(100dvh-5rem)] flex flex-col justify-between pt-20 pb-6 px-4"
      >
        {/* Halo ambiental sutil detrás del planeta */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/12 dark:bg-cyan-500/14 blur-3xl"
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto w-full">
          {/* Eyebrow único y limpio (sin duplicar 2025) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-[10px] font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Exequiel Echevarría · Architect · 2025</span>
          </div>

          {/* Titular nítido y directo */}
          <h1 className="text-[28px] min-[390px]:text-[32px] font-display font-bold tracking-tight leading-[1.08] text-foreground">
            {t('mobile.h1', 'Tu Web & Software a Medida')}
          </h1>

          {/* Propuesta en 1 línea pragmática */}
          <p className="mt-2 text-[13px] text-muted-foreground leading-snug max-w-[300px]">
            Código 100% tuyo · <span className="text-foreground font-semibold">1 solo pago</span> ·
            Sin alquileres.
          </p>

          {/* PLANETA 3D INTERACTIVO — PROTAGONISTA */}
          <div className="relative w-[248px] min-[390px]:w-[272px] max-w-[74vw] my-2 flex flex-col items-center">
            <OptimusGlyphSphere
              className="w-full aspect-square"
              sphereRadius={210}
              radiusRatio={0.43}
            />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/8 text-[10px] font-mono text-muted-foreground -mt-3">
              <Compass className="w-3 h-3 text-emerald-500 dark:text-cyan-400" />
              <span>Deslizá para girar</span>
            </span>
          </div>

          {/* Acciones principales — ergonómicas, sin recortes ni superposición */}
          <div className="w-full mt-4 space-y-2.5">
            <a
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('contact_whatsapp_clicked', { source: 'mobile_hero_cta' })}
              className="w-full h-12 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm flex items-center justify-between shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span className="flex items-center gap-2.5">
                <WhatsAppVectorIcon className="w-4.5 h-4.5 shrink-0" />
                <span>Cotizar por WhatsApp</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-950/12">
                <span>15 min</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/cotizador"
                onClick={() =>
                  trackEvent('cotizador_plan_selected', { source: 'mobile_hero_secondary' })
                }
                className="h-11 px-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/10 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-cyan-400 shrink-0" />
                <span>Cotizador</span>
              </Link>

              <a
                href="#demos-mobile"
                onClick={() =>
                  trackEvent('hero_cta_demo_clicked', { source: 'mobile_hero_scroll' })
                }
                className="h-11 px-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/90 dark:border-white/10 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-cyan-400 shrink-0" />
                <span>Ver Demos</span>
              </a>
            </div>
          </div>

          {/* Barra de confianza compacta (3 datos clave) */}
          <div className="mt-4 w-full grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/10 rounded-xl bg-slate-50/90 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 py-2">
            <div className="px-2">
              <p className="text-xs font-bold font-mono text-foreground">100%</p>
              <p className="text-[10px] text-muted-foreground">Código tuyo</p>
            </div>
            <div className="px-2">
              <p className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                0%
              </p>
              <p className="text-[10px] text-muted-foreground">Comisiones</p>
            </div>
            <div className="px-2">
              <p className="text-xs font-bold font-mono text-foreground">4.9/5</p>
              <p className="text-[10px] text-muted-foreground">SLA contrato</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. SISTEMAS REALES EN PRODUCCIÓN (SELECTOR INTERACTIVO LIMPIO)
         ============================================================== */}
      <section id="demos-mobile" className="scroll-mt-20 px-4 py-7">
        <div className="max-w-sm mx-auto space-y-3.5">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
                En producción
              </p>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
                Probá sistemas reales
              </h2>
            </div>
            <Link
              href="/portafolio"
              className="text-xs font-semibold text-emerald-600 dark:text-cyan-400 inline-flex items-center gap-0.5 shrink-0"
            >
              <span>Ver los 11</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Selector por pestañas */}
          <div
            role="tablist"
            aria-label="Demos en producción"
            className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8"
          >
            {LIVE_DEMOS.map((demo, idx) => {
              const selected = idx === activeDemoIdx
              return (
                <button
                  key={demo.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActiveDemoIdx(idx)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'bg-white dark:bg-[#11192c] text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/12'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {demo.tab}
                </button>
              )
            })}
          </div>

          {/* Tarjeta enfocada del demo seleccionado */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                <img
                  src={activeDemo.image}
                  alt={activeDemo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#090e1a]/85 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/12 text-[10px] font-mono font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                  {activeDemo.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="px-2 py-0.5 rounded-md bg-white/12 backdrop-blur-md text-[10px] font-mono font-medium text-white border border-white/15"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {activeDemo.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {activeDemo.summary}
                  </p>
                </div>

                <a
                  href={activeDemo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('demo_interactive_used', { demoId: activeDemo.id })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <span>Probar sistema en vivo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ==============================================================
          3. PRECIOS CLAROS (SELECTOR ARS / USD + 3 PLANES COMPACTOS)
         ============================================================== */}
      <section className="px-4 py-6">
        <div className="max-w-sm mx-auto space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
                Inversión clara
              </p>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
                Planes de 1 solo pago
              </h2>
            </div>

            {/* Toggle compacto ARS / USD */}
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 shrink-0">
              {(['ARS', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                    currency === curr
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Pestañas de plan */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8">
            {QUICK_PLANS.map((plan, idx) => {
              const selected = idx === activePlanIdx
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setActivePlanIdx(idx)}
                  className={`py-2 px-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'bg-white dark:bg-[#11192c] text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/12'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {plan.tab}
                </button>
              )
            })}
          </div>

          {/* Tarjeta del plan activo */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">{activePlan.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Desarrollo único · Sin comisiones
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-display font-black tracking-tight text-foreground leading-none">
                  {currency === 'ARS' ? activePlan.setupARS : activePlan.setupUSD}
                </p>
                <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  Mant. opc. {currency === 'ARS' ? activePlan.monthlyARS : activePlan.monthlyUSD}
                </p>
              </div>
            </div>

            <ul className="space-y-2 border-t border-slate-100 dark:border-white/8 pt-3">
              {activePlan.highlights.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={activePlan.quoteHref}
              onClick={() =>
                trackEvent('cotizador_plan_selected', {
                  source: 'mobile_home_pricing',
                  plan: activePlan.id,
                })
              }
              className="w-full h-11 px-4 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <span>Personalizar este plan</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==============================================================
          4. COMPARATIVA VISUAL RÁPIDA + ACCESO LINUX POS
         ============================================================== */}
      <section className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-emerald-500/8 border border-emerald-500/25 space-y-2">
              <p className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                ExePaginasWeb
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>1 solo pago</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Código tuyo</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>0% comisiones</span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/6 border border-rose-500/20 space-y-2">
              <p className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                Alquiler SaaS
              </p>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <X className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Cuota eterna</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <X className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Fees por venta</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <X className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Sitio cautivo</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta slim Linux POS */}
          <Link
            href="/linux"
            className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/12 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  Terminales Linux POS para Locales
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Arranque en 4.5s · $0 en licencias · Sin virus
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </Link>
        </div>
      </section>

      {/* ==============================================================
          5. CIERRE DIRECTO + PIE COMPACTO MÓVIL
         ============================================================== */}
      <section className="px-4 pt-4 pb-2">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 dark:bg-[#0d1424] border border-slate-800 dark:border-emerald-500/30 text-white text-center space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Atención directa · Sin agencias
            </p>
            <h2 className="text-lg font-display font-bold leading-snug">
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Contame tu negocio y recibís alcance y presupuesto técnico en menos de 15 minutos.
            </p>
            <a
              href={whatsappCloseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('contact_whatsapp_clicked', { source: 'mobile_contact_footer' })
              }
              className="w-full h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <WhatsAppVectorIcon className="w-4 h-4" />
              <span>Abrir WhatsApp Directo</span>
            </a>
          </div>

          <footer className="pt-3 border-t border-slate-200/70 dark:border-white/8 text-center space-y-2.5">
            <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[11px] font-medium text-muted-foreground">
              <Link href="/soluciones" className="hover:text-foreground">
                Soluciones
              </Link>
              <Link href="/linux" className="hover:text-foreground">
                Linux POS
              </Link>
              <Link href="/tienda" className="hover:text-foreground">
                Abonos
              </Link>
              <Link href="/terminos" className="hover:text-foreground">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-foreground">
                Privacidad
              </Link>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/75">
              © 2025 Exequiel Echevarría — ExePaginasWeb · {DISPLAY_WHATSAPP_NUMBER}
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
