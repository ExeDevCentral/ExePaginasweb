/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * MegaPanel: Nace de la píldora con clip-path animado, tarjetas escalonadas y accesibilidad completa.
 */
'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import {
  CyberAppointmentIcon,
  CyberComandaIcon,
  CyberCatalogIcon,
  CyberPitchRadarIcon,
  CyberCalculatorIcon,
  CyberShopBagIcon,
  WhatsAppLiveIcon,
} from '@/components/ui/MagnificentIcons'

export interface MegaPanelProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
}

const solutionItems = [
  {
    href: '/soluciones#peluqueria',
    label: 'Peluquerías & Salones',
    detail: 'Turnos online 24/7, recordatorios WhatsApp y CRM de fidelización.',
    icon: CyberAppointmentIcon,
    tag: 'TURNO ONLINE',
  },
  {
    href: '/soluciones#panaderia',
    label: 'Panaderías & Gastronomía',
    detail: 'Terminal de pedidos rápidos, combos, delivery y stock por kilo.',
    icon: CyberComandaIcon,
    tag: 'COMANDAS',
  },
  {
    href: '/soluciones#indumentaria',
    label: 'Indumentaria & Calzado',
    detail: 'Catálogo con talles, variantes en vivo y sincronización de stock.',
    icon: CyberCatalogIcon,
    tag: 'CATÁLOGO VIVO',
  },
  {
    href: '/soluciones#canchas',
    label: 'Canchas & Complejos',
    detail: 'Grilla de ocupación en tiempo real y bloqueo anti-solapamiento.',
    icon: CyberPitchRadarIcon,
    tag: 'OCUPACIÓN 24/7',
  },
]

export default function MegaPanel({ isOpen, onClose, anchorRef }: Readonly<MegaPanelProps>) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduceMotion = Boolean(useReducedMotion())

  // Cierre por click afuera y por tecla Escape
  useEffect(() => {
    if (!isOpen) return

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target)) {
        if (anchorRef?.current?.contains(target)) {
          return // El toggle button maneja su propio click
        }
        onClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, anchorRef])

  const containerVariants: import('framer-motion').Variants = {
    hidden: {
      clipPath: reduceMotion ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0% round 24px)',
      opacity: 0,
      y: -6,
      scale: 0.98,
    },
    visible: {
      clipPath: 'inset(0% 0% 0% 0% round 24px)',
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 28,
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
    exit: {
      clipPath: reduceMotion ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0% round 24px)',
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: { duration: 0.18, ease: 'easeInOut' as const },
    },
  }

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 350, damping: 26 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop desenfocado que aísla el menú del fondo y evita que se pierda */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-45"
          />

          <div className="fixed inset-x-0 top-18 z-50 flex justify-center px-4 pointer-events-auto select-none sm:top-20">
            <motion.div
              ref={panelRef}
              id="mega-panel-menu"
              role="region"
              aria-label="Panel de Soluciones y Herramientas"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#DFD7CA] dark:border-emerald-500/50 bg-[#FFFDF9]/98 dark:bg-[#060b13]/98 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl dark:shadow-[0_0_50px_rgba(16,185,129,0.18),0_30px_70px_rgba(0,0,0,0.95)]"
            >
              {/* Bordes verdes neón finos y alargados (superior e inferior) */}
              <div className="absolute top-0 inset-x-8 sm:inset-x-16 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-12 sm:inset-x-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

              {/* Header del Mega Panel con botón de cierre accesible y toggles de idioma y tema */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#DFD7CA] dark:border-emerald-500/25 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981] shrink-0" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground font-mono truncate">
                    Sistemas &amp; Herramientas Web a Medida
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <LanguageSwitcher />
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar panel"
                    className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Ficha de Autor & WhatsApp Directo con Exe en vivo */}
              <motion.div
                variants={itemVariants}
                className="mb-4 p-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-slate-900/80 dark:to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 font-mono font-black text-xs text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] shrink-0">
                    EXE
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">
                        Exequiel Echevarría
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 font-bold">
                        Software &amp; Web Architect
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Arquitectura de Software &amp; Sistemas Cloud · Escala Global · Ingeniería
                      Directa
                    </p>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(
                    '¡Hola Exequiel! Me interesa consultar por un desarrollo de software / web a medida.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/40 dark:hover:bg-emerald-500/30 text-xs transition-all group shrink-0 shadow-sm"
                >
                  <WhatsAppLiveIcon size={18} />
                  <span>Hablar por WhatsApp con Exe</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/20 text-slate-950 dark:bg-emerald-500/20 dark:text-emerald-300">
                    EN VIVO
                  </span>
                </a>
              </motion.div>

              {/* Grid de 4 Soluciones Principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {solutionItems.map(({ href, label, detail, icon: Icon, tag }) => (
                  <motion.div key={href} variants={itemVariants}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className="group relative flex items-start gap-3 p-3.5 rounded-2xl border border-[#DFD7CA] dark:border-emerald-500/25 bg-muted/40 dark:bg-emerald-950/15 hover:bg-emerald-500/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/60 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                    >
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#F3ECE1] to-[#EBE2D4] dark:from-slate-800/90 dark:to-slate-950 border border-[#DFD7CA] dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0 group-hover:border-emerald-500/50 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-all">
                        <Icon size={22} />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-sm text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {label}
                          </span>
                          <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0">
                            {tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                          {detail}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Fila Especial: Cotizador y Tienda Online */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DFD7CA] dark:border-emerald-500/25"
              >
                <Link
                  href="/cotizador"
                  onClick={onClose}
                  className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CyberCalculatorIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          Cotizador Interactivo
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Calculá tu presupuesto en 2 min
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-emerald-500 group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/tienda"
                  onClick={onClose}
                  className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/15 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <CyberShopBagIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                          Tienda Online &amp; E-Commerce
                        </span>
                        <Sparkles size={11} className="text-cyan-400" />
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        Demo sin comisiones cautivas
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-cyan-500 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>

              {/* Footer con link general a /soluciones */}
              <motion.div
                variants={itemVariants}
                className="mt-3.5 pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-[#DFD7CA] dark:border-emerald-500/20"
              >
                <Link
                  href="/soluciones"
                  onClick={onClose}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold flex items-center gap-1.5"
                >
                  <span>Ver arquitectura completa y casos reales de software</span>
                  <ArrowRight size={13} />
                </Link>
                <span className="hidden sm:inline font-mono text-[10px] opacity-70">
                  Presioná{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 text-foreground font-mono">
                    Esc
                  </kbd>{' '}
                  para cerrar
                </span>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
