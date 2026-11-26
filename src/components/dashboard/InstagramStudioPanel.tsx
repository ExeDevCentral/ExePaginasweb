/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Mesa Editorial · Instagram (Minimalist Instrument Workbench).
 * Ejecución 100% local (<2ms, cero red, cero API keys) sobre el dominio puro
 * src/core/domain/instagram. Diseñado bajo principios anti-genéricos:
 * retícula asimétrica con filetes de 1px, números tabulares y un único acento esmeralda.
 */
'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Eraser, RotateCcw, Search } from 'lucide-react'
import {
  HOOK_FORMULAS,
  buildBeatSheet,
  detectMachineSignals,
  humanizeDraft,
  lintInstagramCaption,
  scoreReelHook,
  type DetectionCheckKey,
  type HookCheckKey,
} from '@/core/domain/instagram'

type WorkbenchMode = 'reel' | 'caption' | 'formulas'

interface EditorialPreset {
  id: string
  label: string
  mode: 'reel' | 'caption'
  content: string
  keywords?: string
}

const EDITORIAL_PRESETS: readonly EditorialPreset[] = [
  {
    id: 'padel-reel',
    label: 'Pádel · Señas',
    mode: 'reel',
    content: [
      'Nadie te dice que anotar 40 turnos por WhatsApp te cuesta clientes.',
      'El viernes a las 19 llueve, se bajan dos canchas y perdés media tarde reacomodando horarios a mano.',
      'Cuando el turno pide seña automática al reservar, el horario queda cubierto aunque no mires el teléfono.',
      'Dejá de regalar turnos vacíos por WhatsApp: comentá TURNOS y te muestro el flujo real.',
    ].join('\n'),
  },
  {
    id: 'restoia-reel',
    label: 'RESTOia · Caja',
    mode: 'reel',
    content: [
      'Cerrar caja en el restaurante llevaba 50 minutos. En RESTOia lleva 4 minutos.',
      'El problema nunca era el cajero: eran tres planillas distintas para salón, mostrador y transferencias.',
      'Unificamos comandas, medios de pago y arqueo en una sola pantalla pensada para hora pico.',
      'Esos 46 minutos menos cada noche salen de ordenar el sistema en RESTOia.',
    ].join('\n'),
  },
  {
    id: 'clinica-caption',
    label: 'Clínica · Caption 125c',
    mode: 'caption',
    keywords: 'turnos, whatsapp, consultorio',
    content: [
      'Pasamos un consultorio de {{tu_numero}} mensajes diarios por WhatsApp a agenda automática 24/7.',
      '',
      'La recepción no estaba saturada por falta de ganas: estaba confirmando horarios uno por uno sin recordatorio previo.',
      '',
      'Cuando el paciente elige hueco libre y recibe confirmación automática, bajan las ausencias sin sumar personal.',
      '',
      'Comentá SISTEMA y te paso el esquema exacto por mensaje privado.',
      '',
      '#sistemasweb #turnosmedicos #automatizacion',
    ].join('\n'),
  },
  {
    id: 'slop-demo',
    label: 'Prueba · Borrador IA sucio',
    mode: 'caption',
    keywords: 'sistemas web, reservas',
    content:
      '¡Dejá de scrollear!\u200B En el vertiginoso mundo actual — tu empresa necesita una solución integral para llevar tu negocio al siguiente nivel. No es solo una web, es un paradigma disruptivo con reservas online. Comentá INFO.\n\n#viral #fyp #parati #web #tech #negocios',
  },
]

const HOOK_LABELS_ES: Record<HookCheckKey, string> = {
  LENGTH: 'Longitud (<3s)',
  SPECIFICITY: 'Concreción',
  STAKES: 'Tensión / Costo',
  FRONTLOAD: 'Carga al inicio',
  ADDRESS: 'Dirección',
}

const DETECT_LABELS_ES: Record<DetectionCheckKey, string> = {
  BURSTINESS: 'Cadencia',
  SPECIFICITY: 'Datos reales',
  'SLOP DENSITY': 'Léxico limpio',
  FINGERPRINT: 'Tipografía',
  VOICE: 'Voz propia',
}

function statusTone(
  status:
    'PASS' | 'WARN' | 'FAIL' | 'STRONG' | 'OK' | 'WEAK' | 'READY' | 'REVIEW' | 'FIX' | 'FLAGGED'
): string {
  if (status === 'PASS' || status === 'STRONG' || status === 'READY') {
    return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  }
  if (status === 'WARN' || status === 'OK' || status === 'REVIEW') {
    return 'text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10'
  }
  return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10'
}

function barTone(score: number): string {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-rose-500'
}

export default function InstagramStudioPanel() {
  const [mode, setMode] = useState<WorkbenchMode>('reel')
  const [draft, setDraft] = useState<string>(EDITORIAL_PRESETS[0]?.content ?? '')
  const [seoKeywords, setSeoKeywords] = useState<string>('turnos, sistemas web')
  const [wpm, setWpm] = useState<number>(155)
  const [targetSeconds, setTargetSeconds] = useState<number>(30)
  const [formulaSearch, setFormulaSearch] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [lastCleanDelta, setLastCleanDelta] = useState<{
    removed: number
    scoreDelta: number
  } | null>(null)

  const firstLine = useMemo(() => {
    const line = draft
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find(Boolean)
    return line ?? ''
  }, [draft])

  const hookReport = useMemo(() => scoreReelHook(firstLine), [firstLine])

  const beatSheet = useMemo(
    () => buildBeatSheet(draft, { wpm, targetSeconds }),
    [draft, wpm, targetSeconds]
  )

  const captionLint = useMemo(() => {
    const kw = seoKeywords
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return lintInstagramCaption(draft, { keywords: kw })
  }, [draft, seoKeywords])

  const detection = useMemo(() => detectMachineSignals(draft), [draft])

  const humanPreview = useMemo(() => humanizeDraft(draft), [draft])

  const filteredFormulas = useMemo(() => {
    const q = formulaSearch.trim().toLowerCase()
    if (!q) return HOOK_FORMULAS
    return HOOK_FORMULAS.filter(
      (f) =>
        f.nameEs.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.exampleEs.toLowerCase().includes(q) ||
        f.bestForEs.toLowerCase().includes(q)
    )
  }, [formulaSearch])

  const handleApplyHumanizer = () => {
    const before = detectMachineSignals(draft).humanScore
    const cleaned = humanizeDraft(draft)
    const after = detectMachineSignals(cleaned.text).humanScore
    setDraft(cleaned.text)
    setLastCleanDelta({
      removed: cleaned.report.removedTotal,
      scoreDelta: Math.round((after - before) * 10) / 10,
    })
  }

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft.trim())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const handleLoadPreset = (preset: EditorialPreset) => {
    setMode(preset.mode)
    setDraft(preset.content)
    if (preset.keywords) setSeoKeywords(preset.keywords)
    setLastCleanDelta(null)
  }

  return (
    <section
      aria-label="Mesa Editorial de Instagram"
      className="rounded-2xl border border-slate-300/85 bg-card text-foreground dark:border-border"
    >
      {/* Cabecera Superior Sobria */}
      <div className="flex flex-col justify-between gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              Mesa de Corte Editorial · Instagram
            </h2>
            <span className="rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              Local · 0 API
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Medición de retención de 3 segundos, ventana real de 125 caracteres y limpieza de
            huellas mecánicas. Nada se publica automáticamente.
          </p>
        </div>

        {/* Selector de Modo con Regla Minimalista */}
        <div
          role="tablist"
          aria-label="Modo de trabajo editorial"
          className="inline-flex rounded-xl border border-border bg-muted/40 p-1"
        >
          {(
            [
              { id: 'reel', label: '01 · Guion & Toma' },
              { id: 'caption', label: '02 · Feed 125c' },
              { id: 'formulas', label: '03 · 26 Fórmulas' },
            ] as const
          ).map((tab) => {
            const active = mode === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setMode(tab.id)}
                className={`min-h-[34px] cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                  active
                    ? 'border border-transparent bg-foreground font-semibold text-background shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Barra de Casos Reales (Presets rápidos sin salir de la mesa) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/20 px-5 py-2.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[11px] text-muted-foreground">Base:</span>
          {EDITORIAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="cursor-pointer rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-emerald-500/50 hover:text-foreground active:scale-[0.99]"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <span className="font-mono text-[11px] text-muted-foreground">
          Voz activa: Exequiel Echevarría · ES-AR
        </span>
      </div>

      {mode === 'formulas' ? (
        /* Vista 03: Índice Minimalista de las 26 Fórmulas Empíricas */
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={formulaSearch}
                onChange={(e) => setFormulaSearch(e.target.value)}
                placeholder="Filtrar fórmulas por rubro, tensión o estructura..."
                aria-label="Filtrar las 26 fórmulas de hooks"
                className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {filteredFormulas.length} / {HOOK_FORMULAS.length} estructuras
            </span>
          </div>

          <div className="divide-y divide-border border-y border-border overscroll-contain">
            {filteredFormulas.map((formula) => (
              <div
                key={formula.id}
                className="grid grid-cols-1 gap-3 py-4 transition-colors hover:bg-muted/20 md:grid-cols-[180px_1fr_auto] md:items-start md:gap-6"
              >
                <div>
                  <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    #{String(formula.id).padStart(2, '0')} · {formula.name}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-foreground">
                    {formula.nameEs}
                  </div>
                  <div className="mt-1.5 inline-block rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[10px] font-medium text-foreground">
                    {formula.onScreenEs}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="font-medium leading-relaxed text-foreground">
                    “{formula.exampleEs}”
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-mono text-[11px] text-foreground/80">Estructura:</span>{' '}
                    {formula.templateEs}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-mono text-[11px] text-rose-500">Evitar:</span>{' '}
                    {formula.trapEs}
                  </p>
                </div>

                <div className="flex md:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(
                        `${formula.exampleEs}\n\nComentá SISTEMA y te envío el detalle por DM.`
                      )
                      setMode('reel')
                      setLastCleanDelta(null)
                    }}
                    className="min-h-[34px] cursor-pointer rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-[0.99]"
                  >
                    Usar en mesa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Vistas 01 & 02: Mesa Asimétrica a Dos Columnas */
        <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-[1.12fr_0.88fr] lg:divide-x lg:divide-y-0">
          {/* Columna Izquierda — Original en Crudo */}
          <div className="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="ig-manuscript-editor"
                  className="font-mono text-xs font-medium text-foreground"
                >
                  {mode === 'reel'
                    ? 'Guion hablado (1 línea = 1 plano)'
                    : 'Texto del post (Caption completo)'}
                </label>

                {mode === 'reel' ? (
                  <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums text-muted-foreground">
                    <label className="inline-flex items-center gap-1">
                      <span>Ritmo:</span>
                      <select
                        value={wpm}
                        onChange={(e) => setWpm(Number(e.target.value))}
                        aria-label="Palabras por minuto"
                        className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-foreground"
                      >
                        <option value={140}>140 ppm</option>
                        <option value={155}>155 ppm</option>
                        <option value={170}>170 ppm</option>
                      </select>
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <span>Meta:</span>
                      <select
                        value={targetSeconds}
                        onChange={(e) => setTargetSeconds(Number(e.target.value))}
                        aria-label="Duración objetivo en segundos"
                        className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-foreground"
                      >
                        <option value={20}>20s</option>
                        <option value={30}>30s</option>
                        <option value={45}>45s</option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {captionLint.characters} / {captionLint.limit} chars
                  </span>
                )}
              </div>

              <textarea
                id="ig-manuscript-editor"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value)
                  setLastCleanDelta(null)
                }}
                rows={10}
                spellCheck
                placeholder="Escribí o pegá el borrador acá..."
                className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground overscroll-contain placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
              />

              {mode === 'caption' && (
                <div className="mt-3">
                  <label
                    htmlFor="ig-seo-keywords"
                    className="block font-mono text-[11px] text-muted-foreground"
                  >
                    Términos de búsqueda en Instagram (separados por coma)
                  </label>
                  <input
                    id="ig-seo-keywords"
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Alerta Anti-Invención para Placeholders {{tu_numero}} */}
              {humanPreview.unverifiedPlaceholders.length > 0 && (
                <div className="mt-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-200">
                  <span className="font-mono font-semibold">Dato real requerido:</span> reemplazá{' '}
                  <code className="font-mono">
                    {humanPreview.unverifiedPlaceholders.join(', ')}
                  </code>{' '}
                  con tu métrica verificada antes de publicar.
                </div>
              )}

              {/* Barra de Acción Táctil */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyHumanizer}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-300 active:scale-[0.99]"
                  >
                    <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Depurar huella IA</span>
                    {humanPreview.report.removedTotal > 0 && (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
                        {humanPreview.report.removedTotal}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDraft('')
                      setLastCleanDelta(null)
                    }}
                    className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-[0.99]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Vaciar</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  disabled={!draft.trim()}
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40 active:scale-[0.99]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Copiado al portapapeles</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copiar bloque limpio</span>
                    </>
                  )}
                </button>
              </div>

              {lastCleanDelta && (
                <p className="mt-2.5 font-mono text-[11px] tabular-nums text-emerald-600 dark:text-emerald-400">
                  Limpieza aplicada: {lastCleanDelta.removed} artefacto(s) mecánico(s) removido(s) ·{' '}
                  {lastCleanDelta.scoreDelta >= 0
                    ? `+${lastCleanDelta.scoreDelta}`
                    : lastCleanDelta.scoreDelta}{' '}
                  pts de naturalidad.
                </p>
              )}
            </div>

            {/* Panel Inferior Izquierdo — Semáforo Humano de 5 Señales */}
            <div className="mt-6 border-t border-border pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground">
                  Señal Humana (5 controles locales)
                </span>
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                  <span className="font-bold text-foreground">{detection.humanScore} / 100</span>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${statusTone(
                      detection.verdict
                    )}`}
                  >
                    {detection.verdict}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {(Object.keys(DETECT_LABELS_ES) as DetectionCheckKey[]).map((key) => {
                  const metric = detection.checks[key]
                  return (
                    <div
                      key={key}
                      title={metric.detail}
                      className="rounded-lg border border-border bg-background/60 p-2.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
                        <span>{DETECT_LABELS_ES[key]}</span>
                        <span className="font-semibold text-foreground">{metric.score}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-all duration-300 ${barTone(metric.score)}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {humanPreview.report.structures.length > 0 && (
                <ul className="mt-3 space-y-1.5 border-t border-border pt-2.5 text-xs text-muted-foreground">
                  {humanPreview.report.structures.map((st, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        Reescritura sugerida ({st.name}):
                      </span>{' '}
                      {st.fix}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Columna Derecha — Lectura Técnica en Vivo */}
          <div className="p-5 sm:p-6">
            {mode === 'reel' ? (
              <div className="space-y-6">
                {/* Bloque 1: Score del Hook (Primeros 3 segundos) */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Apertura (Línea 1)
                      </span>
                      <h3 className="text-sm font-semibold text-foreground">
                        {hookReport.matchedFormula
                          ? `Fórmula #${hookReport.matchedFormula.id}: ${hookReport.matchedFormula.nameEs}`
                          : 'Estructura libre (sin fórmula nominal)'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-xl font-bold text-foreground">
                        {hookReport.overall}
                      </span>
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${statusTone(
                          hookReport.verdict
                        )}`}
                      >
                        {hookReport.verdict}
                      </span>
                    </div>
                  </div>

                  {hookReport.dealbreakers.length > 0 && (
                    <div className="mt-3 space-y-1 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                      {hookReport.dealbreakers.map((db, i) => (
                        <p key={i}>• {db}</p>
                      ))}
                    </div>
                  )}

                  <div className="mt-3.5 space-y-2">
                    {(Object.keys(HOOK_LABELS_ES) as HookCheckKey[]).map((key) => {
                      const item = hookReport.checks[key]
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                              {HOOK_LABELS_ES[key]}
                            </span>
                            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                              {item.detail} ·{' '}
                              <strong className="text-foreground">{item.score}</strong>
                            </span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all duration-300 ${barTone(item.score)}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bloque 2: Cronograma de Toma (Beat Sheet) */}
                <div className="border-t border-border pt-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      Cronograma de Toma (Beat Sheet)
                    </span>
                    {beatSheet && (
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        {beatSheet.totalWords} palabras · ~{beatSheet.totalSeconds}s / meta{' '}
                        {targetSeconds}s
                      </span>
                    )}
                  </div>

                  {beatSheet ? (
                    <>
                      <div className="divide-y divide-border rounded-xl border border-border bg-background/50">
                        {beatSheet.beats.map((row) => (
                          <div
                            key={row.n}
                            className="grid grid-cols-[54px_46px_54px_1fr] items-baseline gap-2 px-3 py-2.5 text-xs"
                          >
                            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                              {row.timecode}
                            </span>
                            <span
                              className={`font-mono text-[11px] tabular-nums ${
                                row.dur > 4
                                  ? 'font-semibold text-amber-600 dark:text-amber-400'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {row.dur.toFixed(1)}s
                            </span>
                            <span className="font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {row.label || `B${row.n}`}
                            </span>
                            <div>
                              <p className="leading-relaxed text-foreground">{row.text}</p>
                              {row.flags.map((flag, fi) => (
                                <p
                                  key={fi}
                                  className="mt-0.5 font-mono text-[10px] text-amber-600 dark:text-amber-400"
                                >
                                  ↳ {flag}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {beatSheet.notes.map((note, ni) => (
                          <li key={ni}>— {note}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Escribí al menos una línea en la mesa para calcular los tiempos de cámara.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Columna Derecha en Modo 02: Ventana Real de 125 Caracteres + Linter */
              <div className="space-y-5">
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      Lo que muestra el feed antes del toque ({captionLint.truncateAt} chars)
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${statusTone(
                        captionLint.verdict
                      )}`}
                    >
                      {captionLint.verdict}
                    </span>
                  </div>

                  {/* Espécimen Tipográfico Exacto del Feed Móvil */}
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs leading-relaxed text-foreground">
                      <span className="mr-1.5 font-semibold">exepaginasweb</span>
                      <span>{captionLint.visible || 'Sin texto todavía...'}</span>
                      {captionLint.truncated && (
                        <span className="ml-1 font-medium text-muted-foreground">... más</span>
                      )}
                    </p>

                    {captionLint.truncated && captionLint.hidden && (
                      <div className="mt-3 border-t border-dashed border-border pt-2.5">
                        <span className="block font-mono text-[10px] text-muted-foreground">
                          Oculto detrás del tap:
                        </span>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground/60">
                          {captionLint.hidden.trim()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabla de 8 Controles de Caption */}
                <div className="divide-y divide-border border-y border-border">
                  {captionLint.checks.map((chk) => (
                    <div
                      key={chk.check}
                      className="grid grid-cols-[58px_128px_1fr] items-baseline gap-2.5 py-2.5 text-xs"
                    >
                      <span
                        className={`inline-flex justify-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${statusTone(
                          chk.status
                        )}`}
                      >
                        {chk.status}
                      </span>
                      <span className="font-mono text-[11px] font-medium text-foreground">
                        {chk.check}
                      </span>
                      <span className="text-muted-foreground">{chk.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
