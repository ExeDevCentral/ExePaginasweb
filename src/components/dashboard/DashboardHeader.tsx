/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../layout/LanguageSwitcher'
import ThemeToggle from '../layout/ThemeToggle'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { DashboardView } from './DashboardView'
import type { EcosystemSubTab } from '../services/ServicesPanel'

interface DashboardHeaderProps {
  userEmail?: string | null | undefined
  activeView?: DashboardView | undefined
  activeEcosystemTab?: EcosystemSubTab | undefined
  onNavigate?: ((tab: DashboardView) => void) | undefined
  onOpenEcosystemSubTab?: ((subTab: EcosystemSubTab) => void) | undefined
  onLogout: () => void
}

export function DashboardHeader({
  userEmail,
  activeView = 'overview',
  activeEcosystemTab = 'active',
  onNavigate,
  onOpenEcosystemSubTab,
  onLogout,
}: Readonly<DashboardHeaderProps>) {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  const quickTabs = [
    {
      id: 'q-overview',
      label: t('dashboard.quick_resumen', 'Resumen'),
      active: activeView === 'overview',
      onClick: () => onNavigate?.('overview'),
    },
    {
      id: 'q-ecosystem',
      label: t('dashboard.quick_servicios_tienda', 'Servicios & Tienda'),
      active:
        activeView === 'services' &&
        (activeEcosystemTab === 'active' || activeEcosystemTab === 'store'),
      onClick: () =>
        onOpenEcosystemSubTab ? onOpenEcosystemSubTab('active') : onNavigate?.('services'),
    },
    {
      id: 'q-linux',
      label: t('dashboard.quick_linux_pos', 'Linux POS'),
      active: activeView === 'services' && activeEcosystemTab === 'linux',
      onClick: () =>
        onOpenEcosystemSubTab ? onOpenEcosystemSubTab('linux') : onNavigate?.('services'),
    },
    {
      id: 'q-quoter',
      label: t('dashboard.quick_cotizar', 'Cotizar'),
      active: activeView === 'services' && activeEcosystemTab === 'quoter',
      onClick: () =>
        onOpenEcosystemSubTab ? onOpenEcosystemSubTab('quoter') : onNavigate?.('services'),
    },
    {
      id: 'q-sla',
      label: t('dashboard.quick_tickets', 'Tickets'),
      active: activeView === 'sla',
      onClick: () => onNavigate?.('sla'),
    },
    {
      id: 'q-invoices',
      label: t('dashboard.quick_facturas', 'Facturas'),
      active: activeView === 'invoices',
      onClick: () => onNavigate?.('invoices'),
    },
  ]

  return (
    <header className="sticky top-2 z-40 mb-5 p-2.5 sm:px-4 sm:py-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-slate-300/90 dark:border-border shadow-sm flex flex-wrap items-center justify-between gap-3 transition-all duration-300">
      <div className="flex items-center gap-2.5">
        <motion.button
          type="button"
          onClick={() => navigate('/')}
          aria-label={t('dashboard.sitio_web', 'Sitio Web')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-slate-300/80 dark:border-border text-foreground transition-all cursor-pointer"
          {...(!prefersReducedMotion
            ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } }
            : {})}
        >
          <ArrowLeft size={13} className="text-[#4361EE] dark:text-[#38BDF8]" />
          <span>{t('dashboard.sitio_web', 'Sitio Web')}</span>
        </motion.button>
      </div>

      {/* Barra central rápida de 1 clic con píldora elástica (Desktop) */}
      {onNavigate && (
        <nav
          aria-label={t('dashboard.cambio_rapido_vista', 'Cambio rápido de vista')}
          className="hidden xl:flex items-center gap-0.5 p-1 rounded-xl bg-slate-100/90 dark:bg-muted/50 border border-slate-300/85 dark:border-border"
        >
          {quickTabs.map((qt) => (
            <button
              key={qt.id}
              type="button"
              onClick={qt.onClick}
              className={`relative px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                qt.active
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-950 dark:text-muted-foreground dark:hover:text-foreground'
              }`}
            >
              {qt.active && (
                <motion.span
                  layoutId="header-quick-pill"
                  transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-[#4361EE] shadow-2xs"
                />
              )}
              <span className="relative z-10">{qt.label}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        <div className="hidden 2xl:flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>TLS 1.3</span>
        </div>

        <LanguageSwitcher />

        <div className="p-0.5 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
          <ThemeToggle />
        </div>

        {userEmail && (
          <button
            type="button"
            onClick={() => onNavigate?.('settings')}
            className="hidden sm:block text-xs font-medium text-foreground bg-muted/40 hover:bg-muted px-3 py-1.5 rounded-xl border border-border max-w-[180px] truncate cursor-pointer transition-colors"
            title={t('dashboard.ir_cuenta_ajustes', 'Ir a Cuenta & Ajustes')}
            aria-label={t('dashboard.ir_cuenta_ajustes', 'Ir a Cuenta & Ajustes')}
          >
            {userEmail}
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          aria-label={t('dashboard.salir', 'Salir')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold transition-all cursor-pointer active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('dashboard.salir', 'Salir')}</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
