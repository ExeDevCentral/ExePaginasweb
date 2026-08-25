'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Shield, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { storeAudio } from '../../core/utils/storeAudio'

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
  rawPriceARS: number
  rawPriceUSD: number
  period: string
}

interface PlanCardProps {
  plan: PlanData
  index: number
  currency: 'ARS' | 'USD'
  isAnnual: boolean
  onSelect: (plan: PlanData) => void
}

export default function PlanCard({ plan, index, currency, isAnnual, onSelect }: PlanCardProps) {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D Motion Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for buttery-smooth tilt
  const springConfig = { damping: 20, stiffness: 200 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig)
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseEnter = () => {
    storeAudio.playHover()
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Price calculations
  const rawMonthly = currency === 'ARS' ? plan.rawPriceARS : plan.rawPriceUSD
  const discountedMonthly = isAnnual ? Math.round(rawMonthly * 0.8) : rawMonthly
  const formattedPrice =
    currency === 'ARS'
      ? '$' + discountedMonthly.toLocaleString('es-AR').replace(/,/g, '.')
      : '$' + discountedMonthly

  const savingsARS = (plan.rawPriceARS * 12 * 0.2).toLocaleString('es-AR').replace(/,/g, '.')
  const savingsUSD = (plan.rawPriceUSD * 12 * 0.2).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 25 }}
      className="relative w-full group pt-6"
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative transition-shadow duration-300"
      >
        {/* Glow de fondo amplificado */}
        <div
          className={`absolute -inset-4 rounded-[36px] blur-[36px] -z-10 pointer-events-none transition-all duration-500 ${
            plan.popular
              ? 'bg-gradient-to-r from-cyan-500/30 via-purple-500/40 to-pink-500/30 opacity-90 group-hover:opacity-100 group-hover:scale-105'
              : 'bg-black/40 dark:bg-accent-cyan/10 opacity-40 group-hover:opacity-80 group-hover:scale-105'
          }`}
        />

        {/* Badge "Más Elegido" con efecto de pulso */}
        {plan.popular && (
          <div className="absolute -top-5 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-90 rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white text-[11px] font-black px-6 py-2 rounded-full shadow-2xl border border-white/50 tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                <span>{t('store.mas_elegido')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta Principal Adaptativa con Alto Contraste y Vidrio Holográfico */}
        <div
          className={`relative rounded-3xl bg-white/95 dark:bg-[#0c0e1a]/90 border border-slate-200/90 dark:border-white/15 backdrop-blur-2xl p-7 sm:p-9 flex flex-col text-left transition-all duration-300 shadow-2xl overflow-hidden ${
            plan.popular
              ? 'border-purple-500/60 dark:border-purple-500/60 ring-2 ring-purple-500/30'
              : 'hover:border-accent-cyan/60'
          }`}
        >
          {/* Reflejo Especular Holográfico Interactivo */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 350px at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 70%)`
              ),
            }}
          />

          {/* Borde animado de plasma en el plan popular */}
          {plan.popular && (
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              <motion.div
                className="w-full h-full bg-white/60"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Encabezado con Icono */}
          <div className="flex items-start justify-between mb-5 relative z-20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br p-0.5 shadow-lg">
              <div
                className={`w-full h-full bg-gradient-to-br ${plan.color} rounded-[14px] flex items-center justify-center shadow-inner`}
              >
                <plan.icon className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Badge de Garantía en la esquina */}
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-muted-foreground">
              <Shield className="w-3 h-3 text-accent-cyan" />
              <span>SLA Activo</span>
            </div>
          </div>

          {/* Título y Descripción */}
          <div className="relative z-20 mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
              {plan.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm h-11 leading-relaxed font-medium">
              {plan.description}
            </p>
          </div>

          {/* Caja de Precio Dinámica */}
          <div className="relative z-20 mb-6 p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 shadow-inner">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-montserrat tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">
                {currency}/mes
              </span>
            </div>

            {isAnnual ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  Ahorrás {currency === 'ARS' ? `$${savingsARS}` : `$${savingsUSD}`}/año
                </span>
                <span className="text-[11px] text-muted-foreground line-through font-mono">
                  {currency === 'ARS' ? plan.price : plan.priceUSD}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                Facturación mensual sin compromiso
              </p>
            )}
          </div>

          {/* Lista de Prestaciones */}
          <div className="relative z-20 flex-1 mb-8">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Incluye en este plan:
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 group/feat">
                  <div
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-sm group-hover/feat:scale-110 transition-transform`}
                  >
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-sm text-slate-800 dark:text-slate-200 font-medium group-hover/feat:text-foreground transition-colors">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón de Suscripción con Efecto de Destello */}
          <div className="relative z-30 mt-auto pt-2">
            <motion.button
              type="button"
              onClick={() => {
                storeAudio.playSelect()
                onSelect(plan)
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 overflow-hidden group/btn cursor-pointer shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.color}`} />
              <motion.div
                className="absolute -inset-full top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                animate={{ left: ['-100%', '200%'] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 1.5,
                }}
              />
              <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base tracking-wide uppercase font-montserrat">
                <span>{t('store.suscribirme')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
