'use client'

import { useEffect, useState, useTransition, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { SupabaseSLAContractRepository } from '../core/infra/repositories/SupabaseSLAContractRepository'
import { SupabaseWorkGroupRepository } from '../core/infra/repositories/SupabaseWorkGroupRepository'
import { PREMIUM_TOKENS } from '../styles/premium-tokens'
import BrandLoader from '../components/layout/BrandLoader'

// High-performance direct panel imports to eliminate chunk loading waterfalls & freeze lag
import WorkGroupsPanel from '../components/workgroups/WorkGroupsPanel'
import ServicesPanel from '../components/services/ServicesPanel'
import SLADashboard from '../components/sla/SLADashboard'
import InvoicesPanel from '../components/invoices/InvoicesPanel'

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
  const navigate = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(path)
      } else {
        router.push(path)
      }
    },
    [router]
  )

  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const prefersReducedMotion = useReducedMotion()
  const [, startTransition] = useTransition()

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

  // Keep-alive cache: track which tabs have been visited so they stay mounted in memory
  const [visitedTabs, setVisitedTabs] = useState<Set<DashboardView>>(() => new Set([activeView]))

  // Sync activeView with searchParams tab without lag
  useEffect(() => {
    const tab = searchParams.get('tab') as DashboardView | null
    if (tab && ['overview', 'services', 'workgroups', 'sla', 'invoices'].includes(tab)) {
      setActiveView(tab)
      setVisitedTabs((prev) => {
        if (prev.has(tab)) return prev
        const next = new Set(prev)
        next.add(tab)
        return next
      })
    }
  }, [searchParams])

  const handleTabChange = (tabId: DashboardView) => {
    if (activeView === tabId) return
    startTransition(() => {
      setActiveView(tabId)
      setVisitedTabs((prev) => {
        if (prev.has(tabId)) return prev
        const next = new Set(prev)
        next.add(tabId)
        return next
      })
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('tab', tabId)
        window.history.replaceState(null, '', url.pathname + url.search)
      }
    })
  }

  // Feature Flag / Rollback Support (?ui=legacy or NEXT_PUBLIC_DASHBOARD_UI=legacy)
  const isLegacyUI =
    searchParams.get('ui') === 'legacy' ||
    process.env.NEXT_PUBLIC_DASHBOARD_UI === 'legacy' ||
    (typeof window !== 'undefined' &&
      (window as unknown as { __DASHBOARD_UI__?: string }).__DASHBOARD_UI__ === 'legacy')

  const { data: tenants = [] } = useTenant(cliente?.id ?? null, ready && !!session && !!cliente?.id)
  const currentTenant = tenants[0] || null

  // Eager parallel data prefetching: as soon as currentTenant is known, preheat all caches
  useEffect(() => {
    if (!currentTenant?.id) return
    const tid = currentTenant.id

    // Prefetch all panels concurrently with generous staleTime
    queryClient.prefetchQuery({
      queryKey: queryKeys.tenantServices.byTenant(tid),
      queryFn: () => new SupabaseTenantServiceRepository().listByTenantId(tid),
      staleTime: 5 * 60 * 1000,
    })
    queryClient.prefetchQuery({
      queryKey: queryKeys.invoices.byTenant(tid),
      queryFn: () => new SupabaseInvoiceRepository().listByTenantId(tid),
      staleTime: 5 * 60 * 1000,
    })
    queryClient.prefetchQuery({
      queryKey: ['sla-active', tid],
      queryFn: () => new SupabaseSLAContractRepository().getActiveByTenantId(tid),
      staleTime: 5 * 60 * 1000,
    })
    queryClient.prefetchQuery({
      queryKey: ['sla-breaches', tid],
      queryFn: () => new SupabaseSLAContractRepository().checkBreaches(tid),
      staleTime: 60 * 1000,
    })
    queryClient.prefetchQuery({
      queryKey: ['work-groups', tid],
      queryFn: () => new SupabaseWorkGroupRepository().listByTenantId(tid),
      staleTime: 5 * 60 * 1000,
    })
  }, [currentTenant?.id, queryClient])

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
  }, [ready, session, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const isGlobalLoading = !ready || loading || (isAdmin && viewMode === 'admin' && adminLoading)

  if (isGlobalLoading) {
    return (
      <div className={PREMIUM_TOKENS.bgMain + ' flex items-center justify-center min-h-screen'}>
        <BrandLoader
          size="lg"
          text="EXESISTEMASWEB"
          subtext={t('dashboard.sincronizando') || 'Sincronizando panel...'}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className={PREMIUM_TOKENS.bgMain + ' flex items-center justify-center px-4'}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-xl w-full rounded-3xl border border-rose-500/40 bg-white/95 dark:bg-[#090a12]/90 p-8 backdrop-blur-2xl shadow-2xl"
        >
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.error_conexion_titulo')}
          </h1>
          <p className="mt-3 text-rose-600 dark:text-rose-400 text-sm font-semibold">{error}</p>
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
            <div className="bg-white/95 dark:bg-[#090a12]/95 border border-slate-200 dark:border-white/10 backdrop-blur-2xl p-5 sm:p-6 rounded-[23px] flex flex-wrap items-center justify-between gap-4 shadow-lg dark:shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Crown className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400 font-extrabold font-mono">
                      {t('dashboard.super_admin')}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full bg-amber-500 ${
                        prefersReducedMotion ? '' : 'animate-ping'
                      }`}
                    />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-medium">
                    {viewMode === 'admin'
                      ? t('dashboard.consola_central_operativa')
                      : t('dashboard.vista_cliente_activa')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-2xl border border-slate-200 dark:border-white/15">
                  <button
                    type="button"
                    onClick={() => setViewMode('admin')}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      viewMode === 'admin'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t('dashboard.simular_cliente')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => (viewMode === 'admin' ? refreshAdmin() : refresh())}
                  disabled={loading || adminLoading}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shadow-md cursor-pointer"
                >
                  <RefreshCw
                    size={18}
                    className={
                      loading || adminLoading
                        ? 'animate-spin text-amber-500'
                        : 'text-slate-600 dark:text-slate-300'
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
            {/* SaaS Segmented Tabs Bar (Ultra-responsive, Zero-latency sliding pill) */}
            <div className={PREMIUM_TOKENS.tabsBar + ' snap-x relative'}>
              {VIEW_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeView === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-colors whitespace-nowrap snap-start cursor-pointer z-10 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-cyan via-purple-600 to-pink-500 shadow-md -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Icon className="w-4 h-4" />
                    <span>{t(tab.labelKey)}</span>
                  </button>
                )
              })}
            </div>

            {/* High-Performance Keep-Alive Panels Container */}
            <div className="relative mt-2">
              {/* Overview (Resumen) Panel */}
              <div
                className={`transition-opacity duration-150 ${
                  activeView === 'overview' ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
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
              </div>

              {/* Services (Servicios) Panel */}
              {currentTenant && (visitedTabs.has('services') || activeView === 'services') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'services' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Servicios">
                    <ServicesPanel tenantId={currentTenant.id} />
                  </PanelErrorBoundary>
                </div>
              )}

              {/* Workgroups (Equipo) Panel */}
              {currentTenant && (visitedTabs.has('workgroups') || activeView === 'workgroups') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'workgroups' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Equipo">
                    <WorkGroupsPanel tenantId={currentTenant.id} />
                  </PanelErrorBoundary>
                </div>
              )}

              {/* SLA Panel */}
              {currentTenant && (visitedTabs.has('sla') || activeView === 'sla') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'sla' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="SLA">
                    <SLADashboard tenantId={currentTenant.id} />
                  </PanelErrorBoundary>
                </div>
              )}

              {/* Invoices (Facturas) Panel */}
              {currentTenant && (visitedTabs.has('invoices') || activeView === 'invoices') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'invoices' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Facturas">
                    <InvoicesPanel tenantId={currentTenant.id} />
                  </PanelErrorBoundary>
                </div>
              )}

              {/* Fallback if no current tenant */}
              {activeView !== 'overview' && !currentTenant && (
                <div className="text-center py-16 rounded-3xl border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#090a12]/80 backdrop-blur-2xl shadow-xl dark:shadow-2xl">
                  <Settings className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('dashboard.configura_espacio')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto font-medium">
                    {t('dashboard.compra_plan_hint')}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
