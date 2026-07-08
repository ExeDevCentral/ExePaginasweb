import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'
import { Crown, RefreshCw, CheckCircle } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import ClientDashboard from '../components/dashboard/ClientDashboard'
import type { PlanTier } from '../components/dashboard/resolvePlanTier'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import AdminDashboardView from '../components/dashboard/AdminDashboardView'
import { useTranslation } from 'react-i18next'
import { sileo } from 'sileo'

const PREVIEW_TIERS: PlanTier[] = ['basico', 'avanzado', 'premium']

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard(
    ready && !!session
  )
  const { role } = useAuthRole()
  const isAdmin = role === 'admin'
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin')
  const [paymentBanner, setPaymentBanner] = useState<string | null>(null)

  const {
    loading: adminLoading,
    clientes: adminClientes,
    suscripciones: adminSuscripciones,
    pagos: adminPagos,
    tickets: adminTickets,
    stats: adminStats,
    refresh: refreshAdmin,
  } = useAdminDashboard(ready && !!session && isAdmin && viewMode === 'admin')

  useEffect(() => {
    const payment = searchParams.get('payment')
    const pago = searchParams.get('pago')
    if (pago === 'ok' || payment === 'mp_ok' || payment === 'paypal_ok') {
      setPaymentBanner(payment || 'mp_ok')
      setSearchParams({}, { replace: true })
      refresh()
      sileo.success({
        title: 'Pago aprobado',
        description:
          payment === 'paypal_ok'
            ? 'Pago con PayPal confirmado'
            : 'Suscripción activada correctamente',
      })
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
    sileo.success({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const isGlobalLoading = !ready || loading || (isAdmin && viewMode === 'admin' && adminLoading)

  if (isGlobalLoading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-secondary font-medium">{t('dashboard.sincronizando')}</p>
          <p className="mt-2 text-xs text-muted-foreground font-mono">dashboard.exe · loading</p>
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
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.error_conexion_titulo')}
          </h1>
          <p className="mt-3 text-accent-magenta text-sm font-bold">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta py-4 font-bold text-foreground"
          >
            {t('dashboard.volver_login')}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground/80 hover:text-foreground hover:bg-muted hover:border-border transition-all text-sm font-medium"
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
            {t('dashboard.volver_exepaginasweb')}
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
                <p className="text-lg font-bold text-foreground">
                  {t('dashboard.pago_aprobado_titulo')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentBanner === 'paypal_ok'
                    ? t('dashboard.pago_aprobado_paypal')
                    : t('dashboard.pago_aprobado_suscripcion')}
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
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-400 font-bold">
                    {t('dashboard.super_admin')}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {viewMode === 'admin'
                      ? t('dashboard.consola_central_operativa')
                      : t('dashboard.vista_previa_activa', { activeTier })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Segmented Control */}
                <div className="flex bg-muted p-1 rounded-2xl border border-border">
                  <button
                    onClick={() => setViewMode('admin')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      viewMode === 'admin'
                        ? 'bg-yellow-400 text-foreground shadow-lg shadow-yellow-400/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('dashboard.consola_admin')}
                  </button>
                  <button
                    onClick={() => setViewMode('client')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      viewMode === 'client'
                        ? 'bg-yellow-400 text-foreground shadow-lg shadow-yellow-400/20'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t('dashboard.simular_cliente')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => (viewMode === 'admin' ? refreshAdmin() : refresh())}
                  disabled={loading || adminLoading}
                  className="p-3 rounded-xl border border-border hover:bg-muted"
                >
                  <RefreshCw
                    size={18}
                    className={
                      loading || adminLoading
                        ? 'animate-spin text-yellow-400'
                        : 'text-muted-foreground'
                    }
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {previewTier && PREVIEW_TIERS.includes(previewTier) && (
          <p className="mb-4 text-center text-xs font-mono text-accent-cyan/80">
            preview mode · tier={previewTier}
          </p>
        )}

        {isAdmin && viewMode === 'admin' ? (
          <AdminDashboardView
            clientes={adminClientes}
            suscripciones={adminSuscripciones}
            pagos={adminPagos}
            tickets={adminTickets}
            stats={adminStats}
            onRefresh={refreshAdmin}
            refreshing={adminLoading}
          />
        ) : (
          <ClientDashboard
            planTier={activeTier}
            cliente={cliente}
            suscripciones={suscripciones}
            pagos={pagos}
            onRefresh={refresh}
            refreshing={loading}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  )
}
