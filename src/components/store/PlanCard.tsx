/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import {
  CyberCheckMark,
  CyberRealPropertyShield,
  CyberMetricLightning,
  CyberSparkleIcon,
} from '@/components/ui/MagnificentIcons'
import { useTranslation } from 'react-i18next'
import { storeAudio } from '../../core/utils/storeAudio'
import HudButton from '@/components/HudButton'

export interface PlanData {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; size?: number }> | LucideIcon
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
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  // 3D Motion Values
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for buttery-smooth tilt
  const springConfig = { damping: 25, stiffness: 220 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig)
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig)
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig)

  useEffect(() => {
    if (isButtonHovered) {
      x.set(0)
      y.set(0)
    }
  }, [isButtonHovered, x, y])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isButtonHovered) return
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
    setIsButtonHovered(false)
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
        animate={
          isButtonHovered
            ? {
                rotateX: 0,
                rotateY: 0,
                y: -8,
                scale: 1.02,
              }
            : {
                y: 0,
                scale: 1,
              }
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          rotateX: isButtonHovered ? 0 : rotateX,
          rotateY: isButtonHovered ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative transition-shadow duration-300"
      >
        {/* Glow de fondo calibrado y nítido */}
        <div
          className={`absolute -inset-2 rounded-2xl blur-xl -z-10 pointer-events-none transition-all duration-300 ${
            plan.popular
              ? isButtonHovered
                ? 'bg-linear-to-r from-cyan-400/30 via-purple-500/40 to-pink-500/30 opacity-100'
                : 'bg-linear-to-r from-cyan-500/20 via-purple-500/25 to-pink-500/20 opacity-80'
              : isButtonHovered
                ? 'bg-cyan-500/20 dark:bg-accent-cyan/20 opacity-80'
                : 'bg-cyan-500/5 dark:bg-accent-cyan/10 opacity-30'
          }`}
        />

        {/* Badge "Más Elegido" con acabado sobrio */}
        {plan.popular && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <div className="relative">
              <div className="relative bg-linear-to-r from-cyan-600 via-purple-600 to-pink-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md border border-white/30 tracking-wider uppercase flex items-center gap-1.5">
                <CyberSparkleIcon size={13} className="text-yellow-300" />
                <span>{t('store.mas_elegido')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta Principal Adaptativa con Alto Contraste */}
        <div
          className={`relative rounded-2xl bg-white/95 dark:bg-[#0c0e1a]/90 border backdrop-blur-xl p-6 sm:p-8 flex flex-col text-left transition-all duration-300 shadow-xl overflow-hidden ${
            isButtonHovered
              ? plan.popular
                ? 'border-purple-400 ring-1 ring-purple-400/50 shadow-purple-500/10'
                : 'border-cyan-400 ring-1 ring-cyan-400/50 shadow-cyan-500/10'
              : plan.popular
                ? 'border-purple-500/50 ring-1 ring-purple-500/20'
                : 'border-slate-200/90 dark:border-white/10 hover:border-accent-cyan/50'
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
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500">
              <motion.div
                className="w-full h-full bg-white/60"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Encabezado con Icono */}
          <div className="flex items-start justify-between mb-5 relative z-20">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br p-0.5 shadow-sm">
              <div
                className={`w-full h-full bg-linear-to-br ${plan.color} rounded-[10px] flex items-center justify-center shadow-inner`}
              >
                <plan.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Badge de Garantía en la esquina */}
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-muted-foreground">
              <CyberRealPropertyShield size={14} />
              <span>{t('store.sla_activo', 'SLA Activo')}</span>
            </div>
          </div>

          {/* Título y Descripción */}
          <div className="relative z-20 mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              {plan.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm h-11 leading-relaxed font-medium">
              {plan.description}
            </p>
          </div>

          {/* Caja de Precio Dinámica */}
          <div className="relative z-20 mb-6 p-4 rounded-xl bg-muted/40 border border-border shadow-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-montserrat tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-extrabold text-sm">
                {currency}
                {t('store.period_month', '/mes')}
              </span>
            </div>

            {isAnnual ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CyberMetricLightning size={14} />
                  {t('store.ahorras_anual', 'Ahorrás {{amount}}/año', {
                    amount: currency === 'ARS' ? `$${savingsARS}` : `$${savingsUSD}`,
                  })}
                </span>
                <span className="text-[11px] text-muted-foreground line-through font-mono">
                  {currency === 'ARS' ? plan.price : plan.priceUSD}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                {t('store.facturacion_sin_compromiso', 'Facturación mensual sin compromiso')}
              </p>
            )}
          </div>

          {/* Lista de Prestaciones */}
          <div className="relative z-20 flex-1 mb-8">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {t('store.incluye_plan', 'Incluye en este plan:')}
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 group/feat">
                  <div
                    className={`mt-0.5 shrink-0 w-4 h-4 rounded-full bg-linear-to-br ${plan.color} flex items-center justify-center shadow-sm group-hover/feat:scale-110 transition-transform`}
                  >
                    <CyberCheckMark size={14} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-800 dark:text-slate-200 font-medium group-hover/feat:text-foreground transition-colors">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón de Suscripción HUD Cyber */}
          <div className="relative z-30 mt-auto pt-2">
            <HudButton
              label={t('store.suscribirme')}
              variant={plan.popular ? 'primary' : 'secondary'}
              size="lg"
              className="w-full justify-center"
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={() => {
                storeAudio.playSelect()
                onSelect(plan)
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
