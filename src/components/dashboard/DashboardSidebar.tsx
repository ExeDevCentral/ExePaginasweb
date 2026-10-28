/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { useState } from 'react'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  DollarSign,
  Settings,
  Globe,
  X,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DashboardView } from './DashboardView'

interface DashboardSidebarProps {
  sidebarOpen: boolean
  onCloseSidebar: () => void
  activeView: DashboardView
  onNavigate: (tab: DashboardView) => void
  onHome: () => void
  userName: string
  userInitial: string
}

export function DashboardSidebar({
  sidebarOpen,
  onCloseSidebar,
  activeView,
  onNavigate,
  onHome,
  userName,
  userInitial,
}: DashboardSidebarProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const activeCls = (view: DashboardView) =>
    activeView === view
      ? 'bg-primary/10 text-foreground font-semibold border-l-2 border-primary shadow-sm'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted'

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col justify-between p-4 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-5 overflow-y-auto scrollbar-none pr-1">
        {/* Logo & Collapse Header */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-2.5 cursor-pointer text-left bg-transparent border-none p-0"
          >
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#4361EE]" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm sm:text-base tracking-tight block leading-none">
                ExeSistemasWEB
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Panel de Clientes</span>
            </div>
          </button>
          <button
            type="button"
            onClick={onCloseSidebar}
            className="text-muted-foreground hover:text-foreground p-1 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="hidden md:inline-block text-xs font-mono text-muted-foreground">
            &lt;&gt;
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('dashboard.search_placeholder', 'Buscar servicios, facturas...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          {/* Dashboard Category */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-2 mb-2">
              <span className="flex items-center gap-2 text-foreground">
                <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                Panel Principal
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="space-y-1 pl-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3 py-1">
                Vistas Activas
              </p>
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${activeCls('overview')}`}
              >
                <span>Resumen General</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('services')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${activeCls('services')}`}
              >
                <span>Servicios Web & Turnos</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('sla')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${activeCls('sla')}`}
              >
                <span>Tickets & SLA</span>
              </button>
            </div>
          </div>

          {/* Other Categories */}
          <div className="space-y-1 pt-1 border-t border-border mb-4">
            <button
              type="button"
              onClick={() => onNavigate('sla')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Star className="w-3.5 h-3.5" />
                Garantías & SLA
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('workgroups')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5" />
                Equipo & Sedes
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('invoices')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${activeCls('invoices')}`}
            >
              <span className="flex items-center gap-2.5">
                <DollarSign className="w-3.5 h-3.5" />
                Facturas & Abonos
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Bottom Pages */}
          <div className="space-y-1 pt-2 border-t border-border mb-4">
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${activeCls('settings')}`}
            >
              <span className="flex items-center gap-2.5">
                <Settings className="w-3.5 h-3.5" />
                Configuración
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={onHome}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5" />
                Volver al Sitio Web
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Bottom Profile & Action Button */}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4361EE] to-[#38BDF8] flex items-center justify-center font-bold text-xs text-white shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">Cliente ExePaginasWeb</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('sla')}
          className="w-full py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Mesa de Ayuda & Tickets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
