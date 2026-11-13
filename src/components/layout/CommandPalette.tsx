/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * CommandPalette: Terminal HUD interactiva accesible con Ctrl+K / Cmd+K impulsada por cmdk.
 * Permite navegación hiper-rápida, alternancia de tema, cambio de idioma y contacto directo.
 */
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Laptop,
  ShoppingBag,
  Calculator,
  Layers,
  Briefcase,
  LayoutDashboard,
  MessageCircle,
  Sun,
  Moon,
  Globe,
  Copy,
  ArrowUp,
  X,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '@/core/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { getWhatsAppUrl } from '@/core/utils/whatsappUtils'
import { getGlobalLenis } from '@/components/shared/scrollUtils'
import { toast } from 'sonner'

export interface CommandPaletteProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  // Listener global de teclado (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const executeAction = useCallback((action: () => void) => {
    setOpen(false)
    action()
  }, [])

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      void navigator.clipboard.writeText(window.location.origin)
      toast.success(t('cmd.toast_copied', '🔗 Enlace copiado al portapapeles'))
    }
  }

  const handleScrollToTop = () => {
    const lenis = getGlobalLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.85 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'es' : 'en'
    void i18n.changeLanguage(nextLang)
    toast.success(
      nextLang === 'en'
        ? t('cmd.toast_lang_en', '🌐 Language switched to English')
        : t('cmd.toast_lang_es', '🌐 Idioma cambiado a Español')
    )
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    toast.success(
      nextTheme === 'dark'
        ? t('cmd.toast_dark', '🌙 Modo Oscuro Activado')
        : t('cmd.toast_light', '☀️ Modo Claro Activado')
    )
  }

  return (
    <>
      {/* Botón flotante o disparador visual para accesibilidad móvil/escritorio */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-105 flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop oscuro translúcido con desenfoque de GPU */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md"
            />

            {/* Modal de cmdk */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-xl rounded-2xl bg-slate-900/95 dark:bg-[#0b101d]/95 border border-cyan-500/30 dark:border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.2)] overflow-hidden z-10 text-white"
            >
              <Command
                label={t('cmd.aria_label', 'Comandos y Navegación Rápida')}
                className="flex flex-col w-full focus:outline-hidden"
              >
                {/* Cabecera de búsqueda con icono animado */}
                <div className="flex items-center px-4 border-b border-white/10 gap-3">
                  <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                  <Command.Input
                    placeholder={t(
                      'cmd.placeholder',
                      'Escribe un comando o busca una sección... (ej. cotizador, tienda, whatsapp)'
                    )}
                    className="w-full py-4 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-hidden"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={t('cmd.close_aria', 'Cerrar paleta de comandos')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Lista de resultados */}
                <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <Command.Empty className="py-8 text-center text-sm text-slate-400">
                    {t('cmd.empty', 'No se encontraron comandos o secciones coincidentes.')}
                  </Command.Empty>

                  {/* GRUPO: NAVEGACIÓN */}
                  <Command.Group
                    heading={t('cmd.group_nav', 'Navegación Rápida')}
                    className="text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 px-2 pt-2 pb-1"
                  >
                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{t('cmd.nav_home', 'Inicio')}</span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/tienda'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{t('cmd.nav_store', 'Tienda de Abonos y Mantenimiento')}</span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /tienda
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/cotizador'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Calculator className="w-4 h-4 text-pink-400 shrink-0" />
                      <span>
                        {t('cmd.nav_quote', 'Cotizador Interactivo Online (Web + Linux POS)')}
                      </span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /cotizador
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/linux'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-emerald-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Laptop className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {t('cmd.nav_linux', 'Portal de Servicios Linux, POS & Nodos Locales')}
                      </span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /linux
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/soluciones'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{t('cmd.nav_solutions', 'Soluciones de Software y Arquitectura')}</span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /soluciones
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/portafolio'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t('cmd.nav_portfolio', 'Portafolio de Sistemas y Clientes')}</span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /portafolio
                      </kbd>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(() => router.push('/dashboard'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{t('cmd.nav_dashboard', 'Portal / Dashboard de Clientes')}</span>
                      <kbd className="ml-auto text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                        /dashboard
                      </kbd>
                    </Command.Item>
                  </Command.Group>

                  {/* GRUPO: ACCIONES */}
                  <Command.Group
                    heading={t('cmd.group_actions', 'Acciones Rápidas')}
                    className="text-[11px] font-mono uppercase tracking-wider text-cyan-400/80 px-2 pt-3 pb-1"
                  >
                    <Command.Item
                      onSelect={() =>
                        executeAction(() =>
                          window.open(
                            getWhatsAppUrl(
                              t(
                                'cmd.wa_message',
                                '¡Hola Exe! Me contacto desde la paleta de comandos.'
                              )
                            ),
                            '_blank',
                            'noopener,noreferrer'
                          )
                        )
                      }
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-emerald-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t('cmd.action_wa', 'Conversar por WhatsApp Directo')}</span>
                      <span className="ml-auto text-[10px] text-emerald-400 font-medium">
                        {t('cmd.online', 'En línea')}
                      </span>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(toggleTheme)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span>
                        {t('cmd.action_theme', 'Alternar Tema')} (
                        {theme === 'dark'
                          ? t('cmd.light_mode', 'Modo Claro')
                          : t('cmd.dark_mode', 'Modo Oscuro')}
                        )
                      </span>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(toggleLanguage)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>
                        {t('cmd.action_lang', 'Cambiar Idioma')} (
                        {i18n.language === 'en' ? 'Español' : 'English'})
                      </span>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(handleCopyLink)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <Copy className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{t('cmd.action_copy', 'Copiar Enlace de ExePaginasWeb')}</span>
                    </Command.Item>

                    <Command.Item
                      onSelect={() => executeAction(handleScrollToTop)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 aria-selected:bg-cyan-500/20 aria-selected:text-white cursor-pointer transition-colors"
                    >
                      <ArrowUp className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{t('cmd.action_top', 'Volver al Inicio Superior')}</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                {/* Barra inferior de atajos */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/10 text-[11px] font-mono text-slate-400 select-none">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↑↓</kbd>{' '}
                      {t('cmd.hint_nav', 'Navegar')}
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">↵</kbd>{' '}
                      {t('cmd.hint_select', 'Seleccionar')}
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300">ESC</kbd>{' '}
                      {t('cmd.hint_close', 'Cerrar')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400/90 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Exe Terminal</span>
                  </div>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
