'use client'

import { motion } from 'framer-motion'
import { Crown, RefreshCw, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { Suscripcion } from '../../core/domain/entities/Suscripcion'
import type { Pago } from '../../core/domain/entities/Pago'
import type {
  AdminCliente,
  AdminSuscripcion,
  AdminPago,
  AdminTicket,
  AdminStats,
} from '../../core/domain/entities/AdminDashboard'
import type { PlanTier } from '../../core/domain/planCatalog'
import type { DashboardView, DashboardMode } from '../../hooks/useDashboardNavigation'
import type { EffectiveTenant } from '../../hooks/useDemoData'
import ClientDashboard from './ClientDashboard'
import AdminDashboardView from './AdminDashboardView'
import OnboardingWizard from './OnboardingWizard'
import DashboardHeader from './DashboardHeader'
import PanelErrorBoundary from './PanelErrorBoundary'
import WorkGroupsPanel from '../workgroups/WorkGroupsPanel'
import ServicesPanel from '../services/ServicesPanel'
import SLADashboard from '../sla/SLADashboard'
import InvoicesPanel from '../invoices/InvoicesPanel'
import SettingsPanel from './SettingsPanel'

interface DashboardViewportProps {
  userEmail?: string | null
  role: string | null
  isPreview: boolean
  isAdmin: boolean
  viewMode: DashboardMode
  activeView: DashboardView
  visitedTabs: Set<DashboardView>
  onNavigate: (tab: DashboardView) => void
  onToggleViewMode: (mode: DashboardMode) => void
  onOpenSidebar: () => void
  onLogout: () => void
  effectiveCliente: Cliente | null
  effectiveTier: PlanTier | null
  effectiveSuscripciones: Suscripcion[]
  effectivePagos: Pago[]
  effectiveTenantId: string
  currentTenant: EffectiveTenant | null
  clientLoading: boolean
  onRefreshClient: () => void
  adminLoading: boolean
  adminClientes: AdminCliente[]
  adminSuscripciones: AdminSuscripcion[]
  adminPagos: AdminPago[]
  adminTickets: AdminTicket[]
  adminStats: AdminStats
  onRefreshAdmin: () => void
  onOnboardingComplete: () => void
}

export function DashboardViewport({
  userEmail,
  role,
  isPreview,
  isAdmin,
  viewMode,
  activeView,
  visitedTabs,
  onNavigate,
  onToggleViewMode,
  onOpenSidebar,
  onLogout,
  effectiveCliente,
  effectiveTier,
  effectiveSuscripciones,
  effectivePagos,
  effectiveTenantId,
  currentTenant,
  clientLoading,
  onRefreshClient,
  adminLoading,
  adminClientes,
  adminSuscripciones,
  adminPagos,
  adminTickets,
  adminStats,
  onRefreshAdmin,
  onOnboardingComplete,
}: DashboardViewportProps) {
  const { t } = useTranslation()

  const adminPanel = (
    <PanelErrorBoundary panelName="Admin Dashboard">
      <AdminDashboardView
        clientes={adminClientes}
        suscripciones={adminSuscripciones}
        pagos={adminPagos}
        tickets={adminTickets}
        stats={adminStats}
        onRefresh={onRefreshAdmin}
        refreshing={adminLoading}
      />
    </PanelErrorBoundary>
  )

  return (
    <div className="flex-1 min-w-0 flex flex-col min-h-screen">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0D111A] border-b border-[#1E2638]">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-[#151B28] text-white border border-[#1E2638]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-white text-sm">ExeSistemasWEB</span>
        <button
          type="button"
          onClick={onLogout}
          className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20"
        >
          Salir
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:px-10 2xl:px-12 w-full space-y-6">
        <DashboardHeader
          userEmail={isPreview ? 'john.carter@dashdark.io' : userEmail}
          onLogout={onLogout}
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
                    onClick={() => {
                      onToggleViewMode('admin')
                      onNavigate('overview')
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'admin' && activeView === 'overview'
                        ? 'bg-[#4361EE] text-white shadow-sm'
                        : 'text-[#8C9BB0] hover:text-white'
                    }`}
                  >
                    {t('dashboard.consola_admin', 'Consola Admin')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleViewMode('client')
                      onNavigate('overview')
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'client' && activeView === 'overview'
                        ? 'bg-[#4361EE] text-white shadow-sm'
                        : 'text-[#8C9BB0] hover:text-white'
                    }`}
                  >
                    {t('dashboard.simular_cliente', 'Simular Cliente')}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => (viewMode === 'admin' ? onRefreshAdmin() : onRefreshClient())}
                  disabled={clientLoading || adminLoading}
                  className="p-2 rounded-xl border border-[#1E2638] bg-[#151B28] hover:bg-[#1C2438] text-slate-300 transition-all cursor-pointer"
                >
                  <RefreshCw
                    size={16}
                    className={
                      clientLoading || adminLoading
                        ? 'animate-spin text-amber-400'
                        : 'text-slate-300'
                    }
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Dashboard Views */}
        {!isPreview && isAdmin && viewMode === 'admin' && activeView === 'overview' ? (
          adminPanel
        ) : !isPreview &&
          !currentTenant &&
          effectiveCliente &&
          effectiveTier !== 'none' &&
          activeView === 'overview' ? (
          <PanelErrorBoundary panelName="Onboarding">
            <OnboardingWizard
              cliente={effectiveCliente}
              planTier={effectiveTier ?? 'basico'}
              onComplete={onOnboardingComplete}
            />
          </PanelErrorBoundary>
        ) : (
          <div className="space-y-6">
            {activeView === 'admin' && adminPanel}

            {/* Overview (Resumen) Panel */}
            <div
              className={`transition-opacity duration-150 ${
                activeView === 'overview' ? 'block opacity-100' : 'hidden opacity-0'
              }`}
            >
              <PanelErrorBoundary panelName="Resumen Cliente">
                <ClientDashboard
                  planTier={effectiveTier ?? 'none'}
                  cliente={effectiveCliente}
                  suscripciones={effectiveSuscripciones}
                  pagos={effectivePagos}
                  onRefresh={onRefreshClient}
                  refreshing={clientLoading}
                  onLogout={onLogout}
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
                    <ServicesPanel
                      tenantId={effectiveTenantId}
                      onOpenTicket={() => onNavigate('sla')}
                    />
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
                    <WorkGroupsPanel tenantId={effectiveTenantId} />
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
                    <SLADashboard tenantId={effectiveTenantId} />
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
                    <InvoicesPanel
                      tenantId={effectiveTenantId}
                      pagos={effectivePagos}
                      onOpenTicket={() => onNavigate('sla')}
                    />
                  </div>
                </PanelErrorBoundary>
              </div>
            )}

            {/* Settings (Configuración) Panel */}
            {(visitedTabs.has('settings') || activeView === 'settings') && (
              <div
                className={`transition-opacity duration-150 ${
                  activeView === 'settings' ? 'block opacity-100' : 'hidden opacity-0'
                }`}
              >
                <PanelErrorBoundary panelName="Configuración">
                  <div className="rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm">
                    <SettingsPanel
                      cliente={effectiveCliente}
                      userEmail={userEmail}
                      role={role}
                      currentTenant={currentTenant}
                      onLogout={onLogout}
                      onRefreshProfile={onRefreshClient}
                    />
                  </div>
                </PanelErrorBoundary>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
