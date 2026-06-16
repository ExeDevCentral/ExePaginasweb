import { motion } from 'framer-motion'
import {
  Lock,
  Sparkles,
  X,
  Check,
  ArrowRight,
  Monitor,
  Building,
  Building2,
  Palette,
  ShoppingBag,
  Calendar,
  Wallet,
  Globe,
  Copy,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PremiumBackground from '../Effects/PremiumBackground'
import { Helmet } from 'react-helmet-async'
import { useIsMobile } from '../../hooks/useIsMobile'
import { supabase } from '../../core/infra/supabase/client'
import { usePayment } from '../../hooks/usePayment'

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: {
        createOrder: () => Promise<string>
        onApprove: (data: { orderID: string }, actions: { order?: { capture: () => Promise<unknown> } }) => Promise<void>
        onError: (err: unknown) => void
        style?: Record<string, string>
      }) => { render: (sel: string) => void }
    }
  }
}

const TIPO_PROYECTO_OPTIONS = [
  { value: 'mantenimiento', label: 'Mantenimiento', icon: Monitor },
  { value: 'desarrollo', label: 'Desarrollo Web', icon: Palette },
  { value: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
  { value: 'reservas', label: 'Sistema de Reservas', icon: Calendar },
]

const PLANS = [
  {
    id: 'mantenimiento-basico',
    title: 'Abono Básico',
    description: 'Mantenimiento mensual para Landing Pages y sitios institucionales.',
    icon: Monitor,
    price: '$25.000',
    period: '/mes',
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
    icon: Building,
    price: '$50.000',
    period: '/mes',
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
    icon: Building2,
    price: '$150.000',
    period: '/mes',
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

export default function StorePage() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { error: paymentError, reset } = usePayment()
  const [tipoProyecto, setTipoProyecto] = useState('mantenimiento')
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[0] | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const fullText = 'Gestión de abonos para clientes activos de'
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'paypal'>('transfer')
  const [copied, setCopied] = useState(false)

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

  const openCheckout = async (plan: (typeof PLANS)[0]) => {
    setSelectedPlan(plan)
    setShowCheckout(true)
    setPaymentMethod('transfer')
    setCopied(false)
    reset()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      navigate('/login')
      return
    }
  }

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('Exeq90')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const paypalRenderedRef = useRef(false)

  useEffect(() => {
    if (!showCheckout || !selectedPlan || paymentMethod !== 'paypal') return
    if (paypalRenderedRef.current) return

    const price = parseInt(selectedPlan.price.replace(/[^0-9]/g, ''))
    const usdPrice = Math.round(price / 1200)

    const scriptId = 'paypal-sdk'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (script) { script.remove() }

    const renderButton = async () => {
      if (!window.paypal?.Buttons) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        const email = user?.email || ''

        window.paypal.Buttons({
          createOrder: async () => {
            const resp = await fetch('/api/create-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                planId: selectedPlan.id,
                planTitle: selectedPlan.title,
                price: usdPrice,
                email,
                tipoProyecto,
              }),
            })
            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error || 'Error creating order')
            return data.order_id
          },
          onApprove: async (_data) => {
            window.location.href = '/dashboard?payment=paypal_ok'
          },
          onError: (err) => {
            console.error('PayPal Checkout error:', err)
          },
          style: {
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: '45',
          },
        }).render('#paypal-button-container')

        paypalRenderedRef.current = true
      } catch (e) {
        console.error('PayPal render error:', e)
      }
    }

    script = document.createElement('script')
    script.id = scriptId
    script.src = `https://www.paypal.com/sdk/js?client-id=BAAAvwRKJ9kv0-cQu3OgJ4dpcjVTVzozUEkt00PIg2UxxQpwJk-RMIAMct0xwjTBNbMXTVeqhvVH6jkAAQ&currency=USD&intent=capture`
    script.crossOrigin = 'anonymous'
    script.async = true
    script.onload = renderButton
    document.head.appendChild(script)

    return () => {
      paypalRenderedRef.current = false
    }
  }, [showCheckout, selectedPlan, paymentMethod, tipoProyecto])

  const closeCheckout = () => {
    setShowCheckout(false)
    setSelectedPlan(null)
    reset()
  }

  const particles = Array.from({ length: isMobile ? 20 : 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 5 + 3,
    color: i % 2 === 0 ? 'bg-accent-cyan' : 'bg-accent-magenta',
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25 } },
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Suscripciones y Tienda | ExeSistemasWEB</title>
      </Helmet>

      <PremiumBackground />

      <div className="absolute inset-0 pointer-events-none hero-grid opacity-20" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1.5 h-1.5 ${particle.color} rounded-full blur-[1px]`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [particle.scale, particle.scale * 1.5, particle.scale],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-24">
        <section className="text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent-cyan/80 mb-4">
              Portal de Clientes
            </p>
            <h1 className="text-4xl md:text-6xl font-montserrat font-black text-foreground mb-6">
              Abonos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                Mantenimiento
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-secondary max-w-2xl mx-auto mb-16">
              Suscripciones mensuales para garantizar que tu sistema esté siempre rápido, seguro y
              actualizado. Elige tu plan correspondiente.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className={`relative bg-gradient-to-br from-zinc-100/40 to-zinc-50/10 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-xl border rounded-3xl p-8 flex flex-col text-left transition-all duration-300 hover:bg-zinc-200/40 dark:hover:bg-white/10 ${plan.border} ${plan.popular ? 'md:-translate-y-4 shadow-2xl ' + plan.shadow : ''}`}
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-0 right-0 flex justify-center"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 blur-md opacity-50 rounded-full" />
                      <span className="relative bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg border border-white/20">
                        ⭐ MÁS ELEGIDO
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-primary-bg/80 dark:bg-[#050508]/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                    <plan.icon className="w-7 h-7 text-zinc-800 dark:text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.title}</h3>
                <p className="text-primary-secondary text-sm mb-6 h-10">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-black text-foreground">{plan.price}</span>
                  <span className="text-primary-secondary font-medium"> ARS{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
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

                <div className="mt-auto pt-4 min-h-[50px]">
                  <button
                    onClick={() => openCheckout(plan)}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 relative z-20
                      ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.color} shadow-lg ${plan.shadow} hover:opacity-90`
                          : 'bg-zinc-800/10 hover:bg-zinc-800/20 dark:bg-white/10 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/10 text-foreground'
                      }
                    `}
                  >
                    <>
                      <ArrowRight className="w-4 h-4" /> Suscribirme
                    </>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
              className="mx-auto w-24 h-24 mb-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            <div className="text-center mb-8">
              <motion.p className="text-xl md:text-2xl text-foreground mb-4 min-h-[4rem]">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 align-middle"
                />
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
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
              className="block w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-2xl text-white font-semibold text-lg text-center transition-all shadow-lg shadow-purple-500/50"
            >
              Portal de Clientes 🚀
            </motion.a>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </section>
      </div>

      {showCheckout && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeCheckout}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Confirmar suscripción</h2>
              <button onClick={closeCheckout} className="p-2 hover:bg-zinc-800/10 dark:hover:bg-white/5 rounded-xl">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Plan seleccionado</p>
              <p className="text-xl font-bold text-foreground">{selectedPlan.title}</p>
              <p className="text-3xl font-black text-foreground mt-2">
                {selectedPlan.price}{' '}
                <span className="text-sm font-medium text-muted-foreground">ARS{selectedPlan.period}</span>
              </p>
            </div>

            <div className="mb-6">
              <p className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-wider">
                Tipo de proyecto
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIPO_PROYECTO_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipoProyecto(opt.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all border ${
                      tipoProyecto === opt.value
                        ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-bold'
                        : 'border-zinc-200 dark:border-white/10 text-muted-foreground hover:bg-zinc-800/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentError && (
              <p className="text-sm text-red-400 mb-4 bg-red-400/10 rounded-xl p-3">
                {paymentError}
              </p>
            )}

            {/* Selector de Método de Pago */}
            <div className="mb-6">
              <p className="block text-sm font-bold text-foreground/70 mb-3 uppercase tracking-wider">
                Método de Pago
              </p>
              <div className="flex bg-zinc-800/5 dark:bg-white/5 rounded-2xl p-1 border border-zinc-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    paymentMethod === 'transfer'
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-cyan/80 text-white shadow-lg shadow-accent-cyan/15'
                      : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Transferencia (ARS)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-gradient-to-r from-accent-magenta to-accent-magenta/80 text-white shadow-lg shadow-accent-magenta/15'
                      : 'text-muted-foreground hover:text-foreground hover:bg-zinc-800/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  PayPal (USD)
                </button>
              </div>
            </div>

            {/* Contenido según Método de Pago */}
            <div className={paymentMethod === 'transfer' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div className="bg-zinc-800/5 dark:bg-gradient-to-br dark:from-white/[0.04] dark:to-transparent border border-zinc-200 dark:border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-accent-cyan/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Plataforma</span>
                    <span className="text-accent-cyan font-bold bg-accent-cyan/10 px-2 py-0.5 rounded-lg border border-accent-cyan/20">
                      Personal Pay
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Titular</span>
                    <span className="text-foreground font-medium">Exequiel Echevarria</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Alias</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono font-bold bg-zinc-800/10 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/5">
                        Exeq90
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAlias}
                        className="p-2 bg-zinc-800/10 hover:bg-zinc-800/20 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg border border-zinc-200 dark:border-white/10 text-foreground hover:text-accent-cyan transition-all"
                        title="Copiar Alias"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400 animate-pulse" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/5493416874786?text=¡Hola%20Exequiel!%20Acabo%20de%20realizar%20la%20transferencia%20para%20el%20plan%20*${encodeURIComponent(selectedPlan.title)}*%20(${selectedPlan.price}%20ARS/mes)%20del%20proyecto%20*${tipoProyecto}*.%20Aquí%20tienes%20el%20comprobante.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-accent-cyan to-accent-cyan/80 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/25"
                >
                  Enviar Comprobante por WhatsApp
                </a>
              </div>
            </div>

            <div className={paymentMethod === 'paypal' ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div id="paypal-button-container" ref={paypalContainerRef} className="min-h-[50px]" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Pago verificado de forma segura. Podés cancelar tu abono cuando quieras desde tu
              panel.
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
