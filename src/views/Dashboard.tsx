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
  LayoutDashboard,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  DollarSign,
  Plug,
  Menu,
  X,
  ArrowRight,
  Globe,
} from 'lucide-react'

import { useDashboard } from '../hooks/useDashboard'
import { useAuthRole } from '../core/auth/userAuth'
import { useAuthSession } from '../core/auth/AuthSessionProvider'
import { useTenant } from '../hooks/useTenant'
import type { Cliente } from '../core/domain/entities/Cliente'
import type { Suscripcion } from '../core/domain/entities/Suscripcion'
import ClientDashboard from '../components/dashboard/ClientDashboard'
import AdminDashboardView from '../components/dashboard/AdminDashboardView'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import PanelErrorBoundary from '../components/dashboard/PanelErrorBoundary'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { queryKeys } from '../core/infra/query/queryKeys'
import { SupabaseTenantServiceRepository } from '../core/infra/repositories/SupabaseTenantServiceRepository'
import { SupabaseInvoiceRepository } from '../core/infra/repositories/SupabaseInvoiceRepository'
import { SupabaseSLAContractRepository } from '../core/infra/repositories/SupabaseSLAContractRepository'
import { SupabaseWorkGroupRepository } from '../core/infra/repositories/SupabaseWorkGroupRepository'
import BrandLoader from '../components/layout/BrandLoader'

// High-performance direct panel imports to eliminate chunk loading waterfalls & freeze lag
import WorkGroupsPanel from '../components/workgroups/WorkGroupsPanel'
import ServicesPanel from '../components/services/ServicesPanel'
import SLADashboard from '../components/sla/SLADashboard'
import InvoicesPanel from '../components/invoices/InvoicesPanel'

type DashboardView = 'overview' | 'services' | 'workgroups' | 'sla' | 'invoices' | 'admin'

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
  const [, startTransition] = useTransition()

  const isPreview = searchParams.get('preview') === 'true' || searchParams.get('demo') === '1'

  const { ready, session } = useAuthSession()
  const { loading, error, cliente, suscripciones, pagos, planTier, refresh } = useDashboard(
    !isPreview && ready && !!session
  )
  const { role } = useAuthRole()
  const isAdmin = role === 'admin'
  const [viewMode, setViewMode] = useState<'admin' | 'client'>('admin')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabParam = searchParams.get('tab') as DashboardView | null
  const [activeView, setActiveView] = useState<DashboardView>(
    tabParam && ['overview', 'services', 'workgroups', 'sla', 'invoices'].includes(tabParam)
      ? tabParam
      : 'overview'
  )

  // Keep-alive cache: track which tabs have been visited so they stay mounted in memory
  const [visitedTabs, setVisitedTabs] = useState<Set<DashboardView>>(() => new Set([activeView]))

  // Mock data for demo preview
  const demoCliente: Cliente = {
    id: 'demo-user-1',
    full_name: 'John Carter',
    email: 'john.carter@dashdark.io',
  }

  const effectiveCliente = isPreview ? demoCliente : cliente
  const effectiveTier = isPreview
    ? (searchParams.get('tier') as 'basico' | 'avanzado' | 'premium') || 'avanzado'
    : planTier
  const effectiveSuscripciones: Suscripcion[] = isPreview
    ? [
        {
          id: 'demo-sub',
          cliente_id: 'demo-user-1',
          plan_slug: 'avanzado',
          plan_id: 'plan-avanzado',
          estado: 'activa',
          fecha_inicio: '2025-01-15T00:00:00Z',
          plan: {
            slug: 'avanzado',
            nombre: 'Plan Avanzado',
            precio: 144.6,
          },
        },
      ]
    : suscripciones
  const effectivePagos = isPreview
    ? [
        {
          id: 'demo-pago-1',
          monto: 144.6,
          moneda: 'USD',
          estado: 'aprobado',
          plan_nombre: 'Plan Avanzado',
          plan_slug: 'avanzado',
          created_at: '2025-02-01T00:00:00Z',
        },
      ]
    : pagos

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
    setSidebarOpen(false)
  }

  const { data: tenants = [] } = useTenant(
    effectiveCliente?.id ?? null,
    !isPreview && ready && !!session && !!cliente?.id
  )
  const currentTenant = isPreview
    ? { id: 'demo-tenant-1', nombre: 'Workspace ExeSistemasWEB', slug: 'exesistemasweb-ws' }
    : tenants[0] ||
      (effectiveCliente
        ? {
            id: effectiveCliente.id,
            nombre: effectiveCliente.full_name || 'Espacio ExeSistemasWEB',
            slug: 'exesistemasweb-ws',
          }
        : { id: 'default-tenant', nombre: 'Espacio ExeSistemasWEB', slug: 'exesistemasweb-ws' })
  const effectiveTenant = currentTenant

  // Eager parallel data prefetching
  useEffect(() => {
    if (isPreview || !currentTenant?.id) return
    const tid = currentTenant.id

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
  }, [isPreview, currentTenant?.id, queryClient])

  const {
    loading: adminLoading,
    clientes: adminClientes,
    suscripciones: adminSuscripciones,
    pagos: adminPagos,
    tickets: adminTickets,
    stats: adminStats,
    refresh: refreshAdmin,
  } = useAdminDashboard(!isPreview && ready && !!session && isAdmin && viewMode === 'admin')

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
      {/* ========================================================================= */}
      {/* 1. DASHDARK X SIDEBAR NAVIGATION (LEFT) */}
      {/* ========================================================================= */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar barra lateral"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden border-none w-full h-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0D111A] border-r border-[#1E2638] flex flex-col justify-between p-4 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5 overflow-y-auto scrollbar-none pr-1">
          {/* Logo & Collapse Header */}
          <div className="flex items-center justify-between pb-1">
            <button
              type="button"
              className="flex items-center gap-2.5 cursor-pointer text-left bg-transparent border-none p-0"
              onClick={() => navigate('/')}
            >
              {/* ExeSistemasWEB Brand Icon */}
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#4361EE]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
              </div>
              <div>
                <span className="font-bold text-white text-sm sm:text-base tracking-tight block leading-none">
                  ExeSistemasWEB
                </span>
                <span className="text-[10px] text-[#8C9BB0] font-mono">Panel de Clientes</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-[#64748B] hover:text-white p-1 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="hidden md:inline-block text-xs font-mono text-[#64748B]">
              &lt;&gt;
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('dashboard.search_placeholder', 'Buscar servicios, facturas...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#151B28] border border-[#1E2638] rounded-xl text-xs text-slate-200 placeholder:text-[#64748B] focus:border-[#4361EE] focus:outline-none transition-colors"
            />
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            {/* Dashboard Category */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C9BB0] font-semibold px-2 mb-2">
                <span className="flex items-center gap-2 text-white">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#4361EE]" />
                  Panel Principal
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </div>

              <div className="space-y-1 pl-2">
                <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider px-3 py-1">
                  Vistas Activas
                </p>
                {/* Reports / Overview */}
                <button
                  type="button"
                  onClick={() => handleTabChange('overview')}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    activeView === 'overview'
                      ? 'bg-[#1C2438] text-white font-semibold border-l-2 border-[#4361EE] shadow-sm'
                      : 'text-[#8C9BB0] hover:text-white hover:bg-[#151B28]'
                  }`}
                >
                  <span>Resumen General</span>
                </button>

                {/* Products / Services */}
                <button
                  type="button"
                  onClick={() => handleTabChange('services')}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    activeView === 'services'
                      ? 'bg-[#1C2438] text-white font-semibold border-l-2 border-[#4361EE] shadow-sm'
                      : 'text-[#8C9BB0] hover:text-white hover:bg-[#151B28]'
                  }`}
                >
                  <span>Servicios Web & Turnos</span>
                </button>

                {/* Task / SLA */}
                <button
                  type="button"
                  onClick={() => handleTabChange('sla')}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    activeView === 'sla'
                      ? 'bg-[#1C2438] text-white font-semibold border-l-2 border-[#4361EE] shadow-sm'
                      : 'text-[#8C9BB0] hover:text-white hover:bg-[#151B28]'
                  }`}
                >
                  <span>Tickets & SLA</span>
                </button>
              </div>
            </div>

            {/* Other Categories */}
            <div className="space-y-1 pt-1 border-t border-[#1E2638]">
              <button
                type="button"
                onClick={() => handleTabChange('sla')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Star className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  Garantías & SLA
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('workgroups')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  Equipo & Sedes
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('invoices')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  Facturas & Abonos
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <a
                href="https://wa.me/5493416874786"
                target="_blank"
                rel="noreferrer"
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Plug className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  WhatsApp & Bot
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </a>
            </div>

            {/* Bottom Pages */}
            <div className="space-y-1 pt-2 border-t border-[#1E2638]">
              <button
                type="button"
                onClick={() => handleTabChange('overview')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  Configuración
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="w-3.5 h-3.5 text-[#8C9BB0]" />
                  Volver al Sitio Web
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Profile & Action Button */}
        <div className="pt-4 border-t border-[#1E2638] space-y-3">
          {/* User Account Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#151B28] border border-[#1E2638]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4361EE] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-[#8C9BB0] truncate">Cliente ExePaginasWeb</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
          </div>

          {/* Primary Action Button */}
          <a
            href="https://wa.me/5493416874786?text=Hola%20ExePaginasWeb!%20Necesito%20soporte%20VIP"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Soporte WhatsApp VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT WORKSPACE (RIGHT) */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0D111A] border-b border-[#1E2638]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#151B28] text-white border border-[#1E2638]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-sm">ExeSistemasWEB</span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
          >
            Salir
          </button>
        </div>

        {/* Main Content Area - Full Width Space Utilization */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:px-10 2xl:px-12 w-full space-y-6">
          {/* Header */}
          <DashboardHeader
            userEmail={isPreview ? 'john.carter@dashdark.io' : session?.user?.email}
            onLogout={handleLogout}
          />

          {/* Super Admin Control Bar */}
          {!isPreview && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/40 via-yellow-500/30 to-amber-500/40 mb-6"
            >
              <div className="bg-[#111622] border border-[#1E2638] p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold font-mono">
                        {t('dashboard.super_admin', 'SUPER ADMIN')}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <p className="text-[#8C9BB0] text-xs font-medium">
                      {viewMode === 'admin'
                        ? t('dashboard.consola_central_operativa', 'Consola central operativa')
                        : t('dashboard.vista_cliente_activa', 'Vista de cliente activa')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-[#151B28] p-1 rounded-xl border border-[#1E2638]">
                    <button
                      type="button"
                      onClick={() => setViewMode('admin')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'admin'
                          ? 'bg-[#4361EE] text-white shadow-sm'
                          : 'text-[#8C9BB0] hover:text-white'
                      }`}
                    >
                      {t('dashboard.consola_admin', 'Consola Admin')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('client')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'client'
                          ? 'bg-[#4361EE] text-white shadow-sm'
                          : 'text-[#8C9BB0] hover:text-white'
                      }`}
                    >
                      {t('dashboard.simular_cliente', 'Simular Cliente')}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => (viewMode === 'admin' ? refreshAdmin() : refresh())}
                    disabled={loading || adminLoading}
                    className="p-2 rounded-xl border border-[#1E2638] bg-[#151B28] hover:bg-[#1C2438] text-slate-300 transition-all cursor-pointer"
                  >
                    <RefreshCw
                      size={16}
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
          {!isPreview && isAdmin && viewMode === 'admin' ? (
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
          ) : (
            <div className="space-y-6">
              {/* Overview (Resumen) Panel */}
              <div
                className={`transition-opacity duration-150 ${
                  activeView === 'overview' ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
                <PanelErrorBoundary panelName="Resumen Cliente">
                  <ClientDashboard
                    planTier={effectiveTier}
                    cliente={effectiveCliente}
                    suscripciones={effectiveSuscripciones}
                    pagos={effectivePagos}
                    onRefresh={refresh}
                    refreshing={loading}
                    onLogout={handleLogout}
                  />
                </PanelErrorBoundary>
              </div>

              {/* Services (Servicios) Panel */}
              {(visitedTabs.has('services') || activeView === 'services') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'services' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Servicios">
                    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
                      <ServicesPanel tenantId={effectiveTenant.id} />
                    </div>
                  </PanelErrorBoundary>
                </div>
              )}

              {/* Workgroups (Equipo) Panel */}
              {(visitedTabs.has('workgroups') || activeView === 'workgroups') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'workgroups' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Equipo">
                    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
                      <WorkGroupsPanel tenantId={effectiveTenant.id} />
                    </div>
                  </PanelErrorBoundary>
                </div>
              )}

              {/* SLA Panel */}
              {(visitedTabs.has('sla') || activeView === 'sla') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'sla' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="SLA">
                    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
                      <SLADashboard tenantId={effectiveTenant.id} />
                    </div>
                  </PanelErrorBoundary>
                </div>
              )}

              {/* Invoices (Facturas) Panel */}
              {(visitedTabs.has('invoices') || activeView === 'invoices') && (
                <div
                  className={`transition-opacity duration-150 ${
                    activeView === 'invoices' ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <PanelErrorBoundary panelName="Facturas">
                    <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
                      <InvoicesPanel tenantId={effectiveTenant.id} />
                    </div>
                  </PanelErrorBoundary>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
