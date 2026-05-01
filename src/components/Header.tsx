import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { NAV_ITEMS, SCROLL_OFFSET } from './constants'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
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
              src="/logo.webp" 
              alt="ExepaginasWeb Logo" 
              loading="lazy" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-accent-cyan/20 border border-accent-cyan/30 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />

            <span className="bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-xl font-bold tracking-tight text-transparent font-montserrat">ExepaginasWeb</span>
          </motion.a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
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
          </nav>

          {/* CTA Button */}
          <motion.a
            href="#contact"
            className="hidden md:inline-block rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-2 text-sm font-semibold text-primary-bg shadow-md shadow-accent-cyan/20 transition-all hover:shadow-lg hover:shadow-accent-cyan/30"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Contacto
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              className="md:hidden py-4 border-t border-accent-cyan/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col space-y-4">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={activeId === item.id ? 'font-semibold text-accent-cyan' : 'text-primary-secondary transition-colors duration-300 hover:text-accent-cyan'}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      scrollToSection(e, item.id);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="self-start rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-2 text-sm font-semibold text-primary-bg"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    scrollToSection(e, 'contact');
                  }}
                >
                  Contacto
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
