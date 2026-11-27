/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Umbral de versiones: retorno al selector Classic / V2 desde cualquier cara.
 *
 * Interacción en dos tiempos (doble hover):
 *   1. Hover sobre la pestaña  → abre el umbral con las dos puertas.
 *   2. Hover sobre una puerta  → revela su descripción y anima la miniatura.
 *
 * Teclado: foco abre, Escape cierra, Tab recorre las puertas. Touch: tap.
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, ChevronUp } from 'lucide-react'
import i18n from '@/core/i18n/config'
import { normalizeSupportedLang, type SupportedLang } from '@/core/i18n/languageDetector'
import { GATEWAY_COPY } from './gateway-i18n'
import { type SiteFace, useFacePreference } from './face-preference'

interface DockCopy {
  trigger: string
  header: string
  youAreAt: string
  current: string
  returnToThreshold: string
}

const DOCK_COPY: Record<SupportedLang, DockCopy> = {
  es: {
    trigger: 'Versión',
    header: 'Umbral de versiones',
    youAreAt: 'Estás en',
    current: 'Actual',
    returnToThreshold: 'Volver al umbral',
  },
  en: {
    trigger: 'Version',
    header: 'Version threshold',
    youAreAt: "You're in",
    current: 'Current',
    returnToThreshold: 'Back to the threshold',
  },
  'pt-BR': {
    trigger: 'Versão',
    header: 'Limiar de versões',
    youAreAt: 'Você está em',
    current: 'Atual',
    returnToThreshold: 'Voltar ao limiar',
  },
  de: {
    trigger: 'Version',
    header: 'Versionsschwelle',
    youAreAt: 'Du bist in',
    current: 'Aktuell',
    returnToThreshold: 'Zurück zur Schwelle',
  },
  fr: {
    trigger: 'Version',
    header: 'Seuil des versions',
    youAreAt: 'Vous êtes dans',
    current: 'Actuelle',
    returnToThreshold: 'Retour au seuil',
  },
  ar: {
    trigger: 'الإصدار',
    header: 'عتبة الإصدارات',
    youAreAt: 'أنت في',
    current: 'الحالي',
    returnToThreshold: 'العودة إلى العتبة',
  },
  'zh-CN': {
    trigger: '版本',
    header: '版本之门',
    youAreAt: '当前位于',
    current: '当前',
    returnToThreshold: '返回版本之门',
  },
}

interface FaceReturnDockProps {
  currentFace: SiteFace
}

const FACE_NUMERAL: Record<SiteFace, string> = {
  classic: '01',
  v2: '02',
}

export function FaceReturnDock({ currentFace }: FaceReturnDockProps) {
  const router = useRouter()
  const { setFace, clearFace } = useFacePreference()
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<SiteFace | null>(null)
  const [lang, setLang] = useState<SupportedLang>('es')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeTimer = useRef<number | null>(null)

  const copy = DOCK_COPY[lang] ?? DOCK_COPY.es
  const gateway = GATEWAY_COPY[lang] ?? GATEWAY_COPY.es
  const isV2 = currentFace === 'v2'

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const openDock = useCallback(() => {
    cancelClose()
    setOpen(true)
  }, [cancelClose])

  const closeDock = useCallback(() => {
    cancelClose()
    setOpen(false)
    setHovered(null)
  }, [cancelClose])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
      setHovered(null)
    }, 180)
  }, [cancelClose])

  // guardrail-ok(useEffect): suscripción externa a i18next para reflejar el idioma activo del sitio
  useEffect(() => {
    const sync = (next?: string) => setLang(normalizeSupportedLang(next ?? i18n.language))
    sync()
    i18n.on('languageChanged', sync)
    return () => {
      i18n.off('languageChanged', sync)
    }
  }, [])

  // guardrail-ok(useEffect): cierre del umbral al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeDock()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeDock()
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeDock, open])

  // guardrail-ok(useEffect): libera el temporizador de cierre pendiente al desmontar
  useEffect(() => () => cancelClose(), [cancelClose])

  const chooseFace = (next: SiteFace) => {
    if (next === currentFace) {
      closeDock()
      return
    }
    setFace(next)
    closeDock()
    router.push(`/${next}`)
  }

  const returnToThreshold = () => {
    clearFace()
    closeDock()
    router.push('/')
  }

  const panelSurface = isV2
    ? 'border-[#e2e8f0] bg-white text-[#0f172a] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]'
    : 'border-white/15 bg-[#0b0f17]/[0.97] text-[#f2f2ee] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]'
  const divider = isV2 ? 'border-[#e2e8f0]' : 'border-white/10'
  const muted = isV2 ? 'text-[#475569]' : 'text-zinc-400'
  const accentText = isV2 ? 'text-[#047857]' : 'text-emerald-400'
  const accentBg = isV2 ? 'bg-[#047857]' : 'bg-emerald-400'
  const rowHover = isV2 ? 'hover:bg-[#f1f5f9]' : 'hover:bg-white/[0.06]'

  return (
    <div
      ref={rootRef}
      className="face-dock-root fixed start-4 z-[45] print:hidden"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') openDock()
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') scheduleClose()
      }}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) closeDock()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="face-return-dock-panel"
        aria-label={`${copy.trigger}: ${copy.header}`}
        onClick={() => (open ? closeDock() : openDock())}
        className={`group flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 backdrop-blur-md transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isV2
            ? 'border-[#e2e8f0] bg-white/95 text-[#0f172a] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] hover:border-[#cbd5e1] focus-visible:outline-[#047857]'
            : 'border-white/15 bg-[#0b0f17]/90 text-[#f2f2ee] hover:border-white/30 focus-visible:outline-emerald-400'
        }`}
      >
        <span aria-hidden="true" className="flex h-4 w-4 flex-col justify-center gap-[3px]">
          <span className={`h-[2px] w-4 rounded-full ${accentBg}`} />
          <span className={`h-[2px] w-2.5 rounded-full ${isV2 ? 'bg-[#94a3b8]' : 'bg-zinc-500'}`} />
        </span>
        <span className="font-mono text-[11px] font-semibold tabular-nums">
          {FACE_NUMERAL[currentFace]}
        </span>
        <span className={`hidden text-[11px] font-semibold sm:inline ${muted}`}>
          {copy.trigger}
        </span>
        <ChevronUp
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            isV2 ? 'text-[#64748b]' : 'text-zinc-500'
          }`}
        />
      </button>

      {open && (
        <div
          id="face-return-dock-panel"
          role="group"
          aria-label={copy.header}
          className={`face-dock-panel absolute bottom-full start-0 mb-2 w-[min(20rem,calc(100vw-2rem))] origin-bottom-left overflow-hidden rounded-xl border rtl:origin-bottom-right ${panelSurface}`}
        >
          <div
            className={`flex items-center justify-between gap-3 border-b px-3.5 py-2.5 ${divider}`}
          >
            <span className="font-mono text-[10.5px] font-semibold">{copy.header}</span>
            <span className={`font-mono text-[10px] tabular-nums ${muted}`}>
              {copy.youAreAt} {FACE_NUMERAL[currentFace]}
            </span>
          </div>

          <div className="p-1.5">
            {(['classic', 'v2'] as const).map((face) => {
              const isCurrent = face === currentFace
              const isHovered = hovered === face
              const title = face === 'classic' ? gateway.classicTitle : gateway.v2Title
              const desc = face === 'classic' ? gateway.classicDesc : gateway.v2Desc
              const meta = face === 'classic' ? gateway.classicMeta : gateway.v2Meta

              return (
                <button
                  key={face}
                  type="button"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => chooseFace(face)}
                  onPointerEnter={() => setHovered(face)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(face)}
                  onBlur={() => setHovered(null)}
                  className={`relative flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2.5 text-start transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 ${
                    isV2 ? 'focus-visible:outline-[#047857]' : 'focus-visible:outline-emerald-400'
                  } ${rowHover}`}
                >
                  {isCurrent && (
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2 start-0 w-[2px] rounded-full ${accentBg}`}
                    />
                  )}
                  <span className={`mt-0.5 w-4 font-mono text-[10px] tabular-nums ${muted}`}>
                    {FACE_NUMERAL[face]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-[13px] font-semibold leading-tight">
                        {title}
                      </span>
                      {isCurrent && (
                        <span
                          className={`shrink-0 rounded-full border px-1.5 py-px text-[9px] font-semibold ${divider} ${accentText}`}
                        >
                          {copy.current}
                        </span>
                      )}
                    </span>
                    <span className={`mt-0.5 block truncate text-[10.5px] ${muted}`}>{meta}</span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                        isHovered ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className={`block pt-1.5 text-[11px] leading-snug ${muted}`}>
                          {desc}
                        </span>
                      </span>
                    </span>
                  </span>
                  <FaceMiniature face={face} active={isHovered} />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={returnToThreshold}
            className={`flex w-full cursor-pointer items-center justify-between gap-3 border-t px-3.5 py-2.5 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 ${divider} ${muted} ${
              isV2
                ? 'hover:bg-[#f8fafc] hover:text-[#047857] focus-visible:outline-[#047857]'
                : 'hover:bg-white/[0.04] hover:text-emerald-300 focus-visible:outline-emerald-400'
            }`}
          >
            <span>{copy.returnToThreshold}</span>
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </button>
        </div>
      )}
    </div>
  )
}

function FaceMiniature({ face, active }: { face: SiteFace; active: boolean }) {
  const isClassic = face === 'classic'

  return (
    <span
      aria-hidden="true"
      className={`relative mt-0.5 block h-8 w-11 shrink-0 overflow-hidden rounded-[5px] border ${
        isClassic ? 'border-white/15 bg-[#0b1018]' : 'border-[#e2e8f0] bg-white'
      }`}
    >
      <span
        className={`absolute inset-x-1 top-1 h-[2px] rounded-full ${
          isClassic ? 'bg-white/25' : 'bg-[#cbd5e1]'
        }`}
      />
      <span
        className={`absolute left-1 top-2.5 h-[6px] rounded-[1px] ${
          isClassic ? 'w-5 bg-white/75' : 'w-4 bg-[#0f172a]/80'
        }`}
      />
      <span
        className={`absolute left-1 top-[18px] h-[2px] w-6 rounded-full ${
          isClassic ? 'bg-white/20' : 'bg-[#94a3b8]'
        }`}
      />
      {isClassic ? (
        <span
          className={`absolute bottom-1 left-1 h-[3px] rounded-full bg-emerald-400 transition-[width] duration-300 ${
            active ? 'w-6' : 'w-3'
          }`}
        />
      ) : (
        <>
          <span
            className={`absolute right-1 bottom-1 h-[7px] w-[13px] rounded-[1px] border border-[#e2e8f0] bg-[#f8fafc] transition-colors duration-300 ${
              active ? 'border-[#047857]/40 bg-[#ecfdf5]' : ''
            }`}
          />
          <span
            className={`absolute bottom-1 left-1 h-[3px] rounded-full bg-[#047857] transition-[width] duration-300 ${
              active ? 'w-5' : 'w-2.5'
            }`}
          />
        </>
      )}
    </span>
  )
}

export default FaceReturnDock
