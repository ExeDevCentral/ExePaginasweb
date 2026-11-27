/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Motor Determinístico de Instagram & Humanizer (TypeScript Puro, 0 dependencias).
 * Soporta español rioplatense (ES-AR) e inglés (EN).
 */

import { classifyHookFormula, type HookFormula } from './hookFormulas'
import { INVISIBLE_RULES, SLOP_LEXICON, STRUCTURAL_TELLS, TYPOGRAPHIC_RULES } from './slopLexicon'

export interface CheckMetric {
  score: number
  detail: string
}

export type HookCheckKey = 'LENGTH' | 'SPECIFICITY' | 'STAKES' | 'FRONTLOAD' | 'ADDRESS'

export interface HookScoreReport {
  text: string
  overall: number
  verdict: 'STRONG' | 'OK' | 'WEAK'
  weakest: HookCheckKey
  checks: Record<HookCheckKey, CheckMetric>
  dealbreakers: string[]
  matchedFormula: HookFormula | null
}

export interface BeatRow {
  n: number
  start: number
  timecode: string
  dur: number
  words: number
  text: string
  concrete: number
  label: 'HOOK' | 'MID' | 'CTA' | 'HOOK/CTA' | ''
  flags: string[]
}

export interface BeatSheetReport {
  wpm: number
  targetSeconds: number | null
  totalSeconds: number
  totalWords: number
  hasLoop: boolean
  loopWords: string[]
  beats: BeatRow[]
  notes: string[]
}

export interface CaptionLintCheck {
  check:
    | 'LENGTH'
    | 'FIRST LINE'
    | 'HOOK IS CONCRETE'
    | 'HASHTAGS'
    | 'TAG PLACEMENT'
    | 'LINKS'
    | 'ONE ASK'
    | 'EMOJI'
    | 'SEARCH TERMS'
  status: 'PASS' | 'WARN' | 'FAIL'
  detail: string
}

export interface CaptionLintReport {
  characters: number
  limit: number
  truncateAt: number
  visible: string
  hidden: string
  truncated: boolean
  firstLineChars: number
  hashtags: string[]
  mentions: string[]
  links: string[]
  emojiCount: number
  asks: string[]
  checks: CaptionLintCheck[]
  verdict: 'READY' | 'REVIEW' | 'FIX'
}

export interface HumanizeReport {
  removedTotal: number
  invisible: Array<{ name: string; count: number; action: 'delete' | 'space' }>
  typographic: Array<{ name: string; count: number; to: string }>
  lexical: Array<{ find: string; replace: string; count: number; family: string }>
  structures: Array<{ name: string; count: number; fix: string }>
}

export interface HumanizeResult {
  text: string
  unverifiedPlaceholders: string[]
  report: HumanizeReport
}

export type DetectionCheckKey =
  'BURSTINESS' | 'SPECIFICITY' | 'SLOP DENSITY' | 'FINGERPRINT' | 'VOICE'

export interface DetectionReport {
  humanScore: number
  verdict: 'PASS' | 'REVIEW' | 'FLAGGED'
  weakest: DetectionCheckKey
  checks: Record<DetectionCheckKey, CheckMetric>
}

const WORD_RE = /[\p{L}\p{N}$%'’-]+/gu
const NUMBER_RE =
  /\$\s?\d[\d.,]*|\b\d[\d.,]*\s?(?:%|k\b|x\b|hs?\b|hrs?\b|horas?\b|min\b|minutos?\b|d[ií]as?\b|semanas?\b|meses?\b|a[ñn]os?\b|seg\b|segundos?\b)?/gi
const PROPER_RE = /(?<!^)\b[A-ZÁÉÍÓÚÑ][a-záéíóúñA-Z]{2,}\b/g
const HASHTAG_RE = /(?:^|\s)(#[\p{L}\p{N}_]+)/gu
const MENTION_RE = /(?:^|\s)(@[A-Za-z0-9_.]+)/g
const LINK_RE =
  /https?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|ar|co|io|net|org|ai|app)(?:\/\S*)?/gi
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu
const PLACEHOLDER_RE = /\{\{[^{}]+\}\}/g

const SPOKEN_NUMBERS = new Set([
  'cero',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
  'once',
  'doce',
  'quince',
  'veinte',
  'treinta',
  'cuarenta',
  'cincuenta',
  'cien',
  'ciento',
  'mil',
  'millón',
  'millon',
  'millones',
  'mitad',
  'doble',
  'triple',
  'zero',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'twenty',
  'thirty',
  'fifty',
  'hundred',
  'thousand',
  'million',
  'half',
  'twice',
])

const CONCRETE_DOMAIN_WORDS = new Set([
  'pesos',
  'dólares',
  'dolares',
  'usd',
  'turnos',
  'reservas',
  'señas',
  'senas',
  'horas',
  'minutos',
  'clientes',
  'facturas',
  'whatsapp',
  'dollars',
  'bucks',
  'percent',
  'revenue',
  'profit',
])

const STAKES_WORDS = new Set([
  'dejá',
  'deja',
  'nunca',
  'mal',
  'error',
  'errores',
  'perdí',
  'perdi',
  'perder',
  'pierden',
  'cuesta',
  'costó',
  'costo',
  'costaba',
  'rompe',
  'falla',
  'falló',
  'nadie',
  'no',
  'sin',
  'reemplazó',
  'reemplazo',
  'ahorró',
  'ahorro',
  'antes',
  'secreto',
  'problema',
  'riesgo',
  'contra',
  'versus',
  'vs',
  'stop',
  'never',
  'wrong',
  'mistake',
  'lost',
  'lose',
  'cost',
  'costs',
  'failed',
  'nobody',
  'not',
  "don't",
  'dont',
  'replaced',
  'saved',
  'worst',
  'wasted',
])

const WEAK_OPENERS = [
  'hola',
  'buenas',
  'buen día',
  'buen dia',
  'che',
  'bueno',
  'mirá hoy',
  'hoy quiero',
  'hoy te',
  'en este',
  'en el video',
  'básicamente',
  'basicamente',
  'sinceramente',
  'so',
  'ok',
  'okay',
  'hey',
  'hi',
  'hello',
  'guys',
  'welcome',
  'today',
  'basically',
  'honestly',
  'in this',
  'in today',
]

const IMPERATIVES = new Set([
  'dejá',
  'deja',
  'copiá',
  'copia',
  'robá',
  'roba',
  'borrá',
  'borra',
  'probá',
  'proba',
  'mirá',
  'mira',
  'guardá',
  'guarda',
  'usá',
  'usa',
  'armá',
  'arma',
  'medí',
  'medi',
  'cambiá',
  'cambia',
  'cortá',
  'corta',
  'stop',
  'steal',
  'copy',
  'delete',
  'try',
  'watch',
  'read',
  'save',
  'use',
  'build',
  'never',
])

const STOPWORDS = new Set([
  'el',
  'la',
  'los',
  'las',
  'un',
  'una',
  'unos',
  'unas',
  'de',
  'del',
  'al',
  'a',
  'en',
  'por',
  'para',
  'con',
  'sin',
  'que',
  'y',
  'o',
  'pero',
  'si',
  'es',
  'son',
  'era',
  'fue',
  'este',
  'esta',
  'ese',
  'esa',
  'tu',
  'tus',
  'mi',
  'mis',
  'me',
  'te',
  'se',
  'lo',
  'le',
  'no',
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'if',
  'of',
  'to',
  'in',
  'on',
  'for',
  'with',
  'that',
  'this',
  'it',
  'is',
  'are',
  'you',
  'your',
  'i',
  'my',
])

const HOOK_DEALBREAKERS: ReadonlyArray<{ regex: RegExp; message: string }> = [
  {
    regex:
      /^\s*[¡!]?\s*(?:dej[aá]\s+de\s+scrollear|no\s+sigas\s+bajando|stop\s+scrolling|don'?t\s+scroll)/i,
    message:
      'Abre pidiendo atención ("dejá de scrollear"). Pedir atención demuestra que no la ganaste.',
  },
  {
    regex:
      /\b(?:en\s+(?:este|el)\s+(?:video|reel)(?:\s+de\s+hoy)?|hoy\s+te\s+voy\s+a\s+(?:mostrar|contar)|in\s+(?:this|today'?s)\s+(?:video|reel)|i'?m\s+going\s+to\s+show\s+you)\b/i,
    message: 'Preámbulo de video. Cortalo y abrí directo en el resultado o conflicto.',
  },
  {
    regex: /^\s*[¡!]?\s*(?:hola\b|buenas\b|hey\b|hi\b|what'?s\s+up\b|bienvenidos?\b)/i,
    message: 'Saludo inicial. Nadie entra al feed para que lo saluden.',
  },
  {
    regex: /(?:^|\s)#[\p{L}\p{N}_]+/u,
    message: 'Hashtag dentro del hook. Los hashtags van al cierre del caption (máx. 5).',
  },
  {
    regex: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
    message:
      'Emoji en el hook hablado/en pantalla. En 2 segundos entran palabras claras, no adornos.',
  },
]

const CAPTION_ASKS: ReadonlyArray<{ regex: RegExp; label: string }> = [
  {
    regex: /\b(?:coment[aá]|escrib[ií])\s+(?:la\s+palabra\s+)?["“]?[A-ZÁÉÍÓÚÑ0-9]{3,}["”]?/i,
    label: 'comentar palabra clave',
  },
  {
    regex:
      /\b(?:mandame|escribime|enviame)\s+(?:un\s+)?(?:dm|mensaje|privado)\b|\b(?:dm|message)\s+me\b/i,
    label: 'enviar DM',
  },
  { regex: /\b(?:guard[aá]|save)\s+(?:este|esto|el\s+post|this|it)\b/i, label: 'guardar post' },
  { regex: /\b(?:compart[ií]|mandale|share)\s+(?:esto|este|this|it)\b/i, label: 'compartir' },
  {
    regex: /\blink\s+en\s+(?:mi\s+|la\s+)?bio\b|\blink\s+in\s+(?:my\s+)?bio\b/i,
    label: 'link en bio',
  },
  { regex: /\b(?:seguime|follow\s+(?:me|for))\b/i, label: 'seguir cuenta' },
]

const FILLER_TAGS = new Set([
  '#viral',
  '#fyp',
  '#parati',
  '#explore',
  '#explorepage',
  '#foryou',
  '#trending',
  '#instagood',
  '#reels',
  '#reelsinstagram',
  '#viralreels',
  '#argentina',
])

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function tokenizeWords(text: string): string[] {
  const normalizedNumbers = text.replace(/(?<=\d)[.,](?=\d)/g, '')
  return normalizedNumbers.match(WORD_RE) ?? []
}

function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds - mins * 60
  return `${mins}:${secs.toFixed(1).padStart(4, '0')}`
}

export function scoreReelHook(rawText: string): HookScoreReport {
  const text = rawText.trim()
  const tokens = tokenizeWords(text)
  const wordCount = tokens.length
  const chars = text.length
  const secs = wordCount / 2.6 // ~156 wpm natural en español

  // 1. LENGTH
  let lengthScore: number
  if (wordCount === 0) {
    lengthScore = 0
  } else if (wordCount >= 5 && wordCount <= 13) {
    lengthScore = 100
  } else if (wordCount < 5) {
    lengthScore = clamp(100 - (5 - wordCount) * 20)
  } else {
    lengthScore = clamp(100 - (wordCount - 13) * 11)
  }
  if (chars > 72) lengthScore = clamp(lengthScore - 12)

  // 2. SPECIFICITY
  const nums = (text.match(NUMBER_RE) ?? []).map((m) => m.trim()).filter(Boolean)
  const propers = [...new Set(text.match(PROPER_RE) ?? [])]
  const lowTokens = tokens.map((w) => w.toLowerCase().replace(/^['’]+|['’]+$/g, ''))
  const spoken = lowTokens.filter((w) => SPOKEN_NUMBERS.has(w) || CONCRETE_DOMAIN_WORDS.has(w))
  const concreteHits = nums.length + propers.length + spoken.length
  const specificityScore = concreteHits === 0 ? 15 : clamp(45 + concreteHits * 30)
  const concreteSamples = [...nums.slice(0, 2), ...propers.slice(0, 2), ...spoken.slice(0, 2)].join(
    ', '
  )

  // 3. STAKES
  const stakeMarkers = [...new Set(lowTokens.filter((w) => STAKES_WORDS.has(w)))]
  if (/\$\s?\d/.test(text)) stakeMarkers.push('monto ($)')
  const stakesScore = stakeMarkers.length === 0 ? 20 : stakeMarkers.length === 1 ? 75 : 100

  // 4. FRONTLOAD
  let frontloadScore = 0
  let frontloadDetail = 'vacío'
  if (wordCount > 0) {
    const opener2 = lowTokens.slice(0, 2).join(' ')
    const opener3 = lowTokens.slice(0, 3).join(' ')
    let penalty = 0
    let hitOpener: string | null = null
    for (const weak of WEAK_OPENERS) {
      if (opener3.startsWith(weak) || opener2.startsWith(weak) || lowTokens[0] === weak) {
        penalty = 35
        hitOpener = weak
        break
      }
    }

    let payloadIndex: number | null = null
    for (let i = 0; i < lowTokens.length; i++) {
      const tok = lowTokens[i] ?? ''
      const rawTok = tokens[i] ?? ''
      if (
        STAKES_WORDS.has(tok) ||
        SPOKEN_NUMBERS.has(tok) ||
        CONCRETE_DOMAIN_WORDS.has(tok) ||
        /^\$?\d/.test(rawTok) ||
        (i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(rawTok))
      ) {
        payloadIndex = i
        break
      }
    }

    const base = payloadIndex === null ? 30 : payloadIndex <= 3 ? 100 : payloadIndex <= 6 ? 72 : 40
    frontloadScore = clamp(base - penalty)
    const posText =
      payloadIndex === null ? 'sin palabra ancla' : `carga fuerte en palabra ${payloadIndex + 1}`
    frontloadDetail = hitOpener ? `${posText}; apertura débil "${hitOpener}"` : posText
  }

  // 5. ADDRESS
  const lowText = text.toLowerCase()
  let addressScore = 35
  let addressDetail = '3ra persona abstracta'
  if (
    /\b(?:tu|tus|te|vos|ten[eé]s|est[aá]s|pod[eé]s|necesit[aá]s|you|your|you're)\b/i.test(lowText)
  ) {
    addressScore = 100
    addressDetail = 'habla directo al espectador'
  } else if (lowTokens[0] && IMPERATIVES.has(lowTokens[0])) {
    addressScore = 92
    addressDetail = `imperativo directo ("${lowTokens[0]}")`
  } else if (/\b(?:yo|mi|mis|me|perdí|armé|pasamos|hicimos|i|my|we|our)\b/i.test(lowText)) {
    addressScore = 72
    addressDetail = '1ra persona con experiencia propia'
  }

  const checks: Record<HookCheckKey, CheckMetric> = {
    LENGTH: {
      score: round1(lengthScore),
      detail: `${wordCount} palabras, ${chars} chars (~${secs.toFixed(1)}s hablado · ideal 5-13)`,
    },
    SPECIFICITY: {
      score: round1(specificityScore),
      detail:
        concreteHits > 0
          ? `${concreteHits} ancla(s) concreta(s): ${concreteSamples}`
          : '0 datos verificables (sin número, monto ni entidad)',
    },
    STAKES: {
      score: round1(stakesScore),
      detail:
        stakeMarkers.length > 0
          ? `${stakeMarkers.length} tensión(es): ${stakeMarkers.slice(0, 3).join(', ')}`
          : 'sin costo ni tensión evidente',
    },
    FRONTLOAD: {
      score: round1(frontloadScore),
      detail: frontloadDetail,
    },
    ADDRESS: {
      score: round1(addressScore),
      detail: addressDetail,
    },
  }

  const dealbreakers = HOOK_DEALBREAKERS.filter((d) => d.regex.test(text)).map((d) => d.message)
  const keys: HookCheckKey[] = ['LENGTH', 'SPECIFICITY', 'STAKES', 'FRONTLOAD', 'ADDRESS']
  const scores = keys.map((k) => checks[k].score)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const minScore = Math.min(...scores)
  const weakest = keys.reduce(
    (minKey, k) => (checks[k].score < checks[minKey].score ? k : minKey),
    keys[0]!
  )

  const overall = round1(clamp(mean * 0.6 + minScore * 0.4 - dealbreakers.length * 15))
  const verdict: HookScoreReport['verdict'] =
    overall >= 70 && minScore >= 55 && dealbreakers.length === 0
      ? 'STRONG'
      : overall >= 50
        ? 'OK'
        : 'WEAK'

  return {
    text,
    overall,
    verdict,
    weakest,
    checks,
    dealbreakers,
    matchedFormula: classifyHookFormula(text),
  }
}

export function buildBeatSheet(
  rawScript: string,
  options: { wpm?: number; targetSeconds?: number } = {}
): BeatSheetReport | null {
  const wpm = options.wpm ?? 155
  const targetSeconds = options.targetSeconds ?? null
  const wps = wpm / 60

  const rawLines = rawScript
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (rawLines.length === 0) return null

  const HOOK_WINDOW = 3.0
  const MAX_BEAT = 4.0
  const ABSTRACT_RUN = 3

  const beatsText: string[] = []
  for (const line of rawLines) {
    const lineWords = tokenizeWords(line).length
    if (lineWords / wps <= MAX_BEAT * 1.5) {
      beatsText.push(line)
      continue
    }
    const sentences = (line.match(/[^.!?]+[.!?]*/g) ?? [line]).map((s) => s.trim()).filter(Boolean)
    if (sentences.length <= 1) {
      beatsText.push(line)
      continue
    }
    let buf = ''
    for (const part of sentences) {
      const candidate = buf ? `${buf} ${part}` : part
      if (buf && tokenizeWords(candidate).length / wps > MAX_BEAT) {
        beatsText.push(buf)
        buf = part
      } else {
        buf = candidate
      }
    }
    if (buf) beatsText.push(buf)
  }

  let clock = 0
  const beats: BeatRow[] = beatsText.map((text, idx) => {
    const words = tokenizeWords(text).length
    const dur = words / wps
    const concreteMatches =
      (text.match(NUMBER_RE) ?? []).length + (text.match(PROPER_RE) ?? []).length
    const row: BeatRow = {
      n: idx + 1,
      start: round1(clock),
      timecode: formatTimecode(clock),
      dur: round1(dur),
      words,
      text,
      concrete: concreteMatches,
      label: '',
      flags: [],
    }
    clock += dur
    return row
  })

  const totalSeconds = round1(clock)
  for (const row of beats) {
    if (row.n === 1 || row.start + row.dur <= HOOK_WINDOW) {
      row.label = 'HOOK'
    }
  }
  const lastRow = beats[beats.length - 1]
  if (lastRow) {
    lastRow.label = lastRow.label === 'HOOK' ? 'HOOK/CTA' : 'CTA'
  }
  const midpoint = totalSeconds / 2
  for (const row of beats) {
    if (!row.label && row.start <= midpoint && midpoint < row.start + row.dur) {
      row.label = 'MID'
    }
  }

  const notes: string[] = []
  const firstRow = beats[0]!
  if (firstRow.dur > HOOK_WINDOW) {
    firstRow.flags.push(`el hook dura ${firstRow.dur.toFixed(1)}s (pasa los 3s)`)
    notes.push(
      `El Beat 1 tarda ${firstRow.dur.toFixed(1)}s. Recortalo a ${Math.floor(HOOK_WINDOW * wps)} palabras o menos.`
    )
  }
  if (firstRow.concrete === 0) {
    notes.push('El Beat 1 no tiene números ni nombres concretos verificables.')
  }

  const longBeats: number[] = []
  for (const row of beats) {
    if (row.dur > MAX_BEAT) {
      row.flags.push(`${row.dur.toFixed(1)}s en un mismo plano`)
      longBeats.push(row.n)
    }
  }
  if (longBeats.length > 0) {
    notes.push(
      `Beat(s) ${longBeats.join(', ')} superan ${MAX_BEAT}s. Cortá la frase o cambiá de plano en pantalla.`
    )
  }

  let abstractRun = 0
  let runStart: number | null = null
  for (const row of beats) {
    if (row.concrete === 0) {
      abstractRun += 1
      if (runStart === null) runStart = row.n
      if (abstractRun === ABSTRACT_RUN) {
        notes.push(
          `Los beats ${runStart}-${row.n} son abstractos seguidos. Sumá un dato, tiempo o caso real.`
        )
      }
    } else {
      abstractRun = 0
      runStart = null
    }
  }

  const firstContentWords = new Set(
    tokenizeWords(firstRow.text)
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  )
  const lastContentWords = new Set(
    tokenizeWords(lastRow?.text ?? '')
      .map((w) => w.toLowerCase())
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  )
  const loopWords =
    beats.length > 1 ? [...firstContentWords].filter((w) => lastContentWords.has(w)) : []
  const hasLoop = loopWords.length > 0

  if (hasLoop) {
    notes.push(`Loop activo: el cierre retoma "${loopWords.slice(0, 3).join(', ')}" del hook.`)
  } else {
    notes.push(
      'Sin loop: repetir una palabra clave del Beat 1 en el cierre multiplica segundas vistas.'
    )
  }

  if (targetSeconds !== null) {
    const delta = totalSeconds - targetSeconds
    if (Math.abs(delta) <= targetSeconds * 0.12) {
      notes.push(`Duración clavada en objetivo (${totalSeconds}s / ${targetSeconds}s).`)
    } else if (delta > 0) {
      notes.push(
        `${delta.toFixed(1)}s pasado del objetivo. Recortá ~${Math.ceil(delta * wps)} palabras.`
      )
    } else {
      notes.push(
        `${Math.abs(delta).toFixed(1)}s debajo de ${targetSeconds}s (más corto suele retener mejor).`
      )
    }
  }

  return {
    wpm,
    targetSeconds,
    totalSeconds,
    totalWords: beats.reduce((acc, b) => acc + b.words, 0),
    hasLoop,
    loopWords,
    beats,
    notes,
  }
}

export function lintInstagramCaption(
  rawText: string,
  options: { truncateAt?: number; keywords?: string[] } = {}
): CaptionLintReport {
  const LIMIT = 2200
  const HASHTAG_LIMIT = 5
  const truncateAt = options.truncateAt ?? 125
  const stripped = rawText.trim()
  const characters = stripped.length
  const lines = stripped.split(/\r?\n/)
  const firstLine = (lines[0] ?? '').trim()

  const visible = characters <= truncateAt ? stripped : stripped.slice(0, truncateAt)
  const hidden = characters <= truncateAt ? '' : stripped.slice(truncateAt)
  const truncated = characters > truncateAt

  const hashtags = [...stripped.matchAll(HASHTAG_RE)].map((m) => m[1] ?? '').filter(Boolean)
  const mentions = [...stripped.matchAll(MENTION_RE)].map((m) => m[1] ?? '').filter(Boolean)
  const links = stripped.match(LINK_RE) ?? []
  const emojis = stripped.match(EMOJI_RE) ?? []
  const asks = CAPTION_ASKS.filter((a) => a.regex.test(stripped)).map((a) => a.label)
  const fillerTags = hashtags.filter((t) => FILLER_TAGS.has(t.toLowerCase()))
  const keywords = (options.keywords ?? []).map((k) => k.trim()).filter(Boolean)

  const checks: CaptionLintCheck[] = []

  checks.push({
    check: 'LENGTH',
    status: characters > LIMIT ? 'FAIL' : 'PASS',
    detail:
      characters > LIMIT
        ? `${characters} / ${LIMIT} caracteres (${characters - LIMIT} excedidos)`
        : `${characters} / ${LIMIT} caracteres`,
  })

  if (!firstLine) {
    checks.push({ check: 'FIRST LINE', status: 'FAIL', detail: 'Abre con línea vacía' })
  } else if (firstLine.startsWith('#') || firstLine.startsWith('@')) {
    checks.push({
      check: 'FIRST LINE',
      status: 'FAIL',
      detail: 'Desperdicia la primera línea en un hashtag o mención',
    })
  } else if (firstLine.length > truncateAt) {
    checks.push({
      check: 'FIRST LINE',
      status: 'WARN',
      detail: `${firstLine.length} chars: Instagram corta en ${truncateAt} ("... más") a mitad de idea`,
    })
  } else {
    checks.push({
      check: 'FIRST LINE',
      status: 'PASS',
      detail: `${firstLine.length} chars · entra entera antes del corte`,
    })
  }

  const concreteInWindow =
    (visible.match(NUMBER_RE) ?? []).length + (visible.match(PROPER_RE) ?? []).length
  checks.push({
    check: 'HOOK IS CONCRETE',
    status: concreteInWindow > 0 ? 'PASS' : 'WARN',
    detail:
      concreteInWindow > 0
        ? `${concreteInWindow} dato(s) concreto(s) en los primeros ${truncateAt} caracteres`
        : 'Sin números ni nombres propios visibles antes de tocar "... más"',
  })

  if (hashtags.length > HASHTAG_LIMIT) {
    checks.push({
      check: 'HASHTAGS',
      status: 'FAIL',
      detail: `${hashtags.length} tags (supera el tope oficial de ${HASHTAG_LIMIT} de Instagram desde dic. 2025)`,
    })
  } else if (fillerTags.length > 0) {
    checks.push({
      check: 'HASHTAGS',
      status: 'WARN',
      detail: `${hashtags.length} tags, pero ${fillerTags.join(', ')} son genéricos y no posicionan`,
    })
  } else {
    checks.push({
      check: 'HASHTAGS',
      status: 'PASS',
      detail:
        hashtags.length > 0 ? `${hashtags.length}/5 tags limpios: ${hashtags.join(' ')}` : '0 tags',
    })
  }

  const tagInVisible = hashtags.some((t) => visible.includes(t))
  checks.push({
    check: 'TAG PLACEMENT',
    status: tagInVisible ? 'WARN' : 'PASS',
    detail: tagInVisible
      ? 'Hay hashtags gastando espacio en la ventana visible'
      : 'Tags ubicados al pie',
  })

  checks.push({
    check: 'LINKS',
    status: links.length > 0 ? 'WARN' : 'PASS',
    detail:
      links.length > 0
        ? `${links.length} URL(s) en el cuerpo (en IG no son clickeables; movelo a bio o DM)`
        : 'Sin URLs muertas en el texto',
  })

  if (asks.length === 1) {
    checks.push({ check: 'ONE ASK', status: 'PASS', detail: `1 acción clara: ${asks[0]}` })
  } else if (asks.length === 0) {
    checks.push({ check: 'ONE ASK', status: 'WARN', detail: 'Sin llamado a la acción claro' })
  } else {
    checks.push({
      check: 'ONE ASK',
      status: 'WARN',
      detail: `${asks.length} pedidos distintos (${asks.join(', ')}). Pedir dos cosas equivale a ninguna`,
    })
  }

  const emojiDensity = (emojis.length * 100) / Math.max(characters, 1)
  checks.push({
    check: 'EMOJI',
    status: emojiDensity > 3.5 ? 'WARN' : 'PASS',
    detail: `${emojis.length} emoji(s) (${emojiDensity.toFixed(1)} cada 100 chars)`,
  })

  if (keywords.length > 0) {
    const lowBody = stripped.toLowerCase()
    const found = keywords.filter((k) => lowBody.includes(k.toLowerCase()))
    const missing = keywords.filter((k) => !lowBody.includes(k.toLowerCase()))
    checks.push({
      check: 'SEARCH TERMS',
      status: missing.length === 0 ? 'PASS' : found.length > 0 ? 'WARN' : 'FAIL',
      detail:
        missing.length === 0
          ? `${found.length}/${keywords.length} términos SEO incluidos`
          : `${found.length}/${keywords.length} presentes · faltan: ${missing.join(', ')}`,
    })
  }

  const hasFail = checks.some((c) => c.status === 'FAIL')
  const hasWarn = checks.some((c) => c.status === 'WARN')
  const verdict: CaptionLintReport['verdict'] = hasFail ? 'FIX' : hasWarn ? 'REVIEW' : 'READY'

  return {
    characters,
    limit: LIMIT,
    truncateAt,
    visible,
    hidden,
    truncated,
    firstLineChars: firstLine.length,
    hashtags,
    mentions,
    links,
    emojiCount: emojis.length,
    asks,
    checks,
    verdict,
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchCaseReplacement(source: string, replacement: string): string {
  if (!replacement) return ''
  const letters = source.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '')
  if (letters.length > 1 && letters === letters.toUpperCase()) {
    return replacement.toUpperCase()
  }
  const firstLetter = letters[0]
  if (firstLetter && firstLetter === firstLetter.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}

export function humanizeDraft(rawText: string): HumanizeResult {
  const unverifiedPlaceholders = [...new Set(rawText.match(PLACEHOLDER_RE) ?? [])]

  // Proteger URLs y placeholders {{...}}
  const protectedTokens: string[] = []
  let working = rawText.replace(/https?:\/\/\S+|www\.\S+|\S+@\S+\.\S+|\{\{[^{}]+\}\}/g, (match) => {
    protectedTokens.push(match)
    return `\u0000TOK${protectedTokens.length - 1}\u0000`
  })

  // Pass 1: Caracteres invisibles
  const invisibleHits: HumanizeReport['invisible'] = []
  for (const rule of INVISIBLE_RULES) {
    const matches = working.match(rule.regex)
    if (matches && matches.length > 0) {
      invisibleHits.push({
        name: `${rule.codePoint} ${rule.name}`,
        count: matches.length,
        action: rule.action,
      })
      working = working.replace(rule.regex, rule.action === 'delete' ? '' : ' ')
    }
  }

  // Pass 2: Tipografía mecánica
  const typoHits: HumanizeReport['typographic'] = []
  for (const rule of TYPOGRAPHIC_RULES) {
    const parts = working.split(rule.from)
    const count = parts.length - 1
    if (count <= 0) continue
    typoHits.push({ name: rule.name, count, to: rule.to.trim() || '(espacio)' })
    if (rule.from === '—') {
      working = working.replace(/\s*—\s*/g, ', ')
    } else if (rule.from === '–') {
      working = working
        .replace(/\s*–\s*(?=\d)/g, '-')
        .replace(/\s+–\s+/g, ', ')
        .replace(/–/g, '-')
    } else {
      working = parts.join(rule.to)
    }
  }

  // Pass 3: Lexicón Slop Bilingüe (frases más largas primero)
  const lexicalHits: HumanizeReport['lexical'] = []
  const sortedLexicon = [...SLOP_LEXICON].sort((a, b) => b.find.length - a.find.length)
  for (const entry of sortedLexicon) {
    const patternSource = escapeRegExp(entry.find).replace(/\\ /g, '\\s+')
    const regex = new RegExp(
      `(?<![\\p{L}\\p{N}])(?:[¡!¿?]\\s*)?${patternSource}(?:\\s*[!¡])?(?![\\p{L}\\p{N}])`,
      'giu'
    )
    const found = working.match(regex)
    if (!found || found.length === 0) continue
    lexicalHits.push({
      find: entry.find,
      replace: entry.replace || '(eliminado)',
      count: found.length,
      family: entry.family,
    })
    working = working.replace(regex, (m) => matchCaseReplacement(m, entry.replace))
  }

  // Limpieza de puntuación huérfana tras eliminaciones
  working = working
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^[ \t]*(?:[,.;:]+[ \t]*)+/gm, '')
    .replace(/^[ \t](?=\S)/gm, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/,\s*([,.;:!?])/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(?:^|(?<=[.!?]\s)|(?<=\n))([a-záéíóúñ])/g, (m) => m.toUpperCase())

  // Restaurar URLs y placeholders
  for (let i = 0; i < protectedTokens.length; i++) {
    working = working.replace(`\u0000TOK${i}\u0000`, protectedTokens[i] ?? '')
  }

  const finalText = working.trim()
  const structures: HumanizeReport['structures'] = []
  for (const tell of STRUCTURAL_TELLS) {
    const regex = new RegExp(tell.regex.source, tell.regex.flags)
    const found = finalText.match(regex)
    if (found && found.length > 0) {
      structures.push({ name: tell.name, count: found.length, fix: tell.fix })
    }
  }

  const sentenceLengths = (finalText.match(/[^.!?\n]+[.!?]*/g) ?? [])
    .map((s) => tokenizeWords(s).length)
    .filter((len) => len > 2)

  if (sentenceLengths.length >= 4) {
    const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
    const variance =
      sentenceLengths.reduce((acc, n) => acc + (n - mean) ** 2, 0) / sentenceLengths.length
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0
    if (cv < 0.32) {
      structures.push({
        name: `Cadencia robótica uniforme (variación ${cv.toFixed(2)})`,
        count: sentenceLengths.length,
        fix: 'Cortá una oración a tres palabras y dejá otra larga. La IA escribe todo del mismo largo.',
      })
    }
  }

  const removedTotal =
    invisibleHits.reduce((a, b) => a + b.count, 0) +
    typoHits.reduce((a, b) => a + b.count, 0) +
    lexicalHits.reduce((a, b) => a + b.count, 0)

  return {
    text: finalText,
    unverifiedPlaceholders,
    report: {
      removedTotal,
      invisible: invisibleHits,
      typographic: typoHits,
      lexical: lexicalHits,
      structures,
    },
  }
}

function scaleScore(value: number, humanTarget: number, machineTarget: number): number {
  if (humanTarget === machineTarget) return 50
  return clamp(((value - machineTarget) / (humanTarget - machineTarget)) * 100)
}

export function detectMachineSignals(rawText: string): DetectionReport {
  const text = rawText.trim()
  const tokens = tokenizeWords(text)
  const wordCount = Math.max(tokens.length, 1)

  // 1. BURSTINESS
  const sents = (text.match(/[^.!?\n]+[.!?]*/g) ?? [])
    .map((s) => tokenizeWords(s).length)
    .filter((n) => n > 2)
  let burstScore = 62
  let burstDetail = 'texto breve (referencia neutra)'
  if (sents.length >= 3) {
    const mean = sents.reduce((a, b) => a + b, 0) / sents.length
    const std = Math.sqrt(sents.reduce((acc, n) => acc + (n - mean) ** 2, 0) / sents.length)
    const cv = mean > 0 ? std / mean : 0
    burstScore = scaleScore(cv, 0.65, 0.2)
    burstDetail = `variación ${cv.toFixed(2)} en ${sents.length} oraciones (ideal ≥ 0.50)`
  }

  // 2. SPECIFICITY
  const concreteCount =
    (text.match(NUMBER_RE) ?? []).length +
    new Set(text.match(PROPER_RE) ?? []).size +
    (text.match(PLACEHOLDER_RE) ?? []).length
  const concretePer100 = (concreteCount * 100) / wordCount
  const specScore = tokens.length < 12 ? 60 : scaleScore(concretePer100, 6.0, 0.5)

  // 3. SLOP DENSITY
  let slopHits = 0
  const slopFound: string[] = []
  for (const entry of SLOP_LEXICON) {
    const patternSource = escapeRegExp(entry.find).replace(/\\ /g, '\\s+')
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])${patternSource}(?![\\p{L}\\p{N}])`, 'giu')
    const m = text.match(regex)
    if (m && m.length > 0) {
      slopHits += m.length
      slopFound.push(entry.find)
    }
  }
  const slopPer100 = (slopHits * 100) / wordCount
  const slopScore = scaleScore(slopPer100, 0, 4.0)

  // 4. FINGERPRINT
  let invisibleCount = 0
  for (const r of INVISIBLE_RULES) {
    invisibleCount += (text.match(r.regex) ?? []).length
  }
  const emDashes = (text.match(/—/g) ?? []).length
  const curlyQuotes = (text.match(/[‘’“”]/g) ?? []).length
  const unicodeEllipsis = (text.match(/…/g) ?? []).length
  const fpPenalty = invisibleCount * 5 + emDashes * 2.5 + curlyQuotes + unicodeEllipsis
  const fpPer1k = (fpPenalty * 1000) / Math.max(text.length, 1)
  const fpScore = scaleScore(fpPer1k, 0, 12)

  // 5. VOICE
  let structuralCount = 0
  for (const tell of STRUCTURAL_TELLS) {
    const regex = new RegExp(tell.regex.source, tell.regex.flags)
    structuralCount += (text.match(regex) ?? []).length
  }
  const directVoiceMatches = (
    text.match(
      /\b(?:yo|vos|tu|tus|te|acá|mirá|dejá|pasamos|armamos|cuesta|i|you|your|we|don't|it's)\b/gi
    ) ?? []
  ).length
  const voiceDensity = (directVoiceMatches * 100) / wordCount
  const voiceScore = clamp(
    scaleScore(voiceDensity, 7.0, 0.8) * 0.55 + clamp(100 - structuralCount * 24) * 0.45
  )

  const checks: Record<DetectionCheckKey, CheckMetric> = {
    BURSTINESS: { score: round1(burstScore), detail: burstDetail },
    SPECIFICITY: {
      score: round1(specScore),
      detail: `${concreteCount} anclas (${concretePer100.toFixed(1)} cada 100 palabras)`,
    },
    'SLOP DENSITY': {
      score: round1(slopScore),
      detail:
        slopHits > 0
          ? `${slopHits} muletilla(s) IA: ${slopFound.slice(0, 3).join(', ')}`
          : '0 frases prefabricadas detectadas',
    },
    FINGERPRINT: {
      score: round1(fpScore),
      detail: `${invisibleCount} invisibles · ${emDashes} rayas (—) · ${curlyQuotes} comillas curvas`,
    },
    VOICE: {
      score: round1(voiceScore),
      detail: `${structuralCount} cliché(s) estructural(es) · voz directa ${voiceDensity.toFixed(1)}%`,
    },
  }

  const keys: DetectionCheckKey[] = [
    'BURSTINESS',
    'SPECIFICITY',
    'SLOP DENSITY',
    'FINGERPRINT',
    'VOICE',
  ]
  const scores = keys.map((k) => checks[k].score)
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length
  const minScore = Math.min(...scores)
  const weakest = keys.reduce(
    (minKey, k) => (checks[k].score < checks[minKey].score ? k : minKey),
    keys[0]!
  )
  const humanScore = round1(clamp(mean * 0.6 + minScore * 0.4))
  const verdict: DetectionReport['verdict'] =
    humanScore >= 70 && minScore >= 55 ? 'PASS' : humanScore >= 50 ? 'REVIEW' : 'FLAGGED'

  return {
    humanScore,
    verdict,
    weakest,
    checks,
  }
}
