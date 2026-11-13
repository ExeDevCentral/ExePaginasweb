/**
 * © 2025 Exequiel Echevarría — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * OwnershipVsSubscription:
 * Cockpit compacto de Honestidad Brutal (Alquilar vs. Ser Dueño):
 * - Izquierda: Selector de etapa, simulador de ventas BigInt, veredicto IA y matriz táctica de 4 ejes.
 * - Derecha: Comparativa visual acumulada a 36 meses (Alquiler vs. Activo Propio) + simulador de apagón.
 * - Cierre: Sello de propiedad real (GitHub + PostgreSQL + 0% comisiones, Origen 2025).
 */
'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@astryxdesign/core'
import {
  Sparkles,
  ShoppingBag,
  CalendarCheck,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Zap,
  Terminal,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'
import { CyberInsignia } from '@/components/ui/MagnificentIcons'

const AUDIT_TITLE =
  'Software Diseñado Alrededor de Tu Negocio: ¿Cuándo Conviene Alquilar y Cuándo Ser Dueño?'

type DecisionPhase = 'experimental' | 'escala'
type BusinessScenarioId = 'experimental' | 'ecommerce' | 'servicios'
type AxisId = 'codigo' | 'datos' | 'comisiones' | 'continuidad'

interface BusinessScenario {
  id: BusinessScenarioId
  phase: DecisionPhase
  badge: string
  shortLabel: string
  subtitle: string
  defaultMonthlyArs: number
  defaultFeePct: bigint
  aiVerdictTag: string
  aiHeadline: string
  aiExplanation: string
}

const SCENARIOS: readonly [BusinessScenario, ...BusinessScenario[]] = [
  {
    id: 'experimental',
    phase: 'experimental',
    badge: 'FASE EXPERIMENTAL',
    shortLabel: 'Recién Empiezo',
    subtitle: 'Sin ventas fijas aún',
    defaultMonthlyArs: 1_000_000,
    defaultFeePct: 3n,
    aiVerdictTag: 'HONESTIDAD BRUTAL · RECOMENDACIÓN IA',
    aiHeadline: 'Todavía NO inviertas en software a medida: alquilá algo básico para validar',
    aiExplanation:
      'Si estás experimentando y aún no validaste ventas todos los meses, usar una plantilla económica por 3 a 6 meses es la decisión financiera correcta.',
  },
  {
    id: 'ecommerce',
    phase: 'escala',
    badge: 'FASE ESCALA · VENTAS ACTIVAS',
    shortLabel: 'Vendo Productos',
    subtitle: 'Me cobran por cada venta',
    defaultMonthlyArs: 5_000_000,
    defaultFeePct: 5n,
    aiVerdictTag: 'ALERTA IA · FUGA DE GANANCIA DETECTADA',
    aiHeadline: 'Alquiler + comisión por venta te está comiendo un sueldo entero al año',
    aiExplanation:
      'Cuando tu tienda ya vende, el alquiler con comisión se lleva entre el 3% y el 10% de tu facturación para siempre. Con sistema propio pagás una vez y el 100% es tuyo.',
  },
  {
    id: 'servicios',
    phase: 'escala',
    badge: 'FASE ESCALA · SERVICIOS & B2B',
    shortLabel: 'Servicios / B2B',
    subtitle: 'Turnos, velocidad y prestigio',
    defaultMonthlyArs: 8_000_000,
    defaultFeePct: 5n,
    aiVerdictTag: 'DIAGNÓSTICO IA · ACTIVO DIGITAL PROPIO',
    aiHeadline: 'Tu marca necesita un activo propio que nadie pueda suspender ni limitar',
    aiExplanation:
      'Las plataformas alquiladas te encasillan en plantillas lentas y retienen tu base de clientes. Con arquitectura propia tu web vuela y es 100% tuya de por vida.',
  },
] as const

interface QuestionPillar {
  id: AxisId
  number: string
  tabLabel: string
  question: string
  axisTitle: string
  rentPain: string
  ownGain: string
  rentControlPct: number
  terminalCmd: string
  terminalRentOut: string
  terminalOwnOut: string
}

const QUESTION_PILLARS: readonly [QuestionPillar, ...QuestionPillar[]] = [
  {
    id: 'codigo',
    number: '01',
    tabLabel: 'Código',
    question: '¿De quién es la web cuando terminás de pagarla?',
    axisTitle: 'Propiedad del Código Fuente',
    rentPain:
      'En plataformas de alquiler nunca sos dueño de nada. Aunque pagues 5 años, si dejás de pagar te quedás sin sistema.',
    ownGain:
      'Recibís la escritura digital completa (Repositorio GitHub a tu nombre). Lo pagás una vez y es tuyo para siempre.',
    rentControlPct: 0,
    terminalCmd: '$ git clone https://github.com/tu-empresa/sistema-web.git',
    terminalRentOut: '✗ 402 Payment Required · Código cerrado cautivo en servidor ajeno',
    terminalOwnOut: '✓ Repositorio transferido a tu nombre — 100% propiedad legal y técnica',
  },
  {
    id: 'comisiones',
    number: '02',
    tabLabel: 'Comisiones',
    question: '¿Cuánto me descuentan cada vez que vendo algo?',
    axisTitle: 'Comisiones de Venta y Pasarelas',
    rentPain:
      'Pagás cuota mensual fija más un peaje del 3% al 10% por venta. Cuanto mejor te va, más plata te sacan.',
    ownGain:
      '0% de comisiones por venta para siempre. Tus cobros entran limpios directo a tu cuenta.',
    rentControlPct: 10,
    terminalCmd: '$ audit-checkout --commission-fee',
    terminalRentOut: '✗ Descuento automático del 3% al 10% sobre cada ticket de venta',
    terminalOwnOut: '✓ 0.0% comisión ExePaginasWeb · 100% del dinero directo a tu cuenta',
  },
  {
    id: 'datos',
    number: '03',
    tabLabel: 'Base de Datos',
    question: '¿Mis clientes e historial quedan en mis manos?',
    axisTitle: 'Base de Datos y Tus Clientes',
    rentPain:
      'Tus clientes, pedidos y métricas están encerrados en el sistema de ellos. Mudarse implica perder historial.',
    ownGain:
      'Base de datos PostgreSQL propia y dedicada. Tus clientes, ventas y estadísticas están bajo tu llave exclusiva.',
    rentControlPct: 15,
    terminalCmd: '$ pg_dump --schema=public --verify-ownership',
    terminalRentOut: '✗ Acceso denegado: Base de datos compartida bajo llave del proveedor',
    terminalOwnOut: '✓ PostgreSQL dedicada (Supabase) con acceso total y backups tuyos',
  },
  {
    id: 'continuidad',
    number: '04',
    tabLabel: 'Continuidad',
    question: '¿Me pueden apagar la página de un día para el otro?',
    axisTitle: 'Continuidad Operativa',
    rentPain:
      'Si vence una tarjeta o suben la cuota en dólares, un robot suspende tu tienda en 24 hs y perdés tus ventas.',
    ownGain:
      'Nadie tiene un botón para apagarte el negocio. Tu web sigue online 24/7 sin cuotas extorsivas.',
    rentControlPct: 20,
    terminalCmd: '$ curl -I https://tu-negocio.com/status',
    terminalRentOut: '✗ HTTP 402 Payment Required — Tienda suspendida automáticamente',
    terminalOwnOut: '✓ HTTP 200 OK — Sistema 100% activo sin vencimientos ni bloqueos',
  },
] as const

const QUICK_REVENUE_STOPS = [
  { label: '$1M', value: 1_000_000 },
  { label: '$5M', value: 5_000_000 },
  { label: '$15M', value: 15_000_000 },
  { label: '$30M', value: 30_000_000 },
] as const

const FEE_OPTIONS: readonly { label: string; pct: bigint }[] = [
  { label: '3%', pct: 3n },
  { label: '5%', pct: 5n },
  { label: '10%', pct: 10n },
] as const

/**
 * Cálculo financiero exacto con BigInt (Principio 3 de Ingeniería Real).
 */
function calculateAuditNumbers(monthlySalesArs: number, feePct: bigint, locale = 'es-AR') {
  const monthlySales = BigInt(Math.round(monthlySalesArs))
  const fixedMonthlyRent = 60_000n // Canon base promedio SaaS + apps obligatorias
  const monthlyCommission = (monthlySales * feePct) / 100n
  const monthlyDrain = monthlyCommission + fixedMonthlyRent
  const drainYear1 = monthlyDrain * 12n
  const drainYear2 = monthlyDrain * 24n
  const drainYear3 = monthlyDrain * 36n

  const fmt = new Intl.NumberFormat(locale)
  return {
    monthlyDrainFormatted: `$${fmt.format(monthlyDrain)}`,
    drainYear1Formatted: `$${fmt.format(drainYear1)}`,
    drainYear2Formatted: `$${fmt.format(drainYear2)}`,
    drainYear3Formatted: `$${fmt.format(drainYear3)}`,
    monthlySalesFormatted: `$${fmt.format(monthlySales)}`,
  }
}

export const OwnershipVsSubscription: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [scenarioId, setScenarioId] = React.useState<BusinessScenarioId>('ecommerce')
  const [monthlySalesArs, setMonthlySalesArs] = React.useState<number>(5_000_000)
  const [feePct, setFeePct] = React.useState<bigint>(5n)
  const [stressCutActive, setStressCutActive] = React.useState<boolean>(false)
  const [selectedAxis, setSelectedAxis] = React.useState<AxisId>('codigo')
  const [showTechXray, setShowTechXray] = React.useState<boolean>(false)
  const [ctaGlow, setCtaGlow] = React.useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  })

  const currentScenario: BusinessScenario = React.useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId]
  )

  const activePillar: QuestionPillar = React.useMemo(
    () => QUESTION_PILLARS.find((p) => p.id === selectedAxis) ?? QUESTION_PILLARS[0],
    [selectedAxis]
  )

  const isExperimental = currentScenario.phase === 'experimental'
  const numberLocale = i18n.language?.startsWith('en') ? 'en-US' : 'es-AR'
  const stats = calculateAuditNumbers(monthlySalesArs, feePct, numberLocale)

  const handleSelectScenario = (preset: BusinessScenario) => {
    setScenarioId(preset.id)
    setMonthlySalesArs(preset.defaultMonthlyArs)
    setFeePct(preset.defaultFeePct)
    setStressCutActive(false)
    trackEvent('hero_cta_demo_clicked', {
      source: `ownership_ai_scenario_${preset.id}`,
    })
  }

  const whatsappAuditUrl = getWhatsAppUrl(
    `¡Hola Exequiel! Hice la Mini-Auditoría IA en tu web (${currentScenario.shortLabel}, ventas ~${stats.monthlySalesFormatted}/mes) y quiero cotizar mi propio sistema sin comisiones.`
  )

  return (
    <section
      id="arquitectura"
      aria-labelledby="honest-audit-heading"
      className="relative py-14 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto relative z-10 space-y-6">
        {/* ============================================================
            CABECERA EDITORIAL COMPACTA
           ============================================================ */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/75 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-slate-300 text-[11px] font-mono font-semibold tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>{t('ownership.badge', 'MINI-AUDITORÍA HECHA CON IA · HONESTIDAD BRUTAL')}</span>
            <Badge label={t('ownership.badge_months', '36 MESES')} variant="cyan" />
          </div>

          <h2
            id="honest-audit-heading"
            className="text-2xl sm:text-4xl font-display font-semibold tracking-[-0.025em] text-slate-950 dark:text-white leading-[1.15]"
          >
            {t('ownership.title', AUDIT_TITLE)}
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t(
              'ownership.subtitle',
              'Si estás experimentando sin ventas validadas, te decimos la verdad: alquilá algo barato para probar. Pero si tu negocio ya vende, mirá cuánto capital retenés siendo dueño.'
            )}
          </p>
        </div>

        {/* ============================================================
            COCKPIT UNIFICADO DE 2 COLUMNAS (CERO REDUNDANCIA)
           ============================================================ */}
        <div
          data-audit-workstation="true"
          data-hologram-scanner="true"
          className="relative rounded-3xl bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.08] shadow-xl p-5 sm:p-7 overflow-hidden"
        >
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/60 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA (7 cols): ETAPA + SIMULADOR + VEREDICTO */}
            <div className="lg:col-span-7 space-y-4">
              {/* 1. Selector de Etapa en 3 Pills Compactas */}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black inline-flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>{t('ownership.step1_label', 'Elegí la etapa hoy de tu negocio:')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SCENARIOS.map((item) => {
                    const active = item.id === scenarioId
                    const Icon =
                      item.id === 'experimental'
                        ? Lightbulb
                        : item.id === 'ecommerce'
                          ? ShoppingBag
                          : CalendarCheck

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectScenario(item)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          active
                            ? item.phase === 'experimental'
                              ? 'bg-amber-500/12 border-amber-500/80 text-slate-900 dark:text-white shadow-sm'
                              : item.id === 'servicios'
                                ? 'bg-emerald-500/12 border-emerald-500/80 text-slate-900 dark:text-white shadow-sm'
                                : 'bg-cyan-500/12 border-cyan-500/80 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              active
                                ? item.phase === 'experimental'
                                  ? 'bg-amber-500 text-slate-950'
                                  : item.id === 'servicios'
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono font-bold opacity-75 uppercase">
                            {t(`ownership.scenarios.${item.id}.badge`, item.badge).split('·')[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold leading-tight">
                            {t(`ownership.scenarios.${item.id}.shortLabel`, item.shortLabel)}
                          </div>
                          <div className="text-[11px] opacity-75 mt-0.5 leading-snug">
                            {t(`ownership.scenarios.${item.id}.subtitle`, item.subtitle)}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Simulador de Ventas + Comisión */}
              <div
                data-energy-reactor="true"
                data-capital-simulator="true"
                className="rounded-2xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200/90 dark:border-white/10 p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black inline-flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>{t('ownership.step2_label', 'Tus ventas por mes:')}</span>
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {stats.monthlySalesFormatted}
                  </span>
                </div>

                <input
                  type="range"
                  min={500_000}
                  max={30_000_000}
                  step={500_000}
                  value={monthlySalesArs}
                  aria-label="Simular facturación mensual"
                  onChange={(e) => setMonthlySalesArs(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 my-2"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                  <div className="flex flex-wrap gap-1">
                    {QUICK_REVENUE_STOPS.map((stop) => (
                      <button
                        key={stop.value}
                        type="button"
                        onClick={() => setMonthlySalesArs(stop.value)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          monthlySalesArs === stop.value
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                        }`}
                      >
                        {stop.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    {FEE_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setFeePct(opt.pct)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          feePct === opt.pct
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>{t('ownership.capital_protected', 'CAPITAL PROTEGIDO // 0% FUGAS')}</span>
                  <span>
                    {t('ownership.annual_savings', 'Ahorro anual')}: +{stats.drainYear1Formatted}
                  </span>
                </div>
              </div>

              {/* Veredicto Dinámico Compacto */}
              <div
                className={`rounded-2xl p-4 border relative overflow-hidden ${
                  isExperimental
                    ? 'bg-amber-50/75 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-500/30'
                    : 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-200/90 dark:border-violet-500/30'
                }`}
              >
                <div
                  aria-hidden="true"
                  className={`absolute left-0 inset-y-0 w-1 ${
                    isExperimental ? 'bg-amber-500' : 'bg-violet-500'
                  }`}
                />
                <div className="pl-2 space-y-1">
                  <div
                    className={`text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                      isExperimental
                        ? 'text-amber-800 dark:text-amber-300'
                        : 'text-violet-800 dark:text-violet-300'
                    }`}
                  >
                    {isExperimental ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
                    )}
                    <span>
                      {t(
                        `ownership.scenarios.${currentScenario.id}.aiVerdictTag`,
                        currentScenario.aiVerdictTag
                      )}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {t(
                      `ownership.scenarios.${currentScenario.id}.aiHeadline`,
                      currentScenario.aiHeadline
                    )}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t(
                      `ownership.scenarios.${currentScenario.id}.aiExplanation`,
                      currentScenario.aiExplanation
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (5 cols): PROYECCIÓN CLARA A 36 MESES + APAGÓN */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-950 text-white border border-white/10 p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {t('ownership.projection_eyebrow', 'PROYECCIÓN A 36 MESES')}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {t('ownership.projection_title', 'Alquiler vs. Activo Propio')}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setStressCutActive((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer shrink-0 ${
                    stressCutActive
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                  }`}
                >
                  {stressCutActive ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>
                    {stressCutActive
                      ? t('ownership.sim_restore', 'Restaurar')
                      : t('ownership.sim_cut', '¿Si dejás de pagar?')}
                  </span>
                </button>
              </div>

              {/* Comparativa Visual en Barras Progresivas Año 1 -> Año 2 -> Año 3 */}
              <div className="space-y-3 py-1">
                {[
                  {
                    label: t('ownership.year_1', 'AÑO 1'),
                    amount: stats.drainYear1Formatted,
                    pct: 33,
                  },
                  {
                    label: t('ownership.year_2', 'AÑO 2'),
                    amount: stats.drainYear2Formatted,
                    pct: 66,
                  },
                  {
                    label: t('ownership.year_3', 'AÑO 3'),
                    amount: stats.drainYear3Formatted,
                    pct: 100,
                  },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 font-bold">{row.label}</span>
                      <span className="text-rose-400 font-bold">-{row.amount}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-rose-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen Cara a Cara en 2 Mini-Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className={`rounded-xl p-3 border transition-all ${
                    stressCutActive
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-rose-300 font-bold">
                    {stressCutActive
                      ? t('ownership.rent_offline', 'HTTP 402 · CAÍDA')
                      : t('ownership.rent_3y', 'ALQUILER (3 AÑOS)')}
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-rose-400 mt-0.5">
                    -{stats.drainYear3Formatted}
                  </div>
                  <div className="text-[10px] text-rose-200/75 mt-0.5">
                    {stressCutActive
                      ? t('ownership.rent_suspended', 'Tienda suspendida')
                      : `${stats.monthlyDrainFormatted}/${t('ownership.month_abbr', 'mes')}`}
                  </div>
                </div>

                <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/35">
                  <div className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                    {t('ownership.own_3y', 'SISTEMA PROPIO')}
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-400 mt-0.5">
                    +{stats.drainYear3Formatted}
                  </div>
                  <div className="text-[10px] text-emerald-200/80 mt-0.5">
                    {t('ownership.own_zero_fee', '$0/mes · HTTP 200 OK')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              MATRIZ TÁCTICA DE 4 EJES EN UNA SOLA FILA DE TABS
             ============================================================ */}
          <div
            data-tactical-matrix="true"
            className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {QUESTION_PILLARS.map((pillar) => {
                  const isSelected = pillar.id === selectedAxis
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => setSelectedAxis(pillar.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-700 dark:text-cyan-300'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-400/40'
                      }`}
                    >
                      {pillar.number}.{' '}
                      {t(`ownership.pillars.${pillar.id}.axisTitle`, pillar.axisTitle)}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowTechXray((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                  showTechXray
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-cyan-400/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>
                  {showTechXray
                    ? t('ownership.xray_hide', 'Ocultar CLI')
                    : t('ownership.xray_show', 'Rayos X CLI')}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-rose-700 dark:text-rose-300 mb-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {t('ownership.rent_platform_label', 'En Plataforma Alquilada')} (
                    {t('ownership.your_control', 'Tu control')}: {activePillar.rentControlPct}%)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {t(`ownership.pillars.${activePillar.id}.rentPain`, activePillar.rentPain)}
                </p>
              </div>

              <div className="rounded-xl p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/35">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    {t('ownership.own_platform_label', 'Con ExePaginasWeb')} (
                    {t('ownership.your_control', 'Tu control')}: 100%)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {t(`ownership.pillars.${activePillar.id}.ownGain`, activePillar.ownGain)}
                </p>
              </div>
            </div>

            {showTechXray && (
              <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs space-y-1.5">
                <div className="text-slate-400">{activePillar.terminalCmd}</div>
                <div className="text-rose-400">
                  {t(
                    `ownership.pillars.${activePillar.id}.terminalRentOut`,
                    activePillar.terminalRentOut
                  )}
                </div>
                <div className="text-emerald-400 font-bold">
                  {t(
                    `ownership.pillars.${activePillar.id}.terminalOwnOut`,
                    activePillar.terminalOwnOut
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            SELLO NOTARIAL COMPACTO CON ACCIÓN DIRECTA
           ============================================================ */}
        <div
          data-notarial-seal="true"
          className="rounded-2xl bg-white/90 dark:bg-[#081022]/90 border border-slate-200/90 dark:border-emerald-500/30 shadow-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                <span>{t('ownership.seal_badge', 'GARANTÍA DE PROPIEDAD REAL · ORIGEN 2025')}</span>
                <CyberInsignia size={12} className="text-cyan-500" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {t(
                  'ownership.seal_title',
                  'Trato directo con Exequiel Echevarría — Sin agencias ni alquileres ocultos'
                )}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {t(
                  'ownership.seal_desc',
                  'Transferencia de Repositorio GitHub a tu nombre, base de datos PostgreSQL dedicada y 0% comisiones por venta.'
                )}
              </p>
            </div>
          </div>

          <a
            href={whatsappAuditUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('contact_whatsapp_clicked', {
                source: 'ownership_notarial_seal_cta',
              })
            }
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setCtaGlow({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
                active: true,
              })
            }}
            onPointerLeave={() => setCtaGlow((prev) => ({ ...prev, active: false }))}
            className="group relative inline-flex items-center justify-center rounded-2xl p-[1.5px] overflow-hidden shrink-0 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_35px_-6px_rgba(16,185,129,0.55),0_0_20px_-4px_rgba(34,211,238,0.45)] hover:shadow-[0_0_48px_-4px_rgba(34,211,238,0.8),0_0_28px_-2px_rgba(16,185,129,0.7)]"
          >
            {/* Halo cuántico orbital giratorio (borde láser prismático) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-[100%] animate-[spin_3.6s_linear_infinite] bg-[conic-gradient(from_0deg,#34d399_0%,#22d3ee_25%,#a855f7_50%,#f43f5e_75%,#34d399_100%)] opacity-90 group-hover:opacity-100 transition-opacity"
            />

            {/* Núcleo de cristal oscuro obsidian + reflejo especular */}
            <span className="relative flex items-center gap-3 px-5 py-3 rounded-[14.5px] bg-[#040b16] text-white overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
              {/* Spotlight reactivo al cursor */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: ctaGlow.active ? 1 : 0.35,
                  background: `radial-gradient(120px circle at ${ctaGlow.x}% ${ctaGlow.y}%, rgba(34,211,238,0.38), rgba(16,185,129,0.18) 45%, transparent 75%)`,
                }}
              />

              {/* Destello diagonal continuo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />

              {/* Micro-LED de estado en vivo */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-linear-to-tr from-emerald-400 to-cyan-300 shadow-[0_0_8px_#34d399]" />
              </span>

              {/* Texto principal con gradiente nítido */}
              <span className="relative text-xs sm:text-sm font-black tracking-wide bg-linear-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                {t('ownership.seal_cta', 'Cotizar Mi Propio Sistema')}
              </span>

              {/* Cápsula cinética de flecha */}
              <span className="relative w-7 h-7 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.65)] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.9)] transition-all duration-300">
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default OwnershipVsSubscription
