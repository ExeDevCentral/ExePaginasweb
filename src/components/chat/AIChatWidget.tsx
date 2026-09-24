/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * AIChatWidget:
 * - Diseño minimalista editorial
 * - Paleta cromática blanco marfil / crema (#f7f5ee / #fcfbf8) y negro mate (#0e0e11 / #121215)
 * - Tipografía limpia, bordes sutiles y micro-interacciones de alta gama
 * - Asistente inteligente con fallbacks técnicos, tickets de cotización y traspaso a WhatsApp
 */
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  X,
  User,
  ArrowUpRight,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'

const WELCOME_TEXT =
  'Hola. Soy el asistente de ExePaginasWeb. ¿En qué proyecto o sistema web te puedo asesorar hoy?'

const RESET_TEXT = 'Conversación reiniciada. ¿En qué proyecto o desarrollo te podemos ayudar ahora?'

export interface ChatTopic {
  id: string
  title: string
  desc: string
  prompt: string
  action?: 'whatsapp'
}

export const INITIAL_TOPICS: ChatTopic[] = [
  {
    id: 'cotizar',
    title: 'Cotizar desarrollo web',
    desc: 'Landing ($450k) o Tienda ($750k)',
    prompt: 'Hola, quisiera cotizar un desarrollo web para mi negocio.',
  },
  {
    id: 'turnos',
    title: 'Sistema de turnos y cobros',
    desc: 'Reservas 24/7 con seña online',
    prompt: '¿Cómo funciona el sistema de reservas y cobros automáticos?',
  },
  {
    id: 'saas',
    title: 'Dashboard o panel a medida',
    desc: 'Software cloud con roles y métricas',
    prompt: 'Me interesa desarrollar un dashboard o software cloud a medida.',
  },
  {
    id: 'whatsapp',
    title: 'Hablar por WhatsApp',
    desc: 'Atención personalizada directa',
    prompt: 'Quisiera hablar directamente con un especialista por WhatsApp.',
    action: 'whatsapp',
  },
]

function makeMessage(role: 'user' | 'assistant', text: string, id?: string): UIMessage {
  return {
    id: id ?? `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    parts: [{ type: 'text', text }],
  }
}

function welcomeMessage(text = WELCOME_TEXT): UIMessage {
  return makeMessage('assistant', text, `welcome-${Date.now()}`)
}

function extractTicket(text: string): string | null {
  const match = text.match(/\[(EXE-CHT-[A-Z0-9]+)\]/)
  return match?.[1] ?? null
}

function getMessageText(msg: { parts?: Array<{ type?: string; text?: string }> }): string {
  if (!Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p) => p?.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text ?? '')
    .join('')
}

function buildClientFallback(text: string): string {
  const lowerText = text.toLowerCase()
  const ticket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  if (
    lowerText.includes('abogad') ||
    lowerText.includes('abogada') ||
    lowerText.includes('legal') ||
    lowerText.includes('estudio') ||
    lowerText.includes('juridic')
  ) {
    return `Para estudios jurídicos y abogados desarrollamos sitios institucionales de alto impacto, plataformas de reserva de consultas legales y recepción segura de documentación.\n\nPara enviarte una propuesta técnica a medida con el Ticket [${ticket}], ¿nos dejas tu correo aquí o prefieres continuar por WhatsApp?`
  }
  if (
    lowerText.includes('padel') ||
    lowerText.includes('pádel') ||
    lowerText.includes('cancha') ||
    lowerText.includes('deport') ||
    lowerText.includes('futbol') ||
    lowerText.includes('fútbol') ||
    lowerText.includes('gimnasio')
  ) {
    return `Para complejos deportivos y canchas de pádel construimos sistemas de reservas en tiempo real con cobro online de señas y confirmaciones automáticas por WhatsApp.\n\nPara coordinar una propuesta técnica bajo el Ticket [${ticket}], ¿nos dejas tu email o nos consultas directo por WhatsApp?`
  }
  if (
    lowerText.includes('medic') ||
    lowerText.includes('salud') ||
    lowerText.includes('doct') ||
    lowerText.includes('clinic') ||
    lowerText.includes('dentist') ||
    lowerText.includes('psicolog')
  ) {
    return `Para clínicas y profesionales de la salud desarrollamos sistemas con agenda de turnos, recordatorios automáticos por WhatsApp y portal para pacientes.\n\n¿Te gustaría recibir un presupuesto formal bajo el Ticket [${ticket}]? Déjanos tu email aquí o escríbenos por WhatsApp.`
  }
  if (lowerText.includes('turno') || lowerText.includes('reserva') || lowerText.includes('cita')) {
    return 'Desarrollamos motores de reservas y turnos 24/7 con integración a WhatsApp, cobros por tarjeta y recordatorios sin intervención manual. ¿Te gustaría coordinar una cotización a medida?'
  }
  if (
    lowerText.includes('precio') ||
    lowerText.includes('cuanto') ||
    lowerText.includes('costo') ||
    lowerText.includes('cotiz')
  ) {
    return `Cada desarrollo se realiza con código 100% propio sin plantillas ni cuotas mensuales obligatorias. Para prepararte un presupuesto detallado con el Ticket [${ticket}], déjanos tu email o contáctanos por WhatsApp.`
  }
  if (
    lowerText.includes('dashboard') ||
    lowerText.includes('saas') ||
    lowerText.includes('panel')
  ) {
    return 'Diseñamos dashboards y sistemas SaaS a medida con control de usuarios, métricas en tiempo real y exportación de datos. ¿Qué funcionalidades principales requiere tu operación?'
  }
  if (
    lowerText.trim() === 'hola' ||
    lowerText.trim() === 'buenas' ||
    lowerText.trim() === 'hey' ||
    text.length < 8
  ) {
    return 'Hola. Soy el asistente inteligente de ExePaginasWeb. ¿En qué proyecto o sistema web te gustaría que te asesoremos hoy?'
  }
  return `Desarrollamos páginas web y sistemas a medida adaptados a tu negocio. Para coordinar una propuesta técnica con el Ticket [${ticket}], déjanos tu email por aquí o escríbenos por WhatsApp.`
}

const playSubtleChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.025, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.16)
  } catch {
    // Silencio si el audio está bloqueado por el navegador
  }
}

export const AIChatWidget: React.FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null)
  const [currentTicket, setCurrentTicket] = useState<string | null>(null)

  const { messages, setMessages, sendMessage, status, error, stop, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: [welcomeMessage()],
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<{ text: string; time: number } | null>(null)
  const timestampsRef = useRef<Map<string, string>>(new Map())
  const handledErrorsRef = useRef<Set<string>>(new Set())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Sonido suave y registro de tickets
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg && !timestampsRef.current.has(lastMsg.id)) {
        const now = new Date()
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        timestampsRef.current.set(lastMsg.id, timeStr)
      }

      if (lastMsg && lastMsg.role === 'assistant') {
        const text = getMessageText(lastMsg)
        const t = extractTicket(text)
        if (t) setCurrentTicket(t)

        if (soundEnabled && isOpen) {
          playSubtleChime()
        }
      }
    }
  }, [messages, soundEnabled, isOpen])

  // Fallback elegante en caso de error de red
  useEffect(() => {
    if (error) {
      const errorKey = `${error.message || 'error'}-${Date.now().toString().slice(0, -3)}`
      if (handledErrorsRef.current.has(errorKey)) return
      handledErrorsRef.current.add(errorKey)

      if (lastMessageRef.current) {
        const userPrompt = lastMessageRef.current.text
        const clientText = buildClientFallback(userPrompt)
        setMessages((prev) => [...prev, makeMessage('assistant', clientText)])
      }
      clearError()
    }
  }, [error, clearError, setMessages])

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim()
    if (!text || isLoading) return

    lastMessageRef.current = { text, time: Date.now() }
    setInput('')

    try {
      await sendMessage({ text })
    } catch {
      const fallbackText = buildClientFallback(text)
      setMessages((prev) => [
        ...prev,
        makeMessage('user', text),
        makeMessage('assistant', fallbackText),
      ])
    }
  }

  const copyToClipboard = async (ticket: string) => {
    try {
      await navigator.clipboard.writeText(ticket)
      setCopiedTicket(ticket)
      setTimeout(() => setCopiedTicket(null), 2500)
    } catch {
      // Ignorar fallo de portapapeles
    }
  }

  const resetChat = () => {
    if (isLoading) stop()
    setMessages([welcomeMessage(RESET_TEXT)])
    setCurrentTicket(null)
    setInput('')
  }

  const getWhatsAppHandoffUrl = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user') ?? null
    const lastUserText = lastUserMsg ? getMessageText(lastUserMsg) : 'Consulta desde la web'
    const ticketStr = currentTicket ? ` [Ticket: ${currentTicket}]` : ''
    const fullText = `Hola ExePaginasWeb. Estaba consultando en el chat sobre: "${lastUserText}"${ticketStr}. Quisiera hablar con un especialista.`
    return getWhatsAppUrl(fullText)
  }

  const handleTopicClick = (topic: ChatTopic) => {
    if (topic.action === 'whatsapp') {
      window.open(getWhatsAppHandoffUrl(), '_blank')
      return
    }
    handleSendMessage(topic.prompt)
  }

  return (
    <>
      {/* ========================================================
      {/* ========================================================
          1. BOTÓN FLOTANTE ÚNICO Y MINIMALISTA (UNIFICADO)
         ======================================================== */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 select-none"
      >
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual'}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#111113] hover:bg-[#18181c] dark:bg-[#111113] dark:hover:bg-[#18181c] text-[#f7f5ee] border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          {/* Icono minimalista */}
          <div className="w-6 h-6 rounded-full bg-[#1a1a1e] border border-[#333338] flex items-center justify-center text-[#f7f5ee] shrink-0">
            {isOpen ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </div>

          {/* Texto unificado */}
          <span className="text-xs font-medium tracking-tight text-[#f7f5ee]">
            {isOpen
              ? t('common.cerrar') || 'Cerrar'
              : t('chat.launcher_label') || '¿Dudas? Asistente'}
          </span>

          {/* Indicador de estado activo */}
          {!isOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] shrink-0" />
          )}
        </motion.button>
      </motion.div>

      {/* ========================================================
          2. VENTANA DE CHAT MINIMALISTA (PALETA MARFIL & NEGRO MATE)
         ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-20 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-7 z-50 sm:w-[410px] max-h-[calc(100dvh-6rem)] sm:max-h-[600px] h-[80dvh] sm:h-[560px] rounded-2xl bg-[#fcfbf8] dark:bg-[#0e0e11] border border-[#e8e4d8] dark:border-[#242429] shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-slate-900 dark:text-[#f7f5ee]"
          >
            {/* CABECERA EDITORIAL MINIMALISTA */}
            <div className="px-5 py-4 bg-[#f6f4eb] dark:bg-[#131317] border-b border-[#e8e4d8] dark:border-[#222226] flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#111113] dark:bg-[#f7f5ee] text-[#f7f5ee] dark:text-[#111113] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  E
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold tracking-tight text-neutral-900 dark:text-[#f7f5ee]">
                      {t('chat.header_title') || 'Exe Asistente'}
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111113] dark:bg-[#ede9dc] opacity-75" />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-[#9c9a92] font-mono">
                    {t('chat.header_status') || 'Desarrollo Web & Sistemas'}
                  </p>
                </div>
              </div>

              {/* Controles de cabecera */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
                  aria-label="Silenciar o activar sonidos"
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 dark:text-[#9c9a92] hover:text-neutral-900 dark:hover:text-[#f7f5ee] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetChat}
                  title={t('chat.clear') || 'Reiniciar conversación'}
                  aria-label={t('chat.clear') || 'Reiniciar conversación'}
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 dark:text-[#9c9a92] hover:text-neutral-900 dark:hover:text-[#f7f5ee] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar chat"
                  className="w-7 h-7 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 dark:text-[#9c9a92] hover:text-neutral-900 dark:hover:text-[#f7f5ee] flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CUERPO DE MENSAJES */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#faf8f4] dark:bg-[#0c0c0f]"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                const textContent = getMessageText(msg)
                const extractedTicket = extractTicket(textContent)

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar minimalista */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono ${
                        isUser
                          ? 'bg-[#111113] text-[#f7f5ee] dark:bg-[#f7f5ee] dark:text-[#111113]'
                          : 'bg-[#edeae0] dark:bg-[#1a1a1f] text-neutral-700 dark:text-[#ede9dc] border border-[#ded9cc] dark:border-[#29292e]'
                      }`}
                    >
                      {isUser ? <User className="w-3 h-3" /> : 'E'}
                    </div>

                    {/* Burbuja de mensaje */}
                    <div className="space-y-1.5 max-w-[88%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#111113] text-[#f7f5ee] dark:bg-[#f7f5ee] dark:text-[#0e0e11] font-medium rounded-tr-xs shadow-xs'
                            : 'bg-[#f4f1e8] dark:bg-[#151519] border border-[#e5e0d3] dark:border-[#242429] text-neutral-800 dark:text-[#ece8dd] rounded-tl-xs shadow-xs whitespace-pre-line'
                        }`}
                      >
                        {textContent}
                        {isLoading &&
                          isUser === false &&
                          msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-flex items-center gap-1 ml-1.5 opacity-60">
                              <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                              <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
                              <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
                            </span>
                          )}
                      </div>

                      {/* TARJETAS DE PREGUNTAS FRECUENTES ACCESIBLES EN EL MENSAJE INICIAL */}
                      {!isUser && messages.length <= 1 && (
                        <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {INITIAL_TOPICS.map((topic) => (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => handleTopicClick(topic)}
                              className="group text-left p-2.5 rounded-xl bg-[#edeae0]/70 dark:bg-[#16161b] border border-[#ded9cc] dark:border-[#292930] hover:border-neutral-800 dark:hover:border-[#e0dad0] hover:bg-[#e6e2d4] dark:hover:bg-[#1e1e24] transition-all cursor-pointer flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between gap-1 w-full mb-1">
                                <span className="text-[11px] font-semibold text-neutral-900 dark:text-[#f7f5ee] leading-tight">
                                  {topic.title}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-[#f7f5ee] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </div>
                              <span className="text-[10px] text-neutral-500 dark:text-[#9e9a90] leading-snug">
                                {topic.desc}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Ticket de cotización */}
                      {extractedTicket && !isUser && (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(extractedTicket)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#edeae0] dark:bg-[#1a1a1f] border border-[#ded9cc] dark:border-[#2a2a30] text-neutral-800 dark:text-[#e8e4d8] hover:bg-[#e4e0d4] dark:hover:bg-[#222228] text-[10px] font-mono transition-colors cursor-pointer"
                          >
                            {copiedTicket === extractedTicket ? (
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                            <span>Ticket: {extractedTicket}</span>
                          </button>
                        </div>
                      )}

                      {/* Timestamp discreto */}
                      <div
                        className={`text-[9px] text-neutral-400 dark:text-[#7d7a72] font-mono px-1 ${
                          isUser ? 'text-right' : 'text-left'
                        }`}
                      >
                        {timestampsRef.current.get(msg.id) ?? ''}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-neutral-400 dark:text-[#88857d] text-xs p-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-[11px] font-mono">Escribiendo respuesta...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* PREGUNTAS SUGERIDAS (PILLS MARFIL / NEGRO MATE ENVUELTAS Y 100% ACCESIBLES) */}
            {messages.length < 6 && (
              <div className="px-3.5 py-2.5 bg-[#f4f1e8]/85 dark:bg-[#111114]/85 border-t border-[#e8e4d8] dark:border-[#222226] shrink-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {INITIAL_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className="px-2.5 py-1 rounded-full bg-[#fcfbf8] dark:bg-[#18181d] border border-[#ded9cc] dark:border-[#2c2c34] text-neutral-800 dark:text-[#dcd8cb] hover:text-neutral-900 dark:hover:text-white hover:border-neutral-700 dark:hover:border-[#666675] hover:bg-[#edeae0] dark:hover:bg-[#222228] text-[10.5px] font-medium transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>{topic.title}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TRASPASO A WHATSAPP MINIMALISTA */}
            <div className="px-4 py-2.5 bg-[#f6f4eb] dark:bg-[#121216] border-t border-[#e8e4d8] dark:border-[#222226] flex items-center justify-between gap-2">
              <div className="text-[11px] text-neutral-600 dark:text-[#aba79c] truncate font-mono">
                WhatsApp:{' '}
                <span className="font-semibold text-neutral-900 dark:text-[#f7f5ee]">
                  {DISPLAY_WHATSAPP_NUMBER}
                </span>
              </div>
              <a
                href={getWhatsAppHandoffUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111113] hover:bg-[#202025] dark:bg-[#f7f5ee] dark:hover:bg-white text-[#f7f5ee] dark:text-[#111113] font-medium text-[10px] transition-colors cursor-pointer shrink-0"
              >
                <span>WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* FORMULARIO DE ENTRADA */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="p-3 bg-[#fcfbf8] dark:bg-[#0e0e11] border-t border-[#e8e4d8] dark:border-[#222226] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder') || 'Escribe tu consulta o email...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#f4f1e8] dark:bg-[#141418] border border-[#e2ddd0] dark:border-[#25252a] text-xs text-neutral-900 dark:text-[#f7f5ee] placeholder:text-neutral-400 dark:placeholder:text-[#78756d] focus:outline-none focus:border-neutral-500 dark:focus:border-[#666670] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label={t('chat.send') || 'Enviar mensaje'}
                className="w-9 h-9 rounded-xl bg-[#111113] hover:bg-[#202025] dark:bg-[#f7f5ee] dark:hover:bg-white text-[#f7f5ee] dark:text-[#111113] flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatWidget
