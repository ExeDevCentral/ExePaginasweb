import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const PremiumBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Fondo base ultra oscuro */}
      <div className="absolute inset-0 bg-[#030305]" />

      {/* Orbes dinámicos que flotan lentamente */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-cyan/15 blur-[120px] mix-blend-screen"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
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
          ease: "linear"
        }}
      />

      {/* Orbe que sigue al mouse (con físicas de resorte suaves) */}
      <motion.div
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent-cyan/10 blur-[100px] mix-blend-screen hidden md:block"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{ type: "spring", damping: 50, stiffness: 40, mass: 1 }}
      />

      {/* Textura de ruido animada (Film Grain) */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Viñeta para oscurecer los bordes y enfocar el centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.8)_100%)] pointer-events-none" />
      
      {/* Grid sutil encima */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />
    </div>
  )
}

export default PremiumBackground
