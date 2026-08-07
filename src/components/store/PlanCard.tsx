import { motion } from 'framer-motion'
import { Check, ArrowRight, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 25 }}
      className="relative w-full group pt-4"
    >
      <div className="relative">
        {/* Sombra Glow */}
        <div
          className={`absolute -inset-4 rounded-[32px] blur-[30px] -z-10 pointer-events-none transition-opacity duration-300 ${
            plan.popular
              ? 'bg-accent-magenta/30 opacity-80'
              : 'bg-black/40 dark:bg-black/70 opacity-50 group-hover:opacity-90'
          }`}
        />

        {/* Badge de "Más Elegido" */}
        {plan.popular && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-30 pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-md opacity-80 rounded-full" />
              <span className="relative bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white text-[11px] font-black px-5 py-1.5 rounded-full shadow-xl border border-white/40 tracking-wider uppercase text-shadow">
                {t('store.mas_elegido')}
              </span>
            </div>
          </div>
        )}

        {/* Tarjeta Principal Adaptativa con Alto Contraste */}
        <div
          className={`relative rounded-3xl bg-white dark:bg-[#0d0e19] border border-slate-200 dark:border-white/15 backdrop-blur-2xl p-8 flex flex-col text-left transition-all duration-300 shadow-2xl ${
            plan.popular
              ? 'md:-translate-y-2 border-accent-magenta/60 dark:border-accent-magenta/60'
              : ''
          }`}
        >
          {/* Filo holográfico que recorre el borde */}
          <div
            className="absolute inset-0 rounded-3xl p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 45deg, transparent, rgba(56,189,248,0.9), rgba(236,72,153,0.9), transparent 35%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Marco flotante intermedio */}
          <div className="absolute inset-0 rounded-3xl border border-slate-100 dark:border-white/10 pointer-events-none" />

          {/* Línea superior radiante para el plan popular */}
          {plan.popular && (
            <div className="absolute top-0 inset-x-0 h-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-magenta to-transparent" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              />
            </div>
          )}

          {/* Icono */}
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br p-0.5 mb-6 shadow-md mt-2">
            <div
              className={`w-full h-full bg-gradient-to-br ${plan.color} rounded-[14px] flex items-center justify-center`}
            >
              <plan.icon className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Contenido Texto y Precio con Máximo Contraste */}
          <div className="relative z-20 flex-1 flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {plan.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 h-10 leading-relaxed font-medium">
              {plan.description}
            </p>

            <div className="mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {plan.price}
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-xs ml-1.5">
                ARS{plan.period}
              </span>
            </div>

            {/* Lista de características con alto contraste */}
            <ul className="space-y-3.5 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-sm`}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Botón de Suscribirme */}
            <div className="mt-auto pt-4 relative z-30">
              <motion.button
                type="button"
                onClick={() => onSelect(plan)}
                className="relative w-full py-4 rounded-xl font-extrabold text-white flex items-center justify-center gap-2 overflow-hidden group/btn cursor-pointer shadow-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.color}`} />
                <motion.div
                  className="absolute -inset-full top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1.5,
                  }}
                />
                <span className="relative z-10 flex items-center gap-2 text-sm md:text-base tracking-wide">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  {t('store.suscribirme')}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
