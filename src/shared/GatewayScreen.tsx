/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Gateway Editorial Minimalista: Díptico arquitectónico asimétrico con
 * cuadrícula de doble escala y cadencia cromática psicológica cada 6s
 * (Confianza · Seguridad · Previsibilidad · Estabilidad), autodetección i18n
 * y selector de globo en 7 idiomas.
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpRight, Check, Globe } from 'lucide-react'
import i18n, { syncHtmlLangAttributes } from '@/core/i18n/config'
import {
  SUPPORTED_LANGUAGES,
  detectClientLanguage,
  persistLanguagePreference,
  type DetectionSource,
  type SupportedLang,
} from '@/core/i18n/languageDetector'
import { GATEWAY_COPY } from '@/shared/gateway-i18n'
import { type SiteFace, useFacePreference } from '@/shared/face-preference'

interface LocalDeskClock {
  timeText: string
  isBusinessWindow: boolean
}

interface GridTonePhase {
  id: 'trust' | 'security' | 'predictability' | 'stability'
  layerClass: string
  accentHex: string
  badgeTextClass: string
  groupHoverTextClass: string
  dotBgClass: string
  keycapHoverClass: string
}

const GRID_PHASES: readonly GridTonePhase[] = [
  {
    id: 'trust',
    layerClass: 'gw-grid-trust',
    accentHex: '#3b82f6',
    badgeTextClass: 'text-blue-300',
    groupHoverTextClass: 'group-hover:text-blue-300',
    dotBgClass: 'bg-blue-400',
    keycapHoverClass: 'group-hover:border-blue-400/60 group-hover:text-blue-300',
  },
  {
    id: 'security',
    layerClass: 'gw-grid-security',
    accentHex: '#10b981',
    badgeTextClass: 'text-emerald-300',
    groupHoverTextClass: 'group-hover:text-emerald-300',
    dotBgClass: 'bg-emerald-400',
    keycapHoverClass: 'group-hover:border-emerald-400/60 group-hover:text-emerald-300',
  },
  {
    id: 'predictability',
    layerClass: 'gw-grid-predictability',
    accentHex: '#0ea5e9',
    badgeTextClass: 'text-sky-300',
    groupHoverTextClass: 'group-hover:text-sky-300',
    dotBgClass: 'bg-sky-400',
    keycapHoverClass: 'group-hover:border-sky-400/60 group-hover:text-sky-300',
  },
  {
    id: 'stability',
    layerClass: 'gw-grid-stability',
    accentHex: '#94a3b8',
    badgeTextClass: 'text-slate-200',
    groupHoverTextClass: 'group-hover:text-slate-200',
    dotBgClass: 'bg-slate-300',
    keycapHoverClass: 'group-hover:border-slate-300/60 group-hover:text-slate-200',
  },
]

const PHASE_INTERVAL_MS = 6000

function readArgentinaClock(): LocalDeskClock {
  try {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)

    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '12')
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
    const weekday = (parts.find((p) => p.type === 'weekday')?.value ?? '').toLowerCase()
    const isWeekend =
      weekday.startsWith('sáb') || weekday.startsWith('sab') || weekday.startsWith('dom')

    return {
      timeText: `${String(hour).padStart(2, '0')}:${minute} ART`,
      isBusinessWindow: !isWeekend && hour >= 9 && hour < 19,
    }
  } catch {
    return { timeText: 'UTC-3 ART', isBusinessWindow: true }
  }
}

function ExeMark({ accentHex, className }: { accentHex: string; className?: string }) {
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
      <rect
        x="493"
        y="165"
        width="35"
        height="35"
        fill={accentHex}
        rx="3"
        className="transition-[fill] duration-1000"
      />
    </svg>
  )
}

function runWithViewTransition(action: () => void): void {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    if (typeof docWithVT.startViewTransition === 'function') {
      docWithVT.startViewTransition(action)
      return
    }
  }
  action()
}

export default function GatewayScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { face, isReady, setFace } = useFacePreference()
  const [navigatingTo, setNavigatingTo] = useState<SiteFace | null>(null)
  const [hoveredDoor, setHoveredDoor] = useState<SiteFace | null>(null)
  const [clock, setClock] = useState<LocalDeskClock | null>(null)
  const [phaseIndex, setPhaseIndex] = useState<number>(0)
  const [lockedByUser, setLockedByUser] = useState<boolean>(false)
  const [lang, setLang] = useState<SupportedLang>('es')
  const [detectionSource, setDetectionSource] = useState<DetectionSource>('fallback')
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false)
  const langMenuRef = useRef<HTMLDivElement | null>(null)

  const forceChoose = searchParams?.get('choose') === '1'
  const activePhase = GRID_PHASES[phaseIndex] ?? GRID_PHASES[0]!
  const copy = GATEWAY_COPY[lang] ?? GATEWAY_COPY.es
  const activeLangOption =
    SUPPORTED_LANGUAGES.find((item) => item.code === lang) ?? SUPPORTED_LANGUAGES[0]!

  // guardrail-ok(useEffect): hidratación de reloj local ART + autodetección de idioma tras SSR
  useEffect(() => {
    setClock(readArgentinaClock())
    const detected = detectClientLanguage()
    setLang(detected.lang)
    setDetectionSource(detected.source)
    syncHtmlLangAttributes(detected.lang)
    if (i18n.language !== detected.lang) {
      void i18n.changeLanguage(detected.lang)
    }
  }, [])

  // guardrail-ok(useEffect): cierre del menú de idioma al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!langMenuOpen) return
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLangMenuOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [langMenuOpen])

  // guardrail-ok(useEffect): cadencia metronómica previsible cada 6s sobre la cuadrícula (respeta prefers-reduced-motion)
  useEffect(() => {
    if (lockedByUser || typeof window === 'undefined') return
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const timer = window.setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % GRID_PHASES.length)
    }, PHASE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [lockedByUser])

  // guardrail-ok(useEffect): redirección de preferencia persistida en localStorage hacia /classic o /v2
  useEffect(() => {
    if (!isReady || forceChoose) return
    if (face === 'classic' || face === 'v2') {
      router.replace(`/${face}`)
    }
  }, [face, forceChoose, isReady, router])

  const handleSelectLanguage = useCallback((nextLang: SupportedLang) => {
    setLang(nextLang)
    setDetectionSource('localStorage')
    setLangMenuOpen(false)
    persistLanguagePreference(nextLang)
    syncHtmlLangAttributes(nextLang)
    void i18n.changeLanguage(nextLang)
  }, [])

  const handleSelectFace = useCallback(
    (selected: SiteFace) => {
      setNavigatingTo(selected)
      setFace(selected)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
      runWithViewTransition(() => {
        router.push(`/${selected}`, { scroll: true })
      })
    },
    [router, setFace]
  )

  // guardrail-ok(useEffect): suscripción global de teclado (teclas físicas 1 y 2)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.key === '1') handleSelectFace('classic')
      if (event.key === '2') handleSelectFace('v2')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSelectFace])

  const handlePrefetch = (target: SiteFace) => {
    router.prefetch(`/${target}`)
  }

  const gridTemplateClass =
    hoveredDoor === 'classic'
      ? 'md:grid-cols-[1.14fr_0.86fr]'
      : hoveredDoor === 'v2'
        ? 'md:grid-cols-[0.86fr_1.14fr]'
        : 'md:grid-cols-2'

  return (
    <div
      data-face="gateway"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="relative flex min-h-[100dvh] flex-col justify-between bg-[#080b11] text-[#f2f2ee] selection:bg-blue-500/25 selection:text-white"
    >
      {/* Cuadrícula arquitectónica de doble escala con transición GPU previsible (1.8s) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {GRID_PHASES.map((phase, idx) => (
          <div
            key={phase.id}
            className={`gw-grid-layer ${phase.layerClass} absolute inset-0 transition-opacity duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              idx === phaseIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Cabecera Editorial Minimalista */}
      <header className="relative z-20 border-b border-white/[0.08] px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
            <ExeMark
              accentHex={activePhase.accentHex}
              className="h-3.5 w-auto shrink-0 text-[#f2f2ee]"
            />
            <span className="hidden h-3.5 w-px bg-white/15 sm:block" aria-hidden="true" />
            <span className="hidden truncate text-xs font-medium tracking-tight text-zinc-400 sm:inline">
              {copy.headerRole}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4 text-xs text-zinc-400">
            {/* Selector / Metrónomo discreto del plano cromático */}
            <div
              role="group"
              aria-label="Cadencia cromática del plano"
              className="hidden items-center gap-2 lg:flex"
            >
              <span className="font-mono text-[11px] text-zinc-500">
                {copy.phases[activePhase.id]}
              </span>
              <div className="flex items-center gap-1">
                {GRID_PHASES.map((phase, idx) => {
                  const isCurrent = idx === phaseIndex
                  const phaseLabel = copy.phases[phase.id]
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      title={phaseLabel}
                      aria-label={phaseLabel}
                      aria-pressed={isCurrent}
                      onClick={() => {
                        if (isCurrent && lockedByUser) {
                          setLockedByUser(false)
                        } else {
                          setPhaseIndex(idx)
                          setLockedByUser(true)
                        }
                      }}
                      className="group flex h-5 cursor-pointer items-center px-0.5 focus-visible:outline-1 focus-visible:outline-white/50"
                    >
                      <span
                        className={`block h-[3px] rounded-full transition-all duration-500 ${
                          isCurrent
                            ? `w-5 ${phase.dotBgClass}`
                            : 'w-2 bg-white/15 group-hover:bg-white/35'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {clock && (
              <span className="hidden items-center gap-2 font-mono text-[11px] tabular-nums md:inline-flex">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-1000 ${
                    clock.isBusinessWindow ? activePhase.dotBgClass : 'bg-zinc-500'
                  }`}
                  aria-hidden="true"
                />
                <span>Rosario · {clock.timeText}</span>
              </span>
            )}

            {/* Globo Selector de Idioma + Indicador de Autodetección */}
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((open) => !open)}
                aria-expanded={langMenuOpen}
                aria-haspopup="menu"
                aria-label={`${copy.languageMenuLabel}: ${activeLangOption.nativeName}`}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.03] px-2.5 font-mono text-[11px] text-zinc-200 transition-colors hover:border-white/35 hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <Globe
                  className={`h-3.5 w-3.5 shrink-0 transition-colors duration-700 ${activePhase.badgeTextClass}`}
                  aria-hidden="true"
                />
                <span className="font-semibold">{activeLangOption.short}</span>
                {detectionSource === 'navigator' && (
                  <span className="hidden text-[9px] text-zinc-400 sm:inline">
                    · {copy.autoDetectedTag}
                  </span>
                )}
              </button>

              {langMenuOpen && (
                <div
                  role="menu"
                  aria-label={copy.languageMenuLabel}
                  className="absolute inset-e-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/15 bg-[#0c1018] p-1.5 shadow-2xl"
                >
                  <div className="mb-1 flex items-center justify-between border-b border-white/[0.08] px-2.5 py-1.5 font-mono text-[10px] text-zinc-400">
                    <span>{copy.languageMenuLabel}</span>
                    <span>7 locales</span>
                  </div>
                  {SUPPORTED_LANGUAGES.map((option) => {
                    const isSelected = option.code === lang
                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectLanguage(option.code)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-start text-xs transition-colors ${
                          isSelected
                            ? 'bg-white/[0.09] font-semibold text-white'
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-5 font-mono text-[10px] text-zinc-400">
                            {option.short}
                          </span>
                          <span>{option.nativeName}</span>
                        </span>
                        {isSelected && (
                          <Check
                            className={`h-3.5 w-3.5 shrink-0 ${activePhase.badgeTextClass}`}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <a
              href="mailto:exemetal@hotmail.com"
              className="inline-flex min-h-[36px] items-center text-xs font-medium text-zinc-200 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
            >
              {copy.directContact}
            </a>
          </div>
        </div>
      </header>

      {/* Cuerpo Central Asimétrico — Encuadre completo en el primer vistazo (768p–1080p) */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 py-6 sm:px-10 sm:py-8">
        <div className="mb-6 max-w-3xl sm:mb-8">
          <h1 className="text-[clamp(1.85rem,3.9vw,3.35rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-[#f2f2ee]">
            {copy.heroBefore}{' '}
            <span
              className={`mx-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 align-middle font-mono text-[clamp(0.72rem,1.1vw,0.88rem)] font-normal tracking-normal transition-colors duration-1000 ${activePhase.badgeTextClass}`}
            >
              <span
                className={`gw-dot-breathe h-1.5 w-1.5 rounded-full transition-colors duration-1000 ${activePhase.dotBgClass}`}
              />
              {copy.heroPill}
            </span>{' '}
            {copy.heroAfter}
          </h1>
          <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-zinc-400 sm:text-base">
            {copy.heroSubtitle}
          </p>
        </div>

        {/* Díptico Arquitectónico Proporcional */}
        <div
          role="group"
          aria-label={copy.selectorAria}
          onMouseLeave={() => setHoveredDoor(null)}
          className={`grid grid-cols-1 border-y border-white/[0.11] bg-[#080b11]/55 backdrop-blur-[2px] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:divide-x md:divide-white/[0.11] ${gridTemplateClass}`}
        >
          {/* Entrada 01 — Classic */}
          <button
            type="button"
            onClick={() => handleSelectFace('classic')}
            onMouseEnter={() => {
              setHoveredDoor('classic')
              handlePrefetch('classic')
            }}
            onFocus={() => {
              setHoveredDoor('classic')
              handlePrefetch('classic')
            }}
            disabled={navigatingTo !== null}
            className="group relative flex min-h-[240px] cursor-pointer flex-col justify-between border-b border-white/[0.11] bg-transparent py-6 text-start transition-colors duration-300 hover:bg-white/[0.025] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 active:scale-[0.998] disabled:opacity-50 md:border-b-0 md:px-7"
          >
            <div>
              <div className="flex items-center justify-between gap-4 font-mono text-xs tabular-nums text-zinc-500">
                <span className="text-zinc-300">{copy.classicTag}</span>
                <kbd
                  className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-white/15 bg-white/[0.03] px-1.5 text-[11px] text-zinc-300 transition-colors ${activePhase.keycapHoverClass}`}
                >
                  1
                </kbd>
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#f2f2ee] sm:text-3xl">
                {copy.classicTitle}
              </h2>
              <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
                {copy.classicDesc}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-4">
              <span className="font-mono text-[11px] text-zinc-500">{copy.classicMeta}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#f2f2ee] transition-colors duration-500 ${activePhase.groupHoverTextClass}`}
              >
                <span>{navigatingTo === 'classic' ? copy.classicOpening : copy.classicCta}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </span>
            </div>
          </button>

          {/* Entrada 02 — V2 Cloud Utility */}
          <button
            type="button"
            onClick={() => handleSelectFace('v2')}
            onMouseEnter={() => {
              setHoveredDoor('v2')
              handlePrefetch('v2')
            }}
            onFocus={() => {
              setHoveredDoor('v2')
              handlePrefetch('v2')
            }}
            disabled={navigatingTo !== null}
            className="group relative flex min-h-[240px] cursor-pointer flex-col justify-between bg-transparent py-6 text-start transition-colors duration-300 hover:bg-white/[0.025] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 active:scale-[0.998] disabled:opacity-50 md:px-7"
          >
            <div>
              <div className="flex items-center justify-between gap-4 font-mono text-xs tabular-nums text-zinc-500">
                <span className={`transition-colors duration-1000 ${activePhase.badgeTextClass}`}>
                  {copy.v2Tag}
                </span>
                <kbd
                  className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-white/15 bg-white/[0.03] px-1.5 text-[11px] text-zinc-300 transition-colors ${activePhase.keycapHoverClass}`}
                >
                  2
                </kbd>
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#f2f2ee] sm:text-3xl">
                {copy.v2Title}
              </h2>
              <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
                {copy.v2Desc}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-4">
              <span className="font-mono text-[11px] text-zinc-500">{copy.v2Meta}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#f2f2ee] transition-colors duration-500 ${activePhase.groupHoverTextClass}`}
              >
                <span>{navigatingTo === 'v2' ? copy.v2Opening : copy.v2Cta}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Pie Técnico con Accesos Directos Silenciosos */}
      <footer className="relative z-10 border-t border-white/[0.08] px-5 py-4 text-xs text-zinc-500 sm:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span>{copy.footerCopyright}</span>

          <nav
            aria-label="Accesos rápidos"
            className="flex flex-wrap items-center gap-5 font-mono text-[11px]"
          >
            <Link
              href="/cotizador"
              className="text-zinc-400 transition-colors hover:text-[#f2f2ee]"
            >
              /cotizador
            </Link>
            <Link href="/tienda" className="text-zinc-400 transition-colors hover:text-[#f2f2ee]">
              /tienda
            </Link>
            <Link
              href="/dashboard"
              className="text-zinc-400 transition-colors hover:text-[#f2f2ee]"
            >
              /panel
            </Link>
            <span className="hidden text-zinc-600 md:inline">{copy.footerKeyboard}</span>
          </nav>
        </div>
      </footer>
    </div>
  )
}
