import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import { useIsMobile } from '../../hooks/useIsMobile'
import HeroCompare from './HeroCompare'
import { HERO_TYPEWRITER_LINES } from './constants'

function useSequentialTypewriter(lines: string[], charSpeed = 30, linePause = 600) {
  const [visibleLines, setVisibleLines] = useState<string[]>(() => lines.map(() => ''))
  const [activeLine, setActiveLine] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setVisibleLines(lines.map(() => ''))
    setActiveLine(0)
    setDone(false)

    const ref = { destroyed: false, lineIdx: 0, charIdx: 0 }

    const tick = () => {
      if (ref.destroyed) return
      if (ref.lineIdx >= lines.length) {
        setDone(true)
        return
      }

      const ci = ref.charIdx
      const li = ref.lineIdx

      setVisibleLines((prev) => {
        const next = [...prev]
        next[li] = lines[li].slice(0, ci + 1)
        return next
      })
      ref.charIdx++

      if (ref.charIdx >= lines[li].length) {
        ref.lineIdx++
        ref.charIdx = 0
        setActiveLine(ref.lineIdx)
        if (ref.lineIdx >= lines.length) {
          setDone(true)
          return
        }
        setTimeout(tick, linePause)
        return
      }
      setTimeout(tick, charSpeed)
    }

    const startDelay = setTimeout(tick, 200)
    return () => {
      ref.destroyed = true
      clearTimeout(startDelay)
    }
  }, [lines, charSpeed, linePause])

  return { visibleLines, activeLine, done }
}

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 backdrop-blur-md mb-8 group/badge"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
    </span>
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan group-hover/badge:text-foreground transition-colors">
      {text}
    </span>
  </motion.div>
)

const TitleLine: React.FC<{ text: string; delay: number; dir: 'left' | 'right' }> = ({
  text,
  delay,
  dir,
}) => (
  <motion.span
    initial={{ opacity: 0, x: dir === 'left' ? -80 : 80, filter: 'blur(8px)' }}
    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    className="block"
  >
    {text}
  </motion.span>
)

const Hero: React.FC = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { visibleLines, activeLine, done } = useSequentialTypewriter(HERO_TYPEWRITER_LINES, 28, 500)

  const [showTerminal, setShowTerminal] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowTerminal(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  const particles = useMemo(
    () =>
      Array.from({ length: isMobile ? 8 : 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 5 + 3,
        color: i % 2 === 0 ? 'bg-accent-cyan' : 'bg-accent-magenta',
        xMove: Math.random() * 30 - 15,
      })),
    [isMobile]
  )

  const titleParts = t('hero.titulo_1').split('. ')

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/10 blur-[100px] pointer-events-none z-0" />

      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute w-1.5 h-1.5 ${particle.color} rounded-full blur-[1px]`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                willChange: 'transform, opacity',
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, particle.xMove, 0],
                scale: [particle.scale, particle.scale * 1.5, particle.scale],
                opacity: [0.1, 0.8, 0.1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full">
        <Badge text={t('hero.badge')} />

        <motion.h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-black text-foreground tracking-tight leading-[1.1] md:leading-[1.05] mb-4 max-w-4xl">
          {titleParts.map((part, i) => (
            <TitleLine
              key={i}
              text={`${part}${i < titleParts.length - 1 ? '.' : ''}`}
              delay={1.5 + i * 0.35}
              dir={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 2.6 }}
          className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-muted/60 border border-border backdrop-blur-md mb-6 max-w-2xl"
        >
          <p className="text-base md:text-lg text-primary-secondary font-medium">
            {t('hero.titulo_2')}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gradient-spectacular">
            {t('hero.sub_respuesta')}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 3.0 }}
          className="text-base sm:text-lg md:text-xl text-primary-secondary leading-relaxed max-w-3xl mx-auto mb-6 font-medium"
        >
          {t('hero.descripcion')}
        </motion.p>

        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg mx-auto mb-8"
          >
            <div className="rounded-xl border border-accent-cyan/15 bg-black/40 backdrop-blur-xl p-4 md:p-5 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-[10px] text-muted-foreground/40 font-mono tracking-wider uppercase">
                  terminal — dueño
                </span>
              </div>
              <div className="font-mono text-xs md:text-sm leading-relaxed space-y-1 text-left min-h-[80px]">
                {visibleLines.map((line, i) => {
                  if (!line) return null
                  const isCurrentLine = i === activeLine
                  const isPastLine = i < activeLine
                  const isPrompt = i === 0
                  return (
                    <div
                      key={i}
                      className={`${isPastLine || isCurrentLine ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    >
                      {isPrompt ? (
                        <span>
                          <span className="text-emerald-400">$</span>{' '}
                          <span className="text-foreground/90">{line.slice(2)}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span className="text-accent-cyan/60 shrink-0">▸</span>
                          <span className="text-foreground/80">{line}</span>
                          {isCurrentLine && !done && (
                            <span className="inline-block w-1.5 h-3.5 bg-accent-cyan/80 animate-pulse shrink-0" />
                          )}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 4.0 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto px-4"
        >
          <SalonBloomButton
            href="#demo"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('demo')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          />
          <motion.a
            href="#contact"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl border border-border text-foreground font-semibold bg-background/40 backdrop-blur-md hover:bg-muted hover:border-accent-cyan/40 transition-all text-sm tracking-wide"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.cta_proyecto')}
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 4.2 }}
          className="w-full"
        >
          <HeroCompare />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
