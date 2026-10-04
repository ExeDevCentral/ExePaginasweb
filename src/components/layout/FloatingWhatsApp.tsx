/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Botón flotante interactivo de WhatsApp con "Mucha Onda":
 * - Gradiente 3D con resplandor neón esmeralda
 * - Doble radar sonar expansivo
 * - Badge de notificación no leída (estilo mensaje entrante WhatsApp)
 * - Tarjeta popup con avatar de Exequiel, estado "En línea" y respuestas rápidas
 * - Micro-rebote de atención automático cada 6 segundos
 */
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ArrowRight } from 'lucide-react'
import {
  WhatsAppLiveIcon,
  CyberSparkleIcon,
  CyberRealPropertyShield,
} from '@/components/ui/MagnificentIcons'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'

const QUICK_ACTIONS = [
  {
    id: 'cotizar',
    label: '🚀 Quiero cotizar mi web',
    msg: 'Hola Exequiel, vi tu web y quiero cotizar el desarrollo de una página para mi negocio.',
  },
  {
    id: 'auditoria',
    label: '🎁 Pedir auditoría gratis (5 min)',
    msg: 'Hola Exequiel, quisiera pedir la auditoría gratuita de 5 minutos en video para mi sitio/Instagram.',
  },
  {
    id: 'consulta',
    label: '💬 Hacer una consulta rápida',
    msg: 'Hola Exequiel, tengo una duda sobre los servicios y me gustaría hacerte una consulta.',
  },
]

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  // Abrir link directo a WhatsApp
  const handleOpenWhatsApp = (message?: string) => {
    const defaultMsg = 'Hola Exequiel, vi tu web y quiero consultar por una página para mi negocio'
    const finalMsg = message || defaultMsg

    trackEvent('contact_whatsapp_clicked', {
      source: 'floating_whatsapp_onda',
      message: finalMsg,
    })

    setHasUnread(false)
    window.open(getWhatsAppUrl(finalMsg), '_blank')
  }

  // Micro-vibración suave periódica cada 7 segundos para capturar atención
  const [wiggle, setWiggle] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setWiggle(true)
      setTimeout(() => setWiggle(false), 800)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 select-none">
      {/* ========================================================
          1. MODAL / TARJETA FLOTANTE TIPO CHAT DE WHATSAPP
         ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-82.5 sm:w-90 rounded-3xl bg-[#0c1017]/95 dark:bg-[#0c1017]/95 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-2xl overflow-hidden text-white shadow-emerald-500/20"
          >
            {/* CABECERA ESTILO WHATSAPP PREMIUM */}
            <div className="p-4 bg-linear-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar con aura pulsante */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-400 p-0.5 overflow-hidden flex items-center justify-center font-black text-emerald-400 font-mono text-sm">
                    EE
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c1017] shadow-[0_0_8px_#10b981] animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold tracking-tight text-white">
                      Exequiel Echevarria
                    </h4>
                    <CyberRealPropertyShield size={16} />
                  </div>
                  <p className="text-[11px] text-emerald-300 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>En línea · Respuesta en &lt; 5 min</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat de WhatsApp"
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CUERPO DEL MENSAJE ESTILO BURBUJA */}
            <div className="p-4 space-y-3 bg-[#080b11]">
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-900/90 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed shadow-md">
                <p className="font-medium text-white mb-1">¡Hola! 👋</p>
                <p>
                  ¿Tenés un proyecto o querés consultar un presupuesto? Elegí una opción o escribime
                  directo:
                </p>
                <span className="text-[10px] text-slate-500 block text-right mt-1.5 font-mono">
                  Ahora · WhatsApp
                </span>
              </div>

              {/* PILLS DE RESPUESTAS RÁPIDAS (1 CLIC A WHATSAPP) */}
              <div className="space-y-2 pt-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleOpenWhatsApp(action.msg)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/60 text-xs font-medium text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              {/* BOTÓN INICIAR CONVERSACIÓN LIBRE */}
              <button
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Chatear por WhatsApp ahora</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-center text-slate-500 font-mono">
                {DISPLAY_WHATSAPP_NUMBER} · Atención Global 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          2. BOTÓN PRINCIPAL CON ONDA (RADAR + GLOW + BADGE)
         ======================================================== */}
      <div className="flex items-center gap-3">
        {/* Píldora invitacional en desktop */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 dark:bg-[#0c1017]/95 text-white border-2 border-emerald-500/50 shadow-2xl backdrop-blur-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-emerald-500/20"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block shadow-[0_0_10px_#10b981]" />
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold tracking-tight text-white block">
              Hablar con Exequiel
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium block">
              🟢 En línea · WhatsApp
            </span>
          </div>
          <CyberSparkleIcon size={14} className="text-emerald-400 ml-1" />
        </motion.button>

        {/* BOTÓN CIRCULAR CON DOBLE ONDA EXPANSIVA Y RADAR */}
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setHasUnread(false)
          }}
          animate={
            wiggle
              ? {
                  rotate: [0, -12, 12, -8, 8, 0],
                  scale: [1, 1.1, 1.1, 1.05, 1],
                }
              : {}
          }
          whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
          whileTap={{ scale: 0.94 }}
          aria-label="Abrir WhatsApp directo con Exequiel"
          className="relative flex items-center justify-center w-15 h-15 rounded-full bg-linear-to-tr from-[#059669] via-[#10b981] to-[#34d399] text-white shadow-[0_0_30px_rgba(16,185,129,0.65)] hover:shadow-[0_0_40px_rgba(16,185,129,0.9)] transition-all duration-300 cursor-pointer"
        >
          {/* Anillos de radar sonar expansivo */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400 animate-ping opacity-40 pointer-events-none" />
          <span className="absolute -inset-2.5 rounded-full bg-teal-400 animate-pulse opacity-25 pointer-events-none" />

          {/* Ícono de WhatsApp */}
          <WhatsAppLiveIcon size={32} className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />

          {/* Badge con animación de notificación "1" sin leer */}
          {hasUnread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950 shadow-lg"
            >
              1
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  )
}
