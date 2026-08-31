import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import HeroCompare from './HeroCompare'
import MagneticButton from '../shared/MagneticButton'
import CyberTypewriter from './CyberTypewriter'
import { trackEvent } from '@/core/analytics/trackEvent'

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    initial={{ opacity: 0.85, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-950/40 backdrop-blur-md mb-8 group/badge shadow-sm"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
    </span>
    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 group-hover/badge:text-slate-900 dark:group-hover/badge:text-white transition-colors">
      {text}
    </span>
  </motion.div>
)

const TitleLine: React.FC<{
  text: string
  delay: number
  duration?: number
  index: number
}> = ({ text, delay, duration = 0.75, index }) => {
  const isPunchline = index > 0
  const initialX = isPunchline ? 60 : -60

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX, filter: 'blur(8px)', scale: isPunchline ? 0.96 : 1 }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className="relative block will-change-transform my-1.5"
    >
      {/* Sutil halo ambiental brillante detrás de la frase principal */}
      {isPunchline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0, 0.65, 0.45], scale: [0.92, 1.05, 1] }}
          transition={{ duration: 0.9, delay: delay + 0.05, ease: 'easeOut' }}
          className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-fuchsia-500/25 blur-3xl pointer-events-none -z-10 transform-gpu"
        />
      )}

      <span
        className={`relative inline-block ${
          isPunchline
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-300 to-indigo-400 dark:from-sky-400 dark:via-cyan-300 dark:to-fuchsia-400 font-black drop-shadow-[0_2px_25px_rgba(14,165,233,0.35)]'
            : 'text-slate-900 dark:text-white font-extrabold tracking-tight drop-shadow-sm'
        }`}
      >
        {text}

        {/* Shimmer light sweep across the punchline text */}
        {isPunchline && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 dark:via-white/50 to-transparent bg-clip-text text-transparent"
            style={{ transform: 'translateX(-100%) skewX(-20deg)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: 'easeInOut',
              delay: delay + 0.2,
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
      className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center pt-20 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/15 blur-[60px] sm:blur-[100px] md:blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-fuchsia-500/5 dark:bg-fuchsia-500/15 blur-[60px] sm:blur-[100px] md:blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center px-3 sm:px-4 text-center max-w-5xl mx-auto w-full">
        <Badge text={t('hero.badge')} />

        <h1 className="text-[1.65rem] xs:text-3xl sm:text-5xl md:text-7xl lg:text-[5.25rem] font-montserrat font-black tracking-tight leading-[1.2] sm:leading-[1.12] md:leading-[1.08] mb-5 sm:mb-6 max-w-5xl overflow-visible">
          {titleParts.map((part, i) => {
            const hasPunctuation =
              part.endsWith('.') || part.endsWith('。') || i === titleParts.length - 1
            const lineText = `${part}${!hasPunctuation ? '.' : ''}`
            const lineDelay = i === 0 ? 0.08 : 0.48
            return (
              <TitleLine
                key={`hero-title-line-${part.substring(0, 15)}`}
                index={i}
                text={lineText}
                delay={lineDelay}
                duration={i === 0 ? 0.6 : 0.65}
              />
            )
          })}
        </h1>

        {/* Hero Banner Card — Dual Glass with Cyan Glow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.78 }}
          className="inline-flex flex-col items-center gap-1.5 px-4 py-3.5 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#090a16]/95 border border-slate-200/90 dark:border-cyan-500/30 backdrop-blur-xl mb-5 sm:mb-6 max-w-2xl shadow-lg dark:shadow-[0_10px_35px_rgba(6,182,212,0.18)] hover:border-cyan-500/60 transition-all w-full sm:w-auto"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 animate-pulse" />
            <p className="text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-100 font-bold min-h-[1.5rem] flex items-center">
              <CyberTypewriter text={t('hero.titulo_2')} startDelay={820} speed={30} />
            </p>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-black text-gradient-spectacular">
            {t('hero.sub_respuesta')}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
          className="text-sm sm:text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-7 font-semibold px-2"
        >
          {t('hero.descripcion')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full sm:w-auto px-2 sm:px-4 mb-6"
        >
          <SalonBloomButton
            href="#demo"
            onClick={(e) => {
              e.preventDefault()
              trackEvent('hero_cta_demo_clicked', { source: 'hero_primary_button' })
              const el = document.getElementById('demo')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          />
          <MagneticButton
            href="#contact"
            onClick={() => {
              trackEvent('hero_cta_contact_clicked', { source: 'hero_secondary_button' })
            }}
          >
            <span className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white font-extrabold bg-white dark:bg-[#0e101c] backdrop-blur-md hover:bg-slate-100 dark:hover:bg-[#141728] hover:border-cyan-500/50 transition-all text-xs sm:text-sm tracking-wider uppercase block shadow-md hover:shadow-lg">
              {t('hero.cta_proyecto')}
            </span>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 1.25 }}
          className="w-full"
        >
          <HeroCompare />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
