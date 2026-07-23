import React, { useRef, useCallback, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  icon: string
  color: string
  depth: number
  onClick?: () => void
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'dashboard',
    x: 72,
    y: 35,
    label: 'Dashboard',
    icon: '📊',
    color: 'from-cyan-400 to-blue-500',
    depth: 0.8,
  },
  {
    id: 'reservas',
    x: 28,
    y: 45,
    label: 'Reservas',
    icon: '📅',
    color: 'from-pink-400 to-fuchsia-500',
    depth: 1.0,
  },
  {
    id: 'pagos',
    x: 55,
    y: 70,
    label: 'Pagos',
    icon: '💳',
    color: 'from-yellow-400 to-orange-500',
    depth: 0.6,
  },
  {
    id: 'chat',
    x: 80,
    y: 65,
    label: 'Chat IA',
    icon: '🤖',
    color: 'from-purple-400 to-indigo-500',
    depth: 0.9,
  },
  {
    id: 'analytics',
    x: 40,
    y: 25,
    label: 'Analytics',
    icon: '📈',
    color: 'from-emerald-400 to-teal-500',
    depth: 0.7,
  },
]

function useMultiTransform(
  values: MotionValue<number>[],
  transformer: (values: number[]) => string
): MotionValue<string> {
  return useTransform(values, transformer as (...args: unknown[]) => string)
}

export default function Hero3DImage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [0, 1], [8, -8])
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8])

  const bgX = useTransform(smoothX, [0, 1], [6, -6])
  const bgY = useTransform(smoothY, [0, 1], [6, -6])
  const midX = useTransform(smoothX, [0, 1], [12, -12])
  const midY = useTransform(smoothY, [0, 1], [12, -12])
  const fgX = useTransform(smoothX, [0, 1], [20, -20])
  const fgY = useTransform(smoothY, [0, 1], [20, -20])

  const glareX = useTransform(smoothX, [0, 1], [0, 100])
  const glareY = useTransform(smoothY, [0, 1], [0, 100])

  const outerGlow = useMultiTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(ellipse at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(0,212,255,0.15), rgba(255,0,255,0.08), transparent 70%)`
  )

  const glareBg = useMultiTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08), transparent 60%)`
  )

  const outerBlur = useTransform(smoothX, [0, 1], ['blur(80px)', 'blur(100px)'])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouseX.set(Math.max(0, Math.min(1, x)))
      mouseY.set(Math.max(0, Math.min(1, y)))
    },
    [mouseX, mouseY]
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setActiveHotspot(null)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  return (
    <div className="relative mt-16 w-full max-w-5xl mx-auto z-10 group">
      {/* Outer glow that pulses with mouse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-3xl pointer-events-none -z-10"
        style={{ background: outerGlow, filter: outerBlur }}
      />

      {/* 3D Perspective Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          perspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-2 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] cursor-pointer transition-[border-color] duration-500"
        whileHover={{ borderColor: 'rgba(0,212,255,0.3)' }}
      >
        {/* Background layer - moves slowest */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ x: bgX, y: bgY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-magenta/5" />
        </motion.div>

        {/* Main image with depth layers */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Base image */}
          <img
            src="/assets/hero-spline.png"
            alt="ExeSistemasWEB Platform"
            className="w-full rounded-2xl object-cover"
            loading="eager"
            draggable={false}
          />

          {/* Mid layer - floating UI elements */}
          <motion.div className="absolute inset-0 pointer-events-none" style={{ x: midX, y: midY }}>
            {/* Floating glass card 1 */}
            <motion.div
              className="absolute top-[15%] left-[8%] w-24 h-16 md:w-32 md:h-20 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
              animate={isHovered ? { scale: 1.05, rotateZ: -2 } : { scale: 1, rotateZ: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="text-center">
                <div className="text-lg md:text-xl">📊</div>
                <div className="text-[8px] md:text-[10px] text-white/70 font-bold mt-0.5">
                  Analytics
                </div>
              </div>
            </motion.div>

            {/* Floating glass card 2 */}
            <motion.div
              className="absolute top-[20%] right-[6%] w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
              animate={isHovered ? { scale: 1.08, rotateZ: 3 } : { scale: 1, rotateZ: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.05 }}
            >
              <div className="text-center">
                <div className="text-xl md:text-2xl">🤖</div>
                <div className="text-[8px] md:text-[10px] text-white/70 font-bold mt-0.5">
                  Chat IA
                </div>
              </div>
            </motion.div>

            {/* Floating glass card 3 */}
            <motion.div
              className="absolute bottom-[25%] left-[5%] w-28 h-14 md:w-36 md:h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center gap-2"
              animate={isHovered ? { scale: 1.06, rotateZ: 1 } : { scale: 1, rotateZ: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 15, delay: 0.1 }}
            >
              <div className="text-lg">📅</div>
              <div className="text-[8px] md:text-[10px] text-white/70 font-bold">Reservas</div>
            </motion.div>

            {/* Floating metric pill */}
            <motion.div
              className="absolute bottom-[18%] right-[8%] px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5"
              animate={isHovered ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
            >
              <span className="text-emerald-400 text-[10px] md:text-xs font-bold">+47%</span>
              <span className="text-[8px] md:text-[10px] text-white/50">ventas</span>
            </motion.div>
          </motion.div>

          {/* Foreground layer - moves fastest (depth illusion) */}
          <motion.div className="absolute inset-0 pointer-events-none" style={{ x: fgX, y: fgY }}>
            {/* Floating dots / particles */}
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-accent-cyan"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 3) * 15}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0, 1.5, 0],
                      y: [0, -20 - i * 5],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>

          {/* Hotspot markers */}
          {HOTSPOTS.map((hotspot) => (
            <motion.button
              key={hotspot.id}
              className="absolute z-20 group/hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{
                delay: HOTSPOTS.indexOf(hotspot) * 0.08,
                type: 'spring',
                stiffness: 300,
              }}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={hotspot.onClick}
            >
              {/* Pulse ring */}
              <motion.div
                className={`absolute -inset-2 rounded-full bg-gradient-to-r ${hotspot.color} opacity-30`}
                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Center dot */}
              <div
                className={`relative w-3 h-3 rounded-full bg-gradient-to-r ${hotspot.color} shadow-lg`}
              />

              {/* Tooltip */}
              {activeHotspot === hotspot.id && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-12 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl"
                >
                  <span>{hotspot.icon}</span>
                  <span>{hotspot.label}</span>
                </motion.div>
              )}
            </motion.button>
          ))}

          {/* Glare / light reflection overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: glareBg }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>

        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: isHovered
              ? 'inset 0 0 30px rgba(0,212,255,0.1), 0 0 40px rgba(0,212,255,0.05)'
              : 'inset 0 0 0 transparent',
          }}
        />
      </motion.div>

      {/* Depth indicator */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] text-muted-foreground/50 font-mono"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span>3D DEPTH</span>
        <div className="flex gap-1">
          {[0.6, 0.7, 0.8, 0.9, 1.0].map((_d, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-accent-cyan"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
        <span>INTERACTIVE</span>
      </motion.div>
    </div>
  )
}
