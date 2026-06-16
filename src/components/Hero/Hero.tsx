import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SalonBloomButton } from '../shared/SalonBloomButton'
import { useIsMobile } from '../../hooks/useIsMobile'

const Hero: React.FC = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

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

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Gradiente de fondo base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-[var(--background)] to-accent-magenta/10" />

      {/* Glows de ambiente premium traseros */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/10 blur-[100px] pointer-events-none z-0" />

      {/* Componente de partículas con framer-motion (solo en pantallas grandes para rendimiento) */}
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
        {/* Live Badge Premium */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-muted backdrop-blur-md mb-6 hover:border-accent-cyan/40 transition-colors cursor-pointer group/badge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary group-hover/badge:text-foreground transition-colors">
            {t('hero.badge')}
          </span>
        </motion.div>

        {/* H1 con Alto Impacto Visual y Animación de Degradé Spectacular */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-montserrat font-black text-foreground tracking-tight leading-[1.1] md:leading-[1.05] mb-6 max-w-4xl">
          {t('hero.titulo_1')}
          <br />
          <span className="text-gradient-spectacular block mt-2 pb-2">{t('hero.titulo_2')}</span>
        </h1>

        {/* Descripción de Posicionamiento */}
        <p className="text-base sm:text-lg md:text-xl text-primary-secondary leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
          {t('hero.descripcion')}
        </p>

        {/* Botones de Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
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
      </div>
    </section>
  )
}

export default Hero
