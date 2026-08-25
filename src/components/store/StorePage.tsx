'use client'

import { motion } from 'framer-motion'
import {
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  Volume2,
  VolumeX,
  Coins,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Monitor,
  Building,
  Building2,
  type LucideIcon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useTypewriter } from '../../hooks/useTypewriter'
import { PLAN_CATALOG } from '../../core/domain/planCatalog'
import { useTheme } from '../../core/theme/ThemeContext'
import type { PlanData } from './PlanCard'
import PlanGrid from './PlanGrid'
import CheckoutModal from './CheckoutModal'
import StoreNexusBackground from './StoreNexusBackground'
import StoreTelemetryHUD from './StoreTelemetryHUD'
import PlanComparisonMatrix from './PlanComparisonMatrix'
import StoreGuarantees from './StoreGuarantees'
import { storeAudio } from '../../core/utils/storeAudio'
import { toast } from 'sonner'

const basePlans: Omit<PlanData, 'price' | 'priceUSD' | 'period' | 'rawPriceARS' | 'rawPriceUSD'>[] =
  [
    {
      id: 'mantenimiento-basico',
      title: 'Abono Básico',
      description: 'Mantenimiento mensual para Landing Pages y sitios institucionales.',
      icon: Monitor as LucideIcon,
      color: 'from-blue-400 to-cyan-400',
      shadow: 'shadow-cyan-500/20',
      border: 'border-cyan-500/30',
      features: [
        'Hosting de alta velocidad Vercel Edge',
        'Renovación de dominio anual (.com / .ar)',
        'Actualizaciones continuas de seguridad',
        'Certificado SSL bancario automático',
        'Soporte técnico estándar por ticket',
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
        'Gestión y monitoreo de Base de Datos',
        'Backups diarios automáticos en la nube',
        'Monitoreo de pasarelas de pago y webhooks',
        'Soporte técnico prioritario por WhatsApp',
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
        'Servidor Edge de máxima prioridad y SLA',
        'Bolsa de horas de desarrollo (2hs/mes)',
        'Consultoría estratégica de crecimiento',
        'Account Manager e informes de métricas',
      ],
      popular: false,
    },
  ]

const formatARS = (n: number) => '$' + n.toLocaleString('es-AR').replace(/,/g, '.')
const formatUSD = (n: number) => '$' + n

const PLANS: PlanData[] = basePlans.map((p) => {
  const entry = PLAN_CATALOG.find((c) => c.id === p.id)
  const rawARS = entry?.precio ?? 0
  const rawUSD = entry?.precioUSD ?? 0
  return {
    ...p,
    rawPriceARS: rawARS,
    rawPriceUSD: rawUSD,
    price: formatARS(rawARS),
    priceUSD: formatUSD(rawUSD),
    period: '/mes',
  }
})

export default function StorePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { theme, setTheme } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)

  // Interactive controls
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const [isAnnual, setIsAnnual] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    setSoundEnabled(storeAudio.isEnabled())
  }, [])

  const fullText = t('store.gestion_abonos') || 'Gestión de abonos para clientes activos de'
  const { typedText: displayedText } = useTypewriter(fullText, { typingSpeed: 30 })

  const isDark = theme === 'dark'

  const handleToggleTheme = () => {
    storeAudio.playToggle()
    const nextTheme = isDark ? 'light' : 'dark'
    setTheme(nextTheme)
    toast.success(nextTheme === 'light' ? '☀️ Tema Claro Activado' : '🌙 Tema Oscuro Activado')
  }

  const handleToggleSound = () => {
    const nextVal = storeAudio.toggle()
    setSoundEnabled(nextVal)
    if (nextVal) {
      storeAudio.playHover()
      toast.success('🔊 Efectos de sonido activados')
    } else {
      toast.info('🔇 Efectos de sonido silenciados')
    }
  }

  const handleCurrencyChange = (curr: 'ARS' | 'USD') => {
    storeAudio.playToggle()
    setCurrency(curr)
  }

  const handleBillingChange = (annual: boolean) => {
    storeAudio.playToggle()
    setIsAnnual(annual)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      {/* Dynamic 3D Quantum Cyber Grid & Aurora Background */}
      <StoreNexusBackground />

      <div className="relative max-w-7xl mx-auto z-10 space-y-10">
        {/* NAVEGACIÓN SUPERIOR ELEGANTE */}
        <header className="flex items-center justify-between max-w-6xl mx-auto pt-2">
          <button
            type="button"
            onClick={() => {
              storeAudio.playHover()
              navigate('/')
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border text-foreground font-bold text-xs hover:border-accent-cyan transition-all hover:scale-105 shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-accent-cyan" />
            <span>Volver al Inicio</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
              aria-label="Alternar sonido"
              className="p-2.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border text-foreground hover:border-accent-cyan transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-accent-cyan" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs font-mono hidden sm:inline">
                {soundEnabled ? 'Audio ON' : 'Mute'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              title={isDark ? 'Cambiar a Tema Claro (Sol)' : 'Cambiar a Tema Oscuro (Luna)'}
              aria-label="Cambiar tema de la aplicación"
              className="p-2.5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border text-foreground hover:border-accent-cyan transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
              <span className="text-xs font-bold font-mono">
                {isDark ? '☀️ Claro' : '🌙 Oscuro'}
              </span>
            </button>
          </div>
        </header>

        {/* HERO HEADLINE & BADGE */}
        <section className="text-center pt-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-xs font-mono font-bold tracking-[0.25em] uppercase mb-4 shadow-lg shadow-accent-cyan/10">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('store.portal_clientes')} • CLOUD NEXUS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-montserrat font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Abonos de{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mantenimiento
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
              {t('store.descripcion')}
            </p>
          </motion.div>

          {/* TELEMETRY HUD */}
          <StoreTelemetryHUD />

          {/* CONTROLES DINÁMICOS: MONEDA & CICLO DE FACTURACIÓN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12"
          >
            {/* Currency Selector */}
            <div className="inline-flex items-center gap-1.5 bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => handleCurrencyChange('ARS')}
                className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  currency === 'ARS'
                    ? 'bg-gradient-to-r from-accent-cyan to-cyan-500 text-black shadow-lg shadow-accent-cyan/25'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Coins size={14} />
                <span>ARS ($)</span>
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange('USD')}
                className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-gradient-to-r from-accent-magenta to-pink-500 text-white shadow-lg shadow-accent-magenta/25'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Coins size={14} />
                <span>USD (u$s)</span>
              </button>
            </div>

            {/* Billing Frequency Selector */}
            <div className="inline-flex items-center gap-1.5 bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => handleBillingChange(false)}
                className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isAnnual
                    ? 'bg-muted text-foreground border border-border shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Calendar size={14} />
                <span>Mensual</span>
              </button>
              <button
                type="button"
                onClick={() => handleBillingChange(true)}
                className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isAnnual
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] font-black uppercase bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                  20% OFF
                </span>
              </button>
            </div>
          </motion.div>

          {/* PLAN CARDS GRID */}
          <PlanGrid
            plans={PLANS}
            currency={currency}
            isAnnual={isAnnual}
            onSelectPlan={setSelectedPlan}
          />

          {/* DETAILED COMPARISON MATRIX */}
          <PlanComparisonMatrix />
        </section>

        {/* TRUST GUARANTEES & FAQS */}
        <StoreGuarantees />

        {/* VIP CLIENT PORTAL & CONCIERGE CTA */}
        <section className="flex justify-center pb-16">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-card/85 backdrop-blur-2xl border border-border/80 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-xl w-full text-center overflow-hidden"
          >
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="mx-auto w-20 h-20 mb-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            <div className="mb-8">
              <p className="text-lg sm:text-xl text-foreground mb-3 font-medium min-h-[3rem]">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-indigo-400 ml-1 align-middle"
                />
              </p>

              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-cyan" />
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-montserrat">
                  ExeSistemasWEB
                </span>
                <Sparkles className="w-5 h-5 text-accent-magenta" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault()
                  storeAudio.playHover()
                  navigate('/#contact')
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 rounded-2xl text-white font-bold text-sm text-center transition-all shadow-xl shadow-purple-500/40 cursor-pointer"
              >
                Acceder al Portal de Clientes
              </motion.a>

              <motion.a
                href="https://wa.me/5491168340150?text=Hola%20ExeSistemasWEB,%20quiero%20consultar%20por%20los%20abonos%20de%20mantenimiento"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto py-4 px-5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Concierge</span>
              </motion.a>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </div>
  )
}
