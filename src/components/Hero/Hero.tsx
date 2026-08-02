import React from 'react'
import { motion } from 'framer-motion'
import ThreeHeroScene from './ThreeHeroScene'
import HeroOverlay from './HeroOverlay'
import HeroCompare from './HeroCompare'
import { useSceneProgress } from './ThreeSceneRig'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export const Hero: React.FC = () => {
  const progressRef = useSceneProgress('home')
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="relative min-h-[140vh] w-full overflow-hidden bg-transparent flex flex-col items-center justify-start pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* 3D Server City Canvas Background */}
      <ThreeHeroScene progressRef={progressRef} />

      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-magenta/10 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-accent-magenta/10 blur-[100px] pointer-events-none z-0" />

      {/* HTML Scrollytelling Overlay (Space Grotesk + JetBrains Mono) */}
      <HeroOverlay progressRef={progressRef} reducedMotion={reducedMotion} />

      {/* Feature / Compare Table */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        className="w-full max-w-5xl mx-auto px-4 mt-16 relative z-10"
      >
        <HeroCompare />
      </motion.div>
    </section>
  )
}

export default Hero
