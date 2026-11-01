/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Users,
  DollarSign,
  Settings,
  Globe,
  X,
  LayoutDashboard,
  ArrowRight,
  Terminal,
  ShoppingBag,
  Shield,
  Package,
  Calculator,
  Plus,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DashboardView } from './DashboardView'
import type { EcosystemSubTab } from '../services/ServicesPanel'

interface DashboardSidebarProps {
  sidebarOpen: boolean
  onCloseSidebar: () => void
  activeView: DashboardView
  activeEcosystemTab?: EcosystemSubTab | undefined
  onNavigate: (tab: DashboardView) => void
  onOpenEcosystemSubTab?: ((subTab: EcosystemSubTab) => void) | undefined
  onOpenTicketModal?: (() => void) | undefined
  onHome: () => void
  userName: string
  userInitial: string
}

interface SidebarActionItem {
  id: string
  label: string
  keywords: string
  icon: typeof LayoutDashboard
  accentClass?: string
  isActive: boolean
  onSelect: () => void
}

export function DashboardSidebar({
  sidebarOpen,
  onCloseSidebar,
  activeView,
  activeEcosystemTab = 'active',
  onNavigate,
  onOpenEcosystemSubTab,
  onOpenTicketModal,
  onHome,
  userName,
  userInitial,
}: DashboardSidebarProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const triggerEcosystem = (sub: EcosystemSubTab) => {
    if (onOpenEcosystemSubTab) {
      onOpenEcosystemSubTab(sub)
    } else {
      onNavigate('services')
    }
    onCloseSidebar()
  }

  const primaryItems: SidebarActionItem[] = useMemo(
    () => [
      {
        id: 'overview',
        label: t('dashboard.nav_resumen_ejecutivo', 'Resumen Ejecutivo'),
        keywords: 'inicio resumen metricas trafico pulso general overview',
        icon: LayoutDashboard,
        isActive: activeView === 'overview',
        onSelect: () => onNavigate('overview'),
      },
      {
        id: 'services',
        label: t('dashboard.nav_mis_servicios', 'Mis Servicios & Web'),
        keywords: 'servicios hosting dominio web turnos canchas activos services',
        icon: Package,
        isActive: activeView === 'services' && activeEcosystemTab === 'active',
        onSelect: () => triggerEcosystem('active'),
      },
      {
        id: 'sla',
        label: t('dashboard.nav_tickets_sla', 'Tickets & Garantía SLA'),
        keywords: 'tickets soporte ayuda reclamo sla garantia respuesta support',
        icon: Shield,
        isActive: activeView === 'sla',
        onSelect: () => onNavigate('sla'),
      },
      {
        id: 'invoices',
        label: t('dashboard.nav_facturas_pagos', 'Facturas & Pagos'),
        keywords: 'facturas pagos comprobante transferencia recibos contable invoices billing',
        icon: DollarSign,
        isActive: activeView === 'invoices',
        onSelect: () => onNavigate('invoices'),
      },
      {
        id: 'workgroups',
        label: t('dashboard.nav_equipo_sedes', 'Equipo & Sedes'),
        keywords: 'equipo usuarios operadores sucursales sedes miembros team workgroups',
        icon: Users,
        isActive: activeView === 'workgroups',
        onSelect: () => onNavigate('workgroups'),
      },
      {
        id: 'settings',
        label: t('dashboard.nav_cuenta_ajustes', 'Cuenta & Ajustes'),
        keywords: 'perfil cuenta configuracion ajustes email seguridad settings account',
        icon: Settings,
        isActive: activeView === 'settings',
        onSelect: () => onNavigate('settings'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeView, activeEcosystemTab, onNavigate, t]
  )

  const directModules: SidebarActionItem[] = useMemo(
    () => [
      {
        id: 'hub-store',
        label: t('dashboard.nav_tienda_upgrades', 'Tienda & Upgrades'),
        keywords: 'tienda abonos planes basico avanzado premium paypal cbu upgrade store',
        icon: ShoppingBag,
        accentClass: 'text-violet-500',
        isActive: activeView === 'services' && activeEcosystemTab === 'store',
        onSelect: () => triggerEcosystem('store'),
      },
      {
        id: 'hub-linux',
        label: t('dashboard.nav_linux_flota', 'Linux POS & Flota'),
        keywords: 'linux pos cajas quiosco simulador flota servidor lan offline ssh',
        icon: Terminal,
        accentClass: 'text-emerald-500',
        isActive: activeView === 'services' && activeEcosystemTab === 'linux',
        onSelect: () => triggerEcosystem('linux'),
      },
      {
        id: 'hub-quoter',
        label: t('dashboard.nav_cotizador_rapido', 'Cotizador Rápido'),
        keywords: 'cotizador presupuesto calcular ecommerce turnos canchas quoter quote',
        icon: Calculator,
        accentClass: 'text-cyan-500',
        isActive: activeView === 'services' && activeEcosystemTab === 'quoter',
        onSelect: () => triggerEcosystem('quoter'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeView, activeEcosystemTab, t]
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filterList = (items: SidebarActionItem[]) => {
    if (!normalizedQuery) return items
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.keywords.includes(normalizedQuery)
    )
  }

  const filteredPrimary = filterList(primaryItems)
  const filteredDirect = filterList(directModules)

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const firstMatch = filteredPrimary[0] ?? filteredDirect[0]
      if (firstMatch) {
        firstMatch.onSelect()
        setSearchQuery('')
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('')
    }
  }

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-slate-300/85 dark:border-border flex flex-col justify-between p-4 transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-4 overflow-y-auto scrollbar-none pr-0.5">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-2.5 cursor-pointer text-left bg-transparent border-none p-0 group"
          >
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#4361EE] group-hover:scale-110 transition-transform" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm sm:text-base tracking-tight block leading-none">
                ExeSistemasWEB
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {t('dashboard.panel_unificado', 'Panel Unificado')}
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={onCloseSidebar}
            className="text-muted-foreground hover:text-foreground p-1 md:hidden"
            aria-label={t('dashboard.cerrar_menu', 'Cerrar menú')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Instant Filter Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t('dashboard.search_placeholder', 'Ir a Linux, facturas, cotizar...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-7 py-2 bg-muted/40 border border-slate-300/80 dark:border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={t('dashboard.limpiar_filtro', 'Limpiar filtro')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Primary Unified Views */}
        {filteredPrimary.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1">
              {t('dashboard.gestion_principal', 'Gestión Principal')}
            </p>
            {filteredPrimary.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onSelect}
                  className={`relative w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2.5 cursor-pointer ${
                    item.isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {item.isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-primary/12 border border-primary/30 shadow-2xs"
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 relative z-10 shrink-0 ${
                      item.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <span className="relative z-10 truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Direct In-Dashboard Ecosystem Modules (Zero Page Reloads) */}
        {filteredDirect.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-border">
            <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-2.5 py-1">
              {t('dashboard.modulos_directos', 'Módulos Directos (1 Clic)')}
            </p>
            {filteredDirect.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onSelect}
                  className={`relative w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2.5 cursor-pointer ${
                    item.isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {item.isActive && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-primary/12 border border-primary/30 shadow-2xs"
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 relative z-10 shrink-0 ${
                      item.accentClass ?? 'text-primary'
                    }`}
                  />
                  <span className="relative z-10 truncate">{item.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {filteredPrimary.length === 0 && filteredDirect.length === 0 && (
          <p className="text-xs text-muted-foreground px-3 py-4 text-center">
            {t('dashboard.sin_coincidencias_busqueda', {
              defaultValue: 'Sin coincidencias para “{{query}}”',
              query: searchQuery,
            })}
          </p>
        )}

        {/* Single Clean Site Return */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={onHome}
            className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 font-medium transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <span>{t('dashboard.sitio_principal', 'Sitio Principal')}</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Sidebar Bottom: Clickable Profile + Instant 1-Click Ticket Drawer */}
      <div className="pt-3 border-t border-border space-y-2.5">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-muted/40 hover:bg-muted border border-slate-300/75 dark:border-border transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4361EE] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {t('dashboard.editar_perfil_acceso', 'Editar perfil & acceso')}
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onOpenTicketModal) {
              onOpenTicketModal()
              onCloseSidebar()
            } else {
              onNavigate('sla')
            }
          }}
          className="w-full py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('dashboard.nuevo_ticket_directo', 'Nuevo Ticket Directo')}</span>
        </button>
      </div>
    </aside>
  )
}
