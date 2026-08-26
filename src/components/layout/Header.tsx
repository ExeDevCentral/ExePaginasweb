'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  LayoutDashboard,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Home,
  Layers,
  ShoppingBag,
  Send,
  MessageCircle,
  X,
  User,
} from 'lucide-react'
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
import { getWhatsAppUrl } from '../../core/utils/whatsappUtils'

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

  const whatsappUrl = getWhatsAppUrl('¡Hola ExePaginasWeb! Quiero consultar por un proyecto web.')

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#050508]/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
          : 'bg-white/90 dark:bg-[#050508]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.06]'
      }`}
      initial={{ y: -80, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Subtle bottom gradient glow */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-30'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[68px] gap-3 sm:gap-4">
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
              <span className="text-slate-900 dark:text-white text-sm font-black tracking-tight font-sans">
                EXE
              </span>
              <span className="text-yellow-500 dark:text-yellow-400 font-bold text-xs">{'//'}</span>
              <span className="text-slate-900 dark:text-white text-sm font-extrabold tracking-tight font-sans">
                PAGINASWEB
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-[10px] tracking-normal">
                .COM
              </span>
            </div>
          </motion.a>

          {/* Navegación Central Flotante (Desktop Pill Island Pro) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/90 dark:bg-[#0e101c]/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-inner shrink-0">
            {/* Inicio */}
            <motion.a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'home'
                  ? 'text-cyan-700 dark:text-cyan-300 font-bold bg-white dark:bg-cyan-500/15 border border-slate-200 dark:border-cyan-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 border border-transparent'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.inicio')}</span>
            </motion.a>

            {/* Sistemas */}
            <motion.a
              href="#products"
              onClick={(e) => scrollToSection(e, 'products')}
              className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'products'
                  ? 'text-cyan-700 dark:text-cyan-300 font-bold bg-white dark:bg-cyan-500/15 border border-slate-200 dark:border-cyan-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 border border-transparent'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.productos')}</span>
            </motion.a>

            {/* Cotizador */}
            <motion.a
              href="/cotizador"
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/30 transition-all duration-200 select-none group"
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles
                size={12}
                className="text-emerald-500 opacity-90 group-hover:scale-110 transition-transform"
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
              className="relative flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 transition-all duration-200 select-none group"
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.tienda_online')}</span>
              <ExternalLink
                size={11}
                className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </motion.a>

            {/* Contacto */}
            <motion.a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`relative px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-full transition-all duration-200 select-none ${
                activeId === 'contact'
                  ? 'text-cyan-700 dark:text-cyan-300 font-bold bg-white dark:bg-cyan-500/15 border border-slate-200 dark:border-cyan-500/30 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 border border-transparent'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <span>{t('nav.contacto')}</span>
            </motion.a>
          </nav>

          {/* Acciones Derecha Desktop */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Dock de utilidades (Idioma + Modo Oscuro) */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100/90 dark:bg-[#0e101c]/90 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shrink-0">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Auth / Dashboard o CTA Principal */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="h-9 px-4 text-xs font-bold rounded-full border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 shadow-sm shrink-0 select-none cursor-pointer"
                  whileTap={{ scale: 0.96 }}
                >
                  <LayoutDashboard
                    size={13}
                    className="shrink-0 text-cyan-600 dark:text-cyan-400"
                  />
                  <span>{t('nav.panel_cliente')}</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="h-9 w-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
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
                className="relative group overflow-hidden h-9 px-4 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer"
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
            {/* Dock de utilidades para móvil */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-slate-100/90 dark:bg-[#0e101c]/90 border border-slate-200/80 dark:border-white/10 shrink-0">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* Botón Hamburguesa con MorphIcon */}
            <motion.button
              className="w-9 h-9 flex items-center justify-center border border-slate-200/80 dark:border-white/15 text-slate-800 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 bg-white dark:bg-[#0c0d14] hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-md transition-all duration-200 rounded-xl shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shadow-sm cursor-pointer"
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

      {/* Menu Mobile / Drawer Desplegable con FONDO 100% OPACO SÓLIDO (Cero transparencia / Cero superposición con la página) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            key="mob-drawer"
            className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-50 flex flex-col bg-white dark:bg-[#07080f] border-t border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
            style={{
              height: 'calc(100dvh - 64px)',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Cabecera del Drawer */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0c0d18]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Navegación
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 cursor-pointer active:scale-95 transition-all"
              >
                <X size={13} className="shrink-0" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Lista de enlaces limpia y 100% opaca */}
            <nav
              data-lenis-prevent
              className="flex flex-col px-5 py-4 gap-2 flex-1 overflow-y-auto bg-white dark:bg-[#07080f]"
            >
              {/* Enlace Inicio */}
              <motion.a
                href="#home"
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  activeId === 'home'
                    ? 'bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-500/50 dark:border-cyan-500/60 text-cyan-700 dark:text-cyan-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0e101c] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:border-cyan-500/40 hover:bg-slate-100 dark:hover:bg-[#141728]'
                }`}
                onClick={(e) => scrollToSection(e, 'home')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Home size={16} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('nav.inicio')}
                  </span>
                </div>
                {activeId === 'home' && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold">
                    Activo
                  </span>
                )}
              </motion.a>

              {/* Enlace Sistemas */}
              <motion.a
                href="#products"
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  activeId === 'products'
                    ? 'bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-500/50 dark:border-cyan-500/60 text-cyan-700 dark:text-cyan-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0e101c] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:border-cyan-500/40 hover:bg-slate-100 dark:hover:bg-[#141728]'
                }`}
                onClick={(e) => scrollToSection(e, 'products')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <Layers size={16} className="text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('nav.productos')}
                  </span>
                </div>
                {activeId === 'products' && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold">
                    Activo
                  </span>
                )}
              </motion.a>

              {/* Enlace Cotizador */}
              <motion.a
                href="/cotizador"
                className="p-3.5 rounded-xl border bg-slate-50 dark:bg-[#0e101c] border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                      {t('nav.cotizador')}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold">
                      PRO
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-emerald-500 dark:text-emerald-400" />
              </motion.a>

              {/* Enlace Tienda Online */}
              <motion.a
                href="/tienda"
                className="p-3.5 rounded-xl border bg-slate-50 dark:bg-[#0e101c] border-cyan-500/30 dark:border-cyan-500/40 hover:border-cyan-400 transition-all flex items-center justify-between"
                onClick={(e) => {
                  e.preventDefault()
                  setIsMenuOpen(false)
                  navigate('/tienda')
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 dark:bg-cyan-500/20 border border-cyan-500/30 dark:border-cyan-500/40 flex items-center justify-center shrink-0">
                    <ShoppingBag size={16} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-sm font-extrabold text-cyan-700 dark:text-cyan-300">
                    {t('nav.tienda_online')}
                  </span>
                </div>
                <ExternalLink size={15} className="text-cyan-600 dark:text-cyan-400" />
              </motion.a>

              {/* Enlace Contacto */}
              <motion.a
                href="#contact"
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  activeId === 'contact'
                    ? 'bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-500/50 dark:border-cyan-500/60 text-cyan-700 dark:text-cyan-300 font-bold'
                    : 'bg-slate-50 dark:bg-[#0e101c] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:border-cyan-500/40 hover:bg-slate-100 dark:hover:bg-[#141728]'
                }`}
                onClick={(e) => scrollToSection(e, 'contact')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Send size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t('nav.contacto')}
                  </span>
                </div>
                {activeId === 'contact' && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold">
                    Activo
                  </span>
                )}
              </motion.a>

              {/* Botón WhatsApp Directo */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="mt-1 p-3.5 rounded-xl border bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-500/30 dark:border-emerald-500/40 hover:bg-emerald-500/20 dark:hover:bg-emerald-900/60 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="fill-slate-950 stroke-emerald-300" />
                  </div>
                  <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                    WhatsApp Directo ⚡
                  </span>
                </div>
                <ChevronRight size={16} className="text-emerald-600 dark:text-emerald-400" />
              </a>

              {/* Panel de cliente / Sesión si está logueado */}
              {isLoggedIn && (
                <div className="mt-2 p-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-950/40 border border-cyan-500/25 dark:border-cyan-500/30 flex flex-col gap-1.5">
                  <motion.button
                    onClick={() => {
                      navigate('/dashboard')
                      setIsMenuOpen(false)
                    }}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold text-cyan-700 dark:text-cyan-300 text-left flex items-center justify-between bg-cyan-500/10 hover:bg-cyan-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard size={15} className="text-cyan-600 dark:text-cyan-400" />
                      <span>{t('nav.panel_cliente')}</span>
                    </div>
                    <ChevronRight size={14} />
                  </motion.button>

                  <motion.button
                    onClick={handleLogout}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 text-left flex items-center gap-2 hover:bg-rose-500/10"
                  >
                    <LogOut size={14} />
                    <span>{t('nav.cerrar_sesion')}</span>
                  </motion.button>
                </div>
              )}

              {/* Botón Área de Cliente inferior */}
              <div className="mt-auto pt-4 pb-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={goToClientArea}
                  className="w-full py-3.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 active:scale-[0.99] transition-all rounded-xl shadow-lg shadow-cyan-500/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <User size={14} />
                  <span>{isLoggedIn ? t('nav.panel_cliente') : t('nav.area_cliente')}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
