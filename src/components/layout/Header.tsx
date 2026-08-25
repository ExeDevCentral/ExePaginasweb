'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, LayoutDashboard, ExternalLink, Sparkles, ChevronRight } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { Menu as MenuData, X as XData } from 'lucide'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { SCROLL_OFFSET, SECTION_IDS } from '../landing/constants'
import { useRouter } from 'next/navigation'
import { useAuthRole } from '../../core/auth/userAuth'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'
import { toast } from 'sonner'
import { navigateToSection } from '../shared/ScrollProvider'

const ALL_SECTION_IDS = Array.from(SECTION_IDS)

const Header = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const navigate = (path: string) => router.push(path)
  const { user, signOut } = useAuthRole()
  const isLoggedIn = user !== null

  useEffect(() => {
    let prevScrolled = false
    const onScroll = () => {
      const isPast = window.scrollY > 16
      if (isPast !== prevScrolled) {
        prevScrolled = isPast
        setScrolled(isPast)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const activeId = useScrollSpy(ALL_SECTION_IDS, { offset: SCROLL_OFFSET })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsMenuOpen(false)
    navigateToSection(id, { offset: 70 })
  }

  const handleLogout = async () => {
    await signOut()
    setIsMenuOpen(false)
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  const goToClientArea = () => {
    setIsMenuOpen(false)
    navigate(isLoggedIn ? '/dashboard' : '/login')
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#050508]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle bottom gradient glow on scroll */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[68px] gap-4">
          {/* Logo & Marca (Izquierda) */}
          <motion.a
            href="#home"
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            whileTap={{ scale: 0.98 }}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <Logo
              size={32}
              className="h-8 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-foreground text-sm font-extrabold tracking-tight font-sans">
                EXE
              </span>
              <span className="text-yellow-500 dark:text-yellow-400 font-semibold text-xs">
                {'//'}
              </span>
              <span className="text-foreground text-sm font-bold tracking-tight font-sans">
                PAGINASWEB
              </span>
              <span className="text-muted-foreground font-medium text-[10px] tracking-normal">
                .COM
              </span>
            </div>
          </motion.a>

          {/* Navegación Central Flotante (Pill Island Pro) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.08] backdrop-blur-xl shadow-inner shrink-0">
            {/* Inicio */}
            <motion.a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className={`relative px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'home'
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-white dark:bg-white/[0.1] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.inicio')}</span>
            </motion.a>

            {/* Sistemas */}
            <motion.a
              href="#products"
              onClick={(e) => scrollToSection(e, 'products')}
              className={`relative px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'products'
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-white dark:bg-white/[0.1] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.productos')}</span>
            </motion.a>

            {/* Cotizador */}
            <motion.a
              href="/cotizador"
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-full text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 select-none group"
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles
                size={12}
                className="text-emerald-500 opacity-80 group-hover:scale-110 transition-transform"
              />
              <span>{t('nav.cotizador')}</span>
            </motion.a>

            {/* Tienda Online */}
            <motion.a
              href="/tienda"
              onClick={(e) => {
                e.preventDefault()
                navigate('/tienda')
              }}
              className="relative flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-full text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 select-none group"
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.tienda_online')}</span>
              <ExternalLink
                size={11}
                className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </motion.a>

            {/* Contacto */}
            <motion.a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`relative px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'contact'
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-white dark:bg-white/[0.1] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06]'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.contacto')}</span>
            </motion.a>
          </nav>

          {/* Acciones Derecha (Utilidades + CTA Premium) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Dock de utilidades (Idioma + Modo Oscuro) */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/60 dark:border-white/[0.08] backdrop-blur-md shrink-0">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Auth / Dashboard o CTA Principal */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="h-9 px-4 text-xs font-semibold rounded-full border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 shadow-sm shrink-0 select-none cursor-pointer"
                  whileTap={{ scale: 0.96 }}
                >
                  <LayoutDashboard size={13} className="shrink-0 text-cyan-500" />
                  <span>{t('nav.panel_cliente')}</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                  whileTap={{ scale: 0.96 }}
                  title={t('nav.cerrar_sesion')}
                  aria-label={t('nav.cerrar_sesion')}
                >
                  <LogOut size={14} className="shrink-0" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                onClick={goToClientArea}
                className="relative group overflow-hidden h-9 px-4 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer"
                whileTap={{ scale: 0.96 }}
              >
                <span>{t('nav.area_cliente')}</span>
                <ChevronRight
                  size={13}
                  className="text-white/80 group-hover:translate-x-0.5 transition-transform"
                />
              </motion.button>
            )}
          </div>

          {/* Mobile / Tablet controls (pantallas < lg: 1024px) */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <motion.button
              className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-200 hover:text-foreground bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-all duration-200 rounded-xl shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shadow-sm cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <MorphIcon icon={isMenuOpen ? XData : MenuData} size={18} spring="snappy" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu Mobile / Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mob-backdrop"
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu-drawer"
              key="mob-drawer"
              className="lg:hidden fixed top-16 left-0 w-full z-50 flex flex-col bg-card/95 backdrop-blur-2xl border-t border-border shadow-2xl overflow-hidden"
              style={{
                height: 'calc(100dvh - 64px)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/70 bg-muted/30">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navegación
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs font-semibold text-foreground hover:text-cyan-500 px-3 py-1 rounded-lg border border-border bg-background cursor-pointer"
                >
                  ✕ Cerrar
                </button>
              </div>

              <nav
                data-lenis-prevent
                className="flex flex-col px-6 py-5 gap-2 flex-1 overflow-y-auto"
              >
                {/* Inicio */}
                <motion.a
                  href="#home"
                  className={`py-3 px-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    activeId === 'home'
                      ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-muted/60'
                  }`}
                  onClick={(e) => scrollToSection(e, 'home')}
                >
                  <span>{t('nav.inicio')}</span>
                  {activeId === 'home' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                </motion.a>

                {/* Sistemas */}
                <motion.a
                  href="#products"
                  className={`py-3 px-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    activeId === 'products'
                      ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-muted/60'
                  }`}
                  onClick={(e) => scrollToSection(e, 'products')}
                >
                  <span>{t('nav.productos')}</span>
                  {activeId === 'products' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  )}
                </motion.a>

                {/* Cotizador */}
                <motion.a
                  href="/cotizador"
                  className="py-3 px-3.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sparkles size={14} className="text-emerald-500" />
                  <span>{t('nav.cotizador')}</span>
                </motion.a>

                {/* Tienda */}
                <motion.a
                  href="/tienda"
                  className="py-3 px-3.5 rounded-xl text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-between"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    navigate('/tienda')
                  }}
                >
                  <span>{t('nav.tienda_online')}</span>
                  <ExternalLink size={13} className="opacity-70" />
                </motion.a>

                {/* Contacto */}
                <motion.a
                  href="#contact"
                  className={`py-3 px-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    activeId === 'contact'
                      ? 'text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-500/10'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-muted/60'
                  }`}
                  onClick={(e) => scrollToSection(e, 'contact')}
                >
                  <span>{t('nav.contacto')}</span>
                  {activeId === 'contact' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  )}
                </motion.a>

                {/* Auth dashboard if logged in */}
                {isLoggedIn && (
                  <>
                    <div className="my-2 border-t border-border/50" />
                    <motion.button
                      onClick={() => {
                        navigate('/dashboard')
                        setIsMenuOpen(false)
                      }}
                      className="py-3 px-3.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 text-left flex items-center gap-2 hover:bg-muted/60"
                    >
                      <LayoutDashboard size={16} className="text-cyan-500" />
                      <span>{t('nav.panel_cliente')}</span>
                    </motion.button>

                    <motion.button
                      onClick={handleLogout}
                      className="py-3 px-3.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 text-left flex items-center gap-2 hover:bg-rose-500/10"
                    >
                      <LogOut size={16} />
                      <span>{t('nav.cerrar_sesion')}</span>
                    </motion.button>
                  </>
                )}

                {/* Controls and CTA at the bottom */}
                <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
                  <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-xs font-medium text-muted-foreground">Configuración</span>
                    <div className="flex items-center gap-2 p-1 rounded-full bg-muted/60 border border-border">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToClientArea}
                    className="w-full py-3.5 text-xs font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 active:scale-[0.99] transition-all rounded-xl shadow-md shadow-cyan-500/25 cursor-pointer"
                  >
                    {t('nav.area_cliente')}
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
