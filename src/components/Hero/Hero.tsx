import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import HeroCompare from './HeroCompare'

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

const TitleLine: React.FC<{
  text: string
  delay: number
  duration?: number
  index: number
}> = ({ text, delay, duration = 1.1, index }) => {
  const isLeft = index % 2 === 0
  return (
    <motion.span
      initial={{ opacity: 0, x: isLeft ? -240 : 240, filter: 'blur(10px)', scale: 0.9 }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className="block will-change-transform"
    >
      {text}
    </motion.span>
  )
}

const Hero: React.FC = () => {
  const { t } = useTranslation()

  const titleParts = t('hero.titulo_1').split('. ')

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/10 blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full">
        <Badge text={t('hero.badge')} />

        <motion.h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-[1.1] md:leading-[1.05] mb-4 max-w-4xl">
          {titleParts.map((part, i) => (
            <TitleLine
              key={i}
              index={i}
              text={`${part}${i < titleParts.length - 1 ? '.' : ''}`}
              delay={i === 0 ? 0.1 : 0.3}
              duration={i === 0 ? 1.1 : 2.7}
            />
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-primary-secondary leading-relaxed max-w-3xl mx-auto mb-6 font-medium"
        >
          {t('hero.descripcion')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
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
