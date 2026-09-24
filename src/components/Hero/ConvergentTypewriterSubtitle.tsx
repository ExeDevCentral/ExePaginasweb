/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Subtítulo Hero con efecto Máquina de Escribir Fluida + Escáner Láser Holográfico
 * - Escritura natural y fluida de izquierda a derecha (100% legible y comprensible)
 * - CERO saltos de línea: el párrafo pre-reserva su layout exacto con opacity (cero layout shift)
 * - Al completar "sitios web de máxima conversión": barrido láser cian + cápsula neón activa
 * - Al completar "sistemas cloud a medida": barrido láser fucsia + cápsula neón activa
 * - Cursor flotante de ancho cero (w-0) que jamás empuja texto a otra línea
 * - Re-escaneo interactivo al pasar el mouse y botón discreto para repetir
 * - 100% SEO y accesibilidad (sr-only + aria-hidden)
 */
'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcwIcon, SparklesIcon } from 'lucide-react'

interface ConvergentTypewriterSubtitleProps {
  className?: string
  startDelay?: number
  charSpeed?: number
}

export const ConvergentTypewriterSubtitle: React.FC<ConvergentTypewriterSubtitleProps> = ({
  className = '',
  startDelay = 350,
  charSpeed = 16,
}) => {
  const { t, i18n } = useTranslation()

  const PART_1 =
    t('hero.sub_part_1') ||
    'Tu solución integral para dejar de improvisar con plantillas lentas y comisiones cautivas. Diseñamos '
  const PHRASE_1 = t('hero.sub_phrase_1') || 'sitios web de máxima conversión'
  const PART_2 = t('hero.sub_part_2') || ' y '
  const PHRASE_2 = t('hero.sub_phrase_2') || 'sistemas cloud a medida'
  const PART_3 = t('hero.sub_part_3') || ' con 100% código propio para multiplicar tus ventas.'

  const FULL_TEXT = `${PART_1}${PHRASE_1}${PART_2}${PHRASE_2}${PART_3}`

  const P1_START = PART_1.length
  const P1_END = P1_START + PHRASE_1.length
  const P2_START = P1_END + PART_2.length
  const P2_END = P2_START + PHRASE_2.length
  const TOTAL_CHARS = FULL_TEXT.length

  const containerRef = useRef<HTMLParagraphElement>(null)
  const [charIndex, setCharIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [scan1, setScan1] = useState(false)
  const [scan2, setScan2] = useState(false)
  const [hoverScan1, setHoverScan1] = useState(false)
  const [hoverScan2, setHoverScan2] = useState(false)
  const [showReplayHint, setShowReplayHint] = useState(false)

  // Descomponer en arreglos de caracteres estables
  const part1Chars = useMemo(() => Array.from(PART_1), [PART_1])
  const phrase1Chars = useMemo(() => Array.from(PHRASE_1), [PHRASE_1])
  const part2Chars = useMemo(() => Array.from(PART_2), [PART_2])
  const phrase2Chars = useMemo(() => Array.from(PHRASE_2), [PHRASE_2])
  const part3Chars = useMemo(() => Array.from(PART_3), [PART_3])

  // Iniciar o reiniciar la animación
  const startAnimation = useCallback(() => {
    setCharIndex(0)
    setStarted(false)
    setIsComplete(false)
    setScan1(false)
    setScan2(false)
    setHoverScan1(false)
    setHoverScan2(false)

    const timer = setTimeout(() => {
      setStarted(true)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [startDelay])

  useEffect(() => {
    return startAnimation()
  }, [startAnimation, i18n.language])

  // Loop de escritura natural de izquierda a derecha
  useEffect(() => {
    if (!started || isComplete) return

    const interval = setInterval(() => {
      setCharIndex((prev) => {
        const next = prev + 1

        // Al terminar frase 1: activar escáner cian
        if (next === P1_END) {
          setScan1(true)
        }

        // Al terminar frase 2: activar escáner fucsia
        if (next === P2_END) {
          setScan2(true)
        }

        // Al completar todo el párrafo
        if (next >= TOTAL_CHARS) {
          setIsComplete(true)
          setScan1(true)
          setScan2(true)
          clearInterval(interval)
          return TOTAL_CHARS
        }

        return next
      })
    }, charSpeed)

    return () => clearInterval(interval)
  }, [started, isComplete, charSpeed, P1_END, P2_END, TOTAL_CHARS])

  const isP1Scanned = isComplete || scan1
  const isP2Scanned = isComplete || scan2
  const isP1Scanning = hoverScan1 || (scan1 && !isComplete)
  const isP2Scanning = hoverScan2 || (scan2 && !isComplete)

  return (
    <div
      className={`group/typewriter relative ${className}`}
      onMouseEnter={() => isComplete && setShowReplayHint(true)}
      onMouseLeave={() => setShowReplayHint(false)}
    >
      {/* 1. TEXTO ACCESIBLE PARA LECTORES Y SEO BOT (100% INDEXABLE) */}
      <span className="sr-only">{FULL_TEXT}</span>

      {/* 2. PÁRRAFO VISUAL CON ESTRUCTURA IDÉNTICA DESDE FRAME 0 (CERO SALTOS DE LÍNEA) */}
      <p
        ref={containerRef}
        aria-hidden="true"
        className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal select-text relative"
      >
        {/* Cursor inicial parpadeando antes de arrancar */}
        {!isComplete && started && charIndex === 0 && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
          >
            <span className="block w-[2px] h-5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
          </span>
        )}

        {/* ========================================================
            PARTE 1: "Tu solución integral para... Diseñamos "
           ======================================================== */}
        {part1Chars.map((char, i) => {
          const isVisible = isComplete || i < charIndex
          const isCursor = !isComplete && started && i === charIndex - 1

          return (
            <span key={'p1c-' + i} className="relative inline">
              <span
                className={`transition-opacity duration-75 ${
                  isVisible ? 'opacity-100' : 'opacity-0 select-none'
                }`}
              >
                {char}
              </span>
              {isCursor && (
                <span
                  aria-hidden="true"
                  className="absolute left-full top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
                >
                  <span className="block w-[2px] h-5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                </span>
              )}
            </span>
          )
        })}

        {/* ========================================================
            FRASE 1: "sitios web de máxima conversión" (Cápsula Cian)
           ======================================================== */}
        <span
          onMouseEnter={() => isComplete && setHoverScan1(true)}
          onMouseLeave={() => setHoverScan1(false)}
          className={`relative inline-block px-2.5 py-0.5 rounded-xl transition-all duration-500 cursor-default align-baseline ${
            isP1Scanned
              ? 'border border-cyan-400/80 dark:border-cyan-400/80 bg-cyan-500/[0.12] dark:bg-cyan-500/[0.14] shadow-[0_0_20px_rgba(6,182,212,0.30)]'
              : 'border border-transparent bg-transparent'
          }`}
        >
          {/* Haz láser holográfico cian */}
          {isP1Scanning && (
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl z-20">
              <span className="scanner-beam-line bg-white shadow-[0_0_12px_#22d3ee,0_0_24px_#06b6d4]" />
              <span className="scanner-beam-glow bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />
            </span>
          )}

          <span
            className={`transition-colors duration-300 ${
              isP1Scanned
                ? 'font-bold text-cyan-600 dark:text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'font-semibold text-slate-900 dark:text-white'
            }`}
          >
            {phrase1Chars.map((char, i) => {
              const globalIdx = P1_START + i
              const isVisible = isComplete || globalIdx < charIndex
              const isCursor = !isComplete && started && globalIdx === charIndex - 1

              return (
                <span key={'p1-char-' + i} className="relative inline">
                  <span
                    className={`transition-opacity duration-75 ${
                      isVisible ? 'opacity-100' : 'opacity-0 select-none'
                    }`}
                  >
                    {char}
                  </span>
                  {isCursor && (
                    <span
                      aria-hidden="true"
                      className="absolute left-full top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
                    >
                      <span className="block w-[2px] h-5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                    </span>
                  )}
                </span>
              )
            })}
          </span>

          {/* Underline neón cian tras escaneo */}
          {isP1Scanned && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 right-2 h-[2px] bg-linear-to-r from-cyan-500 via-sky-300 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.9)] opacity-95 transition-all duration-500"
            />
          )}
        </span>

        {/* ========================================================
            PARTE 2: " y "
           ======================================================== */}
        {part2Chars.map((char, i) => {
          const globalIdx = P1_END + i
          const isVisible = isComplete || globalIdx < charIndex
          const isCursor = !isComplete && started && globalIdx === charIndex - 1

          return (
            <span key={'p2c-' + i} className="relative inline">
              <span
                className={`transition-opacity duration-75 ${
                  isVisible ? 'opacity-100' : 'opacity-0 select-none'
                }`}
              >
                {char}
              </span>
              {isCursor && (
                <span
                  aria-hidden="true"
                  className="absolute left-full top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
                >
                  <span className="block w-[2px] h-5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                </span>
              )}
            </span>
          )
        })}

        {/* ========================================================
            FRASE 2: "sistemas cloud a medida" (Cápsula Fucsia)
           ======================================================== */}
        <span
          onMouseEnter={() => isComplete && setHoverScan2(true)}
          onMouseLeave={() => setHoverScan2(false)}
          className={`relative inline-block px-2.5 py-0.5 rounded-xl transition-all duration-500 cursor-default align-baseline ${
            isP2Scanned
              ? 'border border-fuchsia-400/80 dark:border-fuchsia-400/80 bg-fuchsia-500/[0.12] dark:bg-fuchsia-500/[0.14] shadow-[0_0_20px_rgba(217,70,239,0.30)]'
              : 'border border-transparent bg-transparent'
          }`}
        >
          {/* Haz láser holográfico fucsia */}
          {isP2Scanning && (
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl z-20">
              <span className="scanner-beam-line bg-white shadow-[0_0_12px_#f472b6,0_0_24px_#d946ef]" />
              <span className="scanner-beam-glow bg-linear-to-r from-transparent via-fuchsia-400/40 to-transparent" />
            </span>
          )}

          <span
            className={`transition-colors duration-300 ${
              isP2Scanned
                ? 'font-bold text-fuchsia-600 dark:text-fuchsia-300 drop-shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                : 'font-semibold text-slate-900 dark:text-white'
            }`}
          >
            {phrase2Chars.map((char, i) => {
              const globalIdx = P2_START + i
              const isVisible = isComplete || globalIdx < charIndex
              const isCursor = !isComplete && started && globalIdx === charIndex - 1

              return (
                <span key={'p2-char-' + i} className="relative inline">
                  <span
                    className={`transition-opacity duration-75 ${
                      isVisible ? 'opacity-100' : 'opacity-0 select-none'
                    }`}
                  >
                    {char}
                  </span>
                  {isCursor && (
                    <span
                      aria-hidden="true"
                      className="absolute left-full top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
                    >
                      <span className="block w-[2px] h-5 bg-fuchsia-400 shadow-[0_0_8px_#d946ef] animate-pulse" />
                    </span>
                  )}
                </span>
              )
            })}
          </span>

          {/* Underline neón fucsia tras escaneo */}
          {isP2Scanned && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 right-2 h-[2px] bg-linear-to-r from-fuchsia-500 via-pink-300 to-violet-500 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.9)] opacity-95 transition-all duration-500"
            />
          )}
        </span>

        {/* ========================================================
            PARTE 3: " con 100% código propio para multiplicar tus ventas."
           ======================================================== */}
        {part3Chars.map((char, i) => {
          const globalIdx = P2_END + i
          const isVisible = isComplete || globalIdx < charIndex
          const isCursor = !isComplete && started && globalIdx === charIndex - 1

          return (
            <span key={'p3c-' + i} className="relative inline">
              <span
                className={`transition-opacity duration-75 ${
                  isVisible ? 'opacity-100' : 'opacity-0 select-none'
                }`}
              >
                {char}
              </span>
              {isCursor && (
                <span
                  aria-hidden="true"
                  className="absolute left-full top-[12%] bottom-[12%] w-0 overflow-visible pointer-events-none z-30 select-none"
                >
                  <span className="block w-[2px] h-5 bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                </span>
              )}
            </span>
          )
        })}

        {/* Cursor en reposo al finalizar */}
        {isComplete && (
          <span
            aria-hidden="true"
            className="inline-block w-0 overflow-visible relative pointer-events-none select-none align-middle ml-1"
          >
            <span className="block w-[2px] h-4 bg-cyan-400/70 shadow-[0_0_6px_#06b6d4] animate-[pulse_2s_ease-in-out_infinite]" />
          </span>
        )}
      </p>

      {/* 3. BOTÓN DISCRETO PARA REPETIR LA ANIMACIÓN */}
      {isComplete && (
        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={startAnimation}
            title="Revivir animación y escáner láser"
            aria-label="Repetir animación de texto"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 opacity-0 group-hover/typewriter:opacity-100 cursor-pointer ${
              showReplayHint ? 'translate-y-0' : 'translate-y-1'
            }`}
          >
            <RotateCcwIcon className="w-3 h-3 transition-transform group-hover/typewriter:rotate-180 duration-500" />
            <span>{t('hero.sub_replay') || 'Repetir animación & escáner'}</span>
          </button>

          {isP1Scanned && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-600/80 dark:text-cyan-400/80 opacity-0 group-hover/typewriter:opacity-100 transition-opacity duration-300">
              <SparklesIcon className="w-3 h-3" />
              <span>
                {t('hero.sub_hover_hint') || 'Pasa el mouse sobre las cápsulas para re-escanear'}
              </span>
            </span>
          )}
        </div>
      )}

      {/* ESTILOS CSS DEL HAZ DE LUZ ESCÁNER LÁSER */}
      <style jsx>{`
        @keyframes scannerLaser {
          0% {
            left: -10%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: 108%;
            opacity: 0;
          }
        }
        .scanner-beam-line {
          position: absolute;
          top: -2px;
          bottom: -2px;
          width: 2.5px;
          animation: scannerLaser 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scanner-beam-glow {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 48px;
          transform: translateX(-24px);
          animation: scannerLaser 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}

export default ConvergentTypewriterSubtitle
