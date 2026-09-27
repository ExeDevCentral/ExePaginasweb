/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Widget Flotante Interactivo de WhatsApp con atajos de cotización y chat directo.
 */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, ShoppingBag, Globe, Cpu, CreditCard } from 'lucide-react'

const WHATSAPP_PHONE = '5493416874786'

const QUICK_TOPICS = [
  {
    id: 'store',
    label: 'Tienda Online',
    icon: ShoppingBag,
    text: '¡Hola Exequiel! Quisiera cotizar una Tienda Online con catálogo y cobros integrados.',
  },
  {
    id: 'landing',
    label: 'Página Web / Landing',
    icon: Globe,
    text: '¡Hola Exequiel! Me interesa desarrollar una Página Web profesional de alta velocidad.',
  },
  {
    id: 'saas',
    label: 'Sistema a Medida / SaaS',
    icon: Cpu,
    text: '¡Hola Exequiel! Tengo un proyecto para automatizar procesos con un Sistema a medida.',
  },
  {
    id: 'payment',
    label: 'Medios de Pago / Alias',
    icon: CreditCard,
    text: '¡Hola! Quisiera consultar los medios de pago disponibles y datos de transferencia.',
  },
]

export default function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [customMessage, setCustomMessage] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape o clic afuera
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  function handleSend(textToSend?: string) {
    const finalMsg =
      textToSend ||
      customMessage.trim() ||
      '¡Hola Exequiel! Vengo desde exepaginasweb.com y quisiera hacer una consulta.'
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(finalMsg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
    setCustomMessage('')
    setSelectedTopic(null)
  }

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 sm:w-92 overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-950/95 text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-600 text-slate-950 shadow-md">
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">ExeSistemasWEB</h4>
                  <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span>En línea ahora • Resp. &lt; 15 min</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Cerrar chat de WhatsApp"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Subtítulo */}
            <p className="my-3 text-xs text-slate-300 leading-relaxed">
              ¿En qué podemos ayudarte hoy? Seleccioná un tema o escribinos directamente:
            </p>

            {/* Atajos rápidos */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {QUICK_TOPICS.map((topic) => {
                const Icon = topic.icon
                const isSelected = selectedTopic === topic.id
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(topic.id)
                      handleSend(topic.text)
                    }}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-xs'
                        : 'border-slate-800/80 bg-slate-900/60 text-slate-200 hover:border-emerald-500/40 hover:bg-emerald-950/20'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="line-clamp-2 leading-tight">{topic.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Campo personalizado */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative mt-2"
            >
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribe tu consulta personalizada..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                aria-label="Enviar a WhatsApp"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Atención técnica directa por Exequiel</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante circular */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition-shadow hover:shadow-emerald-500/50"
        aria-label="Abrir WhatsApp oficial"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400"></span>
        </span>
        <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </motion.button>
    </div>
  )
}
