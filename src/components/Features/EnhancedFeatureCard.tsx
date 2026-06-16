import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type LaserBeamSide = 'top' | 'right' | 'bottom' | 'left'

function LaserBeam({ side }: { side: LaserBeamSide }) {
  const beamRef = useRef<HTMLDivElement>(null)
  const [beamLength, setBeamLength] = useState(0)

  useEffect(() => {
    if (!beamRef.current) return
    setBeamLength(
      side === 'top' || side === 'bottom'
        ? beamRef.current.offsetWidth
        : beamRef.current.offsetHeight
    )
  }, [side])

  const beamStyle: React.CSSProperties = {
    position: 'absolute',
    background: 'linear-gradient(90deg, #00f6ff, #0044ff)',
    opacity: 0.7,
    ...(side === 'top' || side === 'bottom'
      ? { height: '2px', width: '100%', [side]: '-1px', left: 0 }
      : { width: '2px', height: '100%', [side]: '-1px', top: 0 }),
  }

  const initial = side === 'right' || side === 'bottom' ? beamLength : 0
  const animate = side === 'right' || side === 'bottom' ? 0 : beamLength

  return (
    <div ref={beamRef} style={beamStyle}>
      <motion.div
        style={{
          position: 'absolute',
          background: '#00f6ff',
          boxShadow: '0 0 8px #00f6ff',
          ...(side === 'top' || side === 'bottom'
            ? { height: '100%', width: '20px' }
            : { width: '100%', height: '20px' }),
        }}
        initial={{ [side === 'top' || side === 'bottom' ? 'x' : 'y']: initial }}
        animate={{ [side === 'top' || side === 'bottom' ? 'x' : 'y']: animate }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
    </div>
  )
}

export type EnhancedFeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  colorClass: string
}

export default function EnhancedFeatureCard({
  icon: Icon,
  title,
  description,
  colorClass,
}: EnhancedFeatureCardProps) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / rect.width - 0.5
    const yPct = mouseY / rect.height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative w-full perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-3xl border border-border bg-card/40 p-0"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
      >
        <div className="relative">
          <LaserBeam side="top" />
          <LaserBeam side="right" />
          <LaserBeam side="bottom" />
          <LaserBeam side="left" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} p-3 shadow-2xl`}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon className="h-full w-full text-foreground" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-secondary/90">
              {t('features.badge')}
            </span>
          </div>

          <h3 className="mt-5 mb-3 font-montserrat text-2xl font-black text-foreground">{title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className={`h-1.5 flex-1 rounded-full bg-gradient-to-r ${colorClass}`} />
            <div className="w-2 h-2 rounded-full bg-accent-cyan/80 shadow-[0_0_18px_rgba(0,212,255,0.45)]" />
          </div>

          <div className="mt-6 h-10 rounded-2xl border border-border bg-muted/50 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-20`} />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-accent-cyan/20 blur-2xl" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
