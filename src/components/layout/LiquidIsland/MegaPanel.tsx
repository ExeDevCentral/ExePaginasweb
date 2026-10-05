/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * MegaPanel: Command Palette de ingeniería con navegación por teclado, búsqueda y estética de consola.
 */
'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Calendar,
  UtensilsCrossed,
  Shirt,
  Trophy,
  Calculator,
  ShoppingBag,
  MessageCircle,
  Search,
  Layers,
  X,
  type LucideIcon,
} from 'lucide-react'
import LanguageSwitcher from '../LanguageSwitcher'
import ThemeToggle from '../ThemeToggle'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'

export interface MegaPanelProps {
  isOpen: boolean
  onClose: () => void
  anchorRef?: React.RefObject<HTMLElement | null>
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

const paletteItems: PaletteItem[] = [
  {
    id: 'peluqueria',
    shortcutNumber: 1,
    href: '/soluciones#peluqueria',
    label: 'Turnos online para peluquerías',
    detail: 'Agenda automatizada 24/7, recordatorios por WhatsApp y fidelización.',
    techFact: 'Event-Driven · WhatsApp Cloud API · Postgres RLS',
    icon: Calendar,
    category: 'rubro',
  },
  {
    id: 'gastronomia',
    shortcutNumber: 2,
    href: '/soluciones#panaderia',
    label: 'Comandas y pedidos gastronómicos',
    detail: 'Terminal de pedidos rápidos, combos, delivery y control de stock.',
    techFact: 'Offline-First · Sync Local · WebSockets KDS',
    icon: UtensilsCrossed,
    category: 'rubro',
  },
  {
    id: 'indumentaria',
    shortcutNumber: 3,
    href: '/soluciones#indumentaria',
    label: 'Catálogo y stock para indumentaria',
    detail: 'Gestión ágil de talles, variantes en vivo y sincronización de stock.',
    techFact: 'Multi-Tenant · Stock Concurrente · Edge CDN',
    icon: Shirt,
    category: 'rubro',
  },
  {
    id: 'canchas',
    shortcutNumber: 4,
    href: '/soluciones#canchas',
    label: 'Reservas para canchas y complejos',
    detail: 'Grilla de ocupación en tiempo real y bloqueo anti-solapamiento.',
    techFact: 'Locking Anti-Solapamiento · Realtime · State Engine',
    icon: Trophy,
    category: 'rubro',
  },
  {
    id: 'cotizador',
    shortcutNumber: 5,
    href: '/cotizador',
    label: 'Cotizador Interactivo',
    detail: 'Calculá tu presupuesto en 2 min con desglose transparente de arquitectura.',
    techFact: 'Reactive State Engine · PDF Streaming · Zero Latency',
    icon: Calculator,
    category: 'action',
    isPrimaryCta: true,
  },
  {
    id: 'tienda',
    shortcutNumber: 6,
    href: '/tienda',
    label: 'Tienda Online & E-Commerce',
    detail: 'Tu tienda propia sin comisiones por venta con cobros directos.',
    techFact: 'Server Components · 0% Fee Gateway · Direct Auth',
    icon: ShoppingBag,
    category: 'action',
  },
]

export default function MegaPanel({ isOpen, onClose, anchorRef }: Readonly<MegaPanelProps>) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const reduceMotion = Boolean(useReducedMotion())

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [shortcutKey, setShortcutKey] = useState('Ctrl K')

  // Detección honesta de disponibilidad según horario de Rosario (UTC-3)
  const [availability, setAvailability] = useState<{
    isAvailable: boolean
    text: string
    location: string
  }>({
    isAvailable: true,
    text: 'Disponible · responde en ~1 h',
    location: 'Rosario, AR',
  })

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

        if (!isWeekend && isWorkingHour) {
          setAvailability({
            isAvailable: true,
            text: 'Disponible · responde en ~1 h',
            location: 'Rosario, AR',
          })
        } else {
          setAvailability({
            isAvailable: false,
            text: 'Fuera de horario · responde mañana',
            location: 'Rosario, AR',
          })
        }
      } catch {
        // Fallback seguro
      }
    }
  }, [])

  // Filtrado reactivo tipo Command Palette
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return paletteItems
    const q = searchQuery.toLowerCase().trim()
    return paletteItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.techFact.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Reset del foco e índice al abrir
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSelectedIndex(0)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Mantener selectedIndex en rango válido al filtrar
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Navegación por teclado completa (↑↓, ↵, Esc, 1-6, ⌘K / Ctrl K)
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      // ⌘K o Ctrl+K: enfoca el buscador
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
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
          router.push(item.href)
          onClose()
          return
        }
      }

      // Accesos directos numéricos 1–6 (cuando el input no tiene texto o no está enfocado)
      const isInputActive = document.activeElement === inputRef.current
      if (event.key >= '1' && event.key <= '6' && (!isInputActive || searchQuery === '')) {
        const num = Number.parseInt(event.key, 10)
        const target = paletteItems.find((item) => item.shortcutNumber === num)
        if (target) {
          event.preventDefault()
          router.push(target.href)
          onClose()
        }
      }
    }

    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target)) {
        if (anchorRef?.current?.contains(target)) return
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
  }, [isOpen, onClose, router, filteredItems, selectedIndex, searchQuery, anchorRef])

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
          {/* Backdrop con blur de 12px que aisla la consola */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[12px] z-45"
          />

          <div className="fixed inset-x-0 top-16 z-50 flex justify-center px-4 pointer-events-auto select-none sm:top-20">
            <motion.div
              ref={panelRef}
              id="mega-panel-palette"
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette de Soluciones y Herramientas"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                boxShadow:
                  '0 24px 60px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#FFFDF9] dark:bg-[#0B0F14] flex flex-col"
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
              <div className="relative border-b border-black/[0.06] dark:border-white/[0.08] p-3 sm:px-4 flex items-center justify-between gap-3 bg-black/[0.015] dark:bg-white/[0.015]">
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
                    placeholder="Buscar solución o herramienta…"
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-[#E6EAF0] placeholder:text-slate-400 dark:placeholder:text-[#8B95A5]/60 focus:outline-hidden font-sans"
                    aria-label="Buscar en la consola"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/[0.08] text-slate-600 dark:text-[#CBD5E1] border border-black/5 dark:border-white/[0.06]">
                    {shortcutKey}
                  </kbd>
                  <LanguageSwitcher />
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar consola"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-[#8B95A5] dark:hover:text-[#E6EAF0] hover:bg-black/5 dark:hover:bg-white/[0.06] transition-colors ml-1 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Contenedor escrolleable de tarjetas */}
              <div className="overflow-y-auto p-3.5 sm:p-4 flex-1 space-y-3">
                {/* Categoría: Rubros */}
                {rubroItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-[#8B95A5] uppercase tracking-wider">
                        // Soluciones por rubro
                      </span>
                      <span className="font-mono text-[10px] text-slate-400/60 dark:text-[#8B95A5]/50">
                        {rubroItems.length} módulos
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
                            onClick={onClose}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            onMouseMove={handleMouseMove}
                            style={{
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                            className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? 'border-emerald-500/60 dark:border-emerald-500/60 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.07] -translate-y-0.5'
                                : 'border-black/[0.07] dark:border-white/[0.08] bg-black/[0.02] dark:bg-[#11161D] hover:border-black/15 dark:hover:border-white/[0.18] hover:-translate-y-0.5'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06] text-slate-600 dark:text-[#CBD5E1]'
                                    }`}
                                  >
                                    <Icon size={15} strokeWidth={1.8} />
                                  </div>
                                  <h4 className="font-semibold text-xs sm:text-[13px] text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] leading-tight">
                                    {item.label}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/[0.08] text-slate-500 dark:text-[#CBD5E1] border border-black/5 dark:border-white/[0.06] group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                                    {item.shortcutNumber}
                                  </kbd>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-snug line-clamp-2 pl-0.5">
                                {item.detail}
                              </p>
                            </div>

                            {/* Hecho arquitectónico en mono con luminosidad optimizada y ↵ condicional */}
                            <div className="mt-2 pt-1.5 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-[#CBD5E1]">
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

                {/* Categoría: Acciones Rápidas (Cotizador & Tienda) */}
                {actionItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-[#8B95A5] uppercase tracking-wider">
                        // Herramientas directas
                      </span>
                      <span className="font-mono text-[10px] text-slate-400/60 dark:text-[#8B95A5]/50">
                        Acceso interactivo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {actionItems.map((item) => {
                        const globalIdx = filteredItems.indexOf(item)
                        const isSelected = selectedIndex === globalIdx
                        const Icon = item.icon

                        // Un solo foco verde a la vez: Cotizador solo tiene verde si está seleccionado
                        const borderAndBgClass = isSelected
                          ? 'border-emerald-500/60 dark:border-emerald-500/60 bg-emerald-500/[0.05] dark:bg-emerald-500/[0.07] -translate-y-0.5'
                          : item.isPrimaryCta
                            ? 'border-black/[0.1] dark:border-white/[0.12] bg-black/[0.03] dark:bg-[#141b24] hover:border-black/20 dark:hover:border-white/[0.22] hover:-translate-y-0.5'
                            : 'border-black/[0.07] dark:border-white/[0.08] bg-black/[0.02] dark:bg-[#11161D] hover:border-black/15 dark:hover:border-white/[0.18] hover:-translate-y-0.5'

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            onMouseMove={handleMouseMove}
                            style={{
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                            }}
                            className={`group relative flex flex-col justify-between p-3 rounded-xl border transition-all duration-150 ${borderAndBgClass}`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06] text-slate-600 dark:text-[#CBD5E1]'
                                    }`}
                                  >
                                    <Icon size={15} strokeWidth={1.8} />
                                  </div>
                                  <h4 className="font-semibold text-xs sm:text-[13px] text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] leading-tight">
                                    {item.label}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/[0.08] text-slate-500 dark:text-[#CBD5E1] border border-black/5 dark:border-white/[0.06] group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                                    {item.shortcutNumber}
                                  </kbd>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-snug line-clamp-2 pl-0.5">
                                {item.detail}
                              </p>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-[#CBD5E1]">
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

                {/* Banner destacado: Arquitectura completa & casos reales de software (subido de jerarquía) */}
                <div className="pt-0.5">
                  <Link
                    href="/soluciones"
                    onClick={onClose}
                    className="group flex items-center justify-between px-3 py-2 rounded-xl border border-black/[0.07] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Layers size={13} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 dark:text-[#E6EAF0] tracking-[-0.01em] truncate">
                          Arquitectura completa &amp; casos reales de software
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1] truncate">
                          Documentación técnica · Diagramas de flujo · Benchmarks de rendimiento
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                      Ver ingeniería ↗
                    </span>
                  </Link>
                </div>

                {/* Si no hay resultados de búsqueda */}
                {filteredItems.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="font-mono text-xs text-slate-400 dark:text-[#8B95A5]">
                      No se encontraron resultados para &quot;{searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="mt-2 font-mono text-[11px] text-emerald-500 hover:underline cursor-pointer"
                    >
                      Limpiar búsqueda (Esc)
                    </button>
                  </div>
                )}
              </div>

              {/* Footer de Consola: Autoría + Disponibilidad honesta + WhatsApp CTA */}
              <div className="border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-[#11161D]/90 p-3 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/[0.08] text-[11px] font-mono font-bold text-slate-800 dark:text-[#E6EAF0] flex items-center justify-center shrink-0">
                    EXE
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-[#E6EAF0]">
                        Exequiel Echevarría
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1] border border-black/10 dark:border-white/[0.08] px-1.5 py-0.2 rounded bg-black/[0.02] dark:bg-white/[0.04]">
                        Full-Stack · React / TypeScript
                      </span>
                    </div>
                    {/* Disponibilidad honesta vinculada a horario real de Rosario */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-[#CBD5E1]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            availability.isAvailable
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-amber-400/80'
                          }`}
                        />
                        {availability.text} · {availability.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <a
                    href={getWhatsAppUrl(
                      '¡Hola Exequiel! Me interesa consultar por un desarrollo de software / web a medida.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle size={15} strokeWidth={2} />
                    <span>Hablar por WhatsApp</span>
                    <span className="font-mono text-[10px]">↗</span>
                  </a>
                </div>
              </div>

              {/* Barra de atajos de pie de consola (Keyboard hints puros) */}
              <div className="px-3 sm:px-4 py-2 bg-black/[0.03] dark:bg-black/40 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#CBD5E1]">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      ↑↓
                    </kbd>{' '}
                    navegar
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      ↵
                    </kbd>{' '}
                    abrir
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      1–6
                    </kbd>{' '}
                    acceso directo
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-slate-700 dark:text-[#E6EAF0]">
                      esc
                    </kbd>{' '}
                    cerrar
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
