/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Subtítulo Hero con efecto de máquina de escribir a velocidad de lectura humana
 * - Cadencia calibrada a velocidad de lectura natural (~200-220 wpm / ~42ms por carácter)
 * - Pausas orgánicas en signos de puntuación (. y ,)
 * - Cápsulas holográficas cian y fucsia que se abren e iluminan al ser tipeadas
 * - 100% accesible y SEO friendly (sr-only con texto completo para indexadores)
 */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SparklesIcon } from 'lucide-react'

interface ConvergentTypewriterSubtitleProps {
  className?: string
}

export const ConvergentTypewriterSubtitle: React.FC<ConvergentTypewriterSubtitleProps> = ({
  className = '',
}) => {
  const { t } = useTranslation()
  const [charCount, setCharCount] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [hoverScan1, setHoverScan1] = useState(false)
  const [hoverScan2, setHoverScan2] = useState(false)

  const PART_1 =
    t('hero.sub_part_1') ||
    'Construimos software a medida, plataformas cloud y sistemas web para empresas que no pueden permitirse fallar. Seguridad máxima, privacidad blindada y código 100% tuyo: '
  const PHRASE_1 = t('hero.sub_phrase_1') || 'control total'
  const PART_2 = t('hero.sub_part_2') || ', '
  const PHRASE_2 = t('hero.sub_phrase_2') || 'cero dependencias'
  const PART_3 = t('hero.sub_part_3') || '.'

  const fullText = `${PART_1}${PHRASE_1}${PART_2}${PHRASE_2}${PART_3}`

  const L1 = PART_1.length
  const L2 = PHRASE_1.length
  const L3 = PART_2.length
  const L4 = PHRASE_2.length
  const L5 = PART_3.length
  const totalChars = L1 + L2 + L3 + L4 + L5

  const isMounted = useRef(true)

  const startTyping = useCallback(() => {
    setCharCount(0)
    setIsDone(false)
    let current = 0

    const typeStep = () => {
      if (!isMounted.current) return
      if (current >= totalChars) {
        setIsDone(true)
        return
      }

      current++
      setCharCount(current)

      const currentChar = fullText[current - 1]
      let delay = 42 // Velocidad de lectura de adolescente promedio (~210 palabras/minuto)
      if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        delay = 280 // Pausa natural para asimilar la frase
      } else if (currentChar === ',' || currentChar === ';') {
        delay = 150 // Micro-pausa de coma
      }

      setTimeout(typeStep, delay)
    }

    setTimeout(typeStep, 350)
  }, [totalChars, fullText])

  useEffect(() => {
    isMounted.current = true
    startTyping()
    return () => {
      isMounted.current = false
    }
  }, [startTyping])

  const triggerScan1 = () => {
    setHoverScan1(true)
    setTimeout(() => setHoverScan1(false), 700)
  }

  const triggerScan2 = () => {
    setHoverScan2(true)
    setTimeout(() => setHoverScan2(false), 700)
  }

  // Segmentos tipeados
  const p1Typed = PART_1.slice(0, Math.min(charCount, L1))
  const isPhrase1Started = charCount > L1
  const phrase1Typed = isPhrase1Started ? PHRASE_1.slice(0, Math.min(charCount - L1, L2)) : ''
  const isPart2Started = charCount > L1 + L2
  const p2Typed = isPart2Started ? PART_2.slice(0, Math.min(charCount - L1 - L2, L3)) : ''
  const isPhrase2Started = charCount > L1 + L2 + L3
  const phrase2Typed = isPhrase2Started
    ? PHRASE_2.slice(0, Math.min(charCount - L1 - L2 - L3, L4))
    : ''
  const isPart3Started = charCount > L1 + L2 + L3 + L4
  const p3Typed = isPart3Started ? PART_3.slice(0, Math.min(charCount - L1 - L2 - L3 - L4, L5)) : ''

  // Ubicación del cursor según la fase de tipeo
  const inP1 = charCount <= L1
  const inPhrase1 = charCount > L1 && charCount <= L1 + L2
  const inP2 = charCount > L1 + L2 && charCount <= L1 + L2 + L3
  const inPhrase2 = charCount > L1 + L2 + L3 && charCount <= L1 + L2 + L3 + L4
  const inP3 = charCount > L1 + L2 + L3 + L4 && charCount < totalChars

  return (
    <div className={`group/typewriter relative select-text ${className}`}>
      {/* Texto completo invisible para bots SEO (Google, Brave, Bing) y lectores de pantalla */}
      <span className="sr-only">{fullText}</span>

      {/* Párrafo interactivo con máquina de escribir */}
      <p
        aria-hidden="true"
        onClick={isDone ? startTyping : undefined}
        title={isDone ? 'Clic para reiniciar el efecto' : undefined}
        className={`text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal relative ${
          isDone ? 'cursor-pointer' : ''
        }`}
      >
        <span>{p1Typed}</span>
        {inP1 && (
          <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-500 dark:bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        )}

        {/* Cápsula 1: Sitios web de máxima conversión */}
        {isPhrase1Started && (
          <span
            onMouseEnter={triggerScan1}
            className="relative inline-block max-w-full px-2 sm:px-2.5 py-0.5 rounded-xl border border-cyan-400/80 bg-cyan-500/12 dark:bg-cyan-500/14 text-cyan-600 dark:text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all duration-300 align-baseline font-semibold mx-1 animate-in fade-in zoom-in-95"
          >
            {hoverScan1 && (
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl z-20">
                <span className="scanner-beam-line bg-white shadow-[0_0_12px_#22d3ee,0_0_24px_#06b6d4]" />
                <span className="scanner-beam-glow bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />
              </span>
            )}
            <span>{phrase1Typed}</span>
            {inPhrase1 && (
              <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_10px_#22d3ee]" />
            )}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 right-2 h-0.5 bg-linear-to-r from-cyan-400 via-sky-300 to-blue-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] opacity-90"
            />
          </span>
        )}

        {isPart2Started && <span>{p2Typed}</span>}
        {inP2 && (
          <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-500 dark:bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        )}

        {/* Cápsula 2: Sistemas cloud a medida */}
        {isPhrase2Started && (
          <span
            onMouseEnter={triggerScan2}
            className="relative inline-block max-w-full px-2 sm:px-2.5 py-0.5 rounded-xl border border-fuchsia-400/80 bg-fuchsia-500/12 dark:bg-fuchsia-500/14 text-fuchsia-600 dark:text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.25)] hover:shadow-[0_0_20px_rgba(217,70,239,0.45)] transition-all duration-300 align-baseline font-semibold mx-1 animate-in fade-in zoom-in-95"
          >
            {hoverScan2 && (
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl z-20">
                <span className="scanner-beam-line bg-white shadow-[0_0_12px_#f472b6,0_0_24px_#d946ef]" />
                <span className="scanner-beam-glow bg-linear-to-r from-transparent via-fuchsia-400/40 to-transparent" />
              </span>
            )}
            <span>{phrase2Typed}</span>
            {inPhrase2 && (
              <span className="inline-block w-0.5 h-4 bg-fuchsia-400 ml-0.5 align-middle animate-pulse shadow-[0_0_10px_#d946ef]" />
            )}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 right-2 h-0.5 bg-linear-to-r from-fuchsia-500 via-pink-300 to-violet-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)] opacity-90"
            />
          </span>
        )}

        {isPart3Started && <span>{p3Typed}</span>}
        {inP3 && (
          <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-500 dark:bg-cyan-400 ml-0.5 align-middle animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        )}
        {isDone && (
          <span className="inline-block w-0.5 h-4 sm:h-5 bg-cyan-400/60 ml-0.5 align-middle animate-pulse" />
        )}
      </p>

      {/* Indicador sutil de interacción */}
      <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-cyan-600/70 dark:text-cyan-400/70 select-none opacity-0 group-hover/typewriter:opacity-100 transition-opacity duration-300">
        <SparklesIcon className="w-3 h-3 text-cyan-500 animate-pulse" />
        <span>Interactúa con las cápsulas o haz clic para reiniciar el tipeo</span>
      </div>

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
