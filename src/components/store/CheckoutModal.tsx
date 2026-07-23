import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Monitor, Palette, ShoppingBag, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../core/infra/supabase/client'
import TransferInstructions from './TransferInstructions'
import type { PlanData } from './PlanCard'

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (opts: { hostedButtonId: string }) => { render: (sel: string) => void }
    }
  }
}

const TIPO_PROYECTO_OPTIONS = [
  { value: 'mantenimiento', label: 'Mantenimiento', icon: Monitor },
  { value: 'desarrollo', label: 'Desarrollo Web', icon: Palette },
  { value: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
  { value: 'reservas', label: 'Sistema de Reservas', icon: Calendar },
]

const HOSTED_BUTTONS: Record<string, string> = {
  'mantenimiento-basico': '27YN9Y5VT3UVQ',
  'mantenimiento-avanzado': 'Y88QXE3UHZNHE',
  'mantenimiento-premium': 'LMKVPLYDGVXJC',
}

interface CheckoutModalProps {
  plan: PlanData
  onClose: () => void
}

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const navigate = useNavigate()
  const [tipoProyecto, setTipoProyecto] = useState('mantenimiento')
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'paypal'>('transfer')
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        navigate('/login')
        return
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    if (paymentMethod !== 'paypal' || !plan) {
      setPaypalStatus('idle')
      return
    }

    const buttonId = HOSTED_BUTTONS[plan.id]
    if (!buttonId) return

    setPaypalStatus('loading')

    const containerId = `paypal-container-${buttonId}`
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    const renderButton = () => {
      if (!window.paypal?.HostedButtons) {
        timeoutId = setTimeout(renderButton, 500)
        return
      }
      if (cancelled) return
      setPaypalStatus('ready')
      window.paypal.HostedButtons({ hostedButtonId: buttonId }).render(`#${containerId}`)
    }

    if (window.paypal?.HostedButtons) {
      renderButton()
    } else {
      const scriptId = 'paypal-hosted-sdk'
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script')
        script.id = scriptId
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || ''}&components=hosted-buttons&disable-funding=venmo&currency=USD`
        script.crossOrigin = 'anonymous'
        script.onload = () => {
          if (window.paypal?.HostedButtons) renderButton()
          else if (!cancelled) setPaypalStatus('error')
        }
        script.onerror = () => {
          if (!cancelled) setPaypalStatus('error')
        }
        document.head.appendChild(script)
      } else {
        renderButton()
      }
    }

    timeoutId = setTimeout(() => {
      if (!cancelled && !window.paypal?.HostedButtons) {
        setPaypalStatus('error')
      }
    }, 30000)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      const container = document.getElementById(containerId)
      if (container) container.innerHTML = ''
    }
  }, [paymentMethod, plan])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 60, rotateX: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 60, rotateX: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{ perspective: 1000 }}
          className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-magenta/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Confirmar suscripción</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800/10 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Plan summary */}
          <div className="relative bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Plan seleccionado</p>
            <p className="text-xl font-bold text-foreground">{plan.title}</p>
            <p className="text-3xl font-black text-foreground mt-2">
              {paymentMethod === 'paypal' ? plan.priceUSD : plan.price}{' '}
              <span className="text-sm font-medium text-muted-foreground">
                {paymentMethod === 'paypal' ? 'USD' : 'ARS'}
                {plan.period}
              </span>
            </p>
          </div>

          {/* Project type selector */}
          <div className="relative mb-6">
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

          {/* Payment method toggle */}
          <div className="relative mb-6">
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

          {/* Payment content */}
          <div className="relative">
            {paymentMethod === 'transfer' ? (
              <TransferInstructions
                planTitle={plan.title}
                planPrice={plan.price}
                projectType={tipoProyecto}
              />
            ) : (
              <div className="space-y-4">
                {paypalStatus === 'loading' && (
                  <div className="flex items-center justify-center min-h-[50px]">
                    <div className="w-6 h-6 border-2 border-accent-magenta border-t-transparent rounded-full animate-spin" />
                    <span className="ml-3 text-sm text-muted-foreground">Cargando PayPal...</span>
                  </div>
                )}
                {paypalStatus === 'error' && (
                  <div className="text-center min-h-[50px] flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-accent-magenta">No se pudo cargar PayPal</p>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className="text-xs text-muted-foreground underline hover:text-foreground"
                    >
                      Probá con transferencia bancaria
                    </button>
                  </div>
                )}
                {paypalStatus === 'ready' && HOSTED_BUTTONS[plan.id] && (
                  <div
                    id={`paypal-container-${HOSTED_BUTTONS[plan.id]}`}
                    className="min-h-[50px]"
                  />
                )}
              </div>
            )}
          </div>

          <p className="relative text-xs text-muted-foreground text-center mt-4">
            Pago verificado de forma segura. Podés cancelar tu abono cuando quieras desde tu panel.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
