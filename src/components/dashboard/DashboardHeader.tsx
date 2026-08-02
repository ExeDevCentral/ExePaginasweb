import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../layout/Logo'
import ThemeToggle from '../layout/ThemeToggle'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface DashboardHeaderProps {
  userEmail?: string | null
  onLogout: () => void
}

export function DashboardHeader({ userEmail, onLogout }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 mb-8 p-3.5 sm:p-4 rounded-3xl bg-white/90 dark:bg-[#090a12]/80 border border-slate-200/90 dark:border-white/15 backdrop-blur-2xl shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        >
          <Logo
            className="h-9 w-auto"
            size={38}
            variant="auto"
            showText
            animated={!prefersReducedMotion}
            textClassName="text-slate-900 dark:text-white text-sm sm:text-base font-black tracking-widest uppercase font-mono"
          />
        </motion.a>

        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="hidden md:inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900/80 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft size={13} className="text-cyan-600 dark:text-cyan-400" />
          <span>{t('dashboard.volver_exepaginasweb')}</span>
        </motion.a>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Real-time SSL Security Badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/30 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="tracking-wider">SSL SECURE</span>
          <span
            className={`w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 ${
              prefersReducedMotion ? '' : 'animate-ping'
            }`}
          />
        </div>

        {/* Theme Toggle Sun (☀️) / Moon (🌙) Button */}
        <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-white/15 flex items-center justify-center shadow-sm">
          <ThemeToggle />
        </div>

        {/* User Email Indicator */}
        {userEmail && (
          <div className="hidden sm:block text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-300/80 dark:border-white/10 shadow-sm">
            {userEmail}
          </div>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-rose-300 dark:border-rose-500/20 bg-rose-100 dark:bg-rose-500/10 hover:bg-rose-200 dark:hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('dashboard.salir')}</span>
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
