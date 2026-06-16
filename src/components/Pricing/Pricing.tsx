import React, { useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, X, Coins } from 'lucide-react'
import ROICalculator from './ROICalculator'

interface PlanData {
  tKey: 'landing' | 'ecommerce'
  setupFee: { ARS: string; USD: string }
  monthlyFee: { ARS: string; USD: string }
  includedFeatures: boolean[]
  popular: boolean
}

const PRICING_PLANS: PlanData[] = [
  {
    tKey: 'landing',
    setupFee: { ARS: '$200.000', USD: 'u$s 400' },
    monthlyFee: { ARS: '$10.000', USD: 'u$s 20' },
    includedFeatures: [true, true, true, true, false, false],
    popular: false,
  },
  {
    tKey: 'ecommerce',
    setupFee: { ARS: '$450.000', USD: 'u$s 900' },
    monthlyFee: { ARS: '$25.000', USD: 'u$s 50' },
    includedFeatures: [true, true, true, true, true, true],
    popular: true,
  },
]

const PricingCard = ({
  plan,
  index,
  currency,
}: {
  plan: PlanData
  index: number
  currency: 'ARS' | 'USD'
}) => {
  const { t } = useTranslation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[2.5rem] bg-card backdrop-blur-xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 p-10 flex flex-col ${
        plan.popular
          ? 'border-accent-magenta/50 shadow-2xl shadow-accent-magenta/10 hover:shadow-accent-magenta/20'
          : 'border-border hover:border-border'
      }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${plan.popular ? 'rgba(236,72,153, 0.15)' : 'rgba(255,255,255, 0.05)'},
              transparent 80%
            )
          `,
        }}
      />

      {plan.popular && (
        <>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-magenta to-transparent" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-xs font-bold text-foreground uppercase tracking-wider shadow-lg">
            {t('pricing.popular')}
          </div>
        </>
      )}

      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="text-3xl font-outfit font-black text-foreground mb-3">{t(`pricing.${plan.tKey}_nombre`)}</h3>
        <p className="text-sm text-muted-foreground mb-8 min-h-[40px]">{t(`pricing.${plan.tKey}_desc`)}</p>

        <div className="mb-8 p-6 rounded-2xl bg-muted border border-border">
          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
              {t('pricing.setup_label')}
            </p>
            <p className="text-4xl font-outfit font-black text-foreground">{plan.setupFee[currency]}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
              {t('pricing.monthly_label')}
            </p>
            <div className="flex items-end gap-1">
              <p className="text-2xl font-outfit font-bold text-accent-cyan">{plan.monthlyFee[currency]}</p>
              <span className="text-xs text-muted-foreground mb-1">{t('pricing.per_month')}</span>
            </div>
          </div>
        </div>

        <ul className="space-y-4 mb-10 flex-1">
          {plan.includedFeatures.map((included, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${included ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}`}
              >
                {included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
              <span
                className={`text-sm ${included ? 'text-muted-foreground' : 'text-muted-foreground line-through decoration-slate-600/50'}`}
              >
                {t(`pricing.${plan.tKey}_feat_${i + 1}`)}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={`block w-full py-4 rounded-xl text-center font-bold transition-all duration-300 relative overflow-hidden group ${
            plan.popular
              ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-foreground hover:opacity-90 hover:shadow-lg hover:shadow-accent-magenta/20'
              : 'border border-border bg-card/50 text-foreground hover:border-accent-cyan/30 hover:bg-card hover:shadow-sm hover:shadow-accent-cyan/5'
          }`}
        >
          <span className="relative z-10">
            {currency === 'ARS' ? t('pricing.solicitar_pesos') : t('pricing.request_quotation')}
          </span>
          {!plan.popular && (
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/5 to-accent-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </a>
      </div>
    </motion.div>
  )
}

const Pricing = () => {
  const { t } = useTranslation()
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')

  return (
    <section
      id="pricing"
      className="py-32 px-4 relative overflow-hidden bg-background z-10 border-y border-border"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-cyan/5 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent-cyan font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            {t('pricing.seccion_titulo')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-foreground tracking-tight"
          >
            {t('pricing.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg mb-10"
          >
            {t('pricing.descripcion')}
          </motion.p>

          {/* Selector de Moneda Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-muted border border-border rounded-2xl p-1.5 self-center mb-8"
          >
            <button
              onClick={() => setCurrency('ARS')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
                currency === 'ARS'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-cyan/80 text-black shadow-lg shadow-accent-cyan/25'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Coins size={14} />
              ARS ($)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-accent-magenta to-accent-magenta/80 text-foreground shadow-lg shadow-accent-magenta/25'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <Coins size={14} />
              USD (u$s)
            </button>
          </motion.div>
        </div>

        {/* Tarjetas de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.tKey} plan={plan} index={index} currency={currency} />
          ))}
        </div>

        {/* Sección de la Calculadora de ROI */}
        <div className="border-t border-border pt-20">
          <ROICalculator currency={currency} />
        </div>
      </div>
    </section>
  )
}

export default Pricing
