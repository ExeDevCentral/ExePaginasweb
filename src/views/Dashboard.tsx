'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
} from 'lucide-react'

import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTenant } from '../hooks/useTenant'
import ClientDashboard from '../components/dashboard/ClientDashboard'
import AdminDashboardView from '../components/dashboard/AdminDashboardView'
import OnboardingWizard from '../components/dashboard/OnboardingWizard'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PanelErrorBoundary from '../components/dashboard/PanelErrorBoundary'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { queryKeys } from '../core/infra/query/queryKeys'
import { SupabaseTenantServiceRepository } from '../core/infra/repositories/SupabaseTenantServiceRepository'
import { SupabaseInvoiceRepository } from '../core/infra/repositories/SupabaseInvoiceRepository'
import { PREMIUM_TOKENS } from '../styles/premium-tokens'

import { lazyWithRetry } from '../utils/lazyWithRetry'

// Lazy loaded panels con reintento automático ante nuevos despliegues
const WorkGroupsPanel = lazyWithRetry(() => import('../components/workgroups/WorkGroupsPanel'))
const ServicesPanel = lazyWithRetry(() => import('../components/services/ServicesPanel'))
const SLADashboard = lazyWithRetry(() => import('../components/sla/SLADashboard'))
const InvoicesPanel = lazyWithRetry(() => import('../components/invoices/InvoicesPanel'))

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-slate-800/40 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
  </div>
)

const PanelSkeleton = () => (
  <div className="rounded-3xl border border-white/15 bg-[#090a12]/80 p-8 backdrop-blur-2xl space-y-6 shadow-2xl">
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
  const router = useRouter()
  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(path)
    } else {
      router.push(path)
    }
  }
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const prefersReducedMotion = useReducedMotion()
  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard(
    ready && !!session
  )
  const { role } = useAuthRole()
  const isAdmin = role === 'admin'
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin')
  const tabParam = searchParams.get('tab') as DashboardView | null
  const [activeView, setActiveView] = useState<DashboardView>(
    tabParam && ['overview', 'services', 'workgroups', 'sla', 'invoices'].includes(tabParam)
      ? tabParam
      : 'overview'
  )

  // Sync activeView with searchParams tab
  useEffect(() => {
    const tab = searchParams.get('tab') as DashboardView | null
    if (tab && ['overview', 'services', 'workgroups', 'sla', 'invoices'].includes(tab)) {
      setActiveView(tab)
    }
  }, [searchParams])

  // Reset scroll to top on tab view change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeView])

  // Feature Flag / Rollback Support (?ui=legacy or VITE_DASHBOARD_UI=legacy)
  const isLegacyUI =
    searchParams.get('ui') === 'legacy' ||
    process.env.NEXT_PUBLIC_DASHBOARD_UI === 'legacy' ||
    (typeof window !== 'undefined' && (window as any).__DASHBOARD_UI__ === 'legacy')

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
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('payment')
        url.searchParams.delete('pago')
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''))
      }
      refresh()
      toast.success('Pago aprobado', {
        description:
          payment === 'paypal_ok'
            ? 'Pago con PayPal confirmado'
            : 'Suscripción activada correctamente',
      })
    }
  }, [searchParams, refresh])

  useEffect(() => {
    if (!ready) return
    if (!session) navigate('/login', { replace: true })
  }, [ready, session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const isGlobalLoading = !ready || loading || (isAdmin && viewMode === 'admin' && adminLoading)

  if (isGlobalLoading) {
    return (
      <div className={PREMIUM_TOKENS.bgMain + ' flex items-center justify-center'}>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#090a12]/90 border border-white/15 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.25)]"
          >
            <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300"
          >
            {t('dashboard.sincronizando')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-xs text-slate-400 font-mono tracking-widest uppercase"
          >
            // DASHBOARD OPERATIVO · SYNCING
          </motion.p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={PREMIUM_TOKENS.bgMain + ' flex items-center justify-center px-4'}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-xl w-full rounded-3xl border border-rose-500/40 bg-[#090a12]/90 p-8 backdrop-blur-2xl shadow-2xl"
        >
          <h1 className="text-2xl font-extrabold text-white">
            {t('dashboard.error_conexion_titulo')}
          </h1>
          <p className="mt-3 text-rose-400 text-sm font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className={PREMIUM_TOKENS.ctaButton + ' mt-6'}
          >
            {t('dashboard.volver_login')}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={PREMIUM_TOKENS.bgMain}>
      <div className="relative z-10 pt-4 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Extracted Header Component with ThemeToggle (Sun/Moon) & SSL Security Badge */}
        <DashboardHeader userEmail={session?.user?.email} onLogout={handleLogout} />

        {/* Legacy UI Banner if active via feature flag */}
        {isLegacyUI && (
          <div className="mb-4 text-xs font-mono p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-center">
            ⚠️ Modo Legacy UI activo via URL/Flag (?ui=legacy)
          </div>
        )}

        {/* Super Admin Control Bar */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={PREMIUM_TOKENS.adminGoldAura}
          >
            <div className="bg-[#090a12]/95 border border-white/10 backdrop-blur-2xl p-5 sm:p-6 rounded-[23px] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-extrabold font-mono">
                      {t('dashboard.super_admin')}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full bg-amber-400 ${
                        prefersReducedMotion ? '' : 'animate-ping'
                      }`}
                    />
                  </div>
                  <p className="text-slate-300 text-xs mt-0.5 font-medium">
                    {viewMode === 'admin'
                      ? t('dashboard.consola_central_operativa')
                      : t('dashboard.vista_cliente_activa')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => setViewMode('admin')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      viewMode === 'admin'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('dashboard.consola_admin')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('client')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      viewMode === 'client'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('dashboard.simular_cliente')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => (viewMode === 'admin' ? refreshAdmin() : refresh())}
                  disabled={loading || adminLoading}
                  className="p-3 rounded-2xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 transition-all text-slate-300 hover:text-white shadow-md"
                >
                  <RefreshCw
                    size={18}
                    className={
                      loading || adminLoading ? 'animate-spin text-amber-400' : 'text-slate-300'
                    }
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Dashboard Views */}
        {isAdmin && viewMode === 'admin' ? (
          <PanelErrorBoundary panelName="Admin Dashboard">
            <AdminDashboardView
              clientes={adminClientes}
              suscripciones={adminSuscripciones}
              pagos={adminPagos}
              tickets={adminTickets}
              stats={adminStats}
              onRefresh={refreshAdmin}
              refreshing={adminLoading}
            />
          </PanelErrorBoundary>
        ) : !currentTenant && cliente ? (
          <PanelErrorBoundary panelName="Onboarding">
            <OnboardingWizard
              cliente={cliente}
              planTier={planTier}
              onComplete={async () => {
                await queryClient.invalidateQueries({ queryKey: ['tenant'] })
                await refresh()
              }}
            />
          </PanelErrorBoundary>
        ) : (
          <>
            {/* SaaS Segmented Tabs Bar (Scroll-snap horizontal on mobile) */}
            <div className={PREMIUM_TOKENS.tabsBar + ' snap-x'}>
              {VIEW_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeView === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveView(tab.id)
                      if (typeof window !== 'undefined') {
                        const url = new URL(window.location.href)
                        url.searchParams.set('tab', tab.id)
                        window.history.replaceState(null, '', url.pathname + url.search)
                      }
                    }}
                    onMouseEnter={() => {
                      if (!currentTenant?.id) return
                      if (tab.id === 'services') {
                        queryClient.prefetchQuery({
                          queryKey: queryKeys.tenantServices.byTenant(currentTenant.id),
                          queryFn: () =>
                            new SupabaseTenantServiceRepository().listByTenantId(currentTenant.id),
                        })
                      } else if (tab.id === 'invoices') {
                        queryClient.prefetchQuery({
                          queryKey: queryKeys.invoices.byTenant(currentTenant.id),
                          queryFn: () =>
                            new SupabaseInvoiceRepository().listByTenantId(currentTenant.id),
                        })
                      }
                    }}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap snap-start ${
                      isActive ? PREMIUM_TOKENS.activeTabGradient : PREMIUM_TOKENS.inactiveTab
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{t(tab.labelKey)}</span>
                  </button>
                )
              })}
            </div>

            {/* Content View Panels with Individual Panel Error Boundaries */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Suspense fallback={<PanelSkeleton />}>
                  {activeView === 'overview' && (
                    <PanelErrorBoundary panelName="Resumen Cliente">
                      <ClientDashboard
                        planTier={planTier}
                        cliente={cliente}
                        suscripciones={suscripciones}
                        pagos={pagos}
                        onRefresh={refresh}
                        refreshing={loading}
                        onLogout={handleLogout}
                      />
                    </PanelErrorBoundary>
                  )}
                  {activeView === 'services' && currentTenant && (
                    <PanelErrorBoundary panelName="Servicios">
                      <ServicesPanel tenantId={currentTenant.id} />
                    </PanelErrorBoundary>
                  )}
                  {activeView === 'workgroups' && currentTenant && (
                    <PanelErrorBoundary panelName="Equipo">
                      <WorkGroupsPanel tenantId={currentTenant.id} />
                    </PanelErrorBoundary>
                  )}
                  {activeView === 'sla' && currentTenant && (
                    <PanelErrorBoundary panelName="SLA">
                      <SLADashboard tenantId={currentTenant.id} />
                    </PanelErrorBoundary>
                  )}
                  {activeView === 'invoices' && currentTenant && (
                    <PanelErrorBoundary panelName="Facturas">
                      <InvoicesPanel tenantId={currentTenant.id} />
                    </PanelErrorBoundary>
                  )}
                  {activeView !== 'overview' && !currentTenant && (
                    <div className="text-center py-16 rounded-3xl border border-white/15 bg-[#090a12]/80 backdrop-blur-2xl shadow-2xl">
                      <Settings className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white">
                        {t('dashboard.configura_espacio')}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto font-medium">
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
  )
}
