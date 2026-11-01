/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Componente: InteractiveFeatureShowcase
 * Diseño: Dashboard minimalista de alta precisión con telemetría visual SVG,
 * avance automático continuo entre etapas y pasos, y soporte nativo Claro/Oscuro.
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo'
import {
  Zap,
  ShieldCheck,
  Play,
  Pause,
  Layers,
  Lock,
  Check,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Award,
  Rocket,
  FileCode,
  Target,
  BarChart3,
  Database,
  Cpu,
  Globe,
  ArrowUpRight,
} from 'lucide-react'
import { trackEvent } from '@/core/analytics/trackEvent'

interface SubStage {
  id: string
  label: string
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
  tags: string[]
  visual: {
    type: 'ring' | 'chart' | 'code'
    primaryMetric: string
    primaryLabel: string
    ringPercent?: number
    secondaryMetrics: { label: string; value: string; accent?: boolean }[]
    chartPoints?: string
    codeSnippet?: { line: string; highlight?: boolean }[]
  }
}

interface MainStep {
  id: string
  number: string
  title: string
  subtitle: string
  accent: string
  stages: SubStage[]
}

const STEPS: MainStep[] = [
  {
    id: 'trato-directo',
    number: '01',
    title: 'Trato Directo',
    subtitle: 'Sin intermediarios ni agencias',
    accent: '#06b6d4',
    stages: [
      {
        id: 'diagnostico',
        label: 'Diagnóstico',
        icon: PhoneCall,
        eyebrow: 'CONTACTO DIRECTO',
        title: 'Hablás directo con quien construye tu sistema',
        description:
          'En 15 minutos definimos la arquitectura exacta para digitalizar tus ventas y reservas, sin vendedores ni pasamanos.',
        tags: ['Atención de Fundador', 'Diagnóstico en 15m', 'Cero Burocracia'],
        visual: {
          type: 'ring',
          primaryMetric: '100%',
          primaryLabel: 'Trato con Ingeniería',
          ringPercent: 100,
          secondaryMetrics: [
            { label: 'Tiempo de relevamiento', value: '15 min', accent: true },
            { label: 'Intermediarios', value: '0 agencias' },
            { label: 'Arquitecto a cargo', value: 'Exequiel E.' },
          ],
        },
      },
      {
        id: 'presupuesto',
        label: 'Propuesta Fija',
        icon: Award,
        eyebrow: 'TRANSPARENCIA TOTAL',
        title: 'Presupuesto cerrado y plazos por contrato',
        description:
          'Recibís un desglose técnico claro con precio fijo en pesos o dólares. Sin costos ocultos ni adicionales sorpresivos.',
        tags: ['Precio Fijo', 'Plazos Garantizados', '50% Anticipo'],
        visual: {
          type: 'chart',
          primaryMetric: '$0',
          primaryLabel: 'Costos Ocultos',
          chartPoints: 'M 0 70 Q 45 65, 80 45 T 160 28 T 240 12',
          secondaryMetrics: [
            { label: 'Entrega promedio', value: '7 a 14 días', accent: true },
            { label: 'Alquiler mensual', value: 'Ninguno' },
          ],
        },
      },
      {
        id: 'entrega',
        label: 'Llave en Mano',
        icon: Rocket,
        eyebrow: 'PROPIEDAD ABSOLUTA',
        title: 'Código, dominio y cuentas 100% a tu nombre',
        description:
          'Al finalizar, transferimos el repositorio y las credenciales a tu titularidad. Nunca quedás cautivo de un proveedor.',
        tags: ['Repositorio Propio', 'Dominio Tuyo', 'Soporte Directo'],
        visual: {
          type: 'ring',
          primaryMetric: '100%',
          primaryLabel: 'Titularidad del Cliente',
          ringPercent: 100,
          secondaryMetrics: [
            { label: 'Repositorio GitHub', value: 'Transferido', accent: true },
            { label: 'Comisión por ventas', value: '0%' },
            { label: 'Dependencia mensual', value: 'Nula' },
          ],
        },
      },
    ],
  },
  {
    id: 'arquitectura-viva',
    number: '02',
    title: 'Ingeniería & Pagos',
    subtitle: 'Stack moderno y cobros directos',
    accent: '#10b981',
    stages: [
      {
        id: 'nextjs',
        label: 'Next.js 16 SSR',
        icon: Cpu,
        eyebrow: 'CÓDIGO PURO',
        title: 'Ingeniería empresarial sin plantillas lentas',
        description:
          'Desarrollado en React 19 y Next.js 16. Tu plataforma compila en el servidor para cargar al instante en cualquier móvil.',
        tags: ['Server-Side Rendering', '0 Plugins Basura', 'TypeScript Estricto'],
        visual: {
          type: 'code',
          primaryMetric: '48 KB',
          primaryLabel: 'Bundle Inicial Ultra-Liviano',
          codeSnippet: [
            { line: 'export async function CheckoutFlow() {' },
            { line: '  const session = await edgeAuth.verify()', highlight: true },
            { line: '  return <InstantPaymentGateway />' },
            { line: '}' },
          ],
          secondaryMetrics: [
            { label: 'Motor de render', value: 'Next.js 16 Edge', accent: true },
            { label: 'Plantillas WordPress', value: '0%' },
          ],
        },
      },
      {
        id: 'cobros',
        label: 'Cobros Directos',
        icon: Layers,
        eyebrow: 'FINANZAS SIN INTERMEDIARIOS',
        title: 'El dinero entra directo a tu CBU o Mercado Pago',
        description:
          'Integramos pasarelas oficiales con acreditación inmediata. No retenemos porcentajes ni tocamos tu recaudación.',
        tags: ['Mercado Pago API', 'Transferencia CBU', '0% Comisión Nuestra'],
        visual: {
          type: 'chart',
          primaryMetric: '0%',
          primaryLabel: 'Comisión por Transacción',
          chartPoints: 'M 0 75 Q 50 60, 95 40 T 175 20 T 240 8',
          secondaryMetrics: [
            { label: 'Liquidación', value: 'Directa a tu cuenta', accent: true },
            { label: 'Conciliación', value: 'Automática 24/7' },
          ],
        },
      },
      {
        id: 'cloud',
        label: 'Base de Datos',
        icon: Database,
        eyebrow: 'SEGURIDAD BANCARIA',
        title: 'PostgreSQL dedicado con respaldos diarios',
        description:
          'Tus clientes, turnos y ventas se almacenan con aislamiento criptográfico y copias de seguridad automáticas.',
        tags: ['PostgreSQL Cloud', 'SSL / TLS 1.3', 'Backups Diarios'],
        visual: {
          type: 'ring',
          primaryMetric: '99.9%',
          primaryLabel: 'Uptime Global Edge',
          ringPercent: 99,
          secondaryMetrics: [
            { label: 'Encriptación', value: 'AES-256 + SSL', accent: true },
            { label: 'Nodos CDN', value: 'Multi-Región' },
            { label: 'Respaldo', value: 'Automático' },
          ],
        },
      },
    ],
  },
  {
    id: 'rendimiento',
    number: '03',
    title: 'Velocidad 0.38s',
    subtitle: 'Auditoría Google 100/100 real',
    accent: '#06b6d4',
    stages: [
      {
        id: 'lighthouse',
        label: 'Google 100/100',
        icon: Zap,
        eyebrow: 'VELOCIDAD EXTREMA',
        title: 'Carga en 0.38 segundos comprobable en vivo',
        description:
          'Superamos el puntaje máximo en Google PageSpeed Insights. Una web instantánea retiene al doble de visitantes.',
        tags: ['0.38s Carga Real', 'Core Web Vitals OK', 'Mobile First'],
        visual: {
          type: 'ring',
          primaryMetric: '100',
          primaryLabel: 'Google Lighthouse Score',
          ringPercent: 100,
          secondaryMetrics: [
            { label: 'First Paint (FCP)', value: '0.38 seg', accent: true },
            { label: 'Accesibilidad & SEO', value: '100 / 100' },
            { label: 'Rebote por lentitud', value: 'Eliminado' },
          ],
        },
      },
      {
        id: 'seo',
        label: 'SEO Técnico',
        icon: Globe,
        eyebrow: 'POSICIONAMIENTO ORGÁNICO',
        title: 'Indexación prioritaria en buscadores',
        description:
          'Incluimos metadatos dinámicos y marcado Schema.org para que tu negocio destaque en Google desde el primer día.',
        tags: ['Schema.org JSON-LD', 'Sitemap Dinámico', 'OpenGraph Pro'],
        visual: {
          type: 'chart',
          primaryMetric: '#1',
          primaryLabel: 'Arquitectura SEO Semántica',
          chartPoints: 'M 0 80 Q 60 70, 100 45 T 180 22 T 240 6',
          secondaryMetrics: [
            { label: 'Indexación Google', value: 'Instantánea', accent: true },
            { label: 'Estructura HTML', value: '100% Semántica' },
          ],
        },
      },
      {
        id: 'blindaje',
        label: 'Blindaje Cloud',
        icon: Lock,
        eyebrow: 'CERO CAÍDAS',
        title: 'Inmune a picos de tráfico y ataques',
        description:
          'Despliegue sobre red distribuida con mitigación DDoS automática. Tu sistema responde igual con 10 o 10.000 usuarios.',
        tags: ['Firewall WAF Activo', 'Auto-Escalado', ' Monitoreo 24/7'],
        visual: {
          type: 'code',
          primaryMetric: '24/7',
          primaryLabel: 'Protección Edge Activa',
          codeSnippet: [
            { line: '[WAF] Edge Firewall: ACTIVE' },
            { line: '[TLS] Strict-Transport-Security: max-age=63072000', highlight: true },
            { line: '[CDN] Cache-Control: public, s-maxage=31536000' },
            { line: '[STATUS] 200 OK · Latency: 14ms' },
          ],
          secondaryMetrics: [
            { label: 'Latencia promedio', value: '14 ms', accent: true },
            { label: 'Certificado SSL', value: 'Renovación Auto' },
          ],
        },
      },
    ],
  },
  {
    id: 'conversion-escala',
    number: '04',
    title: 'Conversión & Escala',
    subtitle: 'Diseñado para facturar más',
    accent: '#8b5cf6',
    stages: [
      {
        id: 'embudo',
        label: 'Embudo Directo',
        icon: Target,
        eyebrow: 'ARQUITECTURA DE VENTAS',
        title: 'De visitante a cliente en 3 clics',
        description:
          'Interfaces limpias y libres de distracciones que guían al usuario directo a reservar o comprar en segundos.',
        tags: ['UX de Alta Conversión', 'Checkout en 3 Clics', 'Sin Fricción'],
        visual: {
          type: 'chart',
          primaryMetric: '+210%',
          primaryLabel: 'Incremento en Conversión',
          chartPoints: 'M 0 78 Q 55 68, 105 38 T 185 18 T 240 5',
          secondaryMetrics: [
            { label: 'Pasos al pago', value: 'Solo 3 clics', accent: true },
            { label: 'Abandono de carrito', value: '-65%' },
          ],
        },
      },
      {
        id: 'metricas',
        label: 'Pixel & Analytics',
        icon: BarChart3,
        eyebrow: 'MEDICIÓN EXACTA',
        title: 'Rastreo quirúrgico para tus campañas',
        description:
          'Dejamos configurados los eventos de conversión para Meta Ads y Google Ads para optimizar cada peso invertido.',
        tags: ['Meta Pixel API', 'Google Analytics 4', 'Eventos Medidos'],
        visual: {
          type: 'ring',
          primaryMetric: '3.4x',
          primaryLabel: 'Retorno Publicitario (ROAS)',
          ringPercent: 88,
          secondaryMetrics: [
            { label: 'Tracking de eventos', value: '100% Medido', accent: true },
            { label: 'Costo por Lead', value: '-48% promedio' },
            { label: 'Atribución', value: 'Tiempo Real' },
          ],
        },
      },
      {
        id: 'autonomia',
        label: 'Panel Autónomo',
        icon: FileCode,
        eyebrow: 'CONTROL TOTAL',
        title: 'Administrá precios, stock y clientes desde el celular',
        description:
          'Panel de control intuitivo para gestionar tu operación en segundos sin depender de programadores.',
        tags: ['Panel Autogestionable', '100% Mobile', 'Reportes Claros'],
        visual: {
          type: 'code',
          primaryMetric: '2 seg',
          primaryLabel: 'Actualización en Tiempo Real',
          codeSnippet: [
            { line: '✓ Catálogo sincronizado en vivo' },
            { line: '✓ Reserva #1042 confirmada y cobrada', highlight: true },
            { line: '✓ Notificación enviada al cliente' },
            { line: '✓ Balance diario actualizado' },
          ],
          secondaryMetrics: [
            { label: 'Curva de aprendizaje', value: 'Inmediata', accent: true },
            { label: 'Soporte técnico', value: 'Incluido' },
          ],
        },
      },
    ],
  },
]

export const InteractiveFeatureShowcase: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [subStageIdx, setSubStageIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const STAGE_DURATION = 4500 // 4.5s por sub-etapa

  useEffect(() => {
    if (isPaused) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      const diff = Date.now() - startTime
      if (diff >= STAGE_DURATION) {
        setElapsed(0)
        const currentStagesCount = STEPS[activeStepIdx]?.stages.length ?? 3
        setSubStageIdx((prev) => {
          if (prev + 1 >= currentStagesCount) {
            const nextMain = (activeStepIdx + 1) % STEPS.length
            setActiveStepIdx(nextMain)
            return 0
          }
          return prev + 1
        })
      } else {
        setElapsed(diff)
      }
    }, 40)

    return () => clearInterval(timer)
  }, [activeStepIdx, subStageIdx, isPaused])

  const currentStep = STEPS[activeStepIdx] ?? STEPS[0]!
  const currentStage = currentStep.stages[subStageIdx] ?? currentStep.stages[0]!
  const totalStages = currentStep.stages.length
  const stepProgress = ((subStageIdx + Math.min(1, elapsed / STAGE_DURATION)) / totalStages) * 100

  return (
    <section
      id="arquitectura-en-vivo"
      aria-label="Recorrido interactivo de arquitectura y metodología"
      className={`relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 ${className}`}
    >
      {/* CABECERA MINIMALISTA */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-cyan-400 font-mono text-[11px] uppercase tracking-widest mb-3 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Ingeniería Transparente</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Cómo construimos y escalamos tu{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400">
            activo digital
          </span>
        </h2>
      </div>

      {/* ==============================================================
          SUPER CARD MINIMALISTA ESTILO DASHBOARD (CLARO / OSCURO)
         ============================================================== */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#070b14] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.07)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col lg:flex-row min-h-[520px]">
        {/* ==============================================================
            SIDEBAR IZQUIERDO MINIMALISTA (29%)
           ============================================================== */}
        <div className="w-full lg:w-[29%] p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-white/[0.07] bg-slate-50/70 dark:bg-[#050811] flex flex-col justify-between">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/70 dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Logo size={22} />
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white tracking-wide">
                  ExePaginasWeb
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 dark:text-neutral-500">
                0{activeStepIdx + 1} / 04
              </span>
            </div>

            {/* Lista de 4 Pasos Limpia */}
            <div className="space-y-2">
              {STEPS.map((step, idx) => {
                const isActive = idx === activeStepIdx

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveStepIdx(idx)
                      setSubStageIdx(0)
                      setElapsed(0)
                      trackEvent('main_step_selected', { step: step.id })
                    }}
                    className={`relative w-full text-left p-3.5 rounded-xl transition-colors duration-200 cursor-pointer overflow-hidden group ${
                      isActive
                        ? 'bg-white dark:bg-[#0c1424] border border-cyan-500/50 dark:border-cyan-400/40 shadow-sm dark:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]'
                        : 'bg-transparent hover:bg-slate-200/50 dark:hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isActive
                            ? 'bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-400/40'
                            : 'bg-slate-200/70 text-slate-600 dark:bg-white/[0.04] dark:text-neutral-500 group-hover:text-slate-900 dark:group-hover:text-neutral-300'
                        }`}
                      >
                        {step.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm font-bold truncate transition-colors ${
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-neutral-200'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-xs truncate mt-0.5 transition-colors ${
                            isActive
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-slate-400 dark:text-neutral-600'
                          }`}
                        >
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso sutil integrada solo en el paso activo */}
                    {isActive && (
                      <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-slate-100 dark:bg-white/[0.05]">
                        <div
                          className="h-full bg-cyan-500 dark:bg-cyan-400"
                          style={{
                            width: `${Math.max(4, stepProgress)}%`,
                            transition: isPaused ? 'none' : 'width 50ms linear',
                          }}
                        />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nota discreta al pie del sidebar */}
          <div className="hidden lg:flex items-center justify-between pt-4 mt-4 border-t border-slate-200/70 dark:border-white/[0.06] text-[11px] font-mono text-slate-400 dark:text-neutral-500">
            <span>Secuencia automática</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Activa</span>
          </div>
        </div>

        {/* ==============================================================
            CANVAS PRINCIPAL DERECHO (71%): VISUAL & DESPEJADO
           ============================================================== */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full lg:w-[71%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-[#070b14]"
        >
          {/* BARRA SUPERIOR: SUB-TABS MINIMALISTAS + PAUSA */}
          <div className="flex items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0c1220] border border-slate-200/60 dark:border-white/[0.06]">
              {currentStep.stages.map((stg, i) => {
                const isCurrent = i === subStageIdx
                const Icon = stg.icon
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => {
                      setSubStageIdx(i)
                      setElapsed(0)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors duration-150 cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-slate-900 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border dark:border-cyan-400/30 font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white font-medium'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{stg.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Reanudar rotación' : 'Pausar rotación'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer font-mono text-xs"
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Pause className="w-3.5 h-3.5 text-cyan-500" />
              )}
              <span className="hidden sm:inline">{isPaused ? 'Reanudar' : 'Pausa'}</span>
            </button>
          </div>

          {/* ESCENARIO CENTRAL: WIDGET TELEMÉTRICO + COPY CONCISO */}
          <div className="my-auto py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep.id}-${currentStage.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* COLUMNA VISUAL (5 COLS): TARJETA DASHBOARD CON GRÁFICOS SVG */}
                <div className="md:col-span-5 rounded-2xl p-5 bg-slate-50/90 dark:bg-[#0b111e] border border-slate-200/80 dark:border-cyan-500/25 shadow-sm dark:shadow-[0_0_35px_-12px_rgba(6,182,212,0.2)] space-y-4">
                  {/* Visual Tipo 1: Anillo de Progreso (Estilo Video 83% / 100%) */}
                  {currentStage.visual.type === 'ring' && (
                    <div className="flex items-center gap-4 pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            className="text-slate-200 dark:text-white/[0.07]"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke={currentStep.accent}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={163.36}
                            strokeDashoffset={
                              163.36 - (163.36 * (currentStage.visual.ringPercent ?? 100)) / 100
                            }
                          />
                        </svg>
                        <span className="absolute font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                          {currentStage.visual.primaryMetric}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
                          Métrica Verificada
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual Tipo 2: Curva SVG Luminosa (Estilo Video Spline Chart) */}
                  {currentStage.visual.type === 'chart' && (
                    <div className="space-y-2 pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryMetric}
                        </span>
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {currentStage.visual.primaryLabel}
                        </span>
                      </div>
                      <div className="h-16 w-full pt-1">
                        <svg
                          viewBox="0 0 240 85"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={currentStep.accent} stopOpacity="0.35" />
                              <stop
                                offset="100%"
                                stopColor={currentStep.accent}
                                stopOpacity="0.0"
                              />
                            </linearGradient>
                          </defs>
                          <path
                            d={`${currentStage.visual.chartPoints} L 240 85 L 0 85 Z`}
                            fill="url(#chartGrad)"
                          />
                          <path
                            d={currentStage.visual.chartPoints}
                            fill="none"
                            stroke={currentStep.accent}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Visual Tipo 3: Bloque de Código / Telemetría Limpio */}
                  {currentStage.visual.type === 'code' && (
                    <div className="space-y-2.5 pb-3 border-b border-slate-200/70 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] font-bold">
                          {currentStage.visual.primaryMetric}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 dark:bg-[#050811] border border-slate-800 dark:border-white/[0.06] font-mono text-[11px] space-y-1">
                        {currentStage.visual.codeSnippet?.map((item, idx) => (
                          <div
                            key={idx}
                            className={`truncate ${
                              item.highlight ? 'text-cyan-400 font-semibold' : 'text-slate-400'
                            }`}
                          >
                            {item.line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KPIs Secundarios Limpios */}
                  <div className="space-y-2 font-mono text-xs">
                    {currentStage.visual.secondaryMetrics.map((m, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-neutral-400">{m.label}</span>
                        <span
                          className={`font-bold ${
                            m.accent
                              ? 'text-cyan-700 dark:text-cyan-400'
                              : 'text-slate-800 dark:text-neutral-200'
                          }`}
                        >
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNA EDITORIAL (7 COLS): LIMPIA, DIRECTA Y ESCANEABLE */}
                <div className="md:col-span-7 space-y-4">
                  <span className="inline-block font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                    {currentStage.eyebrow}
                  </span>

                  <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {currentStage.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
                    {currentStage.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentStage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] font-mono text-xs text-slate-700 dark:text-neutral-300"
                      >
                        <Check className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FOOTER INTERNO DISCRETO CON ACCIÓN RÁPIDA */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sistemas en producción verificables</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/soluciones"
                className="font-mono text-xs text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Ver arquitectura</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/5493412799385?text=Hola%20Exequiel!%20Vi%20tu%20plataforma%20en%20ExePaginasWeb%20y%20quiero%20consultar%20por%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('hero_cta_contact_clicked', { source: 'super_card_footer' })
                }
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Diagnosticar Proyecto</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveFeatureShowcase
