import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SalonBloomButton } from '../shared/SalonBloomButton'

interface HeroOverlayProps {
  progressRef: React.MutableRefObject<number>
  reducedMotion?: boolean
}

interface PhaseContent {
  label: string
  headline: string
  headlineStrong: string
  subtitle: string
}

const PHASES: PhaseContent[] = [
  {
    label: '// ACTO 1 · EL CAOS OPERATIVO',
    headline: 'Software desordenado es',
    headlineStrong: 'alquiler disfrazado de compra',
    subtitle: 'Procesos manuales, datos dispersos y ataduras a plataformas de terceros.',
  },
  {
    label: '// ACTO 2 · LA ARQUITECTURA',
    headline: 'Centralizamos y automatizamos',
    headlineStrong: 'tus cuellos de botella',
    subtitle: 'Diseñamos e integramos infraestructura de software con código 100% tuyo.',
  },
  {
    label: '// ACTO 3 · EL SISTEMA COMPLETO',
    headline: 'Tu negocio escalable',
    headlineStrong: 'en un ecosistema bajo control',
    subtitle: 'Reservas, pagos, facturación y soporte operando en piloto automático.',
  },
]

export const HeroOverlay: React.FC<HeroOverlayProps> = ({ progressRef, reducedMotion = false }) => {
  const { t } = useTranslation()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setPhase(2)
      return
    }

    const checkProgress = () => {
      const p = progressRef.current
      const next = p < 0.2 ? 0 : p > 0.75 ? 2 : 1
      setPhase((prev) => (next !== prev ? next : prev))
    }

    const intervalId = setInterval(checkProgress, 100)
    return () => clearInterval(intervalId)
  }, [progressRef, reducedMotion])

  const current = PHASES[phase]

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full min-h-[600px] pointer-events-none">
      {/* Badge / Mono Phase Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${phase}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 backdrop-blur-md mb-6 pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </span>
          <span className="hero-phase-label text-[11px] sm:text-xs text-accent-cyan tracking-[0.18em]">
            {current.label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Main Display Headline (Space Grotesk) */}
      <AnimatePresence mode="wait">
        <motion.h1
          key={`headline-${phase}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="hero-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          {current.headline}{' '}
          <strong className="text-gradient-spectacular">{current.headlineStrong}</strong>.
        </motion.h1>
      </AnimatePresence>

      {/* Subtitle */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`subtitle-${phase}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="text-base sm:text-lg md:text-xl text-primary-secondary leading-relaxed max-w-2xl mx-auto mb-10 font-medium"
        >
          {current.subtitle}
        </motion.p>
      </AnimatePresence>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto px-4 pointer-events-auto">
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
          className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl border border-border text-foreground font-semibold bg-background/50 backdrop-blur-md hover:bg-muted hover:border-accent-cyan/40 transition-all text-sm tracking-wide"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('hero.cta_proyecto')}
        </motion.a>
      </div>
    </div>
  )
}

export default HeroOverlay
