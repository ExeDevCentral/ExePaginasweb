import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { NAV_ITEMS, SCROLL_OFFSET } from './constants'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../core/infra/supabase/client'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  // Bloquear scroll cuando el menú móvil está abierto
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

  // Usamos el hook personalizado para detectar la sección activa
  // Convertimos el array readonly a mutable para el hook
  const activeId = useScrollSpy([...NAV_ITEMS.map(item => item.id)], { offset: SCROLL_OFFSET })

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    navigate('/login')
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
            <motion.button
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-white/70 hover:text-accent-cyan transition-colors px-4"
              whileHover={{ scale: 1.05 }}
            >
              Área Clientes
            </motion.button>
            <motion.a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-2 text-sm font-semibold text-primary-bg shadow-md shadow-accent-cyan/20 transition-all hover:shadow-lg hover:shadow-accent-cyan/30"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => scrollToSection(e, 'contact')}
            >
              Contacto
            </motion.a>
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

                <nav className="relative flex flex-col px-6 pt-12 pb-8 space-y-1 flex-1">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.a
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      key={item.label}
                      href={item.href}
                      className={`text-xl font-bold tracking-wide transition-all duration-200 py-3 px-4 -mx-4 rounded-xl active:scale-[0.98] ${
                        activeId === item.id
                          ? 'text-accent-cyan bg-accent-cyan/8'
                          : 'text-white/90 hover:text-accent-cyan hover:bg-white/5'
                      }`}
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        scrollToSection(e, item.id);
                      }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  
                  <motion.a
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: NAV_ITEMS.length * 0.07 }}
                    href="/tienda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold tracking-wide text-accent-magenta hover:text-accent-cyan transition-all duration-200 flex items-center justify-between py-3 px-4 -mx-4 rounded-xl active:scale-[0.98]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tienda Online
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </motion.a>

                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (NAV_ITEMS.length + 1) * 0.07 }}
                    onClick={handleLogout}
                    className="text-xl font-bold tracking-wide text-accent-magenta/80 hover:text-accent-cyan transition-all duration-200 flex items-center justify-between py-3 px-4 -mx-4 rounded-xl active:scale-[0.98] w-full text-left"
                  >
                    Cerrar Sesión
                    <LogOut size={20} />
                  </motion.button>

                  <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (NAV_ITEMS.length + 2) * 0.07 }}
                    className="pt-6 mt-auto"
                  >
                    <a
                      href="#contact"
                      className="block w-full text-center rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-4 text-lg font-bold text-white shadow-lg shadow-accent-cyan/20 active:scale-[0.97] transition-all duration-150"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        scrollToSection(e, 'contact');
                      }}
                    >
                      Contactar Ahora
                    </a>
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
