/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * MegaPanel: Command Palette de ingeniería con navegación por teclado, búsqueda y estética de consola.
 */
'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Calendar,
  UtensilsCrossed,
  Shirt,
  Trophy,
  Calculator,
  ShoppingBag,
  Terminal,
  MessageCircle,
  Search,
  Layers,
  LayoutDashboard,
  X,
  type LucideIcon,
} from 'lucide-react'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { resolveAnchorElement, smoothScrollTo } from '@/components/shared/scrollUtils'

export interface MegaPanelProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
  mobileAnchorRef?: React.RefObject<HTMLElement | null>
}

interface PaletteItem {
  id: string
  shortcutNumber: number
  href: string
  label: string
  detail: string
  techFact: string
  icon: LucideIcon
  category: 'rubro' | 'action'
  isPrimaryCta?: boolean
}

function getActionCardStyle(isSelected: boolean, isPrimaryCta?: boolean, itemId?: string) {
  if (isSelected) {
    return itemId === 'tienda'
      ? 'border-fuchsia-400/75 dark:border-fuchsia-300/75 bg-black/8 dark:bg-white/6 -translate-y-0.5'
      : 'border-emerald-400/75 dark:border-emerald-300/75 bg-black/8 dark:bg-white/6 -translate-y-0.5'
  }
  if (isPrimaryCta) {
    return 'border-emerald-400/35 dark:border-emerald-300/30 bg-black/3 dark:bg-white/3 hover:border-emerald-300/70 dark:hover:border-emerald-300/65 hover:-translate-y-0.5'
  }
  return 'border-fuchsia-400/25 dark:border-fuchsia-300/25 bg-black/3 dark:bg-white/2 hover:border-fuchsia-300/65 dark:hover:border-fuchsia-300/60 hover:-translate-y-0.5'
}

export default function MegaPanel({
  isOpen,
  onClose,
  anchorRef,
  mobileAnchorRef,
}: Readonly<MegaPanelProps>) {
  const { t } = useTranslation()
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reduceMotion = Boolean(useReducedMotion())

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [shortcutKey, setShortcutKey] = useState('Ctrl K')
  const [isAvailableNow, setIsAvailableNow] = useState(true)

  const localizedPaletteItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'peluqueria',
        shortcutNumber: 1,
        href: '/soluciones#peluqueria',
        label: t('megapanel.item_1_label', 'Turnos online para peluquerías'),
        detail: t(
          'megapanel.item_1_detail',
          'Agenda automatizada 24/7, recordatorios por WhatsApp y fidelización.'
        ),
        techFact: 'Event-Driven · WhatsApp Cloud API · Postgres RLS',
        icon: Calendar,
        category: 'rubro',
      },
      {
        id: 'gastronomia',
        shortcutNumber: 2,
        href: '/soluciones#panaderia',
        label: t('megapanel.item_2_label', 'Comandas y pedidos gastronómicos'),
        detail: t(
          'megapanel.item_2_detail',
          'Terminal de pedidos rápidos, combos, delivery y control de stock.'
        ),
        techFact: 'Offline-First · Sync Local · WebSockets KDS',
        icon: UtensilsCrossed,
        category: 'rubro',
      },
      {
        id: 'indumentaria',
        shortcutNumber: 3,
        href: '/soluciones#indumentaria',
        label: t('megapanel.item_3_label', 'Tienda Online, Catálogo y Stock'),
        detail: t(
          'megapanel.item_3_detail',
          'E-commerce sin comisiones, variantes de talles en vivo y sincronización de stock.'
        ),
        techFact: 'Multi-Tenant · 0% Fee Gateway · Edge CDN',
        icon: Shirt,
        category: 'rubro',
      },
      {
        id: 'canchas',
        shortcutNumber: 4,
        href: '/soluciones#canchas',
        label: t('megapanel.item_4_label', 'Reservas para canchas y complejos'),
        detail: t(
          'megapanel.item_4_detail',
          'Grilla de ocupación en tiempo real y bloqueo anti-solapamiento.'
        ),
        techFact: 'Locking Anti-Solapamiento · Realtime · State Engine',
        icon: Trophy,
        category: 'rubro',
      },
      {
        id: 'linux-pos',
        shortcutNumber: 5,
        href: '/linux',
        label: t('megapanel.item_7_label', 'Terminales Linux POS & Arquitectura B2B'),
        detail: t(
          'megapanel.item_7_detail',
          'Estaciones en modo quiosco, servidores offline-first y rescate de hardware.'
        ),
        techFact: 'Kiosk Mode · 480MB RAM · USB Rescue Key · Offline-First',
        icon: Terminal,
        category: 'rubro',
      },
      {
        id: 'cotizador',
        shortcutNumber: 6,
        href: '/cotizador',
        label: t('megapanel.item_5_label', 'Cotizador Interactivo'),
        detail: t(
          'megapanel.item_5_detail',
          'Calculá tu presupuesto en 2 min con desglose transparente de arquitectura.'
        ),
        techFact: 'Reactive State Engine · PDF Streaming · Zero Latency',
        icon: Calculator,
        category: 'action',
        isPrimaryCta: true,
      },
      {
        id: 'tienda',
        shortcutNumber: 7,
        href: '/tienda',
        label: t('megapanel.item_abonos_label', 'Tienda de Abonos & Mantenimiento'),
        detail: t(
          'megapanel.item_abonos_detail',
          'Planes mensuales de hosting Edge, monitoreo 24/7, soporte SLA y Guardia Linux.'
        ),
        techFact: 'Hosting Edge · Backups Diarios · SLA Prioritario',
        icon: ShoppingBag,
        category: 'action',
      },
    ],
    [t]
  )

  // Detectar SO para ⌘K vs Ctrl K y horario laboral de Rosario (Lunes a Viernes 09:00 - 19:00)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent)
      setShortcutKey(isMac ? '⌘K' : 'Ctrl K')

      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour: 'numeric',
          hour12: false,
          weekday: 'short',
        })
        const parts = formatter.formatToParts(now)
        const hourPart = parts.find((p) => p.type === 'hour')
        const weekdayPart = parts.find((p) => p.type === 'weekday')
        const hour = hourPart ? Number.parseInt(hourPart.value, 10) : 14
        const weekday = weekdayPart?.value?.toLowerCase() || ''

        const isWeekend =
          weekday.startsWith('sáb') ||
          weekday.startsWith('dom') ||
          weekday.startsWith('sat') ||
          weekday.startsWith('sun')
        const isWorkingHour = hour >= 9 && hour < 19

        setIsAvailableNow(!isWeekend && isWorkingHour)
      } catch {
        // Fallback seguro
      }
    }
  }, [])

  // Cerrar MegaPanel si se abre la paleta global CommandPalette
  useEffect(() => {
    const handleCloseEvent = () => onClose()
    window.addEventListener('closeMegaPanel', handleCloseEvent)
    return () => window.removeEventListener('closeMegaPanel', handleCloseEvent)
  }, [onClose])

  // Navegación unificada que soporta #hash tanto en la misma página como entre rutas
  const navigateToTarget = React.useCallback(
    (href: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
      const normalizePath = (p: string) => p.replace(/\/+$/, '') || '/'
      const hashIdx = href.indexOf('#')

      if (hashIdx !== -1 && typeof window !== 'undefined') {
        const targetPath = normalizePath(href.slice(0, hashIdx) || '/')
        const targetHash = href.slice(hashIdx)
        const currentPath = normalizePath(window.location.pathname)

        // Si estamos en la ruta destino (o si es #contact y existe en la página actual)
        const canScrollInPlace =
          (targetPath === currentPath && Boolean(resolveAnchorElement(targetHash))) ||
          (targetHash === '#contact' && Boolean(resolveAnchorElement('contact')))

        if (canScrollInPlace) {
          e?.preventDefault()
          onClose()
          const nextUrl = `${window.location.pathname}${window.location.search}${targetHash}`
          if (
            window.location.pathname + window.location.search + window.location.hash !==
            nextUrl
          ) {
            window.history.pushState(null, '', nextUrl)
          }
          smoothScrollTo(targetHash, -92)
          return
        }
      }

      onClose()
      if (!e) {
        router.push(href)
      }
    },
    [onClose, router]
  )

  // Filtrado reactivo tipo Command Palette
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return localizedPaletteItems
    const q = searchQuery.toLowerCase().trim()
    return localizedPaletteItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.techFact.toLowerCase().includes(q)
    )
  }, [searchQuery, localizedPaletteItems])

  // Reset del foco e índice al abrir (solo auto-enfoca en desktop para no tapar la pantalla con el teclado virtual móvil)
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    setSearchQuery('')
    setSelectedIndex(0)

    let timer: ReturnType<typeof setTimeout> | undefined
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }

    return () => {
      if (timer) clearTimeout(timer)
      // Devuelve el foco al trigger que abrió el panel
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  // Mantener selectedIndex en rango válido al filtrar
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Navegación por teclado completa (↑↓, ↵, Esc, 1-7)
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap: mantiene el foco dentro del diálogo
      if (event.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
        return
      }

      // Flechas ↑ y ↓ para navegar entre ítems
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((prev) => (filteredItems.length ? (prev + 1) % filteredItems.length : 0))
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((prev) =>
          filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        )
        return
      }

      // Enter ↵ para abrir ítem seleccionado
      if (event.key === 'Enter') {
        const item = filteredItems[selectedIndex]
        if (item) {
          event.preventDefault()
          navigateToTarget(item.href)
          return
        }
      }

      // Accesos directos numéricos 1–7 (cuando el input no tiene texto o no está enfocado)
      const isInputActive = document.activeElement === inputRef.current
      if (event.key >= '1' && event.key <= '7' && (!isInputActive || searchQuery === '')) {
        const num = Number.parseInt(event.key, 10)
        const target = localizedPaletteItems.find((item) => item.shortcutNumber === num)
        if (target) {
          event.preventDefault()
          navigateToTarget(target.href)
        }
      }
    }

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target)) {
        if (anchorRef?.current?.contains(target)) return
        if (mobileAnchorRef?.current?.contains(target)) return
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [
    isOpen,
    onClose,
    navigateToTarget,
    filteredItems,
    localizedPaletteItems,
    selectedIndex,
    searchQuery,
    anchorRef,
    mobileAnchorRef,
  ])

  // Mouse spotlight dinámico (estilo Linear / Vercel con variables --mx, --my)
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mx', `${x}px`)
    e.currentTarget.style.setProperty('--my', `${y}px`)
  }

  // Separación por categorías en vista normal
  const rubroItems = filteredItems.filter((it) => it.category === 'rubro')
  const actionItems = filteredItems.filter((it) => it.category === 'action')

  const containerVariants: import('framer-motion').Variants = {
    hidden: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.98,
      y: reduceMotion ? 0 : -6,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.16,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.98,
      y: reduceMotion ? 0 : -6,
      transition: { duration: 0.12, ease: 'easeIn' },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con blur que aisla la consola */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[55]"
          />

          <div className="fixed inset-x-0 top-16 z-[60] flex justify-center px-3 pt-2 pointer-events-auto select-none sm:top-20 sm:px-4">
            <motion.div
              ref={panelRef}
              id="mega-panel-palette"
              role="dialog"
              aria-modal="true"
              aria-label={t(
                'megapanel.aria_dialog',
                'Command Palette de Soluciones y Herramientas'
              )}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                boxShadow:
                  '0 24px 60px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
              className="relative w-full max-w-3xl max-h-[calc(100dvh-88px)] sm:max-h-[min(85vh,calc(100dvh-104px))] overflow-hidden rounded-2xl border border-black/8 dark:border-white/8 bg-[#FFFDF9] dark:bg-[#0B0F14] flex flex-col"
            >
              {/* Recurso visual sutil: Grilla de puntos con máscara radial (3-4% opacidad) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '16px 16px',
                  maskImage: 'radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse at 50% 25%, black 40%, transparent 85%)',
                }}
              />

              {/* Borde superior con highlight tenue de 1px */}
              <div className="absolute top-0 inset-x-12 h-px bg-linear-to-r from-transparent via-emerald-500/35 to-transparent pointer-events-none" />

              {/* Barra superior de Command Palette: Input de búsqueda + atajo de SO (⌘K o Ctrl K) + Controles */}
              <div className="relative border-b border-black/6 dark:border-white/8 p-3 sm:px-4 flex items-center justify-between gap-3 bg-black/1.5 dark:bg-white/1.5">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search
                    size={16}
                    className="text-slate-400 dark:text-[#8B95A5] shrink-0"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(
                      'megapanel.search_placeholder',
                      'Buscar solución, rubro o arquitectura…'
                    )}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-[#E6EAF0] placeholder:text-slate-400 dark:placeholder:text-[#8B95A5]/60 focus:outline-hidden font-sans"
                    aria-label={t('megapanel.aria_search', 'Buscar en la consola')}
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      window.dispatchEvent(new CustomEvent('openCommandPalette'))
                    }}
                    title={t('megapanel.open_cmdk', 'Abrir paleta global de comandos')}
                    className="hidden sm:inline-flex items-center font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 hover:bg-black/10 dark:bg-white/8 dark:hover:bg-white/15 text-slate-600 dark:text-[#CBD5E1] border border-black/5 dark:border-white/6 transition-colors cursor-pointer"
                  >
                    {shortcutKey}
                  </button>
                  <LanguageSwitcher />
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('megapanel.aria_close', 'Cerrar consola')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-[#8B95A5] dark:hover:text-[#E6EAF0] hover:bg-black/5 dark:hover:bg-white/6 transition-colors ml-1 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Contenedor escrolleable de tarjetas */}
              <div className="overflow-y-auto overscroll-contain p-3.5 sm:p-4 flex-1 min-h-0 space-y-3">
                {/* Categoría: Rubros */}
                {rubroItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-[#8B95A5] uppercase tracking-wider">
                        {t('megapanel.cat_rubros', '// Soluciones por rubro')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400/60 dark:text-[#8B95A5]/50">
                        {rubroItems.length} {t('megapanel.modules_count', 'módulos')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {rubroItems.map((item) => {
                        const globalIdx = filteredItems.indexOf(item)
                        const isSelected = selectedIndex === globalIdx
                        const Icon = item.icon

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            data-custom-scroll="true"
                            onClick={(e) => navigateToTarget(item.href, e)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            onMouseMove={handleMouseMove}
                            style={{
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                            className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? 'border-emerald-500/60 dark:border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-500/7 -translate-y-0.5'
                                : 'border-black/7 dark:border-white/8 bg-black/2 dark:bg-[#11161D] hover:border-black/15 dark:hover:border-white/18 hover:-translate-y-0.5'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-emerald-500/8 border-emerald-500/20 text-emerald-600 dark:text-emerald-500/90'
                                    }`}
                                  >
                                    <Icon size={15} strokeWidth={1.8} />
                                  </div>
                                  <h4 className="font-semibold text-xs sm:text-[13px] text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] leading-tight">
                                    {item.label}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-emerald-700/70 dark:text-emerald-200/80">
                                    ENGINE // READY
                                  </span>
                                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/8 text-slate-500 dark:text-[#CBD5E1] border border-black/5 dark:border-white/6 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                                    {item.shortcutNumber}
                                  </kbd>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-snug line-clamp-2 pl-0.5">
                                {item.detail}
                              </p>
                            </div>

                            {/* Hecho arquitectónico en mono con luminosidad optimizada y ↵ condicional */}
                            <div className="mt-2 pt-1.5 border-t border-black/4 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-[#CBD5E1]">
                              <span className="truncate">{item.techFact}</span>
                              <span
                                className={`font-mono text-xs transition-opacity duration-150 ml-1 shrink-0 ${
                                  isSelected
                                    ? 'opacity-100 text-emerald-600 dark:text-emerald-400'
                                    : 'opacity-0 group-hover:opacity-100 text-slate-400 dark:text-[#CBD5E1]'
                                }`}
                              >
                                ↵
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Categoría: Acciones Rápidas (Cotizador & Tienda de Abonos) */}
                {actionItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-[#8B95A5] uppercase tracking-wider">
                        {t('megapanel.cat_actions', '// Herramientas directas')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400/60 dark:text-[#8B95A5]/50">
                        {t('megapanel.interactive_access', 'Acceso interactivo')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {actionItems.map((item) => {
                        const globalIdx = filteredItems.indexOf(item)
                        const isSelected = selectedIndex === globalIdx
                        const Icon = item.icon
                        const borderAndBgClass = getActionCardStyle(
                          isSelected,
                          item.isPrimaryCta,
                          item.id
                        )

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            data-custom-scroll="true"
                            onClick={(e) => navigateToTarget(item.href, e)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            onMouseMove={handleMouseMove}
                            style={{
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                            className={`group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 overflow-hidden clip-path-[polygon(0_10px,10px_0,calc(100%_-_10px)_0,100%_10px,100%_calc(100%_-_10px),calc(100%_-_10px)_100%,10px_100%,0_calc(100%_-_10px))] ${borderAndBgClass}`}
                          >
                            <div
                              className={`absolute left-0 top-3 bottom-3 w-px transition-all duration-200 ${
                                item.id === 'tienda'
                                  ? 'bg-fuchsia-400/80 group-hover:w-0.5'
                                  : 'bg-emerald-400/80 group-hover:w-0.5'
                              }`}
                              aria-hidden="true"
                            />
                            <div
                              className={`absolute right-3 top-0 h-px w-20 bg-linear-to-r from-transparent ${
                                item.id === 'tienda' ? 'via-fuchsia-400/70' : 'via-emerald-400/70'
                              } to-transparent`}
                              aria-hidden="true"
                            />
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-black/3 dark:bg-white/4 border-black/6 dark:border-white/6 text-slate-600 dark:text-[#CBD5E1]'
                                    }`}
                                  >
                                    <Icon size={15} strokeWidth={1.8} />
                                  </div>
                                  <h4 className="font-semibold text-xs sm:text-[13px] text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] leading-tight">
                                    {item.label}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/8 text-slate-500 dark:text-[#CBD5E1] border border-black/5 dark:border-white/6 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                                    {item.shortcutNumber}
                                  </kbd>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-snug line-clamp-2 pl-0.5">
                                {item.detail}
                              </p>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-black/4 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-[#CBD5E1]">
                              <span className="truncate">{item.techFact}</span>
                              <span
                                className={`font-mono text-xs transition-opacity duration-150 ml-1 shrink-0 ${
                                  isSelected
                                    ? 'opacity-100 text-emerald-600 dark:text-emerald-400'
                                    : 'opacity-0 group-hover:opacity-100 text-slate-400 dark:text-[#CBD5E1]'
                                }`}
                              >
                                ↵
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Barra de Secciones Directas del Sitio (Acceso 1-clic tanto en Desktop como en Mobile) */}
                <div className="pt-1 space-y-2">
                  <Link
                    href="/soluciones"
                    data-custom-scroll="true"
                    onClick={(e) => navigateToTarget('/soluciones', e)}
                    className="group flex items-center justify-between px-3 py-2 rounded-xl border border-black/7 dark:border-white/8 bg-black/1.5 dark:bg-white/2 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-emerald-500/3 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Layers size={13} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] truncate">
                          {t(
                            'megapanel.arch_banner_title',
                            'Explorar Catálogo Completo de Soluciones & Demos en Vivo'
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1] truncate">
                          {t(
                            'megapanel.arch_banner_sub',
                            'Sistemas web a medida, simuladores interactivos y arquitectura verificable'
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                      {t('megapanel.arch_banner_cta', 'Ver soluciones ↗')}
                    </span>
                  </Link>

                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {[
                      { href: '/portafolio', label: t('nav.casos', 'Casos de Éxito') },
                      { href: '/precios', label: t('nav.planes', 'Planes') },
                      { href: '/demos', label: t('footer.nav_demo', 'Demo Interactiva') },
                      { href: '/linux', label: t('nav.linux', 'Linux') },
                      { href: '/#contact', label: t('nav.contacto', 'Contacto') },
                    ].map((quickLink) => (
                      <Link
                        key={quickLink.href}
                        href={quickLink.href}
                        data-custom-scroll="true"
                        onClick={(e) => navigateToTarget(quickLink.href, e)}
                        className="px-2.5 py-1.5 rounded-lg border border-black/8 dark:border-white/10 bg-black/2.5 dark:bg-white/4 hover:border-cyan-500/45 hover:text-cyan-700 dark:hover:text-cyan-300 text-[11px] font-semibold text-slate-700 dark:text-[#CBD5E1] transition-colors"
                      >
                        {quickLink.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Si no hay resultados de búsqueda */}
                {filteredItems.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="font-mono text-xs text-slate-400 dark:text-[#8B95A5]">
                      {t('megapanel.no_results', 'No se encontraron resultados para')} &quot;
                      {searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-2 font-mono text-[11px] text-emerald-500 hover:underline cursor-pointer"
                    >
                      {t('megapanel.clear_search', 'Limpiar búsqueda (Esc)')}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer de Consola: Autoría + Disponibilidad honesta + WhatsApp CTA */}
              <div className="border-t border-black/6 dark:border-white/8 bg-black/2 dark:bg-[#11161D]/90 p-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/8 text-[11px] font-mono font-bold text-slate-800 dark:text-[#E6EAF0] flex items-center justify-center shrink-0">
                    EXE
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold text-xs text-slate-900 dark:text-[#E6EAF0] truncate">
                        Exequiel Echevarría
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1] border border-black/10 dark:border-white/8 px-1.5 py-0.2 rounded bg-black/2 dark:bg-white/4 whitespace-nowrap">
                        Full-Stack · React / TypeScript
                      </span>
                    </div>
                    {/* Disponibilidad honesta vinculada a horario real de Rosario */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailableNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400/80'
                          }`}
                        />
                        {isAvailableNow
                          ? t('megapanel.available_now', 'Disponible · responde en ~1 h')
                          : t(
                              'megapanel.available_later',
                              'Fuera de horario · responde mañana'
                            )}{' '}
                        · {t('megapanel.location', 'Rosario, AR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/6 hover:bg-slate-100 dark:hover:bg-white/12 text-slate-900 dark:text-[#E6EAF0] font-semibold text-[11px] sm:text-xs whitespace-nowrap transition-colors shrink-0 shadow-xs active:scale-[0.98]"
                  >
                    <LayoutDashboard
                      size={14}
                      strokeWidth={2}
                      className="text-cyan-600 dark:text-cyan-400 shrink-0"
                    />
                    <span className="truncate">
                      {t('megapanel.dashboard_cta', 'Panel Clientes')}
                    </span>
                  </Link>
                  <a
                    href={getWhatsAppUrl(
                      t(
                        'megapanel.whatsapp_prefill',
                        '¡Hola Exequiel! Me interesa consultar por un desarrollo de software / web a medida.'
                      )
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-[11px] sm:text-xs whitespace-nowrap transition-colors shrink-0 shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle size={15} strokeWidth={2} className="shrink-0" />
                    <span className="truncate">
                      {t('megapanel.whatsapp_cta', 'Hablar por WhatsApp')}
                    </span>
                    <span className="font-mono text-[10px] shrink-0">↗</span>
                  </a>
                </div>
              </div>

              {/* Barra de atajos de pie de consola (Keyboard hints puros) */}
              <div className="hidden sm:flex px-3 sm:px-4 py-2 bg-black/3 dark:bg-black/40 border-t border-black/4 dark:border-white/5 items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#CBD5E1]">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      ↑↓
                    </kbd>{' '}
                    {t('megapanel.nav_hint', 'navegar')}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      ↵
                    </kbd>{' '}
                    {t('megapanel.open_hint', 'abrir')}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      1–7
                    </kbd>{' '}
                    {t('megapanel.shortcut_hint', 'acceso directo')}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      esc
                    </kbd>{' '}
                    {t('megapanel.close_hint', 'cerrar')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
