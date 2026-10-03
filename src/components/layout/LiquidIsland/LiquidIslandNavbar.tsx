/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
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
import { ChevronDown, Menu, X } from 'lucide-react'

import { useNavScroll } from './useNavScroll'
import NavLogo from './NavLogo'
import NavLink from './NavLink'
import MagneticCTA from './MagneticCTA'
import MegaPanel from './MegaPanel'
import SpotlightGlass from './SpotlightGlass'
import BorderBeam from './BorderBeam'
import LiquidFilter from './LiquidFilter'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'

export interface LiquidIslandNavbarProps {
  expandOnScrollUp?: boolean
}

export default function LiquidIslandNavbar({
  expandOnScrollUp = false,
}: Readonly<LiquidIslandNavbarProps>) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const reduceMotion = Boolean(useReducedMotion())

  const { isCompact, scrollY, skewX, scaleY } = useNavScroll({ expandOnScrollUp })

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

  // Transición spring para ancho y layout sin deformaciones
  const springTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 26,
    mass: 0.9,
  }

  return (
    <>
      {/* 1. Inyección del filtro SVG de refracción líquida en el DOM */}
      <LiquidFilter />

      {/* 2. Header fijo con stacking coordinado (z-50) y libre paso de clics en márgenes */}
      <header
        className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none select-none"
        style={{ top: 12 }}
      >
        <motion.nav
          ref={navRef}
          role="navigation"
          aria-label="Navegación principal"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            skewX: reduceMotion ? 0 : skewX,
            scaleY: reduceMotion ? 1 : scaleY,
          }}
          animate={{
            maxWidth: isCompact ? 460 : 1100,
          }}
          transition={springTransition}
          className="relative pointer-events-auto w-full mx-auto h-14 sm:h-14.5 rounded-full border border-foreground/10 dark:border-white/10 bg-white/80 dark:bg-[#070914]/85 backdrop-blur-xl sm:backdrop-blur-2xl shadow-lg dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.8),0_0_24px_rgba(6,182,212,0.14)] flex items-center justify-between px-3 sm:px-4 gap-2 transition-[box-shadow,border-color] duration-300 hover:border-cyan-500/40"
        >
          {/* Spotlight dinámico sobre el cristal */}
          {!reduceMotion && <SpotlightGlass mouseX={mouseX} mouseY={mouseY} />}

          {/* Border beam animado con gradiente cian a amarillo */}
          <BorderBeam duration={7} />

          {/* IZQUIERDA: Logo interactivo con Phosphor Decay & scroll shrink */}
          <motion.div layout="position" className="flex items-center shrink-0">
            <Link
              href="/"
              onClick={() => {
                setMegaPanelOpen(false)
                if (pathname === '/' || pathname === '') {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                }
              }}
              aria-label={getNavLabel('nav.inicio', 'Inicio')}
              className="outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
            >
              <NavLogo scrollY={scrollY} isCompact={isCompact} reduceMotion={reduceMotion} />
            </Link>
          </motion.div>

          {/* CENTRO: Links de navegación (visibles en desktop lg:flex, colapsan suavemente en compact) */}
          <motion.div
            layout="position"
            className="hidden lg:flex items-center justify-center shrink-0 overflow-hidden"
          >
            <motion.div
              animate={{
                width: isCompact ? 0 : 'auto',
                opacity: isCompact ? 0 : 1,
              }}
              transition={springTransition}
              className="overflow-hidden flex items-center gap-1 sm:gap-1.5"
            >
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
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      megaPanelOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'
                    }`}
                  />
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
                onLeave={() => setHoveredLink(null)}
                onClick={() => setMegaPanelOpen(false)}
              />
            </motion.div>
          </motion.div>

          {/* DERECHA: Selector de Idioma + Tema + Botón de Menú (en Compact/Mobile) + CTA Dominante */}
          <motion.div layout="position" className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Selector de idioma: SIEMPRE accesible en expanded y compact, sin overflow-hidden para no recortar el dropdown */}
            <motion.div layout="position" className="flex items-center">
              <LanguageSwitcher />
            </motion.div>

            {/* Selector de tema: accesible en desktop y tablet */}
            <motion.div layout="position" className="hidden sm:flex items-center">
              <ThemeToggle />
            </motion.div>

            {/* Botón de Menú rápido en modo compact o mobile para desplegar MegaPanel */}
            <motion.button
              type="button"
              layout="position"
              onClick={() => setMegaPanelOpen((prev) => !prev)}
              aria-expanded={megaPanelOpen}
              aria-controls="mega-panel-menu"
              aria-label={megaPanelOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className={`p-1.5 sm:p-2 rounded-full border border-foreground/15 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors cursor-pointer ${
                isCompact ? 'flex' : 'flex lg:hidden'
              }`}
            >
              {megaPanelOpen ? <X size={17} /> : <Menu size={17} />}
            </motion.button>

            {/* CTA único dominante: "Cotizá tu web" con atracción magnética hacia el cursor */}
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
