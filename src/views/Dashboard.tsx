'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { supabase } from '../core/infra/supabase/client'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { useDashboard } from '../hooks/useDashboard'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { useDashboardNavigation } from '../hooks/useDashboardNavigation'
import { useDemoData } from '../hooks/useDemoData'
import { useAuthRole } from '../core/auth/userAuth'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTenant } from '../hooks/useTenant'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar'
import { DashboardViewport } from '../components/dashboard/DashboardViewport'
import BrandLoader from '../components/layout/BrandLoader'

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

  const isPreview = searchParams.get('preview') === 'true' || searchParams.get('demo') === '1'

  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard({
    enabled: !isPreview && ready && !!session,
  })
  const { role } = useAuthRole()
  const isAdmin = role === 'admin'

  const { data: tenants = [] } = useTenant(
    cliente?.id ?? null,
    !isPreview && ready && !!session && !!cliente?.id
  )

  const demo = useDemoData({
    cliente,
    planTier,
    suscripciones,
    pagos,
    currentTenant: tenants[0] || null,
  })
  const {
    effectiveCliente,
    effectiveTier,
    effectiveSuscripciones,
    effectivePagos,
    effectiveTenantId,
    currentTenant,
  } = demo

  const {
    activeView,
    viewMode,
    visitedTabs,
    setViewMode,
    handleTabChange,
    sidebarOpen,
    setSidebarOpen,
  } = useDashboardNavigation()

  const {
    loading: adminLoading,
    clientes: adminClientes,
    suscripciones: adminSuscripciones,
    pagos: adminPagos,
    tickets: adminTickets,
    stats: adminStats,
    refresh: refreshAdmin,
  } = useAdminDashboard({
    enabled: !isPreview && ready && !!session && isAdmin && viewMode === 'admin',
  })

  // Notify & de-dup payment success params
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

  // Auth guard
  useEffect(() => {
    if (isPreview) return
    if (!ready) return
    if (!session) navigate('/login', { replace: true })
  }, [ready, session, navigate, isPreview])

  const handleLogout = async () => {
    if (isPreview) {
      navigate('/login')
      return
    }
    await supabase.auth.signOut()
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const onOnboardingComplete = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tenant'] })
    refresh()
  }

  const isGlobalLoading =
    !isPreview && (!ready || loading || (isAdmin && viewMode === 'admin' && adminLoading))

  if (isGlobalLoading) {
    return (
      <div className="bg-[#0B0E14] text-white flex items-center justify-center min-h-screen">
        <BrandLoader
          size="lg"
          text="EXESISTEMASWEB"
          subtext={t('dashboard.sincronizando') || 'Sincronizando panel...'}
        />
      </div>
    )
  }

  if (!isPreview && error) {
    return (
      <div className="bg-[#0B0E14] text-white flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-xl w-full rounded-2xl border border-rose-500/30 bg-[#111622] p-8 shadow-2xl"
        >
          <h1 className="text-2xl font-bold text-white">
            {t('dashboard.error_conexion_titulo', 'Error de conexión')}
          </h1>
          <p className="mt-3 text-rose-400 text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full mt-6 py-3 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] font-semibold text-sm text-white transition-all cursor-pointer"
          >
            {t('dashboard.volver_login', 'Volver al inicio de sesión')}
          </button>
        </motion.div>
      </div>
    )
  }

  const userName = effectiveCliente?.full_name?.split(' ')[0] ?? 'John'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col md:flex-row overflow-x-hidden font-sans">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar barra lateral"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden border-none w-full h-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={handleTabChange}
        onHome={() => navigate('/')}
        userName={userName}
        userInitial={userInitial}
      />

      <DashboardViewport
        userEmail={session?.user?.email}
        role={role}
        isPreview={isPreview}
        isAdmin={isAdmin}
        viewMode={viewMode}
        activeView={activeView}
        visitedTabs={visitedTabs}
        onNavigate={handleTabChange}
        onToggleViewMode={setViewMode}
        onOpenSidebar={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        effectiveCliente={effectiveCliente}
        effectiveTier={effectiveTier}
        effectiveSuscripciones={effectiveSuscripciones}
        effectivePagos={effectivePagos}
        effectiveTenantId={effectiveTenantId}
        currentTenant={currentTenant}
        clientLoading={loading}
        onRefreshClient={refresh}
        adminLoading={adminLoading}
        adminClientes={adminClientes}
        adminSuscripciones={adminSuscripciones}
        adminPagos={adminPagos}
        adminTickets={adminTickets}
        adminStats={adminStats}
        onRefreshAdmin={refreshAdmin}
        onOnboardingComplete={onOnboardingComplete}
      />
    </div>
  )
}
