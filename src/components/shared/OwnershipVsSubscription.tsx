/**
 * © 2025 Exequiel Echevarría — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * OwnershipVsSubscription:
 * Estudio de Mini-Auditoría IA Interactiva con Gráfico SVG de Curvas en Tiempo Real (36 meses),
 * Deslizador Continuo de Ventas (BigInt), Simulador Visual de Apagón y Diagnóstico Humano Simple.
 */
'use client'

import React from 'react'
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
  TrendingUp,
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
  title: string
  subtitle: string
  defaultMonthlyArs: number
  defaultFeePct: bigint
  aiVerdictTag: string
  aiHeadline: string
  aiExplanation: string
  aiRecommendation: string
}

const SCENARIOS: readonly [BusinessScenario, ...BusinessScenario[]] = [
  {
    id: 'experimental',
    phase: 'experimental',
    badge: 'FASE EXPERIMENTAL',
    shortLabel: 'Recién Empiezo',
    title: 'Estoy probando una idea desde cero',
    subtitle: 'Todavía no tengo ventas fijas',
    defaultMonthlyArs: 1_000_000,
    defaultFeePct: 3n,
    aiVerdictTag: 'HONESTIDAD BRUTAL · RECOMENDACIÓN IA',
    aiHeadline: 'Todavía NO inviertas en un sistema a medida: alquilá algo básico para probar',
    aiExplanation:
      'Si estás experimentando y aún no validaste que tu producto se vende todos los meses, usar una plantilla económica por 3 a 6 meses es la decisión financiera correcta.',
    aiRecommendation:
      'Validá tus primeras 30 ventas con gasto mínimo. Cuando la comisión empiece a doler, pasate a código propio.',
  },
  {
    id: 'ecommerce',
    phase: 'escala',
    badge: 'FASE ESCALA · VENTAS ACTIVAS',
    shortLabel: 'Vendo Productos',
    title: 'Ya tengo tienda o catálogo con ventas',
    subtitle: 'Me descuentan comisión por cada venta',
    defaultMonthlyArs: 5_000_000,
    defaultFeePct: 5n,
    aiVerdictTag: 'ALERTA IA · FUGA DE GANANCIA DETECTADA',
    aiHeadline: 'Pagar alquiler + porcentaje por cada venta te está comiendo un sueldo al año',
    aiExplanation:
      'Cuando tu negocio ya vende, el alquiler con comisión funciona como un socio silencioso que se lleva entre el 3% y el 10% de tu esfuerzo para siempre. Con un sistema propio pagás una sola vez y el 100% de cada venta va a tu cuenta.',
    aiRecommendation:
      'Pasar a tienda propia elimina el 100% de comisiones por venta desde el primer día.',
  },
  {
    id: 'servicios',
    phase: 'escala',
    badge: 'FASE ESCALA · SERVICIOS & B2B',
    shortLabel: 'Servicios / Turnos / Empresa',
    title: 'Vendo servicios, turnos o atención profesional',
    subtitle: 'Quiero velocidad, prestigio y cero cuotas',
    defaultMonthlyArs: 8_000_000,
    defaultFeePct: 5n,
    aiVerdictTag: 'DIAGNÓSTICO IA · ACTIVO DIGITAL PROPIO',
    aiHeadline: 'Tu marca necesita un activo propio que nadie te pueda suspender ni limitar',
    aiExplanation:
      'Las plataformas alquiladas te encasillan en plantillas lentas e iguales a las de tu competencia, y retienen tu base de clientes. Con arquitectura propia tu web vuela en celulares y es 100% tuya de por vida.',
    aiRecommendation:
      'Construí un sistema propio con base de datos y código a tu nombre, sin alquileres eternos.',
  },
] as const

interface QuestionPillar {
  id: AxisId
  number: string
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
    question: '¿De quién es la web cuando terminás de pagarla?',
    axisTitle: 'Propiedad del Código Fuente',
    rentPain:
      'En plataformas de alquiler nunca sos dueño de nada. Aunque pagues durante 5 años, el día que dejás de pagar te quedás con las manos vacías.',
    ownGain:
      'Con ExePaginasWeb recibís la escritura digital completa (Repositorio GitHub a tu nombre). Lo pagás una vez y es propiedad de tu negocio para siempre.',
    rentControlPct: 0,
    terminalCmd: '$ git clone https://github.com/tu-empresa/sistema-web.git',
    terminalRentOut: '✗ 402 Payment Required · Código cerrado cautivo en servidor ajeno',
    terminalOwnOut: '✓ Repositorio transferido a tu nombre — 100% propiedad legal y técnica',
  },
  {
    id: 'comisiones',
    number: '02',
    question: '¿Cuánto me descuentan cada vez que vendo algo?',
    axisTitle: 'Comisiones de Venta y Pasarelas',
    rentPain:
      'Te cobran dos veces: la cuota mensual fija más un peaje del 3% al 10% sobre cada venta que hacés. Cuanto mejor te va, más plata te sacan.',
    ownGain:
      '0% de comisiones por venta para siempre. Tus cobros de MercadoPago, transferencia o tarjeta entran limpios y directo a tu banco.',
    rentControlPct: 10,
    terminalCmd: '$ audit-checkout --commission-fee',
    terminalRentOut: '✗ Descuento automático del 3% al 10% sobre cada ticket de venta',
    terminalOwnOut: '✓ 0.0% comisión ExePaginasWeb · 100% del dinero directo a tu cuenta',
  },
  {
    id: 'datos',
    number: '03',
    question: '¿Mis clientes e historial quedan en mis manos?',
    axisTitle: 'Base de Datos y Tus Clientes',
    rentPain:
      'Tus clientes, pedidos y métricas están encerrados en el sistema de ellos. Si querés mudarte, bloquean o recortan la exportación.',
    ownGain:
      'Base de datos PostgreSQL propia y dedicada. Todos tus clientes, teléfonos, ventas y estadísticas están bajo tu llave exclusiva.',
    rentControlPct: 15,
    terminalCmd: '$ pg_dump --schema=public -- verify-ownership',
    terminalRentOut: '✗ Acceso denegado: Base de datos compartida bajo llave del proveedor',
    terminalOwnOut: '✓ PostgreSQL dedicada (Supabase) con acceso total y backups tuyos',
  },
  {
    id: 'continuidad',
    number: '04',
    question: '¿Me pueden apagar la página de un día para el otro?',
    axisTitle: 'Continuidad Operativa',
    rentPain:
      'Si vence una tarjeta o aumentan la cuota en dólares y no pagás, un robot suspende tu tienda en 24 horas y perdés todas las ventas.',
    ownGain:
      'Nadie tiene un botón para apagarte el negocio. Tu web sigue online 24/7 sin cuotas extorsivas ni aumentos sorpresa.',
    rentControlPct: 20,
    terminalCmd: '$ curl -I https://tu-negocio.com/status',
    terminalRentOut: '✗ HTTP 402 Payment Required — Tienda suspendida automáticamente',
    terminalOwnOut: '✓ HTTP 200 OK — Sistema 100% activo sin vencimientos ni bloqueos',
  },
] as const

const QUICK_REVENUE_STOPS = [
  { label: '$1M / mes', value: 1_000_000 },
  { label: '$5M / mes', value: 5_000_000 },
  { label: '$15M / mes', value: 15_000_000 },
  { label: '$30M / mes', value: 30_000_000 },
] as const

const FEE_OPTIONS: readonly { label: string; pct: bigint }[] = [
  { label: '3% comisión', pct: 3n },
  { label: '5% comisión', pct: 5n },
  { label: '10% comisión', pct: 10n },
] as const

/**
 * Cálculo financiero exacto con BigInt (Principio 3 de Ingeniería Real).
 */
function calculateAuditNumbers(monthlySalesArs: number, feePct: bigint) {
  const monthlySales = BigInt(Math.round(monthlySalesArs))
  const fixedMonthlyRent = 60_000n // Canon base promedio SaaS + apps obligatorias
  const monthlyCommission = (monthlySales * feePct) / 100n
  const monthlyDrain = monthlyCommission + fixedMonthlyRent
  const drainYear1 = monthlyDrain * 12n
  const drainYear2 = monthlyDrain * 24n
  const drainYear3 = monthlyDrain * 36n

  const fmt = new Intl.NumberFormat('es-AR')
  return {
    monthlyDrainNum: Number(monthlyDrain),
    drainYear1Num: Number(drainYear1),
    drainYear2Num: Number(drainYear2),
    drainYear3Num: Number(drainYear3),
    monthlyDrainFormatted: `$${fmt.format(monthlyDrain)}`,
    drainYear1Formatted: `$${fmt.format(drainYear1)}`,
    drainYear2Formatted: `$${fmt.format(drainYear2)}`,
    drainYear3Formatted: `$${fmt.format(drainYear3)}`,
    monthlySalesFormatted: `$${fmt.format(monthlySales)}`,
  }
}

/* ============================================================
   Gráfico Central Impactante: Curvas Comparativas 36 Meses +
   Simulador Visual de "Apagón por Falta de Pago"
   ============================================================ */
function WealthGapVisualChart({
  monthlySalesArs,
  feePct,
  stressCutActive,
  onToggleStressCut,
  isExperimental,
}: {
  monthlySalesArs: number
  feePct: bigint
  stressCutActive: boolean
  onToggleStressCut: () => void
  isExperimental: boolean
}) {
  const stats = calculateAuditNumbers(monthlySalesArs, feePct)

  // Escala visual en banda dedicada superior (Y entre 34 y 114) para que NUNCA toque la línea verde (Y=136)
  const maxVisualDrain = 38_000_000
  const rawRatio = Math.min(1, Math.max(0.08, stats.drainYear3Num / maxVisualDrain))
  const ratio = Math.min(0.96, Math.max(0.52, Math.pow(rawRatio, 0.38)))

  // Bandas horizontales compactas y separadas matemáticamente (ViewBox 640 x 182):
  // - Banda Curva Roja (Fuga Alquiler): Y = 34 a 114
  // - Banda Línea Verde (ExePaginasWeb): Y = 136
  // - Banda Eje Temporal (HOY..AÑO 3): Y = 170
  const baseY = 136
  const startRedY = 114
  const endRedY = Math.round(112 - ratio * 76) // Entre 36 y 72
  const mid12Y = Math.round(startRedY - (startRedY - endRedY) * 0.36)
  const mid24Y = Math.round(startRedY - (startRedY - endRedY) * 0.7)

  const redCurvePath = stressCutActive
    ? `M 60 ${startRedY} Q 150 ${(startRedY + mid12Y) / 2}, 235 ${mid12Y} T 410 ${mid24Y} L 428 ${baseY} L 580 ${baseY}`
    : `M 60 ${startRedY} C 175 ${mid12Y + 6}, 340 ${mid24Y}, 580 ${endRedY}`

  const areaFillPath = stressCutActive
    ? `M 60 ${baseY} L 60 ${startRedY} Q 150 ${(startRedY + mid12Y) / 2}, 235 ${mid12Y} T 410 ${mid24Y} L 428 ${baseY} Z`
    : `M 60 ${baseY} L 60 ${startRedY} C 175 ${mid12Y + 6}, 340 ${mid24Y}, 580 ${endRedY} L 580 ${baseY} Z`

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#070d1b] border border-slate-200/90 dark:border-white/10 shadow-xl overflow-hidden p-5 sm:p-7">
      {/* Cabecera del Gráfico con Indicadores Grandes y Dóciles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Proyección Visual en Tiempo Real (Próximos 3 Años)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {stressCutActive
              ? '⚠️ Simulación Activa: Qué pasa si un mes dejás de pagar la cuota'
              : '¿Adónde va el dinero de tus ventas mes a mes?'}
          </h3>
        </div>

        {/* Botón Interactivo de Prueba de Estrés */}
        <button
          type="button"
          onClick={onToggleStressCut}
          className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
            stressCutActive
              ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/25'
              : 'bg-rose-50 dark:bg-rose-950/35 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-950/60'
          }`}
        >
          {stressCutActive ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>Volver a proyección normal</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-rose-500" />
              <span>Simular: ¿Y si dejo de pagar 1 mes?</span>
            </>
          )}
        </button>
      </div>

      {/* 2 Contadores Gigantes Cara a Cara */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
        <div className="relative rounded-2xl p-4 sm:p-5 bg-rose-50/80 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-500/30">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Si Alquilás (Shopify / Tiendanube)</span>
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300">
              Peaje Eterno
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400 tracking-tight my-1">
            -{stats.drainYear3Formatted}{' '}
            <span className="text-xs font-bold uppercase">ARS en 3 años</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Perdés <strong>{stats.monthlyDrainFormatted}/mes</strong> ({stats.drainYear1Formatted}{' '}
            al año) en comisiones y cuotas sin ser dueño de nada.
          </p>
        </div>

        <div className="relative rounded-2xl p-4 sm:p-5 bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-300 dark:border-emerald-500/35">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Con ExePaginasWeb (1 Solo Pago)</span>
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              100% Tuyo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight my-1">
            +{stats.drainYear3Formatted}{' '}
            <span className="text-xs font-bold uppercase">ARS para vos</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <strong>$0 de comisión por venta</strong> y <strong>$0 de alquiler mensual</strong>.
            Toda esa ganancia se queda en tu negocio.
          </p>
        </div>
      </div>

      {/* LIENZO SVG PRINCIPAL: Cero Píldoras Superpuestas (Etiquetas HTML arriba + Bandas SVG limpias) */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none"
        />

        {/* Barra superior de estado en HTML Flexbox (Nunca se desborda ni pisa las líneas del gráfico) */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 mb-2 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>✓ ExePaginasWeb: $0 Comisiones · 100% Activo</span>
          </div>

          {stressCutActive ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600/95 border border-rose-400 text-white text-xs font-mono font-extrabold shadow-lg shadow-rose-600/30">
              <span>✗ MES 24: DEJÁS DE PAGAR → TIENDA APAGADA (Ventas caen a $0)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Fuga acumulada en Alquiler (3 años): -{stats.drainYear3Formatted}</span>
            </div>
          )}
        </div>

        <svg
          viewBox="0 0 640 182"
          className="w-full h-auto overflow-visible select-none"
          shapeRendering="geometricPrecision"
          role="img"
          aria-label="Gráfico comparativo de ahorro entre alquiler de plataforma y propiedad en ExePaginasWeb"
        >
          <defs>
            <linearGradient id="wealthGapFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.36" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="ownLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Líneas guía horizontales suaves */}
          {[32, 66, 100, 136].map((yPos, idx) => (
            <line
              key={idx}
              x1="60"
              y1={yPos}
              x2="580"
              y2={yPos}
              stroke="rgba(148,163,184,0.13)"
              strokeDasharray={idx === 3 ? undefined : '4 4'}
              strokeWidth="1"
            />
          ))}

          {/* Área sombreada entre la curva roja y la base verde */}
          <path d={areaFillPath} fill="url(#wealthGapFill)" />

          {/* Curva Roja: Fuga acumulada en Alquiler SaaS (Siempre en banda Y = 42..142) */}
          <path
            d={redCurvePath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Línea Verde/Cian: ExePaginasWeb ($0 comisiones) fija en banda Y = 164 */}
          <line
            x1="60"
            y1={baseY}
            x2="580"
            y2={baseY}
            stroke="url(#ownLineGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Nodos y valores limpios sobre cada punto de la curva roja (siempre arriba del nodo: cy - 12) */}
          <circle
            cx="60"
            cy={startRedY}
            r="4.5"
            className="fill-rose-500 stroke-slate-950"
            strokeWidth="2"
          />

          <circle
            cx="235"
            cy={mid12Y}
            r="5"
            className="fill-rose-500 stroke-slate-950"
            strokeWidth="2"
          />
          <text
            x="235"
            y={mid12Y - 12}
            textAnchor="middle"
            className="fill-rose-300 text-[11px] font-mono font-bold"
          >
            -{stats.drainYear1Formatted}
          </text>

          <circle
            cx="410"
            cy={mid24Y}
            r="5.5"
            className="fill-rose-500 stroke-slate-950"
            strokeWidth="2"
          />
          <text
            x="410"
            y={mid24Y - 12}
            textAnchor="middle"
            className="fill-rose-300 text-[11px] font-mono font-bold"
          >
            {stressCutActive ? '✗ CORTE DE SITIO' : `-${stats.drainYear2Formatted}`}
          </text>

          {!stressCutActive ? (
            <>
              <circle
                cx="580"
                cy={endRedY}
                r="7"
                className="fill-rose-500 stroke-white"
                strokeWidth="2"
              />
              <text
                x="580"
                y={endRedY - 14}
                textAnchor="end"
                className="fill-rose-400 text-xs font-mono font-extrabold"
              >
                -{stats.drainYear3Formatted}
              </text>
            </>
          ) : (
            <circle
              cx="428"
              cy={baseY}
              r="6"
              className="fill-rose-600 stroke-white"
              strokeWidth="2"
            />
          )}

          {/* Nodos Esmeralda sobre la base (Y = 164) */}
          <circle
            cx="60"
            cy={baseY}
            r="4.5"
            className="fill-cyan-400 stroke-slate-950"
            strokeWidth="2"
          />
          <circle
            cx="580"
            cy={baseY}
            r="7"
            className="fill-emerald-400 stroke-slate-950"
            strokeWidth="2"
          />

          {/* Banda dedicada de Etiquetas de Tiempo (Y = 170, totalmente despejada) */}
          <text x="60" y="170" className="fill-slate-400 text-[11px] font-mono font-semibold">
            HOY
          </text>
          <text
            x="235"
            y="170"
            textAnchor="middle"
            className="fill-slate-400 text-[11px] font-mono font-semibold"
          >
            AÑO 1
          </text>
          <text
            x="410"
            y="170"
            textAnchor="middle"
            className="fill-slate-400 text-[11px] font-mono font-semibold"
          >
            AÑO 2
          </text>
          <text
            x="580"
            y="170"
            textAnchor="end"
            className="fill-emerald-300 text-[11px] font-mono font-bold"
          >
            AÑO 3 ($0 COMISIÓN)
          </text>
        </svg>

        {/* Pie explicativo debajo del gráfico */}
        <div className="mt-2 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-rose-500 inline-block" />
              <span>Plata perdida en alquiler y comisiones</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Propiedad ExePaginasWeb ($0 peaje mensual)</span>
            </span>
          </div>
          {isExperimental && (
            <span className="text-amber-300 font-medium">
              💡 En etapa inicial, validá primero tus ventas antes de invertir.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Componente Principal: Mini-Auditoría IA Interactiva
   (Limpia, Dócil de Comprender y Gráficamente Impactante)
   ============================================================ */
export const OwnershipVsSubscription: React.FC = () => {
  const [scenarioId, setScenarioId] = React.useState<BusinessScenarioId>('ecommerce')
  const [monthlySalesArs, setMonthlySalesArs] = React.useState<number>(5_000_000)
  const [feePct, setFeePct] = React.useState<bigint>(5n)
  const [stressCutActive, setStressCutActive] = React.useState<boolean>(false)
  const [selectedAxis, setSelectedAxis] = React.useState<AxisId>('codigo')
  const [showTechXray, setShowTechXray] = React.useState<boolean>(false)

  const currentScenario: BusinessScenario = React.useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId]
  )

  const activePillar: QuestionPillar = React.useMemo(
    () => QUESTION_PILLARS.find((p) => p.id === selectedAxis) ?? QUESTION_PILLARS[0],
    [selectedAxis]
  )

  const decisionPhase: DecisionPhase = currentScenario.phase
  const isExperimental = decisionPhase === 'experimental'
  const stats = calculateAuditNumbers(monthlySalesArs, feePct)

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
      className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================
            CABECERA LIMPIA Y CENTRADA (Fácil de leer en 3 segundos)
           ============================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/75 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-2xs text-slate-700 dark:text-slate-300 text-[11px] font-mono font-semibold tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>MINI-AUDITORÍA HECHA CON IA · HONESTIDAD BRUTAL</span>
            <Badge label="36 MESES" variant="cyan" />
          </div>

          <h2
            id="honest-audit-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-display font-semibold tracking-[-0.025em] text-slate-950 dark:text-white leading-[1.12]"
          >
            {AUDIT_TITLE}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Si estás experimentando sin ventas validadas, te decimos la verdad: alquilá algo barato
            para probar. Pero si tu negocio ya vende, mirá en el gráfico interactivo cuánta plata
            regalás en alquileres y por qué te conviene ser dueño.
          </p>
        </div>

        {/* ============================================================
            ESTACIÓN DE AUDITORÍA IA (Diseño Luminoso, Gráfico y Dócil)
           ============================================================ */}
        <div data-audit-workstation="true" data-hologram-scanner="true" className="space-y-6">
          {/* PASO 1 + PASO 2: Controles Humanos Simples (3 Botones Grandes + Slider Suave) */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#090e1a]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/[0.08] shadow-[0_14px_40px_-14px_rgba(15,23,42,0.08)] p-5 sm:p-7 overflow-hidden">
            <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/60 to-transparent" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Selector de Situación actual (3 tarjetas visuales amigables) */}
              <div className="lg:col-span-7">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black inline-flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Elegí la etapa hoy de tu negocio:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          active
                            ? item.phase === 'experimental'
                              ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white shadow-md shadow-amber-500/10'
                              : 'bg-cyan-500/15 border-cyan-500 text-slate-900 dark:text-white shadow-md shadow-cyan-500/15'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              active
                                ? item.phase === 'experimental'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono font-bold opacity-75">
                            {item.badge.split('·')[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-extrabold leading-tight">
                            {item.shortLabel}
                          </div>
                          <div className="text-[11px] opacity-80 mt-0.5 leading-snug">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Deslizador Interactivo de Ventas Mensuales (BigInt) */}
              <div
                data-energy-reactor="true"
                data-capital-simulator="true"
                className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black inline-flex items-center justify-center text-[11px]">
                      2
                    </span>
                    <span>Tus ventas por mes:</span>
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                    {stats.monthlySalesFormatted}
                  </span>
                </div>

                {/* Slider nativo estilizado para arrastrar suavemente */}
                <input
                  type="range"
                  min={500_000}
                  max={30_000_000}
                  step={500_000}
                  value={monthlySalesArs}
                  aria-label="Simular facturación mensual en pesos argentinos"
                  onChange={(e) => setMonthlySalesArs(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 my-2"
                />

                {/* Botones rápidos de monto + comisión */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {QUICK_REVENUE_STOPS.map((stop) => (
                      <button
                        key={stop.value}
                        type="button"
                        onClick={() => setMonthlySalesArs(stop.value)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          monthlySalesArs === stop.value
                            ? 'bg-cyan-500 text-slate-950'
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
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
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

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>CAPITAL PROTEGIDO // 0% FUGAS</span>
                  <span>Ahorro anual: +{stats.drainYear1Formatted}</span>
                </div>
              </div>
            </div>

            {/* Banner de Diagnóstico IA Humano (Claro, directo y sin jerga) */}
            <div
              className={`mt-5 rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                isExperimental
                  ? 'bg-amber-50/75 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-500/30'
                  : 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-200/90 dark:border-cyan-500/30'
              }`}
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 inset-y-0 w-1 ${
                  isExperimental ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
              />
              <div className="space-y-1 pl-2">
                <div
                  className={`text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                    isExperimental
                      ? 'text-amber-800 dark:text-amber-300'
                      : 'text-cyan-800 dark:text-cyan-300'
                  }`}
                >
                  {isExperimental ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Zap className="w-4 h-4 text-cyan-500 shrink-0" />
                  )}
                  <span>{currentScenario.aiVerdictTag}</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {currentScenario.aiHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentScenario.aiExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              EL GRAN GRÁFICO VISUAL INTERACTIVO (Curva 36 Meses + Apagón)
             ============================================================ */}
          <WealthGapVisualChart
            monthlySalesArs={monthlySalesArs}
            feePct={feePct}
            stressCutActive={stressCutActive}
            onToggleStressCut={() => setStressCutActive((prev) => !prev)}
            isExperimental={isExperimental}
          />

          {/* ============================================================
              LAS 4 PREGUNTAS CLAVE EN LENGUAJE SIMPLE (Sin muros de texto)
             ============================================================ */}
          <div
            data-tactical-matrix="true"
            className="rounded-3xl bg-white/90 dark:bg-[#081022]/90 border border-slate-200/90 dark:border-white/10 shadow-xl p-5 sm:p-7"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  3. Tocá cualquier pregunta para ver la diferencia real
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Lo que las plataformas de alquiler no te cuentan en la letra chica
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowTechXray((v) => !v)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border self-start ${
                  showTechXray
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-cyan-400/50'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>
                  {showTechXray ? 'Ocultar Rayos X Técnico' : 'Ver Rayos X Técnico (CLI)'}
                </span>
              </button>
            </div>

            {/* 4 Botones de Preguntas Simples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {QUESTION_PILLARS.map((pillar) => {
                const isSelected = pillar.id === selectedAxis
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setSelectedAxis(pillar.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-slate-900 dark:text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        PREGUNTA {pillar.number}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        100% Tuyo
                      </span>
                    </div>
                    <div className="text-sm font-extrabold leading-snug mb-1">
                      {pillar.question}
                    </div>
                    <div className="text-[11px] font-mono opacity-70">{pillar.axisTitle}</div>
                  </button>
                )
              })}
            </div>

            {/* Respuesta Visual Cara a Cara de la Pregunta Seleccionada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-rose-700 dark:text-rose-300 mb-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>En Plataforma Alquilada (Tu control: {activePillar.rentControlPct}%)</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activePillar.rentPain}
                </p>
              </div>

              <div className="rounded-2xl p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/35">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Con ExePaginasWeb (Tu control: 100%)</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activePillar.ownGain}
                </p>
              </div>
            </div>

            {/* Consola Rayos X Opcional (Solo se despliega si el usuario quiere ver la prueba técnica) */}
            {showTechXray && (
              <div className="mt-4 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-2">
                <div className="text-slate-400">{activePillar.terminalCmd}</div>
                <div className="text-rose-400">{activePillar.terminalRentOut}</div>
                <div className="text-emerald-400 font-bold">{activePillar.terminalOwnOut}</div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            CIERRE DIRECTO CON SELLO DE AUTORÍA Y ACCIÓN A WHATSAPP
           ============================================================ */}
        <div
          data-notarial-seal="true"
          className="mt-6 rounded-3xl bg-white/90 dark:bg-[#081022]/90 border border-slate-200/90 dark:border-emerald-500/30 shadow-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                <span>GARANTÍA DE PROPIEDAD REAL · ORIGEN 2025</span>
                <CyberInsignia size={13} className="text-cyan-500" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Trato directo con Exequiel Echevarría — Sin agencias ni alquileres ocultos
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Transferencia de Repositorio GitHub a tu nombre, base de datos PostgreSQL dedicada y
                0% comisiones por venta.
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-linear-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-emerald-500/20 shrink-0"
          >
            <span>Cotizar Mi Propio Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default OwnershipVsSubscription
