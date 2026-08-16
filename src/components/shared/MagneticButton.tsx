import React, { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  href?: string
  type?: 'button' | 'submit'
  magneticStrength?: number
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  magneticStrength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const x = useSpring(0, { stiffness: 150, damping: 15 })
  const y = useSpring(0, { stiffness: 150, damping: 15 })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = (e.clientX - centerX) * magneticStrength
    const distanceY = (e.clientY - centerY) * magneticStrength

    x.set(distanceX)
    y.set(distanceY)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const rippleX = e.clientX - rect.left
      const rippleY = e.clientY - rect.top
      const newRipple = { id: Date.now(), x: rippleX, y: rippleY }

      setRipples((prev) => [...prev, newRipple])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 700)
    }

    if (onClick) onClick(e)
  }

  const content = (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x, y }}
      className="relative inline-block group/mag"
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Click Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/40 animate-[ping_0.7s_ease-out_forwards] pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: r.x,
              top: r.y,
              width: 120,
              height: 120,
            }}
          />
        ))}

        {children}
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={`inline-block ${className}`}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={handleClick} className={`inline-block ${className}`}>
      {content}
    </button>
  )
}
