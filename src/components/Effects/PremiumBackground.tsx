import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

const PremiumBackground = () => {
  const isMobile = useIsMobile()

  // Usar Motion Values para el movimiento del mouse (evita re-renders en cada pixel movido)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Suavizado con spring (física suave) para que se mueva fluido y sin lag
  const springX = useSpring(mouseX, { damping: 50, stiffness: 40, mass: 1 })
  const springY = useSpring(mouseY, { damping: 50, stiffness: 40, mass: 1 })

  useEffect(() => {
    if (isMobile) return // En celulares no hay mouse, no registrar listener

    const handleMouseMove = (e: MouseEvent) => {
      // Ajustamos el valor restando la mitad del tamaño del orbe (400px / 2 = 200px)
      mouseX.set(e.clientX - 200)
      mouseY.set(e.clientY - 200)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, mouseX, mouseY])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-background" />

      {/* Orbes dinámicos que flotan lentamente - En móviles se reducen los movimientos y blur para máxima fluidez */}
      {!isMobile ? (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-cyan/15 blur-[120px] mix-blend-screen"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, 50, 100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-magenta/10 blur-[150px] mix-blend-screen"
            animate={{
              x: [0, -150, 50, 0],
              y: [0, -100, 150, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </>
      ) : (
        // En móviles renderizamos orbes estáticos y pequeños con menor blur para que no sobrecarguen la GPU
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-cyan/10 blur-[60px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-magenta/5 blur-[80px]" />
        </>
      )}

      {/* Orbe que sigue al mouse (solo en PC) */}
      {!isMobile && (
        <motion.div
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-cyan/10 blur-[100px] mix-blend-screen"
          style={{
            x: springX,
            y: springY,
          }}
        />
      )}

      {/* Textura de ruido animada (Film Grain) */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Viñeta para oscurecer los bordes y enfocar el centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none" />

      {/* Grid sutil encima */}
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
