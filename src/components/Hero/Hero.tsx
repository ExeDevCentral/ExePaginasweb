import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import HeroCompare from './HeroCompare'
import MagneticButton from '../shared/MagneticButton'

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 dark:bg-accent-cyan/5 backdrop-blur-md mb-8 group/badge shadow-sm"
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

const TitleLine: React.FC<{
  text: string
  delay: number
  duration?: number
  index: number
}> = ({ text, delay, duration = 1.2, index }) => {
  const fromLeft = index % 2 === 0
  const isPunchline = index > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -100 : 100, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className="relative block will-change-transform my-1"
    >
      {/* Ambient glowing aura behind the punchline */}
      {isPunchline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }}
          className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-fuchsia-500/25 blur-2xl pointer-events-none -z-10"
        />
      )}

      <span
        className={`relative inline-block ${
          isPunchline
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-accent-cyan to-indigo-600 dark:from-cyan-300 dark:via-sky-200 dark:to-fuchsia-400 font-black drop-shadow-[0_2px_20px_rgba(14,165,233,0.35)]'
            : 'text-slate-800 dark:text-slate-100 font-extrabold tracking-tight drop-shadow-sm'
        }`}
      >
        {text}

        {/* Shimmer light sweep across the punchline */}
        {isPunchline && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/30 to-transparent bg-clip-text text-transparent"
            style={{ transform: 'translateX(-100%) skewX(-20deg)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: 'easeInOut',
              delay: delay + 1.2,
            }}
          >
            {text}
          </motion.span>
        )}
      </span>
    </motion.div>
  )
}

const Hero: React.FC = () => {
  const { t } = useTranslation()

  const rawTitle = t('hero.titulo_1')
  // Support both latin full-stops and eastern full-stops
  const titleParts = rawTitle.includes('。')
    ? rawTitle.split('。').filter(Boolean)
    : rawTitle.split('. ').filter(Boolean)

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/15 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/15 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full">
        <Badge text={t('hero.badge')} />

        <motion.h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.25rem] font-montserrat font-black tracking-tight leading-[1.12] md:leading-[1.08] mb-6 max-w-5xl overflow-visible">
          {titleParts.map((part, i) => {
            const hasPunctuation =
              part.endsWith('.') || part.endsWith('。') || i === titleParts.length - 1
            const lineText = `${part}${!hasPunctuation ? '.' : ''}`
            return (
              <TitleLine
                key={`hero-title-line-${part.substring(0, 15)}`}
                index={i}
                text={lineText}
                delay={i === 0 ? 0.2 : 0.9}
                duration={1.1}
              />
            )
          })}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.7 }}
          className="inline-flex flex-col items-center gap-1.5 px-7 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl mb-6 max-w-2xl shadow-xl hover:border-accent-cyan/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-cyan shrink-0" />
            <p className="text-sm md:text-base text-slate-800 dark:text-slate-200 font-bold">
              {t('hero.titulo_2')}
            </p>
          </div>
          <p className="text-xl md:text-2xl font-black text-gradient-spectacular">
            {t('hero.sub_respuesta')}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.9 }}
          className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-7 font-semibold"
        >
          {t('hero.descripcion')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 2.1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto px-4 mb-6"
        >
          <SalonBloomButton
            href="#demo"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('demo')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          />
          <MagneticButton href="#contact">
            <span className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold bg-white dark:bg-slate-900/90 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs sm:text-sm tracking-wider uppercase block shadow-md hover:shadow-lg">
              {t('hero.cta_proyecto')}
            </span>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="w-full"
        >
          <HeroCompare />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
