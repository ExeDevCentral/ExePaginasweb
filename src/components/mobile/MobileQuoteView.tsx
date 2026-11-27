/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileQuoteView:
 * Cotizador interactivo optimizado exclusivamente para celulares (< 768px).
 * - Sin desborde horizontal ni canvases pesados
 * - Cálculo financiero exacto con BigInt monetario (centavos)
 * - Dos modos pragmáticos: Planes Base o Armar a Medida en 3 pasos
 */
'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  Code2,
  Layout,
  Send,
  ShoppingCart,
  Terminal,
} from 'lucide-react'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

type Currency = 'ARS' | 'USD'
type QuoteMode = 'plans' | 'custom'

// Tasa de referencia en centavos enteros para conversión BigInt exacta
const ARS_PER_USD_RATE = BigInt(1150)

function formatMoneyFromCents(cents: bigint, currency: Currency): string {
  const units = cents / BigInt(100)
  if (currency === 'USD') {
    const usdUnits = units / ARS_PER_USD_RATE
    return `u$s ${usdUnits.toLocaleString('es-AR')}`
  }
  return `$${units.toLocaleString('es-AR').replaceAll(',', '.')}`
}

interface BasePlan {
  readonly id: 'landing' | 'ecommerce' | 'linux'
  readonly name: string
  readonly badge?: string
  readonly summary: string
  readonly setupCentsARS: bigint
  readonly setupUSDDisplay: string
  readonly monthlyARS: string
  readonly monthlyUSD: string
  readonly features: readonly string[]
  readonly icon: typeof Layout
  readonly defaultTypeId: string
  readonly defaultFeatureIds: readonly string[]
}

const BASE_PLANS: readonly BasePlan[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    summary: 'Sitio profesional de 1 página enfocado en conversión y velocidad.',
    setupCentsARS: BigInt(45000000),
    setupUSDDisplay: 'u$s 380',
    monthlyARS: '$15.000/mes',
    monthlyUSD: 'u$s 25/mes',
    features: [
      'Diseño a medida responsive',
      'Botón directo a WhatsApp + formulario',
      'SEO técnico y carga ultrarrápida',
      'Código 100% tuyo (1 solo pago)',
    ],
    icon: Layout,
    defaultTypeId: 'landing',
    defaultFeatureIds: ['whatsapp_bot'],
  },
  {
    id: 'ecommerce',
    name: 'Tienda / Turnos',
    badge: 'Más elegido',
    summary: 'Tienda online o sistema de reservas con cobros directos sin comisiones.',
    setupCentsARS: BigInt(75000000),
    setupUSDDisplay: 'u$s 850',
    monthlyARS: '$35.000/mes',
    monthlyUSD: 'u$s 60/mes',
    features: [
      'Catálogo + carrito o agenda 24/7',
      'Cobros Mercado Pago / transferencia (0% fee)',
      'Panel de gestión + base PostgreSQL',
      'Notificaciones automáticas y SLA',
    ],
    icon: ShoppingCart,
    defaultTypeId: 'ecommerce',
    defaultFeatureIds: ['payments', 'admin_panel'],
  },
  {
    id: 'linux',
    name: 'Terminal Linux POS',
    summary: 'Revive PCs de mostrador o caja en modo quiosco blindado (4.5s).',
    setupCentsARS: BigInt(35000000),
    setupUSDDisplay: 'u$s 320',
    monthlyARS: '$18.000/mes',
    monthlyUSD: 'u$s 30/mes',
    features: [
      'Arranque en 4.5s · $0 en licencias',
      'Soporte impresoras térmicas ESC/POS',
      'Llave USB de rescate instantáneo',
      'Sin virus ni actualizaciones que traban caja',
    ],
    icon: Terminal,
    defaultTypeId: 'linux-pos',
    defaultFeatureIds: ['offline_sync'],
  },
]

interface ProjectTypeOption {
  readonly id: string
  readonly label: string
  readonly baseCentsARS: bigint
  readonly icon: typeof Layout
}

const PROJECT_TYPES: readonly ProjectTypeOption[] = [
  { id: 'landing', label: 'Landing Page', baseCentsARS: BigInt(45000000), icon: Layout },
  { id: 'ecommerce', label: 'Tienda Online', baseCentsARS: BigInt(75000000), icon: ShoppingCart },
  { id: 'reservas', label: 'Turnos / Canchas', baseCentsARS: BigInt(65000000), icon: Calendar },
  { id: 'webapp', label: 'Sistema SaaS', baseCentsARS: BigInt(110000000), icon: Code2 },
  { id: 'crm', label: 'Panel / CRM', baseCentsARS: BigInt(89000000), icon: BarChart3 },
  { id: 'linux-pos', label: 'Linux POS', baseCentsARS: BigInt(35000000), icon: Terminal },
]

interface FeatureModule {
  readonly id: string
  readonly label: string
  readonly priceCentsARS: bigint
}

const FEATURE_MODULES: readonly FeatureModule[] = [
  { id: 'payments', label: 'Pagos Mercado Pago / PayPal', priceCentsARS: BigInt(14000000) },
  { id: 'admin_panel', label: 'Panel Admin & Roles', priceCentsARS: BigInt(16000000) },
  { id: 'whatsapp_bot', label: 'Automatización WhatsApp / n8n', priceCentsARS: BigInt(11000000) },
  { id: 'offline_sync', label: 'Operación Offline-First', priceCentsARS: BigInt(15000000) },
  { id: 'ai_assistant', label: 'Asistente IA Integrado', priceCentsARS: BigInt(18000000) },
  { id: 'multi_branch', label: 'Multi-Sucursal / Stock Real', priceCentsARS: BigInt(19000000) },
]

const WhatsAppVectorIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.484 2 12.018c0 1.907.534 3.69 1.464 5.215L2 22l4.914-1.424A9.972 9.972 0 0012.031 22c5.536 0 10.031-4.484 10.031-10.018C22.062 6.484 17.567 2 12.031 2zm0 18.286c-1.636 0-3.18-.45-4.524-1.233l-.324-.19-2.923.848.868-2.846-.21-.334a8.23 8.23 0 01-1.282-4.513c0-4.568 3.717-8.284 8.29-8.284 4.572 0 8.289 3.716 8.289 8.284 0 4.569-3.717 8.286-8.29 8.286zm4.545-6.208c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.124-1.052-.388-2.003-1.237-.741-.66-1.241-1.476-1.386-1.725-.145-.249-.015-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.125-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.756 2.68 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.071 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.291z" />
  </svg>
)

export default function MobileQuoteView() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<QuoteMode>('plans')
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [selectedTypeId, setSelectedTypeId] = useState<string>('ecommerce')
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(['payments']))
  const [expandedPlanId, setExpandedPlanId] = useState<string>('ecommerce')

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [sending, setSending] = useState(false)

  // guardrail-ok(useEffect): sync quote state from URL params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const curr = params.get('currency')
    if (curr === 'USD' || curr === 'ARS') setCurrency(curr)

    const plan = params.get('plan')
    if (plan === 'landing' || plan === 'ecommerce' || plan === 'linux') {
      setExpandedPlanId(plan)
    }

    const type = params.get('type')
    if (type && PROJECT_TYPES.some((t) => t.id === type)) {
      setSelectedTypeId(type)
      setMode('custom')
      setStep(1)
    }
  }, [])

  const selectedType = useMemo(
    () => PROJECT_TYPES.find((pt) => pt.id === selectedTypeId) ?? PROJECT_TYPES[0]!,
    [selectedTypeId]
  )

  const totalCentsARS = useMemo(() => {
    let sum = selectedType.baseCentsARS
    for (const mod of FEATURE_MODULES) {
      if (selectedModules.has(mod.id)) {
        sum += mod.priceCentsARS
      }
    }
    return sum
  }, [selectedType, selectedModules])

  const formattedTotal = useMemo(
    () => formatMoneyFromCents(totalCentsARS, currency),
    [totalCentsARS, currency]
  )

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleChooseBasePlan = (plan: BasePlan) => {
    setSelectedTypeId(plan.defaultTypeId)
    setSelectedModules(new Set(plan.defaultFeatureIds))
    setMode('custom')
    setStep(2)
    trackEvent('cotizador_plan_selected', { source: 'mobile_quote_base', plan: plan.id })
  }

  const selectedModuleLabels = useMemo(
    () => FEATURE_MODULES.filter((m) => selectedModules.has(m.id)).map((m) => m.label),
    [selectedModules]
  )

  const buildWhatsAppMessage = () => {
    const mods =
      selectedModuleLabels.length > 0 ? selectedModuleLabels.join(', ') : 'Configuración base'
    const sender = name.trim() ? `Soy ${name.trim()}. ` : ''
    return `¡Hola Exequiel! ${sender}Armé esta cotización desde el celular:\n• Proyecto: ${selectedType.label}\n• Módulos: ${mods}\n• Estimado: ${formattedTotal} (${currency}, 1 solo pago).\n¿Coordinamos los detalles?`
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) {
      toast.error('Completá tu nombre y WhatsApp o email')
      return
    }
    setSending(true)
    try {
      const isEmail = contact.includes('@')
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail ? contact.trim() : 'whatsapp-mobile@exepaginasweb.com',
          phone: isEmail ? '' : contact.trim(),
          message: buildWhatsAppMessage(),
          source: 'mobile_cotizador',
        }),
      })
      if (res.ok) {
        toast.success('Cotización enviada', {
          description: 'Exequiel te responderá en breve con el alcance formal.',
        })
        setName('')
        setContact('')
      } else {
        toast.info('Abriendo WhatsApp directo para acelerar tu respuesta')
        window.open(getWhatsAppUrl(buildWhatsAppMessage()), '_blank', 'noopener,noreferrer')
      }
    } catch {
      window.open(getWhatsAppUrl(buildWhatsAppMessage()), '_blank', 'noopener,noreferrer')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      data-mobile-quote="true"
      className="relative z-10 min-h-screen bg-transparent text-foreground pt-20 pb-36 px-4 overflow-x-clip"
    >
      <div className="max-w-sm mx-auto space-y-5">
        {/* Cabecera limpia y enfocada */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
              Cotizador móvil
            </p>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground mt-0.5">
              Presupuesto en 1 min
            </h1>
          </div>

          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 shrink-0 mt-1">
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

        {/* Selector de modo: Planes Base vs Armar a Medida */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8">
          <button
            type="button"
            onClick={() => setMode('plans')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'plans'
                ? 'bg-white dark:bg-[#11192c] text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/12'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Planes Base
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-white dark:bg-[#11192c] text-slate-950 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/12'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Armar a Medida
          </button>
        </div>

        {/* MODO A: PLANES BASE COMPACTOS (ACORDEÓN MODERNO) */}
        <AnimatePresence mode="wait">
          {mode === 'plans' ? (
            <motion.div
              key="mobile-quote-plans"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-3"
            >
              {BASE_PLANS.map((plan) => {
                const Icon = plan.icon
                const isExpanded = expandedPlanId === plan.id
                const displayPrice =
                  currency === 'ARS'
                    ? formatMoneyFromCents(plan.setupCentsARS, 'ARS')
                    : plan.setupUSDDisplay

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-[#0b1120] border-emerald-500/45 shadow-md'
                        : 'bg-white/80 dark:bg-[#0b101d]/80 border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedPlanId(plan.id)}
                      className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-sm font-bold text-foreground truncate">
                              {plan.name}
                            </h2>
                            {plan.badge && (
                              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold shrink-0">
                                {plan.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            Mant. opcional {currency === 'ARS' ? plan.monthlyARS : plan.monthlyUSD}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-base font-display font-black text-foreground leading-none">
                          {displayPrice}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground mt-1">
                          1 solo pago
                        </p>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-white/8 space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {plan.summary}
                        </p>
                        <ul className="space-y-1.5">
                          {plan.features.map((feat) => (
                            <li
                              key={feat}
                              className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => handleChooseBasePlan(plan)}
                          className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <span>Elegir {plan.name}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              <button
                type="button"
                onClick={() => {
                  setMode('custom')
                  setStep(0)
                }}
                className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-white/15 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                ¿Necesitás algo distinto? Armá tu presupuesto a medida →
              </button>
            </motion.div>
          ) : (
            /* MODO B: ARMAR A MEDIDA EN 3 PASOS PRAGMÁTICOS */
            <motion.div
              key="mobile-quote-custom"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="space-y-4"
            >
              {/* Barra de progreso 3 pasos */}
              <div className="grid grid-cols-3 gap-1.5">
                {['1. Proyecto', '2. Módulos', '3. Enviar'].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStep(idx as 0 | 1 | 2)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold text-center border transition-colors cursor-pointer ${
                      step === idx
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : step > idx
                          ? 'bg-slate-100 dark:bg-white/[0.05] border-transparent text-foreground'
                          : 'bg-transparent border-slate-200/70 dark:border-white/8 text-muted-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Paso 1: Tipo de proyecto */}
              {step === 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {PROJECT_TYPES.map((pt) => {
                    const Icon = pt.icon
                    const active = pt.id === selectedTypeId
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setSelectedTypeId(pt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer space-y-2 ${
                          active
                            ? 'bg-emerald-500/12 border-emerald-500/50 text-foreground shadow-xs'
                            : 'bg-white dark:bg-[#0b101d] border-slate-200/80 dark:border-white/10 text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon
                            className={`w-4.5 h-4.5 ${active ? 'text-emerald-500' : 'text-slate-400'}`}
                          />
                          {active && <Check className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground leading-tight">
                            {pt.label}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                            {formatMoneyFromCents(pt.baseCentsARS, currency)}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Paso 2: Módulos opcionales */}
              {step === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Sumá solo lo que tu operación necesita:
                  </p>
                  {FEATURE_MODULES.map((mod) => {
                    const checked = selectedModules.has(mod.id)
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className={`w-full p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer ${
                          checked
                            ? 'bg-emerald-500/12 border-emerald-500/45 text-foreground'
                            : 'bg-white dark:bg-[#0b101d] border-slate-200/80 dark:border-white/10 text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                                : 'border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                          </span>
                          <span className="text-xs font-semibold truncate">{mod.label}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          +{formatMoneyFromCents(mod.priceCentsARS, currency)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Paso 3: Resumen & Envío 1-Tap */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#0d1424] border border-emerald-500/35 text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                        Estimación transparente
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">1 solo pago</span>
                    </div>
                    <p className="text-3xl font-display font-black tracking-tight">
                      {formattedTotal}
                    </p>
                    <p className="text-xs text-slate-300">
                      {selectedType.label}
                      {selectedModuleLabels.length > 0
                        ? ` + ${selectedModuleLabels.length} módulo(s)`
                        : ''}
                    </p>
                  </div>

                  {/* Acción más rápida: WhatsApp directo con desglose */}
                  <a
                    href={getWhatsAppUrl(buildWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent('contact_whatsapp_clicked', { source: 'mobile_quote_summary' })
                    }
                    className="w-full h-12 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
                  >
                    <WhatsAppVectorIcon className="w-4.5 h-4.5" />
                    <span>{t('mobile.quote_send_whatsapp')}</span>
                  </a>

                  {/* Alternativa: Formulario ultracorto (2 campos) */}
                  <form
                    onSubmit={handleSubmitForm}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-white/10 space-y-3"
                  >
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                      {t('mobile.quote_or_contact')}
                    </p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('mobile.quote_name_placeholder')}
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="WhatsApp o Email"
                      required
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sending ? 'Enviando...' : 'Solicitar propuesta formal'}</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Barra fija de total y navegación en Modo Personalizado (sobre MobileBottomNav) */}
      {mode === 'custom' && step < 2 && (
        <div className="fixed bottom-[76px] inset-x-3 z-30 md:hidden">
          <div className="mx-auto max-w-md p-2.5 pl-4 rounded-2xl bg-slate-900/95 dark:bg-[#0d1527]/95 border border-white/12 backdrop-blur-xl shadow-xl flex items-center justify-between gap-2 text-white">
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                Estimado ({currency})
              </p>
              <p className="text-base font-display font-black leading-tight truncate">
                {formattedTotal}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : 0))}
                  aria-label="Paso anterior"
                  className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 2))}
                className="h-10 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <span>{step === 1 ? 'Ver resumen' : 'Siguiente'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
