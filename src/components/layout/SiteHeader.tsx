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
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Scissors, Wheat, Shirt, Volleyball, Menu, X, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { MatrixWordmark } from '@/components/Effects/MatrixText'
import { useTheme } from '@/core/theme/ThemeContext'

/** Renders EXE//PAGINASWEB.COM with per-letter matrix scramble */
function HeaderWordmark() {
  const { theme } = useTheme()
  const light = theme === 'light'
  return (
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
  )
}

/** Logo with neon flicker on mount */
function HeaderLogo() {
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 })

  useEffect(() => {
    const glow = (size: number, alpha: string, bright: number) =>
      `drop-shadow(0 0 ${size}px #facc15) drop-shadow(0 0 ${size * 2}px #facc15${alpha}) brightness(${bright})`

    // Fast, aggressive bar-sign flicker — ~2s total, snappy transitions
    const seq: [number, number, string][] = [
      [150, 1, glow(20, 'ff', 2.8)], // FLASH on
      [250, 0, 'none'], // hard off
      [350, 1, glow(18, 'cc', 2.5)], // on
      [420, 0, 'none'], // off
      [500, 1, glow(16, 'aa', 2.2)], // on
      [560, 0, 'none'], // off
      [620, 1, glow(14, '88', 2.0)], // on
      [680, 0, 'none'], // off
      [740, 0.9, glow(12, '77', 1.8)], // partial
      [800, 0, 'none'], // off
      [860, 1, glow(14, '88', 2.0)], // strong back
      [950, 0.2, glow(4, '22', 1.1)], // dim flicker
      [1020, 1, glow(12, '77', 1.8)], // recover
      [1100, 0.6, glow(8, '44', 1.3)], // dip
      [1180, 1, glow(10, '66', 1.5)], // stabilise
      [1400, 1, glow(7, '44', 1.1)], // resting glow
    ]

    const timers = seq.map(([delay, opacity, filter]) =>
      setTimeout(
        () => setStyle({ opacity, filter, transition: 'opacity 0.03s, filter 0.04s' }),
        delay
      )
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <span className="relative flex-shrink-0 group" style={{ width: 38, height: 38 }}>
      <span className="absolute inset-0 rounded-full bg-yellow-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none scale-125" />
      <span
        className="relative z-10 block group-hover:scale-110 transition-transform duration-300"
        style={{ width: 38, height: 38, ...style }}
      >
        <Logo size={38} />
      </span>
    </span>
  )
}

const solutions = [
  {
    href: '/soluciones#peluqueria',
    label: 'Peluquerías',
    detail: 'Turnos y fidelización',
    icon: Scissors,
  },
  { href: '/soluciones#panaderia', label: 'Panaderías', detail: 'Pedidos y catálogo', icon: Wheat },
  {
    href: '/soluciones#indumentaria',
    label: 'Indumentaria',
    detail: 'E-commerce a medida',
    icon: Shirt,
  },
  {
    href: '/soluciones#canchas',
    label: 'Canchas',
    detail: 'Reservas y ocupación',
    icon: Volleyball,
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#050508]/90">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo + wordmark */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            onClick={handleHomeClick}
            aria-label={getNavLabel('nav.inicio', 'Inicio')}
            className="origin-center transition-transform duration-[180ms] ease-out hover:scale-105 active:scale-95"
          >
            <HeaderLogo />
          </Link>
          <Link
            href="/"
            onClick={handleHomeClick}
            className="outline-none origin-center transition-transform duration-[180ms] ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <HeaderWordmark />
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
                  className="absolute left-1/2 top-full w-[440px] -translate-x-1/2 pt-2.5 z-50 select-none"
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
                          className="group relative flex flex-col p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] hover:bg-cyan-500/[0.08] hover:border-cyan-500/40 dark:hover:border-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all duration-300">
                              <Icon size={16} />
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
                      className="group relative flex items-center justify-between rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:border-cyan-400 hover:from-cyan-500/25 hover:to-emerald-500/25 transition-all duration-200 shadow-sm"
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
            className="rounded-full border border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-400/10 dark:text-emerald-300 origin-center transition-all duration-[180ms] ease-out hover:scale-105 active:scale-95"
          >
            {getNavLabel('nav.cotizador', 'Cotizador')}
          </Link>
          <Link
            href="/tienda"
            className="rounded-full border border-cyan-400/40 px-3.5 py-1.5 text-xs font-bold text-cyan-600 hover:bg-cyan-400/10 dark:text-cyan-300 origin-center transition-all duration-[180ms] ease-out hover:scale-105 active:scale-95"
          >
            {getNavLabel('nav.tienda_online', 'Tienda')}
          </Link>
          <div className="flex items-center gap-1 mx-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link
            href="/#contact"
            className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-1.5 text-xs origin-center transition-all duration-[180ms] ease-out hover:scale-105 active:scale-95 shadow-sm"
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
                className="rounded-lg bg-black/5 p-3 text-xs font-bold text-slate-800 dark:bg-white/5 dark:text-slate-200"
              >
                <Icon size={16} className="mb-1 text-cyan-500 dark:text-cyan-400" />
                {label}
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
