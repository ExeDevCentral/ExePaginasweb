import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'
import { Crown, RefreshCw, CheckCircle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'
import { ADMIN_EMAILS } from '../core/auth/roleConfig'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import ClientDashboard from '../components/dashboard/ClientDashboard'
import type { PlanTier } from '../components/dashboard/resolvePlanTier'

const PREVIEW_TIERS: PlanTier[] = ['basico', 'avanzado', 'premium']

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard(
    ready && !!session
  )
  const { role } = useAuthRole(ADMIN_EMAILS)
  const isAdmin = role === 'admin'
  const [paymentBanner, setPaymentBanner] = useState<string | null>(null)

  useEffect(() => {
    const payment = searchParams.get('payment')
    const pago = searchParams.get('pago')
    if (pago === 'ok' || payment === 'mp_ok' || payment === 'paypal_ok') {
      setPaymentBanner(payment || 'mp_ok')
      setSearchParams({}, { replace: true })
      refresh()
      setTimeout(() => setPaymentBanner(null), 8000)
    }
  }, [searchParams, setSearchParams, refresh])

  const previewTier = searchParams.get('tier') as PlanTier | null
  const activeTier = useMemo(() => {
    if (previewTier && PREVIEW_TIERS.includes(previewTier)) return previewTier
    return planTier
  }, [previewTier, planTier])

  useEffect(() => {
    if (!ready) return
    if (!session) navigate('/login', { replace: true })
  }, [ready, session, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!ready || loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-secondary font-medium">Sincronizando tu panel...</p>
          <p className="mt-2 text-xs text-white/30 font-mono">dashboard.exe · loading</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full rounded-3xl border border-accent-magenta/30 bg-primary-bg/50 p-8 backdrop-blur-xl"
        >
          <h1 className="text-2xl font-bold text-white">Error de conexión</h1>
          <p className="mt-3 text-accent-magenta text-sm font-bold">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 font-bold text-[#050508]"
          >
            Volver a Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <motion.a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Volver a ExePaginasWEB
          </motion.a>
        </div>
        {paymentBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">¡Pago aprobado!</p>
                <p className="text-sm text-white/60">
                  {paymentBanner === 'paypal_ok'
                    ? 'Tu pago vía PayPal fue procesado correctamente. Ya podés acceder a tu plan.'
                    : 'Tu suscripción está activa. Bienvenido a tu panel de cliente.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent p-6 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-400 font-bold">
                  Super Admin
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Vista previa:{' '}
                  <span className="font-mono text-yellow-300">
                    ?tier=basico | avanzado | premium
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="p-3 rounded-xl border border-white/10 hover:bg-white/5"
              >
                <RefreshCw
                  size={18}
                  className={loading ? 'animate-spin text-yellow-400' : 'text-white/60'}
                />
              </button>
            </div>
          </motion.div>
        )}

        {previewTier && PREVIEW_TIERS.includes(previewTier) && (
          <p className="mb-4 text-center text-xs font-mono text-accent-cyan/80">
            preview mode · tier={previewTier}
          </p>
        )}

        <ClientDashboard
          planTier={activeTier}
          cliente={cliente}
          suscripciones={suscripciones}
          pagos={pagos}
          onRefresh={refresh}
          refreshing={loading}
          onLogout={handleLogout}
        />
      </div>
    </div>
  )
}
