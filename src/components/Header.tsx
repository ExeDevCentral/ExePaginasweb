import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const sectionIds = ['home', 'features', 'demo', 'contact'] as const

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>('home')

  const menuItems = [
    { label: 'Home', id: 'home' as const, href: '#home' },
    { label: 'Features', id: 'features' as const, href: '#features' },
    { label: 'Demo', id: 'demo' as const, href: '#demo' },
    { label: 'Contact', id: 'contact' as const, href: '#contact' },
  ]

  useEffect(() => {
    const updateActive = () => {
      const scrollY = globalThis.scrollY
      const bar = 120
      let current: string = 'home'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + scrollY
        if (scrollY + bar >= top) current = id
      }
      setActiveId(current)
    }
    updateActive()
    globalThis.addEventListener('scroll', updateActive, { passive: true })
    globalThis.addEventListener('resize', updateActive)
    return () => {
      globalThis.removeEventListener('scroll', updateActive)
      globalThis.removeEventListener('resize', updateActive)
    }
  }, [])

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
            onClick={(e) => {
              const el = document.getElementById('home');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <img src="/logo.png" alt="ExepaginasWeb Logo" loading="lazy" className="w-10 h-10 rounded-xl shadow-lg shadow-accent-cyan/20 border border-accent-cyan/30 object-cover" />

            <span className="bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-xl font-bold tracking-tight text-transparent font-montserrat">ExepaginasWeb</span>
          </motion.a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const isActive = activeId === item.id
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
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
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={activeId === item.id ? 'font-semibold text-accent-cyan' : 'text-primary-secondary transition-colors duration-300 hover:text-accent-cyan'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="self-start rounded-full bg-gradient-to-r from-accent-cyan to-accent-magenta px-6 py-2 text-sm font-semibold text-primary-bg"
                  onClick={() => setIsMenuOpen(false)}
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
