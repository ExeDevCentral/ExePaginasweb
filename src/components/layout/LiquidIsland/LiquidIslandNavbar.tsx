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
import { motion, AnimatePresence, useMotionValue, useReducedMotion } from 'framer-motion'
import { CyberChevron, CyberBurgerIcon, CyberRadarBeacon } from '@/components/ui/MagnificentIcons'

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
import { getGlobalLenis } from '@/components/shared/scrollUtils'

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
        className="fixed top-3 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none select-none"
        style={{ top: 12 }}
      >
        {/* AURA PERIMETRAL DOBLE DE ALTO CONTRASTE (DESPEGA EL CRISTAL DEL NEGRO ABSOLUTO A 120 FPS) */}
        <div
          className="pointer-events-none absolute -inset-2 rounded-full bg-linear-to-r from-cyan-500/40 via-sky-400/25 to-emerald-400/35 blur-2xl -z-20 opacity-80 dark:opacity-95 transition-opacity duration-300"
          style={{
            maxWidth: isCompact ? 440 : 1120,
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
          style={{
            skewX: reduceMotion ? 0 : skewX,
            scaleY: reduceMotion ? 1 : scaleY,
          }}
          initial={{ maxWidth: 1100 }}
          animate={{
            maxWidth: isCompact ? 420 : 1100,
          }}
          transition={springTransition}
          className="relative pointer-events-auto w-full mx-auto h-14 sm:h-14.5 rounded-full border border-slate-300/90 dark:border-cyan-400/45 bg-linear-to-b from-white/95 via-slate-50/90 to-slate-100/95 dark:from-[#151e34]/95 dark:via-[#0c1224]/95 dark:to-[#070914]/98 backdrop-blur-2xl sm:backdrop-blur-3xl shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.55),inset_0_-1px_1px_0_rgba(6,182,212,0.4),0_16px_48px_-8px_rgba(0,0,0,0.7),0_0_28px_rgba(6,182,212,0.24)] flex items-center justify-between px-3 sm:px-4 gap-2 transition-[box-shadow,border-color] duration-300 hover:border-cyan-400/70 hover:shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.7),inset_0_-1px_1px_0_rgba(6,182,212,0.6),0_20px_54px_-8px_rgba(0,0,0,0.85),0_0_36px_rgba(6,182,212,0.35)]"
        >
          {/* Spotlight dinámico sobre el cristal */}
          {!reduceMotion && <SpotlightGlass mouseX={mouseX} mouseY={mouseY} />}

          {/* Border beam animado con gradiente cian a amarillo */}
          <BorderBeam duration={7} />

          {/* IZQUIERDA: Logo interactivo con Phosphor Decay & scroll shrink */}
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
                  <CyberChevron isOpen={megaPanelOpen} size={14} className="text-cyan-400" />
                </button>
              </div>

              {/* Casos / Portafolio con floating preview de caso real */}
              <div className="relative">
                <NavLink
                  href="/portafolio"
                  label={getNavLabel('nav.casos', 'Casos de Éxito')}
                  isActive={pathname === '/portafolio'}
                  isHovered={hoveredLink === 'casos'}
                  onHover={() => setHoveredLink('casos')}
                  onLeave={() => setHoveredLink(null)}
                  onClick={() => setMegaPanelOpen(false)}
                />
                <AnimatePresence>
                  {hoveredLink === 'casos' && !isCompact && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.16 }}
                      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3.5 rounded-2xl border border-cyan-500/30 bg-[#070914]/95 backdrop-blur-xl shadow-2xl z-50 text-left select-none"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-bold text-xs text-white">RESTOia Engine</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          EN PRODUCCIÓN
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Suite gastronómica inteligente con facturación fiscal ARCA/AFIP, KDS en
                        vivo, motor offline y protocolo MCP.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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

          {/* DERECHA: Badge de Disponibilidad + Idioma + Tema + Menú + CTA Dominante */}
          <motion.div layout="position" className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Disponibilidad en tiempo real: SOLO en modo expandido para no sobrecargar el Island compacto */}
            {!isCompact && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 dark:border-cyan-400/40 text-[10px] font-mono font-extrabold tracking-wider text-cyan-900 dark:text-cyan-300 select-none shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
                <CyberRadarBeacon size={9} />
                <span>ABRIL // DISPONIBLE</span>
              </div>
            )}

            {/* Selector de idioma: SIEMPRE accesible en expanded y compact */}
            <motion.div layout="position" className="flex items-center">
              <LanguageSwitcher />
            </motion.div>

            {/* Selector de tema: accesible en desktop y tablet */}
            <motion.div layout="position" className="hidden sm:flex items-center">
              <ThemeToggle />
            </motion.div>

            {/* Botón de Menú rápido en modo compact o mobile para desplegar MegaPanel con icono cinético */}
            <motion.button
              type="button"
              layout="position"
              onClick={() => setMegaPanelOpen((prev) => !prev)}
              aria-expanded={megaPanelOpen}
              aria-controls="mega-panel-menu"
              aria-label={megaPanelOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className={`p-2 rounded-full border border-cyan-500/30 dark:border-cyan-400/35 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-colors cursor-pointer ${
                isCompact ? 'flex' : 'flex lg:hidden'
              }`}
            >
              <CyberBurgerIcon isOpen={megaPanelOpen} size={17} />
            </motion.button>

            {/* CTA único dominante: perfectamente proporcionado (en compact "Cotizar", en expanded "Cotizá tu web") */}
            <motion.div layout="position">
              <MagneticCTA
                label={
                  isCompact
                    ? getNavLabel('nav.cotizar', 'Cotizar')
                    : getNavLabel('nav.cotiza_tu_web', 'Cotizá tu web')
                }
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
