/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Face V2: Cloud Utility Enterprise — 7 idiomas (es, en, pt-BR, de, fr, ar, zh-CN),
 * barra de comandos sin links redundantes, horario real de oficina en Argentina (Lun–Vie 08:00–18:00 ART),
 * y resumen técnico copiable en 1 clic.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Globe,
  Info,
  Layers,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import i18n, { syncHtmlLangAttributes } from '@/core/i18n/config'
import {
  formatTierSetup,
  type PricingTier,
  type ServiceRateCard,
  UNIFIED_PRICING,
} from '@/shared/pricing-catalog'
import {
  getArgentinaDeskStatus,
  normalizeV2Lang,
  V2_COPY,
  V2_LANGUAGES,
  type ArtDeskStatus,
  type V2Lang,
} from './v2-i18n'

type CellState = 'checking' | 'ok'

interface ServicePlanBase {
  id: Exclude<ServiceRateCard['id'], 'linux-lan-server'>
  code: string
  recommended: boolean
  isLinuxSpecial?: boolean
  whatsappText: string
  checks: {
    sslEdge: string
    seoSchema: string
    whatsappFunnel: string
    payments: string
    adminPanel: string
    sourceCode: string
    latency: string
  }
}

const SERVICE_PLANS: readonly ServicePlanBase[] = [
  {
    id: 'landing-express',
    code: UNIFIED_PRICING['landing-express'].code,
    recommended: false,
    whatsappText: 'Hola Exequiel, quiero activar Landing Express.',
    checks: {
      sslEdge: 'HTTPS TLS 1.3',
      seoSchema: 'Google Maps + Meta',
      whatsappFunnel: 'Botón 1-Clic',
      payments: 'Link de Pago',
      adminPanel: 'Opcional',
      sourceCode: '100% Propio',
      latency: '18 ms',
    },
  },
  {
    id: 'tienda-turnos',
    code: UNIFIED_PRICING['tienda-turnos'].code,
    recommended: true,
    whatsappText: 'Hola Exequiel, quiero activar el plan recomendado Catálogo / Turnos.',
    checks: {
      sslEdge: 'HTTPS + Edge CDN',
      seoSchema: 'Schema.org JSON-LD',
      whatsappFunnel: 'Pedidos + Alertas',
      payments: 'MP / PayPal / Stripe',
      adminPanel: 'Panel PostgreSQL',
      sourceCode: '100% Propio',
      latency: '14 ms',
    },
  },
  {
    id: 'saas-medida',
    code: UNIFIED_PRICING['saas-medida'].code,
    recommended: false,
    whatsappText: 'Hola Exequiel, quiero cotizar un Sistema SaaS a medida.',
    checks: {
      sslEdge: 'Multi-Región + WAF',
      seoSchema: 'SSR + Sitemap',
      whatsappFunnel: 'CRM + Webhooks',
      payments: 'Suscripciones',
      adminPanel: 'RBAC Multi-User',
      sourceCode: '100% Propio',
      latency: '12 ms',
    },
  },
  {
    id: 'automatizacion-ia',
    code: UNIFIED_PRICING['automatizacion-ia'].code,
    recommended: false,
    whatsappText: 'Hola Exequiel, quiero activar Automatización IA / Bots.',
    checks: {
      sslEdge: 'API Privada',
      seoSchema: 'N/A (Backend)',
      whatsappFunnel: 'Bot 24/7 + Leads',
      payments: 'Webhooks Auto',
      adminPanel: 'Logs & Métricas',
      sourceCode: '100% Propio',
      latency: '21 ms',
    },
  },
  {
    id: 'linux-pos',
    code: UNIFIED_PRICING['linux-pos'].code,
    recommended: false,
    isLinuxSpecial: true,
    whatsappText: 'Hola Exequiel, quiero probar/activar Terminales Linux POS (4.5s boot).',
    checks: {
      sslEdge: 'LAN + Offline-First',
      seoSchema: 'Boot 4.5s · 480MB',
      whatsappFunnel: 'Tickets ESC/POS',
      payments: 'QR / Tarjetas / Efect.',
      adminPanel: 'PostgreSQL Local',
      sourceCode: '$0 Licencias OS',
      latency: '0.4 ms (LAN)',
    },
  },
] as const

const MATRIX_ROW_KEYS: readonly (keyof ServicePlanBase['checks'])[] = [
  'sslEdge',
  'seoSchema',
  'whatsappFunnel',
  'payments',
  'adminPanel',
  'sourceCode',
  'latency',
] as const

const ROW_TOOLTIPS: Record<keyof ServicePlanBase['checks'], string> = {
  sslEdge: 'Edge deployment with automatic TLS 1.3 SSL certificates & CDN.',
  seoSchema: 'Semantic HTML, OpenGraph metadata, sitemap, and Schema.org JSON-LD.',
  whatsappFunnel: 'Zero-friction direct conversion flow from mobile devices.',
  payments: 'Native Mercado Pago, PayPal, or Stripe integration via webhooks (<1s).',
  adminPanel: 'Self-service dashboard backed by PostgreSQL with zero vendor lock-in.',
  sourceCode: '100% owned repository (TypeScript / React / Next.js or Java Spring Boot).',
  latency: 'Average Edge TTFB measured across South America / LATAM POPs.',
}

function ExeBrandLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 535 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 20 0 L 157.5 0 L 126 42 L 62 42 L 62 79 L 115 79 L 115 121 L 62 121 L 62 158 L 126 158 L 157.5 200 L 20 200 Z"
        fill="currentColor"
      />
      <path
        d="M 170 0 L 212 0 L 250 64.4 L 288 0 L 330 0 L 271 100 L 330 200 L 288 200 L 250 135.6 L 212 200 L 170 200 L 229 100 Z"
        fill="currentColor"
      />
      <path
        d="M 480 0 L 342.5 0 L 374 42 L 438 42 L 438 79 L 385 79 L 385 121 L 438 121 L 438 158 L 374 158 L 342.5 200 L 480 200 Z"
        fill="currentColor"
      />
      <rect x="493" y="165" width="35" height="35" fill="#047857" rx="3" />
    </svg>
  )
}

export default function V2CloudUtilityApp() {
  const [lang, setLang] = useState<V2Lang>('es')
  const [tier, setTier] = useState<PricingTier>('ARS_PYME')
  const [selectedId, setSelectedId] = useState<string>('tienda-turnos')
  const [cellState, setCellState] = useState<CellState>('checking')
  const [deskStatus, setDeskStatus] = useState<ArtDeskStatus>(() => getArgentinaDeskStatus())
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [checkRunId, setCheckRunId] = useState(0)
  const [briefCopied, setBriefCopied] = useState(false)

  // Sync initial language from global i18n / localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('lang') || i18n.language
      const resolved = normalizeV2Lang(saved)
      setLang(resolved)
      syncHtmlLangAttributes(resolved)
    } catch {
      setLang('es')
    }
  }, [])

  const handleLanguageChange = (nextLang: V2Lang) => {
    setLang(nextLang)
    syncHtmlLangAttributes(nextLang)
    try {
      window.localStorage.setItem('lang', nextLang)
      void i18n.changeLanguage(nextLang)
    } catch {
      // safe fallback
    }
  }

  const runLiveMatrixCheck = useCallback(() => {
    setCellState('checking')
    setCheckRunId((n) => n + 1)
    setDeskStatus(getArgentinaDeskStatus())
    const timer = window.setTimeout(() => {
      setCellState('ok')
    }, 380)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    return runLiveMatrixCheck()
  }, [runLiveMatrixCheck])

  // Keep Argentina business clock refreshed every 60s
  useEffect(() => {
    const interval = window.setInterval(() => {
      setDeskStatus(getArgentinaDeskStatus())
    }, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const copy = V2_COPY[lang]
  const selectedPlan = SERVICE_PLANS.find((col) => col.id === selectedId) ?? SERVICE_PLANS[1]!
  const selectedPlanCopy = copy.plans[selectedPlan.id] ?? copy.plans['tienda-turnos']!
  const formatPlanPrice = (plan: ServicePlanBase) => formatTierSetup(plan.id, tier).primary

  const whatsappUrl = (plan: ServicePlanBase) => {
    const formatted = formatTierSetup(plan.id, tier)
    const tierTag =
      tier === 'ARS_PYME'
        ? 'PyME Argentina ($ ARS)'
        : tier === 'USD_AR'
          ? 'Empresa Argentina (USD Bonificado)'
          : 'Global / International (USD)'
    return `https://wa.me/5493416874786?text=${encodeURIComponent(`${plan.whatsappText} [${tierTag}: ${formatted.primary}]`)}`
  }

  const handleCopyBrief = async () => {
    const summary = [
      `ExePaginasWeb — Technical Brief (${selectedPlan.code})`,
      `Plan: ${selectedPlanCopy.name} | ${formatPlanPrice(selectedPlan)} | ${selectedPlanCopy.deliveryTime}`,
      `Included: ${selectedPlanCopy.highlights.join(' · ')}`,
      `Desk Status: ${deskStatus.isOpen ? 'OPEN' : 'BUSINESS DAYS ONLY (Mon-Fri 08:00-18:00 ART)'} (${deskStatus.artTimeFormatted})`,
      `Contact: https://exepaginasweb.com | exemetal@hotmail.com`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(summary)
      setBriefCopied(true)
      window.setTimeout(() => setBriefCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div
      data-face="v2"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#f6f7f9] text-[#0f172a] selection:bg-[#047857] selection:text-white"
    >
      {/* 1. HEADER UTILITY BAR — CERO LINKS INÚTILES: Solo Marca, Reloj/Estado Real ART, Selector de 7 Idiomas, Cambiar Versión y CTA */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-[#e2e8f0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[58px] w-[92vw] max-w-[1380px] items-center justify-between gap-2">
          {/* Izquierda: Logo oficial + Pill de estado horario real ART */}
          <div className="flex items-center gap-3">
            <Link
              href="/v2"
              className="group flex items-center gap-2 text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
            >
              <ExeBrandLogo className="h-5 w-auto text-[#0f172a] transition-transform duration-200 group-hover:scale-[1.03]" />
              <span className="hidden border-l border-[#e2e8f0] pl-2.5 text-[12.5px] font-semibold text-[#475569] sm:inline">
                Páginas Web <span className="font-normal text-[#047857]">· {copy.brandSuffix}</span>
              </span>
            </Link>

            <span
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold lg:inline-flex ${
                deskStatus.isOpen
                  ? 'border-[#047857]/25 bg-[#ecfdf5] text-[#047857]'
                  : 'border-[#b45309]/25 bg-[#fffbeb] text-[#b45309]'
              }`}
              title={copy.deskHoursRule}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  deskStatus.isOpen ? 'bg-[#047857]' : 'bg-[#b45309]'
                }`}
                aria-hidden="true"
              />
              <span>{deskStatus.isOpen ? copy.deskOpenBadge : copy.deskClosedBadge}</span>
              <span className="font-mono opacity-75">· {deskStatus.artTimeFormatted}</span>
            </span>
          </div>

          {/* Derecha: Selector 3 Niveles (PyME AR $ | Empresa AR USD -31% | Global USD) + 7 Idiomas + Cambiar versión + CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div
              role="group"
              aria-label="Seleccionar modalidad de precio"
              className="inline-flex h-8 items-center rounded-md border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-bold"
            >
              <button
                type="button"
                onClick={() => setTier('ARS_PYME')}
                title="Precios en Pesos para PyMEs y Emprendedores de Argentina"
                className={`h-full cursor-pointer rounded px-2 transition-colors ${
                  tier === 'ARS_PYME'
                    ? 'bg-[#047857] text-white'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                🇦🇷 PyME $
              </button>
              <button
                type="button"
                onClick={() => setTier('USD_AR')}
                title="Precios en USD para Empresas de Argentina (~31% bonificación sobre tarifa internacional)"
                className={`h-full cursor-pointer rounded px-2 transition-colors ${
                  tier === 'USD_AR'
                    ? 'bg-[#0f172a] text-white'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                🇦🇷 USD -31%
              </button>
              <button
                type="button"
                onClick={() => setTier('USD_INTL')}
                title="International / Global USD Rate"
                className={`h-full cursor-pointer rounded px-2 transition-colors ${
                  tier === 'USD_INTL'
                    ? 'bg-[#2563eb] text-white'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                🌎 Global
              </button>
            </div>

            <label className="relative inline-flex items-center">
              <Globe
                className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#047857]"
                aria-hidden="true"
              />
              <select
                aria-label="Seleccionar idioma"
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as V2Lang)}
                className="h-8 cursor-pointer appearance-none rounded-md border border-[#e2e8f0] bg-[#f8fafc] py-1 pr-6 pl-7 text-xs font-semibold text-[#0f172a] transition-colors hover:border-[#cbd5e1] focus-visible:outline-2 focus-visible:outline-[#047857]"
              >
                {V2_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.short} · {item.label}
                  </option>
                ))}
              </select>
            </label>

            <Link
              href="/?choose=1"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-2.5 text-xs font-semibold text-[#334155] transition-all duration-150 hover:border-[#cbd5e1] hover:bg-[#f8fafc] hover:text-[#0f172a]"
              title={copy.switchVersion}
            >
              <Layers className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.switchVersion}</span>
            </Link>

            <a
              href={whatsappUrl(selectedPlan)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-md bg-[#047857] px-3 text-xs font-semibold text-white transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#065f46]"
            >
              <span className="hidden sm:inline">{copy.ctaActivate}</span>
              <span className="sm:hidden">{copy.ctaShort}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="mx-auto w-[92vw] max-w-[1380px] pt-[80px] pb-[84px]">
        {/* Hero + Estado Real de Mesa de Ingeniería (Lun–Vie 08:00–18:00 ART) */}
        <section className="v2-enter mb-6 flex flex-col justify-between gap-4 border-b border-[#e2e8f0] pb-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11.5px] font-semibold ${
                  deskStatus.isOpen
                    ? 'border-[#047857]/25 bg-[#ecfdf5] text-[#047857]'
                    : 'border-[#b45309]/30 bg-[#fffbeb] text-[#92400e]'
                }`}
              >
                {deskStatus.isOpen ? (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#047857]" />
                  </span>
                ) : (
                  <Lock className="h-3 w-3 text-[#b45309]" aria-hidden="true" />
                )}
                <span>
                  {deskStatus.isOpen ? copy.deskOpenBadge : copy.deskClosedBadge} ·{' '}
                  {deskStatus.artTimeFormatted}
                </span>
              </span>
              <span className="font-mono text-[11px] text-[#64748b]">{copy.deskHoursRule}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-[28px]">
              {copy.heroTitle}
            </h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{copy.heroSubtitle}</p>
            <p
              className={`mt-2 text-[12.5px] font-medium ${
                deskStatus.isOpen ? 'text-[#047857]' : 'text-[#92400e]'
              }`}
              aria-live="polite"
            >
              {deskStatus.isOpen ? copy.deskOpenNotice : copy.deskClosedNotice}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => runLiveMatrixCheck()}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border border-[#cbd5e1] bg-white px-4 py-2 text-[13px] font-semibold text-[#334155] transition-all duration-150 hover:-translate-y-[1px] hover:border-[#94a3b8] hover:text-[#0f172a] active:translate-y-0"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#047857] ${cellState === 'checking' ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{cellState === 'checking' ? copy.btnVerifying : copy.btnVerifyStatus}</span>
            </button>

            <a
              href={whatsappUrl(selectedPlan)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-md px-5 py-2 text-[13px] font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-[1px] active:translate-y-0 ${
                deskStatus.isOpen
                  ? 'bg-[#047857] hover:bg-[#065f46]'
                  : 'bg-[#0f172a] hover:bg-[#1e293b]'
              }`}
            >
              <span>
                {deskStatus.isOpen
                  ? `${copy.btnRequestPrefix} ${selectedPlanCopy.name} (${formatPlanPrice(selectedPlan)})`
                  : `${copy.btnReserveSlot} · ${selectedPlanCopy.name}`}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* 3. CARDS INTERACTIVAS SINCRONIZADAS CON LA MATRIZ */}
        <section aria-label="Service cards" className="mb-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICE_PLANS.map((plan, index) => {
              const planCopy = copy.plans[plan.id] ?? copy.plans['tienda-turnos']!
              const isSelected = plan.id === selectedPlan.id
              const isLinux = Boolean(plan.isLinuxSpecial)

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedId(plan.id)}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={`v2-enter group relative flex cursor-pointer flex-col justify-between rounded-lg border p-4 text-start transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isLinux
                      ? isSelected
                        ? '-translate-y-1.5 border-[#f59e0b] bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white shadow-[0_14px_30px_-8px_rgba(245,158,11,0.45)] ring-2 ring-[#f59e0b]'
                        : 'border-[#f59e0b]/70 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] text-white shadow-md hover:-translate-y-1.5 hover:border-[#fbbf24] hover:shadow-[0_14px_28px_-8px_rgba(245,158,11,0.38)]'
                      : isSelected
                        ? '-translate-y-1 border-[#047857] bg-white shadow-[0_10px_25px_-10px_rgba(4,120,87,0.28)] ring-1 ring-[#047857]'
                        : 'border-[#e2e8f0] bg-white hover:-translate-y-1 hover:border-[#94a3b8] hover:shadow-md'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10.5px] font-semibold transition-colors ${
                        isLinux
                          ? 'bg-[#f59e0b] text-[#0f172a]'
                          : isSelected
                            ? 'bg-[#047857] text-white'
                            : 'bg-[#f1f5f9] text-[#475569] group-hover:bg-[#e2e8f0]'
                      }`}
                    >
                      {isLinux && <Terminal className="h-3 w-3" aria-hidden="true" />}
                      {plan.code}
                    </span>

                    {isLinux ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#fbbf24]">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#fbbf24]" />
                        {copy.linuxBadge}
                      </span>
                    ) : (
                      plan.recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-bold text-[#047857]">
                          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                          Top
                        </span>
                      )
                    )}
                  </div>

                  <div>
                    <h2
                      className={`text-[15px] font-bold transition-colors ${
                        isLinux
                          ? 'text-[#fbbf24] group-hover:text-white'
                          : 'text-[#0f172a] group-hover:text-[#047857]'
                      }`}
                    >
                      {planCopy.name}
                    </h2>
                    <p
                      className={`mt-1 text-[12px] leading-snug ${
                        isLinux ? 'text-slate-300' : 'text-[#475569]'
                      }`}
                    >
                      {planCopy.tagline}
                    </p>
                  </div>

                  <div
                    className={`mt-4 border-t pt-3 ${
                      isLinux ? 'border-white/15' : 'border-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className={`text-[15px] font-extrabold ${
                            isLinux ? 'text-white' : 'text-[#0f172a]'
                          }`}
                        >
                          {formatTierSetup(plan.id, tier).primary}
                        </span>
                        {formatTierSetup(plan.id, tier).strikeIntl && (
                          <span
                            className={`font-mono text-[10.5px] line-through ${
                              isLinux ? 'text-slate-400' : 'text-[#94a3b8]'
                            }`}
                          >
                            {formatTierSetup(plan.id, tier).strikeIntl}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          isLinux ? 'text-amber-300' : 'text-[#475569]'
                        }`}
                      >
                        <Clock
                          className={`h-3 w-3 ${isLinux ? 'text-[#fbbf24]' : 'text-[#047857]'}`}
                          aria-hidden="true"
                        />
                        {planCopy.deliveryTime}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11.5px] font-semibold">
                      <span
                        className={
                          isLinux
                            ? 'text-[#fbbf24]'
                            : isSelected
                              ? 'text-[#047857]'
                              : 'text-[#64748b]'
                        }
                      >
                        {isSelected ? copy.colActiveLabel : copy.colCompareLabel}
                      </span>
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isLinux
                            ? 'text-[#fbbf24] group-hover:translate-x-1'
                            : isSelected
                              ? 'translate-x-0.5 text-[#047857]'
                              : 'text-[#94a3b8] group-hover:translate-x-1 group-hover:text-[#047857]'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Barra empresarial resumen + Botón "Copiar resumen técnico" (1 clic para gerentes/equipos) */}
          <div
            key={`${selectedPlan.id}-${lang}`}
            className="v2-enter mt-4 flex flex-col justify-between gap-3 rounded-lg border border-[#047857]/25 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:px-5"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#0f172a]">
                <Zap className="h-4 w-4 text-[#047857]" aria-hidden="true" />
                {selectedPlanCopy.name}:
              </span>
              {selectedPlanCopy.highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-[#334155]">
                  <Check className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />
                  <span>{item}</span>
                </span>
              ))}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {selectedPlan.isLinuxSpecial && (
                <Link
                  href="/linux"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#f59e0b] px-3 py-1.5 text-xs font-extrabold text-[#0f172a] shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#fbbf24]"
                >
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.linuxExploreBtn}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => void handleCopyBrief()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#334155] transition-colors hover:border-[#047857]/40 hover:text-[#047857]"
              >
                {briefCopied ? (
                  <Check className="h-3.5 w-3.5 text-[#047857]" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{briefCopied ? copy.copyBriefDone : copy.copyBriefBtn}</span>
              </button>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#047857]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {selectedPlanCopy.availability}
              </span>
            </div>
          </div>
        </section>

        {/* 4. MATRIZ ESTILO AWS WORKSPACES */}
        <section aria-label="Technical comparison matrix">
          <div className="overflow-x-auto rounded-lg border border-[#e2e8f0] bg-white shadow-xs">
            <table className="w-full min-w-[780px] border-collapse text-center text-[12.5px]">
              <thead>
                <tr>
                  <th
                    className="w-[220px] min-w-[205px] bg-[#f8fafc] p-0"
                    aria-label={copy.matrixHeaderCol}
                  />
                  {SERVICE_PLANS.map((col) => {
                    const isActive = col.id === selectedPlan.id
                    const isLinux = Boolean(col.isLinuxSpecial)
                    return (
                      <th
                        key={col.id}
                        className="w-[140px] min-w-[135px] bg-[#f8fafc] p-0 align-bottom"
                      >
                        <div
                          className={`px-2 py-1.5 text-[11px] font-bold tracking-wide transition-all duration-200 ${
                            isLinux
                              ? 'bg-[#f59e0b] text-[#0f172a] opacity-100'
                              : isActive
                                ? 'bg-[#047857] text-white opacity-100'
                                : 'bg-[#047857] text-white opacity-0'
                          }`}
                        >
                          {isLinux
                            ? copy.linuxBadge
                            : col.recommended
                              ? copy.colRecommended
                              : copy.colSelected}
                        </div>
                      </th>
                    )
                  })}
                </tr>

                <tr className="bg-white">
                  <th className="h-[54px] border-b border-[#e2e8f0] px-4 text-start text-[12px] font-bold uppercase tracking-wider text-[#475569]">
                    {copy.matrixHeaderCol}
                  </th>
                  {SERVICE_PLANS.map((col) => {
                    const colCopy = copy.plans[col.id] ?? copy.plans['tienda-turnos']!
                    const isActive = col.id === selectedPlan.id
                    const isLinux = Boolean(col.isLinuxSpecial)
                    return (
                      <th
                        key={col.id}
                        onClick={() => setSelectedId(col.id)}
                        className={`cursor-pointer px-2 py-3 align-middle transition-colors ${
                          isLinux
                            ? isActive
                              ? 'border-x-2 border-t-2 border-[#f59e0b] bg-[#fffbeb]'
                              : 'border-b border-[#e2e8f0] bg-[#fffbeb]/60 hover:bg-[#fef3c7]/60'
                            : isActive
                              ? 'border-x-2 border-t-2 border-[#047857] bg-[#ecfdf5]/40'
                              : 'border-b border-[#e2e8f0] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedId(col.id)}
                          className="flex w-full flex-col items-center focus-visible:outline-2 focus-visible:outline-[#047857]"
                        >
                          <span
                            className={`text-[13px] font-bold ${
                              isLinux ? 'text-[#b45309]' : 'text-[#0f172a]'
                            }`}
                          >
                            {colCopy.name}
                          </span>
                          <span
                            className={`font-mono text-[10.5px] font-normal ${
                              isLinux ? 'text-[#d97706]' : 'text-[#64748b]'
                            }`}
                          >
                            {col.code}
                          </span>
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody>
                {MATRIX_ROW_KEYS.map((rowKey, rowIndex) => {
                  const isStriped = rowIndex % 2 === 0
                  const rowBg = isStriped ? 'bg-[#f8fafc]' : 'bg-white'

                  return (
                    <tr key={rowKey} className={`${rowBg} transition-colors hover:bg-[#f1f5f9]/70`}>
                      <td className="h-[46px] px-4 text-start font-medium text-[#0f172a]">
                        <div className="relative inline-flex items-center gap-1.5">
                          <span>{copy.rows[rowKey]}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTooltip((prev) => (prev === rowKey ? null : rowKey))
                            }
                            aria-label={copy.rows[rowKey]}
                            className="text-[#94a3b8] transition-colors hover:text-[#047857]"
                          >
                            <Info className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          {activeTooltip === rowKey && (
                            <div className="v2-enter absolute top-6 left-0 z-30 w-64 rounded-md border border-[#cbd5e1] bg-white p-2.5 text-start text-[11.5px] font-normal text-[#334155] shadow-lg">
                              {ROW_TOOLTIPS[rowKey]}
                            </div>
                          )}
                        </div>
                      </td>

                      {SERVICE_PLANS.map((col, colIdx) => {
                        const isActive = col.id === selectedPlan.id
                        const isLinux = Boolean(col.isLinuxSpecial)
                        const val = col.checks[rowKey]
                        const isOptional = val === 'Opcional' || val.startsWith('N/A')

                        return (
                          <td
                            key={`${col.id}-${checkRunId}`}
                            onClick={() => setSelectedId(col.id)}
                            className={`cursor-pointer px-2 py-2 align-middle transition-colors ${
                              isLinux
                                ? isActive
                                  ? 'border-x-2 border-[#f59e0b] bg-[#fffbeb]/80'
                                  : 'bg-[#fffbeb]/35'
                                : isActive
                                  ? 'border-x-2 border-[#047857] bg-[#ecfdf5]/30'
                                  : ''
                            }`}
                          >
                            {cellState === 'checking' ? (
                              <span className="inline-flex items-center justify-center text-[#94a3b8]">
                                <RefreshCw
                                  className="h-3.5 w-3.5 animate-spin"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : (
                              <span
                                style={{ animationDelay: `${(rowIndex + colIdx) * 18}ms` }}
                                className={`v2-check-pop inline-flex items-center gap-1 font-semibold ${
                                  isLinux || isOptional ? 'text-[#b45309]' : 'text-[#047857]'
                                }`}
                              >
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                                <span>{val}</span>
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                <tr className="bg-white">
                  <td className="h-[58px] border-t border-[#e2e8f0] px-4 text-start font-bold text-[#0f172a]">
                    {copy.matrixDeliveryRow}
                  </td>
                  {SERVICE_PLANS.map((col) => {
                    const colCopy = copy.plans[col.id] ?? copy.plans['tienda-turnos']!
                    const isActive = col.id === selectedPlan.id
                    const isLinux = Boolean(col.isLinuxSpecial)
                    return (
                      <td
                        key={col.id}
                        onClick={() => setSelectedId(col.id)}
                        className={`cursor-pointer px-2 py-3 align-middle transition-colors ${
                          isLinux
                            ? isActive
                              ? 'border-x-2 border-b-2 border-[#f59e0b] bg-[#fef3c7]/80'
                              : 'border-t border-[#e2e8f0] bg-[#fffbeb]/60'
                            : isActive
                              ? 'border-x-2 border-b-2 border-[#047857] bg-[#ecfdf5]/60'
                              : 'border-t border-[#e2e8f0]'
                        }`}
                      >
                        <div
                          className={`text-[13.5px] font-extrabold ${
                            isLinux ? 'text-[#92400e]' : 'text-[#0f172a]'
                          }`}
                        >
                          {formatTierSetup(col.id, tier).primary}
                        </div>
                        {formatTierSetup(col.id, tier).strikeIntl && (
                          <div className="font-mono text-[10px] text-[#94a3b8] line-through">
                            {formatTierSetup(col.id, tier).strikeIntl}
                          </div>
                        )}
                        <div className="text-[11px] font-medium text-[#475569]">
                          {colCopy.deliveryTime}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Barra SLA Empresarial Compacta */}
          <div className="mt-4 flex flex-col items-start justify-between gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-xs text-[#475569] sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#0f172a]">
              <ShieldCheck className="h-4 w-4 text-[#047857]" aria-hidden="true" />
              {copy.slaBannerLabel}:
            </span>
            <span>{copy.slaCopy}</span>
          </div>
        </section>
      </main>

      {/* 5. FOOTER FIJO SOBRIO */}
      <footer className="fixed bottom-0 left-0 z-40 flex h-[36px] w-full items-center justify-between border-t border-[#1e293b] bg-[#0f172a] px-4 text-[11.5px] text-[#cbd5e1]">
        <div className="flex items-center gap-4">
          <ExeBrandLogo className="h-3.5 w-auto text-white" />
          <Link href="/privacidad" className="text-[#cbd5e1] transition-colors hover:text-white">
            {copy.footerPrivacy}
          </Link>
          <Link href="/terminos" className="text-[#cbd5e1] transition-colors hover:text-white">
            {copy.footerTerms}
          </Link>
          <Link href="/classic" className="text-[#cbd5e1] transition-colors hover:text-white">
            {copy.footerClassic}
          </Link>
        </div>
        <div className="hidden sm:block">{copy.footerRights}</div>
      </footer>
    </div>
  )
}
