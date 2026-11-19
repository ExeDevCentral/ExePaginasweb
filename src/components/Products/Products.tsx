/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Plus,
  Minus,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import {
  CyberAppointmentIcon,
  CyberComandaIcon,
  CyberCatalogIcon,
  CyberPitchRadarIcon,
  CyberCheckMark,
  CyberCalculatorIcon,
  WhatsAppLiveIcon,
} from '@/components/ui/MagnificentIcons'
import HudButton from '@/components/HudButton'
import ProductDemo from './ProductDemo'

export type RubroKey = 'peluqueria' | 'panaderia' | 'ropa' | 'padel'

interface RubroConfig {
  tKey: RubroKey
  anchorId: string
  shortLabel: string
  roiLabel: string
  price: string
  basePrice: number
  gradient: string
  accentBorder: string
  accentText: string
  glowRgba: string
  pillActive: string
  demoZoneAnchor: string
  kpis: { label: string; value: string }[]
  icon: React.ComponentType<{ className?: string; strokeWidth?: number; size?: number }>
}

const RUBROS: RubroConfig[] = [
  {
    tKey: 'peluqueria',
    anchorId: 'peluqueria',
    shortLabel: 'Peluquerías',
    roiLabel: 'Agenda Llena 24/7',
    price: '$250-450 USD',
    basePrice: 250,
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    accentBorder: 'border-pink-500/40',
    accentText: 'text-pink-400',
    glowRgba: 'rgba(244, 63, 94, 0.22)',
    pillActive: 'bg-pink-500/15 border-pink-500/50 text-pink-300',
    demoZoneAnchor: '#demo-salon',
    kpis: [
      { label: 'Turnos Online', value: '+38%' },
      { label: 'Ausentismo', value: '-70%' },
      { label: 'Comisiones', value: '0%' },
    ],
    icon: CyberAppointmentIcon,
  },
  {
    tKey: 'panaderia',
    anchorId: 'panaderia',
    shortLabel: 'Panaderías',
    roiLabel: '+40% Ventas Mostrador',
    price: '$200-400 USD',
    basePrice: 200,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    accentBorder: 'border-amber-500/40',
    accentText: 'text-amber-400',
    glowRgba: 'rgba(245, 158, 11, 0.22)',
    pillActive: 'bg-amber-500/15 border-amber-500/50 text-amber-300',
    demoZoneAnchor: '#demo-coffee',
    kpis: [
      { label: 'Ticket POS', value: '1.4 seg' },
      { label: 'Merma Insumos', value: '-32%' },
      { label: 'Encargos Web', value: '24/7' },
    ],
    icon: CyberComandaIcon,
  },
  {
    tKey: 'ropa',
    anchorId: 'indumentaria',
    shortLabel: 'Indumentaria',
    roiLabel: 'Control Talles & Stock',
    price: '$300-500 USD',
    basePrice: 300,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    glowRgba: 'rgba(16, 185, 129, 0.22)',
    pillActive: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300',
    demoZoneAnchor: '#demo-aura',
    kpis: [
      { label: 'Sync Stock', value: 'Tiempo Real' },
      { label: 'Escaneo QR', value: 'Instantáneo' },
      { label: 'Conversión', value: '+44%' },
    ],
    icon: CyberCatalogIcon,
  },
  {
    tKey: 'padel',
    anchorId: 'canchas',
    shortLabel: 'Canchas & Clubes',
    roiLabel: '+45% Ocupación',
    price: '$350-550 USD',
    basePrice: 350,
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    glowRgba: 'rgba(56, 189, 248, 0.22)',
    pillActive: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300',
    demoZoneAnchor: '#demo-neofit',
    kpis: [
      { label: 'Ocupación', value: '+45%' },
      { label: 'Señas MP', value: 'Automáticas' },
      { label: 'Control Luz', value: 'IoT / Auto' },
    ],
    icon: CyberPitchRadarIcon,
  },
]

const HASH_TO_RUBRO: Record<string, RubroKey> = {
  '#peluqueria': 'peluqueria',
  '#panaderia': 'panaderia',
  '#indumentaria': 'ropa',
  '#ropa': 'ropa',
  '#canchas': 'padel',
  '#padel': 'padel',
}

const Products = () => {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState<RubroKey>('peluqueria')
  const [demoOpen, setDemoOpen] = useState(false)

  // Estimator state
  const [showEstimator, setShowEstimator] = useState(false)
  const [sucursales, setSucursales] = useState(1)
  const [includeWhatsAppBot, setIncludeWhatsAppBot] = useState(true)

  // Interactive Sandbox States
  const [stylistIndex, setStylistIndex] = useState(0)
  const [hairSlot, setHairSlot] = useState('18:30')
  const [bakeryItems, setBakeryItems] = useState(6)
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL'>('M')
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedCourtSlot, setSelectedCourtSlot] = useState('19:00 Hs')

  // Sync URL hash (#peluqueria, #panaderia, #indumentaria, #canchas)
  useEffect(() => {
    const syncHash = () => {
      const matched = HASH_TO_RUBRO[window.location.hash]
      if (matched) setActiveKey(matched)
    }
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const activeRubro = RUBROS.find((r) => r.tKey === activeKey) ?? RUBROS[0]!
  const ActiveIcon = activeRubro.icon
  const estimatedTotal = activeRubro.basePrice * sucursales + (includeWhatsAppBot ? 80 : 0)

  const stylists = [
    t('products.widget_pelu_stylist_1', 'Sofía (Estilista)'),
    t('products.widget_pelu_stylist_2', 'Lucas (Barbero)'),
  ]
  const garmentColors = [
    t('products.widget_ropa_color_1', 'Negro'),
    t('products.widget_ropa_color_2', 'Beige'),
  ]
  const stockMatrix: Record<'S' | 'M' | 'L' | 'XL', number> = {
    S: 6,
    M: 14,
    L: 9,
    XL: 4,
  }

  const scrollToDemoZone = (anchor: string) => {
    const target = document.querySelector(anchor) ?? document.getElementById('demo')
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const triggerSimulation = (message: string) => {
    toast.success(message)
    void confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      disableForReducedMotion: true,
    })
  }

  return (
    <section
      id="products"
      className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Dynamic Ambient Aura */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full blur-[130px] transition-colors duration-700"
        style={{ background: activeRubro.glowRgba }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-[0.25em] mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('products.seccion_titulo')}</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(34,211,238,0.28)]">
              {t('products.heading')}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            {t('products.descripcion')}
          </p>
        </motion.div>

        {/* Unified Rubro Switcher Deck (preserves #peluqueria, #panaderia, #indumentaria, #canchas) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {RUBROS.map((rubro) => {
            const Icon = rubro.icon
            const isActive = rubro.tKey === activeKey
            return (
              <button
                key={rubro.tKey}
                id={rubro.anchorId}
                type="button"
                onClick={() => setActiveKey(rubro.tKey)}
                className={`scroll-mt-28 relative group text-left p-4 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                  isActive
                    ? `${rubro.pillActive} shadow-lg`
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-900/80'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="unifiedRubroIndicator"
                    className={`absolute inset-x-4 top-0 h-[2px] rounded-full bg-gradient-to-r ${rubro.gradient}`}
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
                    {rubro.roiLabel}
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-white">{rubro.shortLabel}</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{rubro.price}</div>
              </button>
            )
          })}
        </div>

        {/* Unified Bento Stage */}
        <div
          className={`relative rounded-3xl border ${activeRubro.accentBorder} bg-gradient-to-br from-slate-950/95 via-[#0f1322]/95 to-[#090c15]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden transition-colors duration-500`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${activeRubro.gradient}`}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRubro.tKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Specs, Features & Linked Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                    <ActiveIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${activeRubro.accentText}`}
                      >
                        {activeRubro.roiLabel}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Código 100% Propio
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-montserrat">
                      {t(`products.${activeRubro.tKey}_titulo`)}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                      {t(`products.${activeRubro.tKey}_desc`)}
                    </p>
                  </div>
                </div>

                {/* 3 Live Business Impact KPI Pills */}
                <div className="grid grid-cols-3 gap-2.5">
                  {activeRubro.kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center"
                    >
                      <div
                        className={`text-base sm:text-lg font-black font-mono ${activeRubro.accentText}`}
                      >
                        {kpi.value}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5 Key Features */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs sm:text-sm text-slate-200"
                    >
                      <CyberCheckMark className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t(`products.${activeRubro.tKey}_feat_${idx}`)}</span>
                    </li>
                  ))}
                </ul>

                {/* Investment & Inline Estimator */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                        {t('products.inversion', 'Inversión estimada')}
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {showEstimator ? `$${estimatedTotal} USD` : activeRubro.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEstimator((v) => !v)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cyan-300 transition-colors"
                    >
                      <CyberCalculatorIcon className="w-4 h-4" />
                      <span>{showEstimator ? 'Ocultar calculador' : 'Calcular por sucursal'}</span>
                    </button>
                  </div>

                  {showEstimator && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">Sucursales:</span>
                        <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => setSucursales((s) => Math.max(1, s - 1))}
                            className="p-1 hover:bg-white/10 rounded"
                            aria-label="Restar sucursal"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-300" />
                          </button>
                          <span className="px-2 font-mono font-bold text-white">{sucursales}</span>
                          <button
                            type="button"
                            onClick={() => setSucursales((s) => Math.min(5, s + 1))}
                            className="p-1 hover:bg-white/10 rounded"
                            aria-label="Sumar sucursal"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-300" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIncludeWhatsAppBot((v) => !v)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                          includeWhatsAppBot
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        <WhatsAppLiveIcon className="w-3.5 h-3.5" />
                        <span>Bot WhatsApp (+$80 USD)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <HudButton
                    label={t('products.ver_demo', 'VER DEMO EN VIVO')}
                    variant="primary"
                    size="md"
                    onClick={() => setDemoOpen(true)}
                    icon={<ExternalLink className="w-4 h-4" />}
                    iconPosition="right"
                  />

                  <Link
                    href={`/cotizador?rubro=${activeRubro.tKey}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-semibold text-white transition-all"
                  >
                    <span>Cotizar sistema</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => scrollToDemoZone(activeRubro.demoZoneAnchor)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors"
                  >
                    <span>Ver subpágina 3D</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive Rubro Sandbox */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/15 bg-[#070911] shadow-2xl overflow-hidden">
                  {/* OS Window Chrome */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                      <Cpu className="w-3 h-3" />
                      <span>SIMULADOR EN VIVO // {activeRubro.shortLabel}</span>
                    </div>
                  </div>

                  {/* Interactive Widget Body */}
                  <div className="p-5 space-y-4">
                    {activeRubro.tKey === 'peluqueria' && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Estilista:</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Disponible hoy
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {stylists.map((name, idx) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => setStylistIndex(idx)}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                                stylistIndex === idx
                                  ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['17:00', '18:30', '20:00'].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setHairSlot(slot)}
                              className={`py-2 rounded-lg text-xs font-mono border transition-all ${
                                hairSlot === slot
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                                  : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              {slot} Hs
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                          <span className="text-slate-300">Corte & Peinado</span>
                          <span className="font-mono font-bold text-pink-300">$4.500 ARS</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerSimulation(
                              `Turno simulado con ${stylists[stylistIndex]} a las ${hairSlot} Hs`
                            )
                          }
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold hover:brightness-110 transition-all"
                        >
                          Confirmar Turno (Simulación)
                        </button>
                      </>
                    )}

                    {activeRubro.tKey === 'panaderia' && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Tanda Recién Horneada:</span>
                          <span className="text-amber-300 font-mono font-bold">
                            17:30 Hs (Listo)
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white">
                              {bakeryItems} Facturas / Medialunas
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              Total: ${(bakeryItems * 650).toLocaleString('es-AR')} ARS
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setBakeryItems((c) => Math.max(1, c - 6))}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300"
                            >
                              -6
                            </button>
                            <button
                              type="button"
                              onClick={() => setBakeryItems((c) => c + 12)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-xs font-bold text-amber-200"
                            >
                              + Docena
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerSimulation(
                              `Comanda POS emitida: ${bakeryItems} un. ($${(bakeryItems * 650).toLocaleString('es-AR')} ARS)`
                            )
                          }
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-bold hover:brightness-110 transition-all"
                        >
                          Emitir Ticket POS (Simulación)
                        </button>
                      </>
                    )}

                    {activeRubro.tKey === 'ropa' && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold">
                            Campera Eco-Cuero Urban
                          </span>
                          <span className="text-emerald-400 font-mono font-bold">
                            Stock: {stockMatrix[selectedSize]} un.
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(['S', 'M', 'L', 'XL'] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setSelectedSize(sz)}
                              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                                selectedSize === sz
                                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                  : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          {garmentColors.map((col, idx) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => setSelectedColorIndex(idx)}
                              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                selectedColorIndex === idx
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                                  : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              {col}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerSimulation(
                              `Agregado: Talle ${selectedSize} · ${garmentColors[selectedColorIndex]}`
                            )
                          }
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-xs font-bold hover:brightness-110 transition-all"
                        >
                          Descontar Stock & Cobrar QR
                        </button>
                      </>
                    )}

                    {activeRubro.tKey === 'padel' && (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-semibold">
                            Cancha 1 (Sintético Blindex)
                          </span>
                          <span className="text-cyan-400 font-semibold">Disponible</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {['17:30 Hs', '19:00 Hs', '20:30 Hs', '22:00 Hs'].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedCourtSlot(slot)}
                              className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                                selectedCourtSlot === slot
                                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                                  : 'bg-white/5 border-white/10 text-slate-400'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerSimulation(
                              `Cancha 1 reservada para las ${selectedCourtSlot} · Luces programadas`
                            )
                          }
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-xs font-bold hover:brightness-110 transition-all"
                        >
                          Reservar con Seña MercadoPago
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Cross-Link CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/cotizador"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 font-semibold text-sm sm:text-base hover:bg-cyan-500/15 transition-all"
          >
            <span>{t('products.cta_boton')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Full Interactive Product Demo Modal */}
      <ProductDemo isOpen={demoOpen} onClose={() => setDemoOpen(false)} productType={activeKey} />
    </section>
  )
}

export default Products
