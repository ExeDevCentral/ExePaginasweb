import { motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import PremiumBackground from '../Effects/PremiumBackground'
import { PLAN_CATALOG } from '../../core/domain/planCatalog'
import { Monitor, Building, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PlanData } from './PlanCard'
import PlanGrid from './PlanGrid'
import CheckoutModal from './CheckoutModal'

const basePlans: Omit<PlanData, 'price' | 'priceUSD' | 'period'>[] = [
  {
    id: 'mantenimiento-basico',
    title: 'Abono Básico',
    description: 'Mantenimiento mensual para Landing Pages y sitios institucionales.',
    icon: Monitor as LucideIcon,
    color: 'from-blue-400 to-cyan-400',
    shadow: 'shadow-cyan-500/20',
    border: 'border-cyan-500/30',
    features: [
      'Hosting de alta velocidad Vercel',
      'Renovación de dominio anual',
      'Actualizaciones de seguridad',
      'Certificado SSL automático',
      'Soporte técnico estándar',
    ],
    popular: false,
  },
  {
    id: 'mantenimiento-avanzado',
    title: 'Abono Avanzado',
    description: 'Mantenimiento integral para Sistemas Web, Reservas y E-Commerce.',
    icon: Building as LucideIcon,
    color: 'from-cyan-400 to-purple-500',
    shadow: 'shadow-purple-500/30',
    border: 'border-purple-500/50',
    features: [
      'Todo lo del Abono Básico',
      'Gestión de Base de Datos',
      'Backups diarios automáticos',
      'Monitoreo de pasarelas de pago',
      'Soporte técnico prioritario 24/7',
    ],
    popular: true,
  },
  {
    id: 'mantenimiento-premium',
    title: 'Abono Premium',
    description: 'Evolución continua, nuevas funcionalidades y bolsa de horas de desarrollo.',
    icon: Building2 as LucideIcon,
    color: 'from-purple-500 to-pink-500',
    shadow: 'shadow-pink-500/20',
    border: 'border-pink-500/30',
    features: [
      'Todo lo del Abono Avanzado',
      'Servidor Edge de máxima prioridad',
      'Modificaciones de contenido (2hs/mes)',
      'Consultoría estratégica',
      'Account Manager dedicado',
    ],
    popular: false,
  },
]

const formatARS = (n: number) => '$' + n.toLocaleString('es-AR').replace(/,/g, '.')
const formatUSD = (n: number) => '$' + n

const PLANS: PlanData[] = basePlans.map((p) => {
  const entry = PLAN_CATALOG.find((c) => c.id === p.id)
  return {
    ...p,
    price: formatARS(entry?.precio ?? 0),
    priceUSD: formatUSD(entry?.precioUSD ?? 0),
    period: '/mes',
  }
})

export default function StorePage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)
  const [displayedText, setDisplayedText] = useState('')
  const fullText = 'Gestión de abonos para clientes activos de'

  useEffect(() => {
    setDisplayedText('')
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Suscripciones y Tienda | ExeSistemasWEB</title>
      </Helmet>

      <PremiumBackground />

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-24">
        {/* Hero headline with typewriter */}
        <section className="text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-500/80 mb-4">
              Portal de Clientes
            </p>
            <h1 className="text-4xl md:text-6xl font-montserrat font-black text-foreground mb-6">
              Abonos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                Mantenimiento
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-secondary max-w-2xl mx-auto mb-16">
              Suscripciones mensuales para garantizar que tu sistema esté siempre rápido, seguro y
              actualizado. Elegí tu plan correspondiente.
            </p>
          </motion.div>

          {/* Plan cards grid */}
          <PlanGrid plans={PLANS} onSelectPlan={setSelectedPlan} />
        </section>

        {/* Gradient separator */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Portal CTA */}
        <section className="flex justify-center pb-20">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-zinc-100/50 to-zinc-50/20 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full"
          >
            <button
              onClick={() => window.history.back()}
              className="absolute top-4 right-4 p-2 hover:bg-zinc-800/10 dark:hover:bg-white/10 rounded-full transition-colors"
              title="Volver"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="mx-auto w-24 h-24 mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            <div className="text-center mb-8">
              <motion.p className="text-xl md:text-2xl text-foreground mb-4 min-h-[4rem]">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-indigo-400 ml-1 align-middle"
                />
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Exesistemas
                </span>
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>

            <motion.a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = '/#contact'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-2xl text-white font-semibold text-lg text-center transition-all shadow-lg shadow-purple-500/50"
            >
              Portal de Clientes
            </motion.a>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </section>
      </div>

      {/* Checkout modal */}
      {selectedPlan && <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </div>
  )
}
