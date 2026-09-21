/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

/**
 * MatrixText — Reusable matrix scramble text effects
 *
 * Components:
 *   <MatrixScramble text="Hola" />          — cycles through random chars on mount + hover
 *   <MatrixWordmark parts={[...]} />        — per-segment color control (for logo wordmarks)
 *
 * Palettes:
 *   MATRIX_PALETTE  — green matrix + cyan (footer/domain style)
 *   WORDMARK_COLORS — white/yellow/cyan (header wordmark style)
 *
 * Usage examples:
 *
 *   // Footer domain signature
 *   <MatrixScramble text="Exepaginasweb.com" palette="matrix" cascade />
 *
 *   // Header wordmark with per-segment colors
 *   <MatrixWordmark
 *     parts={[
 *       { text: 'EXE',        color: '#ffffff' },
 *       { text: '//',         color: '#facc15' },
 *       { text: 'PAGINASWEB', color: '#ffffff' },
 *       { text: '.COM',       color: '#22d3ee' },
 *     ]}
 *   />
 *
 *   // Any custom text, instant (no cascade delay)
 *   <MatrixScramble text="LOADING..." palette="cyber" cascade={false} />
 */

import { useEffect, useRef, useState } from 'react'

// ── Char sets ─────────────────────────────────────────────────────────────────

/** Full matrix set — latin digits + katakana */
export const MATRIX_CHARS_FULL = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ'

/** Compact set — digits + symbols (faster scramble, less exotic) */
export const MATRIX_CHARS_SHORT = '01アイウエオ#$%&?'

// ── Color palettes ────────────────────────────────────────────────────────────

/** Green matrix + cyan/teal — for domains, signatures, decorative text.
 *  Valores via CSS var para adaptarse al tema (neón en dark, verde profundo en light). */
export const MATRIX_PALETTE = [
  'var(--matrix-pal-0)', // matrix green bright
  'var(--matrix-pal-1)', // matrix green mid
  'var(--matrix-pal-2)', // matrix green dark
  'var(--matrix-pal-3)', // accent-cyan
  'var(--matrix-pal-4)', // sky-300
  'var(--matrix-pal-5)', // cyan-green blend
] as const

/** Multi-color scramble set — for wordmarks and interactive headings */
export const WORDMARK_COLORS = ['#00ff41', '#00e5a0', '#22d3ee', '#facc15'] as const

// ── Types ─────────────────────────────────────────────────────────────────────

export type MatrixPalette = 'matrix' | 'wordmark' | string[]

export interface WordmarkPart {
  text: string
  color: string
}

// ── Internal: single letter ───────────────────────────────────────────────────

interface LetterProps {
  char: string
  restColor: string
  index: number
  /** Delay multiplier per letter for the cascade effect (ms). 0 = no cascade */
  cascadeMs?: number
  /** Interval between scramble frames (ms) */
  frameMs?: number
  /** Total scramble frames before resolving */
  frames?: number
  /** Palette used during scramble animation */
  scramblePalette?: readonly string[]
  /** Glow style: 'soft' (default) or 'strong' */
  glow?: 'soft' | 'strong'
  className?: string
}

function MatrixLetter({
  char,
  restColor,
  index,
  cascadeMs = 70,
  frameMs = 44,
  frames,
  scramblePalette = MATRIX_PALETTE,
  glow = 'soft',
  className = '',
}: LetterProps) {
  const [display, setDisplay] = useState(char)
  const [color, setColor] = useState(restColor)
  const [glowing, setGlowing] = useState(false)
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tvRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scramblingRef = useRef(false)
  const restColorRef = useRef(restColor)
  const chars = MATRIX_CHARS_FULL

  restColorRef.current = restColor

  const scramble = () => {
    if (ivRef.current) return
    scramblingRef.current = true
    setGlowing(true)
    let tick = 0
    const total = frames ?? 7 + Math.floor(Math.random() * 6)
    ivRef.current = setInterval(() => {
      setDisplay(chars[Math.floor(Math.random() * chars.length)] ?? char)
      setColor(scramblePalette[Math.floor(Math.random() * scramblePalette.length)] ?? restColor)
      tick++
      if (tick >= total) {
        clearInterval(ivRef.current!)
        ivRef.current = null
        scramblingRef.current = false
        setDisplay(char)
        setColor(restColorRef.current)
        setGlowing(false)
      }
    }, frameMs)
  }

  useEffect(() => {
    const delay = cascadeMs > 0 ? index * cascadeMs + Math.random() * 100 : 0
    tvRef.current = setTimeout(scramble, delay)
    return () => {
      clearTimeout(tvRef.current!)
      clearInterval(ivRef.current!)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync resting color when it changes (e.g. theme toggle) unless scrambling
  useEffect(() => {
    if (!scramblingRef.current) {
      setColor(restColor)
      setDisplay(char)
    }
  }, [restColor, char])

  const glowMix = (pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`

  const shadow =
    glow === 'strong' && glowing
      ? `0 0 8px ${glowMix(60)}, 0 0 14px ${glowMix(20)}`
      : glowing
        ? `0 0 6px ${glowMix(47)}`
        : `0 0 4px ${glowMix(20)}`

  return (
    <span
      onMouseEnter={(e) => {
        e.stopPropagation()
        scramble()
      }}
      style={{
        color,
        textShadow: shadow,
        display: 'inline-block',
        width: '0.62em', // fixed width — no layout shift with wider katakana
        textAlign: 'center',
        overflow: 'hidden',
        transition: 'text-shadow 0.15s, color 0.06s',
      }}
      className={`font-mono cursor-default select-none ${className}`}
    >
      {display}
    </span>
  )
}

// ── Public: MatrixScramble ────────────────────────────────────────────────────

export interface MatrixScrambleProps {
  /** The text to display and scramble */
  text: string
  /**
   * Color palette used during scramble frames.
   * 'matrix' = green/cyan palette, 'wordmark' = multi-color, or pass a string[] directly.
   */
  palette?: MatrixPalette
  /**
   * Resting color of all letters (after scramble resolves).
   * Defaults to inheriting via 'currentColor'.
   */
  restColor?: string
  /** Stagger delay between letters on mount (ms). Set 0 to disable cascade. Default: 75 */
  cascadeMs?: number
  /** Whether to run the cascade animation on mount. Default: true */
  cascade?: boolean
  /** Additional className for the wrapper span */
  className?: string
  /** Additional className applied to each letter span */
  letterClassName?: string
  /** Glow intensity: 'soft' | 'strong'. Default: 'soft' */
  glow?: 'soft' | 'strong'
}

/**
 * Renders text with a matrix scramble effect.
 * Each letter scrambles independently on mount (cascade) and on hover.
 *
 * @example
 * <MatrixScramble text="Exepaginasweb.com" palette="matrix" cascade />
 */
export function MatrixScramble({
  text,
  palette = 'matrix',
  restColor = 'currentColor',
  cascadeMs = 75,
  cascade = true,
  className = '',
  letterClassName = '',
  glow = 'soft',
}: MatrixScrambleProps) {
  const scramblePalette =
    palette === 'matrix'
      ? MATRIX_PALETTE
      : palette === 'wordmark'
        ? WORDMARK_COLORS
        : (palette as string[])

  return (
    <span className={`inline-flex ${className}`}>
      {text.split('').map((char, i) => (
        <MatrixLetter
          key={i}
          char={char}
          restColor={restColor}
          index={i}
          cascadeMs={cascade ? cascadeMs : 0}
          scramblePalette={scramblePalette}
          glow={glow}
          className={letterClassName}
        />
      ))}
    </span>
  )
}

// ── Public: MatrixWordmark ────────────────────────────────────────────────────

export interface MatrixWordmarkProps {
  /**
   * Array of text segments, each with its own resting color.
   * Letters within each segment scramble to WORDMARK_COLORS during animation,
   * then resolve back to the segment's color.
   */
  parts: WordmarkPart[]
  /** Stagger delay between letters (ms). Default: 65 */
  cascadeMs?: number
  /** Additional className for the wrapper span */
  className?: string
  /** Additional className for each letter span */
  letterClassName?: string
  /** Glow intensity: 'soft' | 'strong'. Default: 'strong' */
  glow?: 'soft' | 'strong'
}

/**
 * Renders a multi-color wordmark with per-segment colors and matrix scramble.
 * Ideal for logo text like EXE//PAGINASWEB.COM where each part has a different color.
 *
 * @example
 * <MatrixWordmark
 *   parts={[
 *     { text: 'EXE',        color: '#ffffff' },
 *     { text: '//',         color: '#facc15' },
 *     { text: 'PAGINASWEB', color: '#ffffff' },
 *     { text: '.COM',       color: '#22d3ee' },
 *   ]}
 * />
 */
export function MatrixWordmark({
  parts,
  cascadeMs = 65,
  className = '',
  letterClassName = '',
  glow = 'strong',
}: MatrixWordmarkProps) {
  // Flatten all parts into indexed letters, preserving per-segment color
  const letters: { char: string; color: string }[] = parts.flatMap(({ text, color }) =>
    text.split('').map((char) => ({ char, color }))
  )

  return (
    <span className={`inline-flex ${className}`}>
      {letters.map(({ char, color }, i) => (
        <MatrixLetter
          key={i}
          char={char}
          restColor={color}
          index={i}
          cascadeMs={cascadeMs}
          scramblePalette={WORDMARK_COLORS}
          glow={glow}
          className={letterClassName}
        />
      ))}
    </span>
  )
}
