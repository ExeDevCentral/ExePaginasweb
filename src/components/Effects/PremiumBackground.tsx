import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  shape: 'circle' | 'diamond'
  driftX: number
  driftY: number
}

const PremiumBackground = () => {
  const isMobile = useIsMobile()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 50, stiffness: 40, mass: 1 })
  const springY = useSpring(mouseY, { damping: 50, stiffness: 40, mass: 1 })

  const { scrollYProgress } = useScroll()
  const orbParallaxY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const orbParallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -80])

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 200)
      mouseY.set(e.clientY - 200)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, mouseX, mouseY])

  const particles = useMemo<Particle[]>(() => {
    if (isMobile) return []
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * 20,
      shape: i % 2 === 0 ? 'circle' : 'diamond',
      driftX: (Math.random() - 0.5) * 120,
      driftY: (Math.random() - 0.5) * 120,
    }))
  }, [isMobile])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />

      {/* Deep ambient orbs — scroll-linked parallax */}
      {!isMobile ? (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-cyan/15 blur-[120px] mix-blend-screen"
            animate={{ x: [0, 100, -50, 0], y: [0, 50, 100, 0] }}
            style={{ y: orbParallaxY }}
            transition={{ duration: 20, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-magenta/10 blur-[150px] mix-blend-screen"
            animate={{ x: [0, -150, 50, 0], y: [0, -100, 150, 0] }}
            style={{ y: orbParallaxY2 }}
            transition={{ duration: 25, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
          />
          {/* Mid-page orbs for scroll depth */}
          <motion.div
            className="absolute top-[40%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-accent-cyan/8 blur-[100px] mix-blend-screen"
            animate={{ x: [0, -80, 60, 0], y: [0, 60, -40, 0] }}
            style={{ y: orbParallaxY }}
            transition={{ duration: 28, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
          />
          <motion.div
            className="absolute top-[65%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-accent-magenta/8 blur-[110px] mix-blend-screen"
            animate={{ x: [0, 70, -50, 0], y: [0, -60, 40, 0] }}
            style={{ y: orbParallaxY2 }}
            transition={{ duration: 22, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }}
          />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-cyan/10 blur-[60px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-magenta/5 blur-[80px]" />
        </>
      )}

      {/* Mouse-following orb */}
      {!isMobile && (
        <motion.div
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-cyan/10 blur-[100px] mix-blend-screen"
          style={{ x: springX, y: springY }}
        />
      )}

      {/* Floating particles */}
      {!isMobile &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              rotate: p.shape === 'diamond' ? '45deg' : '0deg',
              backgroundColor: `color-mix(in oklch, var(--foreground) 12%, transparent)`,
            }}
            animate={{
              x: [0, p.driftX, -p.driftX * 0.5, 0],
              y: [0, p.driftY, -p.driftY * 0.5, 0],
              opacity: [0, 0.8, 0.3, 0],
              scale: [0, 1, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}

      {/* Film grain — animated position shift */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none animate-[grain_0.5s_steps(1)_infinite]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, color-mix(in oklch, var(--foreground) 15%, transparent) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />
    </div>
  )
}

export default PremiumBackground
