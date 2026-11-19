/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileSolutionsView:
 * Vista pragmática por rubro para celulares (< 768px).
 * Un rubro enfocado a la vez con KPIs claros, entregables concisos y acceso directo a demo/cotización.
 */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  Calendar,
  Check,
  Shirt,
  Terminal,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'

interface RubroSolution {
  readonly id: string
  readonly hash: string
  readonly tab: string
  readonly title: string
  readonly summary: string
  readonly priceHint: string
  readonly icon: typeof Calendar
  readonly kpis: readonly { label: string; value: string }[]
  readonly deliverables: readonly string[]
  readonly demoUrl: string
  readonly quoteHref: string
}

const SOLUTIONS: readonly RubroSolution[] = [
  {
    id: 'peluqueria',
    hash: 'peluqueria',
    tab: 'Peluquerías',
    title: 'Turnos Online & Fidelización',
    summary: 'Agenda automática 24/7 con señas protegidas y recordatorios por WhatsApp.',
    priceHint: 'Desde $450.000 · 1 solo pago',
    icon: Calendar,
    kpis: [
      { label: 'Turnos', value: '+38%' },
      { label: 'Ausentismo', value: '-70%' },
      { label: 'Comisión', value: '0%' },
    ],
    deliverables: [
      'Reserva online por profesional y servicio',
      'Confirmación instantánea por WhatsApp',
      'Panel de agenda, clientes y caja diaria',
    ],
    demoUrl: 'https://pelu-rosario.vercel.app/',
    quoteHref: '/cotizador?type=reservas',
  },
  {
    id: 'panaderia',
    hash: 'panaderia',
    tab: 'Gastronomía',
    title: 'Comandas, KDS & Offline-First',
    summary: 'Salón, cocina en vivo y pedidos rápidos que no se frenan aunque se corte internet.',
    priceHint: 'Desde $650.000 · 1 solo pago',
    icon: UtensilsCrossed,
    kpis: [
      { label: 'Ticket POS', value: '1.4s' },
      { label: 'Offline', value: '100%' },
      { label: 'Comisión', value: '0%' },
    ],
    deliverables: [
      'Mapa de mesas, delivery y carta QR dinámica',
      'Pantalla KDS de cocina con tiempos de espera',
      'Arqueo ciego Z y control de stock en vivo',
    ],
    demoUrl: 'https://kobe-sand.vercel.app/',
    quoteHref: '/cotizador?type=webapp',
  },
  {
    id: 'indumentaria',
    hash: 'indumentaria',
    tab: 'Tiendas',
    title: 'E-Commerce sin Comisiones',
    summary:
      'Catálogo veloz con talles, variantes, stock sincronizado y cobros directos a tu cuenta.',
    priceHint: 'Desde $750.000 · 1 solo pago',
    icon: Shirt,
    kpis: [
      { label: 'Comisión', value: '0%' },
      { label: 'Stock', value: 'Real-time' },
      { label: 'Conversión', value: '+44%' },
    ],
    deliverables: [
      'Catálogo con filtros, talles y stock atómico',
      'Mercado Pago, transferencia y cálculo de envíos',
      'Código 100% tuyo sin alquiler mensual',
    ],
    demoUrl: 'https://multi-tiendas-celphone.vercel.app',
    quoteHref: '/cotizador?type=ecommerce',
  },
  {
    id: 'canchas',
    hash: 'canchas',
    tab: 'Canchas',
    title: 'Reservas Deportivas 24/7',
    summary: 'Grilla multi-cancha en tiempo real con bloqueo anti doble-reserva y seña automática.',
    priceHint: 'Desde $650.000 · 1 solo pago',
    icon: Trophy,
    kpis: [
      { label: 'Ocupación', value: '+45%' },
      { label: 'Doble turno', value: '0%' },
      { label: 'Cobros', value: 'Auto' },
    ],
    deliverables: [
      'Calendario visual multi-cancha y multi-deporte',
      'Confirmación de seña automática por webhook',
      'CRM de jugadores y reportes de ocupación',
    ],
    demoUrl: 'https://sportmanager-playhub.vercel.app',
    quoteHref: '/cotizador?type=reservas',
  },
  {
    id: 'linux',
    hash: 'linux',
    tab: 'Linux POS',
    title: 'Terminales Linux de Caja',
    summary: 'Recuperamos tus PCs lentas en terminales blindadas con arranque en 4.5 segundos.',
    priceHint: 'Desde $350.000 · $0 licencias',
    icon: Terminal,
    kpis: [
      { label: 'Arranque', value: '4.5s' },
      { label: 'RAM Base', value: '480MB' },
      { label: 'Licencias', value: '$0' },
    ],
    deliverables: [
      'Modo quiosco blindado sin virus ni cuelgues',
      'Impresoras térmicas ESC/POS y lectores USB',
      'Llave USB de rescate + soporte servidor LAN',
    ],
    demoUrl: '/linux',
    quoteHref: '/cotizador?plan=linux',
  },
]

export default function MobileSolutionsView() {
  const [activeId, setActiveId] = useState<string>('peluqueria')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    const match = SOLUTIONS.find((s) => s.hash === hash || s.id === hash)
    if (match) setActiveId(match.id)
  }, [])

  const active = SOLUTIONS.find((s) => s.id === activeId) ?? SOLUTIONS[0]!
  const Icon = active.icon
  const isExternalDemo = active.demoUrl.startsWith('http')

  return (
    <div
      data-mobile-solutions="true"
      className="relative z-10 min-h-screen bg-transparent text-foreground pt-20 pb-28 px-4 overflow-x-clip"
    >
      <div className="max-w-sm mx-auto space-y-4">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-cyan-400">
            Soluciones por rubro
          </p>
          <h1 className="text-2xl font-display font-bold tracking-tight mt-0.5">
            Sistemas listos para operar
          </h1>
        </div>

        {/* Selector horizontal de rubros */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          {SOLUTIONS.map((sol) => {
            const selected = sol.id === active.id
            return (
              <button
                key={sol.id}
                type="button"
                onClick={() => setActiveId(sol.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                  selected
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
              >
                {sol.tab}
              </button>
            )
          })}
        </div>

        {/* Ficha del rubro seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-white/10 space-y-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-foreground leading-snug">{active.title}</h2>
                <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {active.priceHint}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{active.summary}</p>

            {/* 3 KPIs */}
            <div className="grid grid-cols-3 gap-2">
              {active.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 text-center"
                >
                  <p className="text-sm font-display font-black text-foreground">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Entregables */}
            <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/8">
              {active.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Acciones */}
            <div className="space-y-2 pt-1">
              <a
                href={getWhatsAppUrl(
                  `¡Hola Exequiel! Quiero consultar por la solución de ${active.tab} (${active.title}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
              >
                <span>Consultar por WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                {isExternalDemo ? (
                  <a
                    href={active.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span>Probar demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href={active.demoUrl}
                    className="h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span>Ver detalles</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <Link
                  href={active.quoteHref}
                  className="h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-foreground font-semibold text-xs flex items-center justify-center"
                >
                  Cotizar rubro
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
