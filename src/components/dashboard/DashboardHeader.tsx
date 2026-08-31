'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../layout/LanguageSwitcher'
import ThemeToggle from '../layout/ThemeToggle'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface DashboardHeaderProps {
  userEmail?: string | null
  onLogout: () => void
}

export function DashboardHeader({ userEmail, onLogout }: Readonly<DashboardHeaderProps>) {
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 mb-6 p-3 sm:p-4 rounded-2xl bg-[#0D111A] border border-[#1E2638] shadow-sm flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        >
          {/* Dashdark X Style Logo Icon */}
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#4361EE]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#38BDF8]" />
          </div>
          <span className="text-white font-bold text-base sm:text-lg tracking-tight">ExeDash</span>
          <span className="text-[11px] font-mono text-[#64748B] ml-1">&lt;&gt;</span>
        </motion.a>

        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-[#151B28] hover:bg-[#1C2438] border border-[#1E2638] text-slate-300 transition-all shadow-sm"
        >
          <ArrowLeft size={13} className="text-[#38BDF8]" />
          <span>{t('dashboard.volver_exepaginasweb', 'Volver al Sitio')}</span>
        </motion.a>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Real-time SSL Security Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>SSL 100% SECURE</span>
          <span
            className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${
              prefersReducedMotion ? '' : 'animate-ping'
            }`}
          />
        </div>

        {/* Language Switcher Selector */}
        <LanguageSwitcher />

        {/* Theme Toggle Button */}
        <div className="p-1 rounded-xl bg-[#151B28] border border-[#1E2638] flex items-center justify-center shadow-sm">
          <ThemeToggle />
        </div>

        {/* User Email Indicator */}
        {userEmail && (
          <div className="hidden sm:block text-xs font-medium text-slate-300 bg-[#151B28] px-3 py-1.5 rounded-xl border border-[#1E2638] shadow-sm max-w-[200px] truncate">
            {userEmail}
          </div>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('dashboard.salir', 'Salir')}</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
