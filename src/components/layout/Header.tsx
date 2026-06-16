import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { NAV_ITEMS, SCROLL_OFFSET } from '../landing/constants'
import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../core/auth/userAuth'
import { ADMIN_EMAILS } from '../../core/auth/roleConfig'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

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
  const { user, signOut } = useAuthRole(ADMIN_EMAILS)
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
    }
  }

  const handleLogout = async () => {
    await signOut()
    setIsMenuOpen(false)
    navigate('/login')
  }

  const goToClientArea = () => {
    setIsMenuOpen(false)
    navigate(isLoggedIn ? '/dashboard' : '/login')
  }

  return (
    <motion.header
      style={{
        background: scrolled ? 'rgba(5, 5, 7, 0.95)' : 'rgba(10, 10, 12, 1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 242, 254, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
      }}
      className="fixed top-0 w-full z-50 transition-all duration-300 font-mono"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-[70px]">
          
          {/* Logo & Nombre */}
          <motion.a
            href="#home"
            className="flex items-center gap-3 cursor-pointer select-none group"
            whileTap={{ scale: 0.98 }}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <div className="w-8 h-8 overflow-hidden shrink-0 border border-zinc-800 group-hover:border-[#00f2fe] transition-colors duration-300">
              <img
                src="/logo-40.webp"
                srcSet="/logo-40.webp 1x, /logo.webp 2x"
                alt="Logo"
                loading="eager"
                fetchPriority="high"
                width="32"
                height="32"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
            <span className="text-zinc-100 text-xs font-bold tracking-widest uppercase flex items-center gap-1">
              EXE<span className="text-[#00f2fe] font-light">//</span>SISTEMAS<span className="text-zinc-500 font-light">.WEB</span>
            </span>
          </motion.a>

          {/* Links Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="relative px-3 py-2 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color: isActive ? '#00f2fe' : 'rgba(240, 240, 245, 0.6)',
                  }}
                  whileHover={{ color: '#00f2fe' }}
                >
                  <span className="relative z-10">{t(navLabelKeys[item.id] || item.label)}</span>
                  
                  {/* Underline animado */}
                  <span
                    className="absolute bottom-1.5 left-3 right-3 h-[1px] bg-[#00f2fe] transition-transform duration-300 origin-left"
                    style={{
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                  {/* Underline hover effect */}
                  <span className="absolute bottom-1.5 left-3 right-3 h-[1px] bg-[#00f2fe] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                </motion.a>
              )
            })}

            <span className="w-px h-3 mx-2 shrink-0 bg-zinc-800" />

            {/* Tienda Online */}
            <motion.a
              href="/tienda"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-1 px-3 py-2 text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 text-[#00f2fe]/80 hover:text-[#00f2fe]"
            >
              <span>{t('nav.tienda_online')}</span>
              <ExternalLink size={10} className="opacity-70" />
              <span className="absolute bottom-1.5 left-3 right-5 h-[1px] bg-[#00f2fe]/40 transition-transform duration-300 origin-left scale-x-0 hover:scale-x-100" />
            </motion.a>
          </nav>

          {/* Botones Derecha */}
          <div className="hidden md:flex items-center gap-3">
            {/* Idioma + Modo Oscuro */}
            <div className="flex items-center gap-1.5 mr-1 border-r border-zinc-800 pr-3">
              <div className="text-zinc-400 hover:text-white transition-colors duration-200">
                <LanguageSwitcher />
              </div>
              <div className="text-zinc-400 hover:text-white transition-colors duration-200">
                <ThemeToggle />
              </div>
            </div>

            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase border border-zinc-800 text-zinc-300 hover:border-[#00f2fe] hover:text-[#00f2fe] transition-all duration-300 rounded-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  <LayoutDashboard size={12} />
                  {t('nav.panel_cliente')}
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-zinc-500 hover:text-red-400 transition-colors duration-200"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={12} />
                  {t('nav.cerrar_sesion')}
                </motion.button>
              </div>
            )}

            {/* CTA principal - Borde neón sutil, sin glow, rectangular */}
            <motion.button
              type="button"
              onClick={goToClientArea}
              className="px-4 py-2 text-[11px] font-bold tracking-wider uppercase border border-[#00f2fe] text-[#00f2fe] bg-transparent hover:bg-[#00f2fe] hover:text-black transition-all duration-300 rounded-sm"
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('nav.area_cliente')}</span>
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden w-10 h-10 flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#00f2fe] transition-all duration-200 rounded-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Menú principal"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mob-backdrop"
              className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="mob-drawer"
              className="md:hidden fixed top-16 left-0 w-full z-50 flex flex-col bg-[#050507] border-t border-zinc-800"
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
                      className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60"
                      style={{
                        color: isActive ? '#00f2fe' : 'rgba(240, 240, 245, 0.65)',
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

                {/* Tienda */}
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3 * 0.05 }}
                  href="/tienda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 text-xs font-bold tracking-widest uppercase border-b border-zinc-900/60 text-[#00f2fe]/80 flex items-center gap-1.5"
                  onClick={() => setIsMenuOpen(false)}
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
                      transition={{ delay: 4 * 0.05 }}
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
                      transition={{ delay: 5 * 0.05 }}
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
                    <span className="text-[10px] text-zinc-500 tracking-wider uppercase">System Config</span>
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
