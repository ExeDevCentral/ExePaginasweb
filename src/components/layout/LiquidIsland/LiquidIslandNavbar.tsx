/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * LiquidIslandNavbar: Barra de navegación Dynamic Island de vidrio líquido con spring de ancho,
 * decaimiento de fósforo, CTA magnético, indicador elástico y mega panel.
 */
'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { CyberChevron, CyberBurgerIcon, CyberRadarBeacon } from '@/components/ui/MagnificentIcons'

import { useNavScroll } from './useNavScroll'
import NavLogo from './NavLogo'
import NavLink from './NavLink'
import MagneticCTA from './MagneticCTA'
import MegaPanel from './MegaPanel'
import SpotlightGlass from './SpotlightGlass'
import LiquidFilter from './LiquidFilter'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'
import { getGlobalLenis, smoothScrollTo } from '@/components/shared/scrollUtils'

export interface LiquidIslandNavbarProps {
  expandOnScrollUp?: boolean
}

export default function LiquidIslandNavbar({
  expandOnScrollUp = false,
}: Readonly<LiquidIslandNavbarProps>) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const reduceMotion = Boolean(useReducedMotion())

  const { scrollY } = useNavScroll({ expandOnScrollUp })

  // Estados interactivos
  const [megaPanelOpen, setMegaPanelOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  // Referencias para accesibilidad y spotlight
  const navRef = useRef<HTMLElement>(null)
  const solutionsBtnRef = useRef<HTMLButtonElement>(null)

  // Spotlight interactivo que sigue al cursor (MotionValues: 0 re-renders)
  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-500)
    mouseY.set(-500)
    setHoveredLink(null)
  }

  // Previene keys crudas si falta la traducción
  const getNavLabel = (key: string, fallback: string) => {
    const text = t(key)
    return !text || text === key ? fallback : text
  }

  return (
    <>
      {/* 1. Inyección del filtro SVG de refracción líquida en el DOM */}
      <LiquidFilter />

      {/* 2. Header fijo con stacking coordinado (z-50) y libre paso de clics en márgenes */}
      <header
        className="fixed top-3 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none select-none"
        style={{ top: 12 }}
      >
        {/* MICRO-AURA PERIMETRAL SOBRIA DE ALTA INGENIERIA */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-full bg-cyan-500/10 blur-xl -z-20 opacity-40"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            left: 0,
            right: 0,
            transform: 'translateZ(0)',
          }}
        />

        <motion.nav
          ref={navRef}
          role="navigation"
          aria-label="Navegación principal"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative pointer-events-auto w-full max-w-275 mx-auto h-14 sm:h-14.5 rounded-full border border-slate-200/90 dark:border-cyan-400/30 bg-white/90 dark:bg-[#0c1224]/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6),0_0_16px_rgba(6,182,212,0.1)] flex items-center justify-between px-3 sm:px-4 gap-2 transition-colors duration-200 hover:border-slate-300 dark:hover:border-cyan-400/60"
        >
          {/* Spotlight dinámico sobre el cristal */}
          {!reduceMotion && <SpotlightGlass mouseX={mouseX} mouseY={mouseY} />}

          {/* IZQUIERDA: Logo interactivo con Phosphor Decay */}
          <motion.div layout="position" className="flex items-center shrink-0">
            <Link
              href="/"
              onClick={(e) => {
                setMegaPanelOpen(false)
                if (pathname === '/' || pathname === '') {
                  e.preventDefault()
                  const lenis = getGlobalLenis()
                  if (lenis) {
                    lenis.scrollTo(0, { duration: 0.85 })
                  } else {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                  }
                }
              }}
              aria-label={getNavLabel('nav.inicio', 'Inicio')}
              className="outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full min-w-11 min-h-11 flex items-center justify-center p-1 -m-1 active:scale-95 transition-transform"
            >
              <NavLogo scrollY={scrollY} isCompact={false} reduceMotion={reduceMotion} />
            </Link>
          </motion.div>

          {/* CENTRO: Links de navegación (estables y continuos en desktop lg:flex) */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Botón trigger del Mega Panel de Soluciones */}
              <div className="relative">
                <button
                  ref={solutionsBtnRef}
                  type="button"
                  onClick={() => setMegaPanelOpen((prev) => !prev)}
                  onMouseEnter={() => setHoveredLink('soluciones')}
                  onMouseLeave={() => setHoveredLink(null)}
                  aria-expanded={megaPanelOpen}
                  aria-controls="mega-panel-menu"
                  className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 cursor-pointer ${
                    megaPanelOpen || hoveredLink === 'soluciones'
                      ? 'text-cyan-600 dark:text-cyan-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {/* Blob compartido layoutId="nav-blob" */}
                  {(hoveredLink === 'soluciones' || megaPanelOpen) && (
                    <motion.span
                      {...(!reduceMotion ? { layoutId: 'nav-blob' } : {})}
                      className="pointer-events-none absolute inset-0 rounded-full bg-cyan-500/10 dark:bg-white/10 border border-cyan-500/25 dark:border-cyan-400/20 shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="whitespace-nowrap">
                    {getNavLabel('nav.soluciones', 'Soluciones')}
                  </span>
                  <CyberChevron isOpen={megaPanelOpen} size={14} className="text-cyan-400" />
                </button>
              </div>

              {/* Casos / Portafolio */}
              <NavLink
                href="/portafolio"
                label={getNavLabel('nav.casos', 'Casos de Éxito')}
                isActive={pathname === '/portafolio'}
                isHovered={hoveredLink === 'casos'}
                onHover={() => setHoveredLink('casos')}
                onLeave={() => setHoveredLink(null)}
                onClick={() => setMegaPanelOpen(false)}
              />

              {/* Planes / Precios */}
              <NavLink
                href="/precios"
                label={getNavLabel('nav.planes', 'Planes')}
                isActive={pathname === '/precios'}
                isHovered={hoveredLink === 'planes'}
                onHover={() => setHoveredLink('planes')}
                onLeave={() => setHoveredLink(null)}
                onClick={() => setMegaPanelOpen(false)}
              />

              {/* Contacto directo */}
              <NavLink
                href="/#contact"
                label={getNavLabel('nav.contacto', 'Contacto')}
                isActive={false}
                isHovered={hoveredLink === 'contacto'}
                onHover={() => setHoveredLink('contacto')}
                onClick={(e) => {
                  setMegaPanelOpen(false)
                  if (pathname === '/' || pathname === '') {
                    e.preventDefault()
                    smoothScrollTo('#contact', -88)
                  }
                }}
              />
            </div>
          </div>

          {/* DERECHA: Badge de Disponibilidad + Idioma + Tema + Menú + CTA Dominante */}
          <motion.div layout="position" className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Disponibilidad en tiempo real */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 dark:border-cyan-400/30 text-[10px] font-mono font-bold tracking-wider text-cyan-800 dark:text-cyan-300 select-none shrink-0">
              <CyberRadarBeacon size={9} />
              <span>ABRIL // DISPONIBLE</span>
            </div>

            {/* Selector de idioma */}
            <motion.div layout="position" className="flex items-center">
              <LanguageSwitcher />
            </motion.div>

            {/* Selector de tema */}
            <motion.div layout="position" className="hidden sm:flex items-center">
              <ThemeToggle />
            </motion.div>

            {/* Botón de Menú rápido en mobile/tablet para desplegar MegaPanel */}
            <motion.button
              type="button"
              layout="position"
              onClick={() => setMegaPanelOpen((prev) => !prev)}
              aria-expanded={megaPanelOpen}
              aria-controls="mega-panel-menu"
              aria-label={megaPanelOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className="p-2 rounded-full border border-cyan-500/30 dark:border-cyan-400/35 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-colors cursor-pointer flex lg:hidden"
            >
              <CyberBurgerIcon isOpen={megaPanelOpen} size={17} />
            </motion.button>

            {/* CTA único dominante */}
            <motion.div layout="position">
              <MagneticCTA
                label={getNavLabel('nav.cotiza_tu_web', 'Cotizá tu web')}
                href="/cotizador"
                onClick={() => setMegaPanelOpen(false)}
              />
            </motion.div>
          </motion.div>
        </motion.nav>
      </header>

      {/* 3. Mega Panel desplegable que nace de la píldora con clip-path animado */}
      <MegaPanel
        isOpen={megaPanelOpen}
        onClose={() => setMegaPanelOpen(false)}
        anchorRef={solutionsBtnRef}
      />
    </>
  )
}
