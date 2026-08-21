'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function MouseSpotlight() {
  const [isHovered, setIsHovered] = useState(false)

  // Spring animations for silky smooth 60fps tracking
  const mouseX = useSpring(0, { stiffness: 80, damping: 25 })
  const mouseY = useSpring(0, { stiffness: 80, damping: 25 })

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isHovered) setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, isHovered])

  if (!isHovered) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      <motion.div
        className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 dark:opacity-30 blur-[120px] will-change-transform bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-cyan"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
    </motion.div>
  )
}
