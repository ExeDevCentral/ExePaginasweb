import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const typewriterText = "Welcome to Premium Landing Experience"
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < typewriterText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + typewriterText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      const repeatTimeout = setTimeout(() => {
        setDisplayText('')
        setCurrentIndex(0)
      }, 120000) // 2 minutos
      return () => clearTimeout(repeatTimeout)
    }
  }, [currentIndex, typewriterText])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 z-[1] opacity-60" aria-hidden />
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/3 z-[1] h-72 w-72 rounded-full bg-accent-cyan/25 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-1/4 z-[1] h-64 w-64 rounded-full bg-accent-magenta/25 blur-3xl"
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        aria-hidden
      />

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setIsVideoLoaded(false)}
        >
          <source src="/assets/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Fallback cuando no hay video o falla la carga */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-bg via-accent-cyan/20 to-accent-magenta/20" aria-hidden />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/80 via-primary-bg/60 to-primary-bg/90" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(0,255,255,0.12),transparent_55%)]"
          aria-hidden
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Title */}
        <motion.p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent-cyan/90 sm:text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Studio web · 3D · Video · Parallax
        </motion.p>
        <motion.h1
          className="mb-6 font-montserrat text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          variants={itemVariants}
        >
          <span className="text-gradient-animated">Premium</span>
          <br />
          <span className="text-primary-text">Landing Experience</span>
        </motion.h1>

        {/* Typewriter Subtitle */}
        <motion.div
          className="text-xl sm:text-2xl lg:text-3xl text-primary-secondary mb-8 font-inter min-h-[3rem] flex items-center justify-center"
          variants={itemVariants}
        >
          <span className="border-r-2 border-accent-cyan pr-1 animate-pulse">
            {displayText}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-primary-secondary sm:text-xl"
          variants={itemVariants}
        >
          Experiencia web con impacto: animaciones, video y estructura clara para que tu
          proposito se entienda al instante.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-10 justify-center items-center"

          variants={itemVariants}
        >
          <motion.a
            className="transform rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-8 py-4 text-lg font-semibold text-primary-bg shadow-lg shadow-accent-cyan/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-cyan/40"
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contactar ahora
          </motion.a>

          <motion.a
            className="flex items-center gap-2 rounded-full border-2 border-accent-cyan/80 px-8 py-4 text-lg font-semibold text-accent-cyan transition-all duration-300 hover:border-accent-cyan hover:bg-accent-cyan/10 hover:text-primary-text"
            href="#demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={20} />
            Ver Demo
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary-secondary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-cyan rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Controls (Optional) */}
      {isVideoLoaded && (
        <motion.button
          className="absolute bottom-4 right-4 z-20 p-3 bg-primary-bg/80 backdrop-blur-md rounded-full text-primary-text hover:bg-primary-bg transition-colors"
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
      )}
    </section>
  )
}

export default Hero
