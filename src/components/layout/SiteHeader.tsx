/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

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
            onClick={closeMobile}
            aria-label={getNavLabel('nav.inicio', 'Inicio')}
            className="origin-center transition-transform duration-[180ms] ease-out hover:scale-105 active:scale-95"
          >
            <HeaderLogo />
          </Link>
          <Link
            href="/"
            onClick={closeMobile}
            className="outline-none origin-center transition-transform duration-[180ms] ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <HeaderWordmark />
          </Link>
        </div>

        {/* 4 links principales + Soluciones con scale up suave en hover */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkClass}>
            {getNavLabel('nav.inicio', 'Inicio')}
          </Link>
          <div className="relative">
            <button
              type="button"
              className={`${linkClass} gap-1 cursor-pointer`}
              aria-expanded={solutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setSolutionsOpen((open) => !open)}
            >
              {getNavLabel('nav.soluciones', 'Soluciones')}{' '}
              <ChevronDown
                size={15}
                className={
                  solutionsOpen
                    ? 'rotate-180 transition-transform duration-200'
                    : 'transition-transform duration-200'
                }
              />
            </button>
            <div
              id="solutions-menu"
              className={`absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                solutionsOpen
                  ? 'visible opacity-100 translate-y-0'
                  : 'invisible opacity-0 -translate-y-1 pointer-events-none'
              }`}
            >
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-foreground/10 bg-card p-3 shadow-2xl dark:border-white/10 dark:bg-[#0c0e18]">
                {solutions.map(({ href, label, detail, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-xl border border-black/5 p-3 hover:border-cyan-400/40 hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/5 origin-center transition-all duration-[180ms] ease-out hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Icon size={19} className="mb-2 text-cyan-500 dark:text-cyan-400" />
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">
                      {label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{detail}</span>
                  </Link>
                ))}
                <Link
                  href="/soluciones"
                  className="col-span-2 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-bold text-cyan-600 dark:text-cyan-300 origin-center transition-all duration-[180ms] ease-out hover:scale-[1.02]"
                >
                  Ver los 4 rubros <ArrowRight size={14} />
                </Link>
                <div className="col-span-2 flex items-center justify-between gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-xs">
                  <Link
                    href="/cotizador"
                    className="flex-1 rounded-lg py-1.5 px-2.5 text-center font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/5 origin-center transition-all duration-[180ms] ease-out hover:scale-105"
                  >
                    {getNavLabel('nav.cotizador', 'Cotizador Online')}
                  </Link>
                  <Link
                    href="/tienda"
                    className="flex-1 rounded-lg py-1.5 px-2.5 text-center font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-black/5 dark:hover:bg-white/5 origin-center transition-all duration-[180ms] ease-out hover:scale-105"
                  >
                    {getNavLabel('nav.tienda_online', 'Tienda Online')}
                  </Link>
                </div>
              </div>
            </div>
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

        {/* Toggles limpios sin cápsula + único botón (Hablemos) */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link
            href="/#contact"
            className="rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-2 text-xs origin-center transition-all duration-[180ms] ease-out hover:scale-105 active:scale-95 shadow-sm"
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
          <Link href="/" className={linkClass} onClick={closeMobile}>
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
