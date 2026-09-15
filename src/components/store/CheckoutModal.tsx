/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Globe,
  Monitor,
  Palette,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  LogIn,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuthSession } from '../../core/auth/AuthSessionProvider'
import TransferInstructions from './TransferInstructions'
import type { PlanData } from './PlanCard'

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: {
        style?: Record<string, string>
        createOrder: () => Promise<string>
        onApprove: (data: { orderID: string }) => void
        onCancel?: () => void
        onError?: () => void
      }) => {
        render: (sel: string) => Promise<void>
      }
    }
  }
}

const TIPO_PROYECTO_OPTIONS = [
  { value: 'mantenimiento', label: 'Mantenimiento', icon: Monitor },
  { value: 'desarrollo', label: 'Desarrollo Web', icon: Palette },
  { value: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag },
  { value: 'reservas', label: 'Sistema de Reservas', icon: Calendar },
]

type PaypalStatus = 'idle' | 'login' | 'loading' | 'ready' | 'error' | 'approval-error' | 'success'

interface CheckoutModalProps {
  plan: PlanData
  initialMethod?: 'transfer' | 'paypal'
  onClose: () => void
}

export default function CheckoutModal({
  plan,
  initialMethod = 'transfer',
  onClose,
}: CheckoutModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { session } = useAuthSession()
  const [tipoProyecto, setTipoProyecto] = useState('mantenimiento')
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'paypal'>(initialMethod)
  const [paypalStatus, setPaypalStatus] = useState<PaypalStatus>('idle')
  const [paypalError, setPaypalError] = useState('')
  const [renderNonce, setRenderNonce] = useState(0)

  useEffect(() => {
    if (paymentMethod !== 'paypal' || !plan) {
      setPaypalStatus('idle')
      return
    }

    if (!session?.access_token) {
      setPaypalStatus('login')
      return
    }

    let cancelled = false
    let renderTimeout: ReturnType<typeof setTimeout>

    const doRender = () => {
      if (cancelled || !window.paypal?.Buttons) return
      const paypal = window.paypal
      setPaypalStatus('ready')
      renderTimeout = setTimeout(() => {
        if (cancelled) return
        paypal
          .Buttons({
            style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
            createOrder: async () => {
              const resp = await fetch('/api/paypal/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ planSlug: plan.id, tipoProyecto }),
              })
              const json = await resp.json().catch(() => ({}))
              if (!resp.ok || !json?.id) {
                throw new Error(json?.error || 'No se pudo iniciar el pago con PayPal.')
              }
              return json.id as string
            },
            onApprove: async (data: { orderID: string }) => {
              try {
                const resp = await fetch('/api/paypal/capture', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                  },
                  body: JSON.stringify({ orderId: data.orderID }),
                })
                const json = await resp.json().catch(() => ({}))
                if (!resp.ok) {
                  setPaypalError(json?.error || 'No se pudo confirmar el pago.')
                  setPaypalStatus('approval-error')
                  return
                }
                setPaypalStatus('success')
              } catch {
                setPaypalError('Error de conexión al confirmar el pago.')
                setPaypalStatus('approval-error')
              }
            },
            onCancel: () => {
              if (!cancelled) setPaypalStatus('ready')
            },
            onError: () => {
              if (!cancelled) setPaypalStatus('error')
            },
          })
          .render('#paypal-container')
          .catch(() => {
            if (!cancelled) setPaypalStatus('error')
          })
      }, 0)
    }

    const ensureSdk = () => {
      if (window.paypal?.Buttons) {
        doRender()
        return
      }
      const scriptId = 'paypal-checkout-sdk'
      if (document.getElementById(scriptId)) {
        doRender()
        return
      }
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}&components=buttons&disable-funding=venmo&currency=USD&intent=capture`
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        if (window.paypal?.Buttons) doRender()
        else if (!cancelled) setPaypalStatus('error')
      }
      script.onerror = () => {
        if (!cancelled) setPaypalStatus('error')
      }
      document.head.appendChild(script)
    }

    setPaypalStatus('loading')
    ensureSdk()

    const timeoutId = setTimeout(() => {
      if (!cancelled && !window.paypal?.Buttons) setPaypalStatus('error')
    }, 30000)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      clearTimeout(renderTimeout)
      const container = document.getElementById('paypal-container')
      if (container) container.innerHTML = ''
    }
  }, [paymentMethod, plan, session?.access_token, tipoProyecto, renderNonce])

  const retrySdk = () => {
    setPaypalError('')
    setPaypalStatus('loading')
    setRenderNonce((n) => n + 1)
  }

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
            <h2 className="text-2xl font-bold text-foreground">{t('store.checkout_titulo')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800/10 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Plan summary */}
          <div className="relative bg-zinc-800/5 dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t('store.checkout_plan')}</p>
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
                onClick={() => {
                  setPaypalError('')
                  setPaymentMethod('paypal')
                }}
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
                planSlug={plan.id}
                planTitle={plan.title}
                planPrice={plan.price}
                projectType={tipoProyecto}
              />
            ) : paypalStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center"
              >
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                <p className="text-lg font-bold text-foreground mt-3">
                  Pago aprobado correctamente
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tu abono quedó activado. Ya podés ingresar a tu panel.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full mt-4 py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-emerald-400 hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
                >
                  Ir al Dashboard
                </button>
              </motion.div>
            ) : paypalStatus === 'login' ? (
              <div className="space-y-3 text-center">
                <LogIn className="w-8 h-8 mx-auto text-accent-magenta" />
                <p className="text-sm text-muted-foreground">
                  Iniciá sesión para pagar con PayPal.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-accent-magenta to-accent-magenta/80 hover:opacity-90 transition-all shadow-lg shadow-accent-magenta/25"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  O pagá por transferencia bancaria
                </button>
              </div>
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
                      onClick={retrySdk}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline hover:text-accent-magenta"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reintentar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className="text-xs text-muted-foreground underline hover:text-foreground"
                    >
                      Probá con transferencia bancaria
                    </button>
                  </div>
                )}
                {paypalStatus === 'approval-error' && (
                  <div className="text-center min-h-[50px] flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-accent-magenta">{paypalError}</p>
                    <button
                      type="button"
                      onClick={retrySdk}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline hover:text-accent-magenta"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reintentar
                    </button>
                  </div>
                )}
                {(paypalStatus === 'ready' ||
                  paypalStatus === 'loading' ||
                  paypalStatus === 'error' ||
                  paypalStatus === 'approval-error') && (
                  <div id="paypal-container" className="min-h-[50px]" />
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
