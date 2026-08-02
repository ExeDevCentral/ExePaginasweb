import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import HeroCompare from './HeroCompare'

export const Hero: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-transparent flex flex-col items-center justify-start pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/10 blur-[100px] pointer-events-none z-0" />

      {/* Main Hero Header */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto w-full mb-12">
        {/* Phase Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/15 shadow-[0_0_20px_rgba(14,165,233,0.25)] mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </span>
          <span className="hero-phase-label text-[11px] sm:text-xs text-accent-cyan font-bold tracking-[0.18em]">
            // EL SISTEMA COMPLETO
          </span>
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-6 max-w-3xl"
        >
          Tu negocio escalable{' '}
          <strong className="text-gradient-spectacular">en un ecosistema bajo control</strong>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10 font-medium"
        >
          Reservas, pagos, facturación y soporte operando en piloto automático con software 100%
          propio.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
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
            href="/tienda"
            className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold bg-white/10 hover:bg-white/20 hover:border-accent-cyan/60 transition-all text-sm tracking-wide shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('hero.cta_proyecto')}
          </motion.a>
        </motion.div>
      </div>

      {/* Feature / Compare Table */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        className="w-full max-w-5xl mx-auto px-4 relative z-10"
      >
        <HeroCompare />
      </motion.div>
    </section>
  )
}

export default Hero
