'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

interface CyberTypewriterProps {
  text: string
  startDelay?: number
  speed?: number
  className?: string
}

const CYBER_GLYPHS = ['0', '1', '✦', 'X', '>', '#', '%', '&', '*', '_', '~']

export const CyberTypewriter: React.FC<CyberTypewriterProps> = ({
  text,
  startDelay = 2500,
  speed = 36,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('')
  const [glitchChar, setGlitchChar] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const isMounted = useRef(true)

  const startTyping = useCallback(() => {
    setDisplayText('')
    setGlitchChar('')
    setIsDone(false)
    setHasStarted(false)

    const timer = setTimeout(() => {
      if (!isMounted.current) return
      setHasStarted(true)
      let index = 0

      const interval = setInterval(() => {
        if (!isMounted.current) {
          clearInterval(interval)
          return
        }

        if (index < text.length) {
          const randomGlyph = CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)]
          setGlitchChar(randomGlyph)
          setDisplayText(text.slice(0, index + 1))
          index++
        } else {
          setGlitchChar('')
          setIsDone(true)
          clearInterval(interval)
        }
      }, speed)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, startDelay, speed])

  useEffect(() => {
    isMounted.current = true
    const cleanup = startTyping()
    return () => {
      isMounted.current = false
      if (cleanup) cleanup()
    }
  }, [startTyping])

  return (
    <span
      role="button"
      tabIndex={0}
      className={`inline-flex items-center flex-wrap justify-center gap-0.5 cursor-pointer select-none group/tw ${className}`}
      onClick={startTyping}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          startTyping()
        }
      }}
      title="Clic para reiniciar la animación"
    >
      <span className="relative">
        {displayText}
        {isDone && (
          <motion.span
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: [0, 0.8, 0], x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"
          />
        )}
      </span>

      {/* Carácter Glitch Decode interactivo mientras tipea */}
      {!isDone && hasStarted && (
        <span className="text-cyan-400 font-mono text-xs font-black drop-shadow-[0_0_8px_#22d3ee] animate-pulse">
          {glitchChar}
        </span>
      )}

      {/* Cursor Neón Parpadeante */}
      <motion.span
        animate={{ opacity: isDone ? [1, 0, 1] : [1, 0.15, 1] }}
        transition={{
          duration: isDone ? 1.1 : 0.35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="inline-block w-1.5 h-3.5 sm:h-4 bg-cyan-400 dark:bg-cyan-300 rounded-[2px] shadow-[0_0_8px_#06b6d4] ml-0.5 align-middle shrink-0"
      />
    </span>
  )
}

export default CyberTypewriter
