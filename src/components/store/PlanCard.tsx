import React, { useRef, useCallback, useState, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Check, ArrowRight, type LucideIcon } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'

export interface PlanData {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  shadow: string
  border: string
  features: string[]
  popular: boolean
  price: string
  priceUSD: string
  period: string
}

interface PlanCardProps {
  plan: PlanData
  index: number
  onSelect: (plan: PlanData) => void
}

export default function PlanCard({ plan, index, onSelect }: PlanCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [0, 1], [6, -6])
  const rotateY = useTransform(smoothX, [0, 1], [-6, 6])

  const glareX = useTransform(smoothX, [0, 1], [0, 100])
  const glareY = useTransform(smoothY, [0, 1], [0, 100])

  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x as number}% ${y as number}%, rgba(255,255,255,0.06), transparent 60%)`
  )

  const glowBg = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x as number}% ${y as number}%, ${
        plan.popular ? 'rgba(236,72,153,0.12)' : 'rgba(14,165,233,0.06)'
      }, transparent 80%)`
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
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
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  const particles = useMemo(
    () =>
      Array.from({ length: isMobile ? 0 : plan.popular ? 18 : 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
      })),
    [isMobile, plan.popular]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 25 }}
      className="relative"
    >
      {/* Mouse-following glow layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
        style={{ background: glowBg }}
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative rounded-3xl bg-gradient-to-br from-zinc-100/40 to-zinc-50/10 dark:from-white/[0.05] dark:to-white/[0.02] backdrop-blur-xl border overflow-hidden transition-all duration-300 hover:bg-zinc-200/40 dark:hover:bg-white/[0.08] p-8 flex flex-col text-left ${
          plan.border
        } ${plan.popular ? 'md:-translate-y-4 shadow-2xl ' + plan.shadow : ''}`}
      >
        {/* Glare overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glareBg }}
        />

        {/* Top gradient line for popular */}
        {plan.popular && (
          <div className="absolute top-0 inset-x-0 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-magenta to-transparent" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
          </div>
        )}

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: plan.popular ? 'rgba(236,72,153,0.4)' : 'rgba(14,165,233,0.3)',
            }}
            animate={{
              y: [0, -25 - Math.random() * 25, 0],
              x: [0, Math.random() * 16 - 8, 0],
              scale: [0, 1.2, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Popular badge */}
        {plan.popular && (
          <motion.div
            className="absolute -top-4 left-0 right-0 flex justify-center z-20"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-md opacity-50 rounded-full" />
              <span className="relative bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg border border-white/20">
                MÁS ELEGIDO
              </span>
            </div>
          </motion.div>
        )}

        {/* Icon — depth layer 1 */}
        <div
          className="relative z-[4] w-14 h-14 rounded-2xl bg-gradient-to-br p-0.5 mb-6"
          style={{ transform: 'translateZ(4px)' }}
        >
          <div className="w-full h-full bg-primary-bg/80 dark:bg-[#050508]/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
            <plan.icon className="w-7 h-7 text-zinc-800 dark:text-white" />
          </div>
        </div>

        {/* Text — depth layer 2 */}
        <div className="relative z-[6]" style={{ transform: 'translateZ(8px)' }}>
          <h3 className="text-2xl font-bold text-foreground mb-2">{plan.title}</h3>
          <p className="text-primary-secondary text-sm mb-6 h-10">{plan.description}</p>
        </div>

        {/* Price — depth layer 2 */}
        <div className="relative z-[6] mb-8" style={{ transform: 'translateZ(8px)' }}>
          <span className="text-4xl font-black text-foreground">{plan.price}</span>
          <span className="text-primary-secondary font-medium"> ARS{plan.period}</span>
        </div>

        {/* Features — depth layer 2 */}
        <ul
          className="relative z-[6] space-y-4 mb-8 flex-1"
          style={{ transform: 'translateZ(8px)' }}
        >
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}
              >
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-primary-secondary/90">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA button — depth layer 3 */}
        <div
          className="relative z-[8] mt-auto pt-4 min-h-[60px]"
          style={{ transform: 'translateZ(12px)' }}
        >
          <motion.button
            onClick={() => onSelect(plan)}
            className="relative w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 overflow-hidden group/btn cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${plan.color}`}
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Shimmer sweep */}
            <motion.div
              className="absolute -inset-full top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-sm md:text-base">
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              Suscribirme
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
