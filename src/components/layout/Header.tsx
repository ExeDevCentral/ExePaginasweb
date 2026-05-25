import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Home, Cpu, Sparkles, ShoppingBag, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { NAV_ITEMS, SCROLL_OFFSET } from '../landing/constants'
import { useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../core/auth/userAuth'
import { ADMIN_EMAILS } from '../../core/auth/roleConfig'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuthRole(ADMIN_EMAILS)
  const isLoggedIn = user !== null

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const activeId = useScrollSpy([...NAV_ITEMS.map(item => item.id)], { offset: SCROLL_OFFSET })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      className="fixed top-0 w-full z-50 border-b border-accent-cyan/20 bg-primary-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-primary-bg/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={(e) => scrollToSection(e, 'home')}
          >
            <img 
              src="/logo-40.webp"
              srcSet="/logo-40.webp 1x, /logo.webp 2x"
              alt="ExeSistemasWEB Logo" 
              loading="eager" 
              fetchPriority="high"
              width="40"
              height="40"
              className="w-10 h-10 rounded-xl shadow-lg shadow-accent-cyan/20 border border-accent-cyan/30 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />

            <span className="bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-xl font-bold tracking-tight text-transparent font-montserrat">ExeSistemasWEB</span>
          </motion.a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-accent-cyan'
                      : 'text-primary-secondary hover:text-accent-cyan'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta" />
                  )}
                </motion.a>
              )
            })}
            <motion.a
              href="/tienda"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-sm font-medium text-accent-magenta hover:text-accent-cyan transition-colors duration-300 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Tienda Online
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </motion.a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-bold text-accent-cyan hover:text-white transition-colors px-4"
                  whileHover={{ scale: 1.05 }}
                >
                  Mi Panel
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="text-sm font-bold text-white/50 hover:text-accent-magenta transition-colors px-2 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <LogOut size={14} />
                  Cerrar Sesión
                </motion.button>
              </>
            ) : null}
            <motion.button
              type="button"
              onClick={goToClientArea}
              className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-2 text-sm font-semibold text-primary-bg shadow-md shadow-accent-cyan/20 transition-all hover:shadow-lg hover:shadow-accent-cyan/30"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Clientes
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Menú principal"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.button>
        </div>

        {/* Mobile Menu Premium Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay oscuro detrás del menú */}
              <motion.div
                key="mobile-overlay"
                className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menú propiamente dicho */}
              <motion.div
                key="mobile-menu"
                className="md:hidden fixed top-[73px] left-0 w-full bg-[#050508] border-b border-accent-cyan/20 h-[calc(100dvh-73px)] flex flex-col overflow-y-auto z-50"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-accent-cyan/5 blur-[100px]" />
                  <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent-magenta/5 blur-[90px]" />
                </div>

                <nav className="relative flex flex-col px-5 pt-10 pb-8 gap-1 flex-1">
                  {/* Nav items (sin Contacto — va como CTA abajo) */}
                  {NAV_ITEMS.filter(i => i.id !== 'contact').map((item, index) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      home: <Home size={22} />,
                      products: <Cpu size={22} />,
                      features: <Sparkles size={22} />,
                    }
                    const isActive = activeId === item.id
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.03, x: 6 }}
                        whileTap={{ scale: 0.96 }}
                        className={`group flex items-center gap-4 text-lg font-bold tracking-wide py-3.5 px-4 -mx-2 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-accent-cyan/15 to-accent-magenta/10 text-white border border-accent-cyan/20 shadow-lg shadow-accent-cyan/5'
                            : 'text-white/80 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                        onClick={(e) => { setIsMenuOpen(false); scrollToSection(e, item.id) }}
                      >
                        <span className={`shrink-0 ${isActive ? 'text-accent-cyan' : 'text-white/40 group-hover:text-accent-cyan'} transition-colors`}>
                          {iconMap[item.id]}
                        </span>
                        <span className={isActive ? 'bg-gradient-to-r from-accent-cyan to-white bg-clip-text text-transparent' : ''}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                        )}
                      </motion.a>
                    )
                  })}

                  <div className="h-px bg-gradient-to-r from-accent-cyan/30 via-accent-magenta/30 to-transparent my-3 mx-2" />

                  {/* Tienda */}
                  <motion.a
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3 * 0.06, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.03, x: 6 }}
                    whileTap={{ scale: 0.96 }}
                    href="/tienda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 text-lg font-bold tracking-wide py-3.5 px-4 -mx-2 rounded-2xl text-accent-magenta hover:text-white hover:bg-accent-magenta/10 border border-transparent hover:border-accent-magenta/20 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={22} className="shrink-0 text-accent-magenta/70 group-hover:text-accent-magenta transition-colors" />
                    <span>Tienda Online</span>
                    <svg className="ml-auto w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </motion.a>

                  <div className="h-px bg-gradient-to-r from-accent-magenta/30 via-accent-cyan/30 to-transparent my-3 mx-2" />

                  {/* Auth section */}
                  {isLoggedIn ? (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 4 * 0.06, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.03, x: 6 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { navigate('/dashboard'); setIsMenuOpen(false) }}
                        className="group flex items-center gap-4 text-lg font-bold tracking-wide py-3.5 px-4 -mx-2 rounded-2xl text-accent-cyan hover:text-white hover:bg-accent-cyan/10 border border-transparent hover:border-accent-cyan/20 transition-all duration-200 w-full text-left"
                      >
                        <LayoutDashboard size={22} className="shrink-0 text-accent-cyan/70 group-hover:text-accent-cyan transition-colors" />
                        <span>Mi Panel</span>
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 5 * 0.06, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.03, x: 6 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleLogout}
                        className="group flex items-center gap-4 text-lg font-bold tracking-wide py-3.5 px-4 -mx-2 rounded-2xl text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 w-full text-left"
                      >
                        <LogOut size={22} className="shrink-0 text-red-400/50 group-hover:text-red-300 transition-colors" />
                        <span>Cerrar Sesión</span>
                      </motion.button>
                    </>
                  ) : null}

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4 * 0.06, type: 'spring', stiffness: 150 }}
                    className="pt-6 mt-auto"
                  >
                    <button
                      type="button"
                      onClick={goToClientArea}
                      className="group relative block w-full text-center overflow-hidden rounded-2xl bg-gradient-to-r from-accent-cyan via-accent-cyan/80 to-accent-magenta px-6 py-4 text-lg font-black text-white shadow-xl shadow-accent-cyan/25 active:scale-[0.97] transition-all duration-150"
                    >
                      <span className="relative z-10 tracking-wide">Clientes</span>
                    </button>
                  </motion.div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
