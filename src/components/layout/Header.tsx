import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, LayoutDashboard, ExternalLink, MessageCircle } from 'lucide-react'
import { MorphIcon } from 'morphicons/react'
import { Menu as MenuData, X as XData } from 'lucide'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { NAV_ITEMS, SCROLL_OFFSET } from '../landing/constants'
import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../core/auth/userAuth'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'
import { toast } from 'sonner'

const navLabelKeys: Record<string, string> = {
  home: 'nav.inicio',
  products: 'nav.productos',
  features: 'nav.casos',
  contact: 'nav.contacto',
}

const Header = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuthRole()
  const isLoggedIn = user !== null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const activeId = useScrollSpy([...NAV_ITEMS.map((item) => item.id)], { offset: SCROLL_OFFSET })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      e.preventDefault()
      navigate('/#' + id)
    }
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
      style={{
        background: scrolled ? 'var(--background)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}
      className="fixed top-0 w-full z-50 transition-all duration-300 font-mono"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {scrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent blur-sm"
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[70px] gap-2">
          {/* Logo & Nombre */}
          <motion.a
            href="#home"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0 whitespace-nowrap"
            whileTap={{ scale: 0.98 }}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <Logo size={36} className="h-9 w-auto shrink-0" />
            <span className="text-foreground text-xs font-bold tracking-widest uppercase flex items-center gap-1 shrink-0 whitespace-nowrap">
              EXE<span className="text-yellow-400 font-light">//</span>PAGINASWEB
              <span className="text-muted-foreground font-light">.COM</span>
            </span>
          </motion.a>

          {/* Links Desktop (visibles en pantallas xl: 1280px+) */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="relative px-2.5 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 group shrink-0 whitespace-nowrap"
                  style={{
                    color: isActive ? 'var(--accent-cyan)' : 'var(--muted-foreground)',
                  }}
                  whileHover={{ color: 'var(--accent-cyan)' }}
                >
                  <span className="relative z-10 whitespace-nowrap">
                    {t(navLabelKeys[item.id] || item.label)}
                  </span>

                  {/* Glow on hover */}
                  <span className="absolute inset-0 rounded-sm bg-[#00f2fe]/0 group-hover:bg-[#00f2fe]/5 transition-colors duration-300" />

                  {/* Underline animado */}
                  <span
                    className="absolute bottom-1 left-2.5 right-2.5 h-[1px] bg-[#00f2fe] transition-transform duration-300 origin-left"
                    style={{
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  <span className="absolute bottom-1 left-2.5 right-2.5 h-[1px] bg-[#00f2fe] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                </motion.a>
              )
            })}

            {/* Cotizador */}
            <motion.a
              href="/cotizador"
              className="relative flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 text-emerald-400/80 hover:text-emerald-400 group shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{t('nav.cotizador')}</span>
              <span className="absolute bottom-1 left-2.5 right-2.5 h-[1px] bg-emerald-400/40 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </motion.a>

            <span className="w-px h-3 mx-1 shrink-0 bg-zinc-800" />

            {/* Tienda Online */}
            <motion.a
              href="/tienda"
              onClick={(e) => {
                e.preventDefault()
                navigate('/tienda')
              }}
              className="relative flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 text-[#00f2fe]/80 hover:text-[#00f2fe] group shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{t('nav.tienda_online')}</span>
              <ExternalLink
                size={10}
                className="opacity-70 group-hover:rotate-45 transition-transform duration-300 shrink-0"
              />
              <span className="absolute bottom-1 left-2.5 right-2.5 h-[1px] bg-[#00f2fe]/40 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </motion.a>
          </nav>

          {/* Botones Derecha */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {/* Idioma + Modo Oscuro + WhatsApp */}
            <div className="flex items-center gap-1.5 mr-1 border-r border-zinc-800 pr-2 shrink-0">
              <div className="text-zinc-400 hover:text-white transition-colors duration-200">
                <LanguageSwitcher />
              </div>
              <div className="text-zinc-400 hover:text-white transition-colors duration-200">
                <ThemeToggle />
              </div>
              <a
                href="https://wa.me/5493416874786?text=¡Hola%20ExePaginasWeb!%20Me%20contacto%20desde%20la%20web."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contacto directo por WhatsApp"
                title="WhatsApp Directo"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300 text-xs font-bold shadow-sm group shrink-0"
              >
                <MessageCircle
                  size={15}
                  className="fill-emerald-500/30 stroke-current group-hover:rotate-12 transition-transform duration-300"
                />
                <span>WhatsApp</span>
              </a>
            </div>

            {isLoggedIn && (
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider uppercase border border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-accent-cyan hover:text-accent-cyan transition-all duration-300 rounded-md shrink-0 whitespace-nowrap bg-white/80 dark:bg-black/40 shadow-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  <LayoutDashboard size={13} className="shrink-0 text-accent-cyan" />
                  <span className="whitespace-nowrap">{t('nav.panel_cliente')}</span>
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors duration-200 shrink-0 whitespace-nowrap"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={13} className="shrink-0" />
                  <span className="whitespace-nowrap">{t('nav.cerrar_sesion')}</span>
                </motion.button>
              </div>
            )}

            {/* CTA principal */}
            <motion.button
              type="button"
              onClick={goToClientArea}
              className="px-3.5 py-1.5 text-xs font-extrabold tracking-wider uppercase border border-accent-cyan text-cyan-600 dark:text-accent-cyan bg-accent-cyan/10 hover:bg-accent-cyan hover:text-white transition-all duration-300 rounded-md shrink-0 whitespace-nowrap shadow-sm"
              whileTap={{ scale: 0.98 }}
            >
              <span className="whitespace-nowrap">{t('nav.area_cliente')}</span>
            </motion.button>
          </div>

          {/* Mobile / Tablet controls (visible en pantallas menores a xl: < 1280px) */}
          <div className="xl:hidden flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/5493416874786?text=¡Hola%20ExePaginasWeb!%20Me%20contacto%20desde%20la%20web."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacto por WhatsApp"
              className="w-10 h-10 flex items-center justify-center border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-200 rounded-md shrink-0"
              title="WhatsApp Directo"
            >
              <MessageCircle size={18} className="fill-emerald-500/20 stroke-current" />
            </a>

            <motion.button
              className="w-10 h-10 flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#00f2fe] transition-all duration-200 rounded-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2fe]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              <MorphIcon icon={isMenuOpen ? XData : MenuData} size={20} spring="snappy" />
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
              className="xl:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
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
              className="xl:hidden fixed top-16 left-0 w-full z-50 flex flex-col bg-background border-t border-border"
              style={{
                height: 'calc(100dvh - 64px)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col px-6 py-8 gap-4 flex-1 overflow-y-auto">
                {NAV_ITEMS.filter((i) => i.id !== 'contact').map((item, index) => {
                  const isActive = activeId === item.id
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-border/40"
                      style={{
                        color: isActive ? 'var(--accent-cyan)' : 'var(--muted-foreground)',
                      }}
                      onClick={(e) => {
                        setIsMenuOpen(false)
                        scrollToSection(e, item.id)
                      }}
                    >
                      <span>{t(navLabelKeys[item.id] || item.label)}</span>
                    </motion.a>
                  )
                })}

                {/* Cotizador */}
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3 * 0.05 }}
                  href="/cotizador"
                  className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60 text-emerald-400/80 flex items-center gap-1.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{t('nav.cotizador')}</span>
                </motion.a>

                {/* Tienda */}
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 4 * 0.05 }}
                  href="/tienda"
                  className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60 text-[#00f2fe]/80 flex items-center gap-1.5"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    navigate('/tienda')
                  }}
                >
                  <span>{t('nav.tienda_online')}</span>
                  <ExternalLink size={11} className="opacity-70" />
                </motion.a>

                {/* Auth dashboard if logged in */}
                {isLoggedIn && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 5 * 0.05 }}
                      onClick={() => {
                        navigate('/dashboard')
                        setIsMenuOpen(false)
                      }}
                      className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60 text-zinc-300 text-left flex items-center gap-2"
                    >
                      <LayoutDashboard size={14} />
                      <span>{t('nav.panel_cliente')}</span>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 6 * 0.05 }}
                      onClick={handleLogout}
                      className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60 text-zinc-500 text-left flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>{t('nav.cerrar_sesion')}</span>
                    </motion.button>
                  </>
                )}

                {/* Controls and CTA at the bottom */}
                <div className="mt-auto pt-6 border-t border-zinc-900 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 tracking-wider uppercase">
                      System Config
                    </span>
                    <div className="flex items-center gap-3">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToClientArea}
                    className="w-full py-3 text-xs font-bold tracking-widest uppercase border border-[#00f2fe] text-[#00f2fe] bg-transparent active:bg-[#00f2fe] active:text-black transition-colors duration-200 rounded-sm"
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
