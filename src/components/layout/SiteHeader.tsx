/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useScroll, useTransform, type MotionValue } from 'framer-motion'
import {
  ChevronDown,
  CalendarCheck,
  ReceiptText,
  Layers,
  CalendarClock,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { MatrixWordmark } from '@/components/Effects/MatrixText'
import { useTheme } from '@/core/theme/ThemeContext'

/** Renders EXE//PAGINASWEB.COM with per-letter matrix scramble */
function HeaderWordmark({ scrollY }: { scrollY: MotionValue<number> }) {
  const { theme } = useTheme()
  const light = theme === 'light'
  const scale = useTransform(scrollY, [0, 380], [1, 0.88])

  return (
    <motion.div style={{ scale, transformOrigin: 'left center' }} className="flex items-center">
      <MatrixWordmark
        parts={[
          { text: 'EXE', color: light ? '#0f172a' : '#ffffff' },
          { text: '//', color: light ? '#b45309' : '#facc15' },
          { text: 'PAGINASWEB', color: light ? '#0f172a' : '#ffffff' },
          { text: '.', color: light ? '#0e7490' : '#22d3ee' },
          { text: 'COM', color: light ? '#0e7490' : '#22d3ee' },
        ]}
        className="text-xs font-black tracking-tight sm:text-sm"
      />
    </motion.div>
  )
}

/** Logo with neon flicker on mount + Opción 2: Dolly-Out Phosphor Decay & Scroll Shrink */
function HeaderLogo({ scrollY }: { scrollY: MotionValue<number> }) {
  const [flickerStyle, setFlickerStyle] = useState<React.CSSProperties>({ opacity: 0 })

  // Opción 2: El cartel luminoso se achica suavemente hacia la barra (de 46px a 33px)
  const scale = useTransform(scrollY, [0, 380], [1, 0.72])
  // Opción 2: Decaimiento del fósforo (el resplandor de neón se apaga con el scroll)
  const phosphorGlow = useTransform(scrollY, [0, 240], [1, 0])
  const haloOpacity = useTransform(scrollY, [0, 180], [0.85, 0])

  useEffect(() => {
    const glow = (size: number, alpha: string, bright: number) =>
      `drop-shadow(0 0 ${size}px #facc15) drop-shadow(0 0 ${size * 2}px #facc15${alpha}) drop-shadow(0 0 ${size * 3}px rgba(6,182,212,0.45)) brightness(${bright})`

    // Fast, aggressive bar-sign flicker — secuencia realista de encendido de cartel
    const seq: [number, number, string][] = [
      [100, 1, glow(22, 'ff', 2.8)], // FLASH on
      [180, 0, 'none'], // hard off
      [260, 1, glow(20, 'cc', 2.5)], // on
      [320, 0, 'none'], // off
      [380, 1, glow(18, 'aa', 2.2)], // on
      [440, 0, 'none'], // off
      [500, 1, glow(16, '88', 2.0)], // on
      [600, 0.3, glow(4, '22', 1.1)], // dim flicker
      [680, 1, glow(14, '77', 1.8)], // recover
      [760, 0.7, glow(8, '44', 1.3)], // dip
      [840, 1, glow(12, '66', 1.5)], // stabilise
      [1100, 1, glow(10, '55', 1.3)], // resting glow estable
    ]

    const timers = seq.map(([delay, opacity, filter]) =>
      setTimeout(
        () => setFlickerStyle({ opacity, filter, transition: 'opacity 0.03s, filter 0.04s' }),
        delay
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.span
      className="relative shrink-0 group flex items-center justify-center origin-left"
      style={{ width: 46, height: 46, scale }}
    >
      {/* Halo de luz ambiental que baña el fondo y se disipa con el scroll */}
      <motion.span
        className="absolute inset-0 rounded-full bg-yellow-400/25 blur-lg pointer-events-none scale-150"
        style={{ opacity: haloOpacity }}
      />

      {/* Capa 1: Silueta base nítida y seria (permanece impecable al apagarse el neón) */}
      <span
        className="relative z-10 block transition-transform duration-300 group-hover:scale-105"
        style={{ width: 46, height: 46, opacity: flickerStyle.opacity }}
      >
        <Logo size={46} />
      </span>

      {/* Capa 2: Emisión luminosa del neón (se apaga suavemente con el scroll: Phosphor Decay) */}
      <motion.span
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          opacity: phosphorGlow,
          filter: flickerStyle.filter,
        }}
      >
        <Logo size={46} />
      </motion.span>
    </motion.span>
  )
}

const solutions = [
  {
    href: '/soluciones#peluqueria',
    label: 'Peluquerías & Salones',
    detail: 'Gestión de turnos & CRM',
    icon: CalendarCheck,
  },
  {
    href: '/soluciones#panaderia',
    label: 'Panaderías & Gastro',
    detail: 'Terminal de pedidos & catálogo',
    icon: ReceiptText,
  },
  {
    href: '/soluciones#indumentaria',
    label: 'Indumentaria & Moda',
    detail: 'E-commerce a medida & stock',
    icon: Layers,
  },
  {
    href: '/soluciones#canchas',
    label: 'Canchas & Clubes',
    detail: 'Disponibilidad en vivo & domótica',
    icon: CalendarClock,
  },
]

const linkClass =
  'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-[180ms] ease-out origin-center hover:scale-105 active:scale-95 will-change-transform hover:bg-black/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'

export default function SiteHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const solutionsRef = useRef<HTMLDivElement>(null)

  // Opción 2: Monitoreo de scroll fluido sin anclajes ni bloqueo
  const { scrollY } = useScroll()
  const [isAnchored, setIsAnchored] = useState(false)
  const isHomePage = pathname === '/' || pathname === ''

  useEffect(() => {
    // En la página principal no se ancla hasta llegar al primer div (~420px de scroll)
    const threshold = isHomePage ? 420 : 60
    return scrollY.on('change', (latest) => {
      setIsAnchored(latest >= threshold)
    })
  }, [scrollY, isHomePage])

  const closeMobile = () => setMobileOpen(false)

  // Cerrar al hacer clic afuera o presionar tecla Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSolutionsOpen(false)
        setMobileOpen(false)
      }
    }

    if (solutionsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [solutionsOpen])

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setSolutionsOpen(false)
    setMobileOpen(false)
  }, [pathname])

  // Redirección y scroll fluido al inicio garantizado en cualquier página
  const handleHomeClick = () => {
    closeMobile()
    setSolutionsOpen(false)
    if (pathname === '/' || pathname === '') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  // Previene fugas de keys crudas si i18n no cargó o no encuentra la traducción
  const getNavLabel = (key: string, fallback: string) => {
    const text = t(key)
    return !text || text === key ? fallback : text
  }

  const headerHasBackground = isAnchored || mobileOpen
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        headerHasBackground
          ? 'border-b border-foreground/10 bg-background/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#050508]/90 shadow-xs'
          : 'border-b border-transparent bg-transparent backdrop-blur-none shadow-none'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isAnchored ? 'h-16' : 'h-18 sm:h-20'
        }`}
      >
        {/* Logo + wordmark con Opción 2: Phosphor Decay y Scroll Shrink fluido */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            onClick={handleHomeClick}
            aria-label={getNavLabel('nav.inicio', 'Inicio')}
            className="origin-center transition-transform duration-180 ease-out hover:scale-105 active:scale-95"
          >
            <HeaderLogo scrollY={scrollY} />
          </Link>
          <Link
            href="/"
            onClick={handleHomeClick}
            className="outline-none origin-center transition-transform duration-180 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <HeaderWordmark scrollY={scrollY} />
          </Link>
        </div>

        {/* 4 links principales + Soluciones con scale up suave en hover */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          <Link href="/" onClick={handleHomeClick} className={linkClass}>
            {getNavLabel('nav.inicio', 'Inicio')}
          </Link>
          <div ref={solutionsRef} className="relative">
            <button
              type="button"
              className={`${linkClass} gap-1.5 cursor-pointer ${
                solutionsOpen ? 'text-cyan-500 dark:text-cyan-400 bg-black/5 dark:bg-white/10' : ''
              }`}
              aria-expanded={solutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setSolutionsOpen((open) => !open)}
            >
              {getNavLabel('nav.soluciones', 'Soluciones')}{' '}
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ease-out ${
                  solutionsOpen ? 'rotate-180 text-cyan-500 dark:text-cyan-400' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  id="solutions-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-1/2 top-full w-110 -translate-x-1/2 pt-2.5 z-50 select-none"
                >
                  <div className="relative rounded-3xl border border-cyan-500/25 dark:border-cyan-400/20 bg-white/95 dark:bg-[#070914]/95 p-3.5 shadow-2xl backdrop-blur-2xl dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.18)] overflow-hidden">
                    {/* Glow ambiental superior */}
                    <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-24 bg-cyan-500/15 rounded-full blur-2xl" />

                    <div className="relative grid grid-cols-2 gap-2.5 mb-2.5">
                      {solutions.map(({ href, label, detail, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setSolutionsOpen(false)}
                          className="group relative flex flex-col p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/60 dark:bg-white/2 hover:bg-cyan-500/8 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            {/* Chasis de hardware pulido con bisel mecanizado y micro-led */}
                            <div className="relative w-9 h-9 rounded-xl bg-linear-to-b from-slate-100 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-950 border border-slate-200 dark:border-white/10 border-t-slate-300 dark:border-t-white/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)] group-hover:border-cyan-500/50 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-all duration-300 shrink-0">
                              <Icon size={17} strokeWidth={1.8} className="relative z-10" />
                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-950 opacity-70 group-hover:opacity-100" />
                            </div>
                            <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                              {label}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 pl-0.5 leading-snug">
                            {detail}
                          </span>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/soluciones"
                      onClick={() => setSolutionsOpen(false)}
                      className="group relative flex items-center justify-between rounded-xl border border-cyan-500/30 bg-linear-to-r from-cyan-500/15 via-sky-500/10 to-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:border-cyan-400 hover:from-cyan-500/25 hover:to-emerald-500/25 transition-all duration-200 shadow-sm"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Ver los 4 rubros y sistemas</span>
                      </span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform duration-200"
                      />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/portafolio" className={linkClass}>
            {getNavLabel('nav.casos', 'Portafolio')}
          </Link>
          <Link href="/precios" className={linkClass}>
            {getNavLabel('nav.planes', 'Precios')}
          </Link>
          <Link href="/#contact" className={linkClass}>
            {getNavLabel('nav.contacto', 'Contacto')}
          </Link>
        </nav>

        {/* Botones de acción derecha: Cotizador + Tienda + Hablemos + Toggles */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/cotizador"
            className="rounded-full border border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-400/10 dark:text-emerald-300 origin-center transition-all duration-180 ease-out hover:scale-105 active:scale-95"
          >
            {getNavLabel('nav.cotizador', 'Cotizador')}
          </Link>
          <Link
            href="/tienda"
            className="rounded-full border border-cyan-400/40 px-3.5 py-1.5 text-xs font-bold text-cyan-600 hover:bg-cyan-400/10 dark:text-cyan-300 origin-center transition-all duration-180 ease-out hover:scale-105 active:scale-95"
          >
            {getNavLabel('nav.tienda_online', 'Tienda')}
          </Link>
          <div className="flex items-center gap-1 mx-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link
            href="/#contact"
            className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-1.5 text-xs origin-center transition-all duration-180 ease-out hover:scale-105 active:scale-95 shadow-sm"
          >
            {getNavLabel('nav.contacto', 'Hablemos')}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-site-menu"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="rounded-xl border border-foreground/15 p-2 text-slate-800 dark:border-white/15 dark:text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-site-menu"
        className={`lg:hidden overflow-hidden border-t border-foreground/10 bg-background transition-[max-height,opacity] duration-300 dark:border-white/10 dark:bg-[#07080f] ${mobileOpen ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav
          aria-label="Navegación móvil"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
        >
          <Link href="/" className={linkClass} onClick={handleHomeClick}>
            {getNavLabel('nav.inicio', 'Inicio')}
          </Link>
          <button
            type="button"
            className={`${linkClass} flex items-center justify-between text-left`}
            aria-expanded={solutionsOpen}
            onClick={() => setSolutionsOpen((open) => !open)}
          >
            {getNavLabel('nav.soluciones', 'Soluciones')}{' '}
            <ChevronDown
              size={16}
              className={solutionsOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
            />
          </button>
          <div
            className={`grid grid-cols-2 gap-2 overflow-hidden pl-2 transition-[max-height,opacity] duration-300 ${solutionsOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {solutions.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 active:scale-95 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                  <Icon size={15} strokeWidth={1.8} />
                </div>
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <Link href="/portafolio" className={linkClass} onClick={closeMobile}>
            {getNavLabel('nav.casos', 'Portafolio')}
          </Link>
          <Link href="/precios" className={linkClass} onClick={closeMobile}>
            {getNavLabel('nav.planes', 'Precios')}
          </Link>
          <Link href="/#contact" className={linkClass} onClick={closeMobile}>
            {getNavLabel('nav.contacto', 'Contacto')}
          </Link>
          <div className="mt-2 flex gap-2 border-t border-foreground/10 pt-3 dark:border-white/10">
            <Link
              href="/cotizador"
              onClick={closeMobile}
              className="flex-1 rounded-lg bg-emerald-400/10 px-3 py-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-300"
            >
              Cotizador
            </Link>
            <Link
              href="/tienda"
              onClick={closeMobile}
              className="flex-1 rounded-lg bg-cyan-400/10 px-3 py-2 text-center text-xs font-bold text-cyan-600 dark:text-cyan-300"
            >
              Tienda
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
