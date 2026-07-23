import { useEffect, useState, lazy, Suspense } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../core/infra/supabase/client'
import {
  Crown,
  RefreshCw,
  Users,
  Package,
  Shield,
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react'

const PremiumBackground = lazy(() => import('../components/Effects/PremiumBackground'))
import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTenant } from '../hooks/useTenant'
import ClientDashboard from '../components/dashboard/ClientDashboard'
import AdminDashboardView from '../components/dashboard/AdminDashboardView'
import OnboardingWizard from '../components/dashboard/OnboardingWizard'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// Lazy loaded panels
const WorkGroupsPanel = lazy(() => import('../components/workgroups/WorkGroupsPanel'))
const ServicesPanel = lazy(() => import('../components/services/ServicesPanel'))
const SLADashboard = lazy(() => import('../components/sla/SLADashboard'))
const InvoicesPanel = lazy(() => import('../components/invoices/InvoicesPanel'))

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-muted/30 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
)

const PanelSkeleton = () => (
  <div className="rounded-3xl border border-border bg-primary-bg/50 p-8 backdrop-blur-xl space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-6 w-48 rounded-lg" />
        <SkeletonBlock className="h-4 w-72 rounded-lg" />
      </div>
      <SkeletonBlock className="h-10 w-28 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonBlock className="h-32 rounded-2xl animate-pulse" />
      <SkeletonBlock className="h-32 rounded-2xl animate-pulse" />
      <SkeletonBlock className="h-32 rounded-2xl animate-pulse" />
    </div>
    <div className="space-y-4">
      <SkeletonBlock className="h-12 w-full rounded-xl" />
      <SkeletonBlock className="h-12 w-full rounded-xl" />
      <SkeletonBlock className="h-12 w-full rounded-xl" />
    </div>
  </div>
)

type DashboardView = 'overview' | 'services' | 'workgroups' | 'sla' | 'invoices' | 'admin'

const VIEW_TABS: { id: DashboardView; labelKey: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', labelKey: 'dashboard.tab_resumen', icon: LayoutDashboard },
  { id: 'services', labelKey: 'dashboard.tab_servicios', icon: Package },
  { id: 'workgroups', labelKey: 'dashboard.tab_equipo', icon: Users },
  { id: 'sla', labelKey: 'dashboard.tab_sla', icon: Shield },
  { id: 'invoices', labelKey: 'dashboard.tab_facturas', icon: FileText },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard(
    ready && !!session
  )
  const { role } = useAuthRole()
  const isAdmin = role === 'admin'
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin')
  const [activeView, setActiveView] = useState<DashboardView>('overview')

  const { data: tenants = [] } = useTenant(cliente?.id ?? null, ready && !!session && !!cliente?.id)

  const currentTenant = tenants[0] || null

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
      setSearchParams({}, { replace: true })
      refresh()
      toast.success('Pago aprobado', {
        description:
          payment === 'paypal_ok'
            ? 'Pago con PayPal confirmado'
            : 'Suscripcion activada correctamente',
      })
    }
  }, [searchParams, setSearchParams, refresh])

  useEffect(() => {
    if (!ready) return
    if (!session) navigate('/login', { replace: true })
  }, [ready, session, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const isGlobalLoading = !ready || loading || (isAdmin && viewMode === 'admin' && adminLoading)

  if (isGlobalLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <Suspense fallback={null}>
          <PremiumBackground />
        </Suspense>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-card/50 border border-border backdrop-blur-xl flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground font-medium"
          >
            {t('dashboard.sincronizando')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-xs text-muted-foreground font-mono"
          >
            dashboard.exe · loading
          </motion.p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        <Suspense fallback={null}>
          <PremiumBackground />
        </Suspense>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-xl w-full rounded-3xl border border-accent-magenta/30 bg-card/50 p-8 backdrop-blur-xl"
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
    <div className="min-h-screen relative">
      <Suspense fallback={null}>
        <PremiumBackground />
      </Suspense>
      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
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

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('dashboard.salir')}
            </button>
          </div>

          {/* Admin Toggle */}
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
                        : t('dashboard.vista_cliente_activa')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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

          {/* Admin View */}
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
          ) : !currentTenant && cliente ? (
            <OnboardingWizard
              cliente={cliente}
              planTier={planTier}
              onComplete={async () => {
                await queryClient.invalidateQueries({ queryKey: ['tenant'] })
                await refresh()
              }}
            />
          ) : (
            <>
              {/* SaaS Navigation Tabs */}
              <div className="mb-6 flex items-center gap-1 p-1 bg-muted/50 rounded-2xl border border-border overflow-x-auto">
                {VIEW_TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveView(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        activeView === tab.id
                          ? 'bg-accent-cyan text-foreground shadow-lg shadow-accent-cyan/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t(tab.labelKey)}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Suspense fallback={<PanelSkeleton />}>
                    {activeView === 'overview' && (
                      <ClientDashboard
                        planTier={planTier}
                        cliente={cliente}
                        suscripciones={suscripciones}
                        pagos={pagos}
                        onRefresh={refresh}
                        refreshing={loading}
                        onLogout={handleLogout}
                      />
                    )}
                    {activeView === 'services' && currentTenant && (
                      <ServicesPanel tenantId={currentTenant.id} />
                    )}
                    {activeView === 'workgroups' && currentTenant && (
                      <WorkGroupsPanel tenantId={currentTenant.id} />
                    )}
                    {activeView === 'sla' && currentTenant && (
                      <SLADashboard tenantId={currentTenant.id} />
                    )}
                    {activeView === 'invoices' && currentTenant && (
                      <InvoicesPanel tenantId={currentTenant.id} />
                    )}
                    {activeView !== 'overview' && !currentTenant && (
                      <div className="text-center py-16">
                        <Settings className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground">
                          {t('dashboard.configura_espacio')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                          {t('dashboard.compra_plan_hint')}
                        </p>
                      </div>
                    )}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
