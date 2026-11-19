/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * MobileBottomNav:
 * Dock flotante inferior estilo app nativa + Action Sheet de Conversión móvil (< 768px).
 * Reemplaza los botones flotantes superpuestos por navegación ergonómica en zona de pulgar.
 */
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  LayoutGrid,
  Calculator,
  Tag,
  MessageCircle,
  Bot,
  X,
  ArrowUpRight,
  Terminal,
  ShoppingBag,
  Layers,
  UserCheck,
  Phone,
} from 'lucide-react'
import Logo from '@/components/layout/Logo'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '@/core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

const HIDDEN_ROUTES = ['/dashboard', '/login', '/hero-upgrade'] as const

const WhatsAppVectorIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.484 2 12.018c0 1.907.534 3.69 1.464 5.215L2 22l4.914-1.424A9.972 9.972 0 0012.031 22c5.536 0 10.031-4.484 10.031-10.018C22.062 6.484 17.567 2 12.031 2zm0 18.286c-1.636 0-3.18-.45-4.524-1.233l-.324-.19-2.923.848.868-2.846-.21-.334a8.23 8.23 0 01-1.282-4.513c0-4.568 3.717-8.284 8.29-8.284 4.572 0 8.289 3.716 8.289 8.284 0 4.569-3.717 8.286-8.29 8.286zm4.545-6.208c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.124-1.052-.388-2.003-1.237-.741-.66-1.241-1.476-1.386-1.725-.145-.249-.015-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.125-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.756 2.68 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.071 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.291z" />
  </svg>
)

export default function MobileBottomNav() {
  const pathname = usePathname() || '/'
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setSheetOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!sheetOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sheetOpen])

  if (HIDDEN_ROUTES.some((route) => pathname.startsWith(route))) {
    return null
  }

  const isHome = pathname === '/'
  const isDemos = pathname.startsWith('/portafolio') || pathname.startsWith('/demos')
  const isQuote = pathname.startsWith('/cotizador')
  const isPricing = pathname.startsWith('/precios')

  const whatsappUrl = getWhatsAppUrl(
    '¡Hola Exequiel! Te escribo desde la versión móvil de ExePaginasWeb para consultar por un proyecto.'
  )

  const handleOpenAIChat = () => {
    setSheetOpen(false)
    trackEvent('chat_widget_opened', { source: 'mobile_bottom_sheet' })
    window.dispatchEvent(new CustomEvent('exe:open-ai-chat'))
  }

  return (
    <>
      {/* Action Sheet Móvil de Conversión */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="mobile-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSheetOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-[58] bg-black/65 backdrop-blur-md md:hidden"
            />

            <motion.div
              key="mobile-sheet-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Canales de contacto directo"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[60] md:hidden rounded-t-3xl bg-white dark:bg-[#090e1a] border-t border-slate-200 dark:border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.45)] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              {/* Drag indicator */}
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/15 mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-[#0f172a] border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Logo size={26} variant="dark" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Exequiel Echevarría
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Directo · Respuesta &lt;15 min</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Cerrar panel de contacto"
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Channels */}
              <div className="space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setSheetOpen(false)
                    trackEvent('contact_whatsapp_clicked', { source: 'mobile_action_sheet' })
                  }}
                  className="flex items-center justify-between gap-3 w-full p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0">
                      <WhatsAppVectorIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="block text-sm font-bold leading-tight">
                        WhatsApp Directo
                      </span>
                      <span className="block text-[11px] text-slate-950/75 font-medium truncate">
                        {DISPLAY_WHATSAPP_NUMBER} · Sin intermediarios
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>

                {isHome && (
                  <button
                    type="button"
                    onClick={handleOpenAIChat}
                    className="flex items-center justify-between gap-3 w-full p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="block text-sm font-bold leading-tight">
                          Asistente IA Técnico
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          Consultas 24/7 y pruebas de automatización
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                )}
              </div>

              {/* Quick Secondary Routes */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/8">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Explorar secciones
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/soluciones"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-transform"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="truncate">Soluciones</span>
                  </Link>
                  <Link
                    href="/linux"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-transform"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">Linux POS</span>
                  </Link>
                  <Link
                    href="/tienda"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-transform"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span className="truncate">Abonos</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/8 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-[0.98] transition-transform"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Área Cliente</span>
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Phone className="w-3 h-3" />
                <span>{DISPLAY_WHATSAPP_NUMBER} · Rosario, AR</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Native-App Bottom Bar (Solo Móvil < md) */}
      <nav
        aria-label="Navegación rápida móvil"
        data-mobile-bottom-nav="true"
        className="fixed bottom-3 inset-x-3 z-40 md:hidden select-none pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200/90 dark:border-white/12 bg-white/92 dark:bg-[#090e1a]/92 backdrop-blur-2xl shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] px-1.5 py-1.5 grid grid-cols-5 items-center gap-1">
          {/* 1. Inicio */}
          <Link
            href="/"
            aria-current={isHome ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              isHome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 active:text-slate-900 dark:active:text-white'
            }`}
          >
            {isHome && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-0 rounded-xl bg-emerald-500/12 dark:bg-emerald-400/12 border border-emerald-500/25"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Home className="w-[18px] h-[18px] relative z-10" strokeWidth={isHome ? 2.2 : 1.8} />
            <span className="text-[10px] font-semibold mt-0.5 relative z-10 leading-none">
              Inicio
            </span>
          </Link>

          {/* 2. Demos / Casos */}
          <Link
            href="/portafolio"
            aria-current={isDemos ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              isDemos
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 active:text-slate-900 dark:active:text-white'
            }`}
          >
            {isDemos && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-0 rounded-xl bg-emerald-500/12 dark:bg-emerald-400/12 border border-emerald-500/25"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <LayoutGrid
              className="w-[18px] h-[18px] relative z-10"
              strokeWidth={isDemos ? 2.2 : 1.8}
            />
            <span className="text-[10px] font-semibold mt-0.5 relative z-10 leading-none">
              Demos
            </span>
          </Link>

          {/* 3. Cotizar (Acción Central Pragmática) */}
          <Link
            href="/cotizador"
            aria-current={isQuote ? 'page' : undefined}
            onClick={() => trackEvent('cotizador_plan_selected', { source: 'mobile_bottom_nav' })}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all active:scale-95 ${
              isQuote
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-sm'
            }`}
          >
            <Calculator className="w-[18px] h-[18px]" strokeWidth={2.2} />
            <span className="text-[10px] font-bold mt-0.5 leading-none">Cotizar</span>
          </Link>

          {/* 4. Precios */}
          <Link
            href="/precios"
            aria-current={isPricing ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
              isPricing
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 active:text-slate-900 dark:active:text-white'
            }`}
          >
            {isPricing && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-0 rounded-xl bg-emerald-500/12 dark:bg-emerald-400/12 border border-emerald-500/25"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <Tag className="w-[18px] h-[18px] relative z-10" strokeWidth={isPricing ? 2.2 : 1.8} />
            <span className="text-[10px] font-semibold mt-0.5 relative z-10 leading-none">
              Precios
            </span>
          </Link>

          {/* 5. Hablar (Action Sheet Contacto) */}
          <button
            type="button"
            onClick={() => setSheetOpen((prev) => !prev)}
            aria-expanded={sheetOpen}
            aria-label="Abrir canales de contacto"
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors cursor-pointer ${
              sheetOpen
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/12'
                : 'text-slate-500 dark:text-slate-400 active:text-slate-900 dark:active:text-white'
            }`}
          >
            <span className="relative">
              <MessageCircle className="w-[18px] h-[18px]" strokeWidth={sheetOpen ? 2.2 : 1.8} />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090e1a]" />
            </span>
            <span className="text-[10px] font-semibold mt-0.5 leading-none">Hablar</span>
          </button>
        </div>
      </nav>
    </>
  )
}
