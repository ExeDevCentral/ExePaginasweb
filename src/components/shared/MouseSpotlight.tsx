'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function MouseSpotlight() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)

  // Spring animation for smooth cursor following (ligero y sin sobrecarga)
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 26, mass: 0.4 })
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 26, mass: 0.4 })

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad) and without reduced motion preference
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }
    }

    const handleMouseLeave = () => {
      isVisibleRef.current = false
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transform-gpu"
        style={{
          x: smoothX,
          y: smoothY,
          background:
            'radial-gradient(circle, rgba(14,165,233,0.11) 0%, rgba(99,102,241,0.06) 35%, rgba(14,165,233,0.02) 60%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </motion.div>
  )
}
