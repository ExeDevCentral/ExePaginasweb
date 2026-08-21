'use client'

import { motion } from 'framer-motion'
import { Sparkles, X, Sun, Moon, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useTypewriter } from '../../hooks/useTypewriter'
import { PLAN_CATALOG } from '../../core/domain/planCatalog'
import { useTheme } from '../../core/theme/ThemeContext'
import { Monitor, Building, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PlanData } from './PlanCard'
import PlanGrid from './PlanGrid'
import CheckoutModal from './CheckoutModal'
import { toast } from 'sonner'

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
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { theme, setTheme } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)

  const fullText = t('store.gestion_abonos')
  const { typedText: displayedText } = useTypewriter(fullText, { typingSpeed: 30 })

  const isDark = theme === 'dark'

  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark'
    setTheme(nextTheme)
    toast.success(nextTheme === 'light' ? '☀️ Tema Claro' : '🌙 Tema Oscuro')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-10 px-4 sm:px-6 lg:px-8">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-12">
        {/* NAVEGACIÓN TOP ELEGANTE Y LIMPIA */}
        <div className="flex items-center justify-between max-w-6xl mx-auto pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground font-bold text-xs hover:border-accent-cyan transition-all hover:scale-105 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-accent-cyan" />
            <span>Volver al Inicio</span>
          </button>

          <button
            type="button"
            onClick={handleToggleTheme}
            title={isDark ? 'Cambiar a Tema Claro (Sol)' : 'Cambiar a Tema Oscuro (Luna)'}
            aria-label="Cambiar tema de la aplicación"
            className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:border-accent-cyan transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-xs font-bold font-mono">{isDark ? '☀️ Claro' : '🌙 Oscuro'}</span>
          </button>
        </div>

        {/* Hero headline with typewriter */}
        <section className="text-center pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-accent-cyan mb-4">
              {t('store.portal_clientes')}
            </p>
            <h1 className="text-4xl md:text-6xl font-montserrat font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              {t('store.subtitulo')}
            </h1>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              {t('store.descripcion')}
            </p>
          </motion.div>

          {/* Plan cards grid */}
          <PlanGrid plans={PLANS} onSelectPlan={setSelectedPlan} />
        </section>

        {/* Gradient separator */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Portal CTA */}
        <section className="flex justify-center pb-20">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-card backdrop-blur-xl border border-border rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full"
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
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
              href="/#contact"
              onClick={(e) => {
                e.preventDefault()
                navigate('/#contact')
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
        </section>
      </div>

      {/* Checkout modal */}
      {selectedPlan && <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </div>
  )
}
