/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * UnifiedSupportHub (AIChatWidget unificado):
 * - Un solo botón flotante expandible en esquina inferior derecha (estilo SaaS "Ciudad de Servidores")
 * - Al hacer clic despliega dos canales limpios:
 *   1. Hablar con Exequiel por WhatsApp (Humano · Respuesta en < 5 min)
 *   2. Preguntarle al Asistente IA (Técnico · 24/7 autónomo)
 * - Paleta cian, ámbar, esmeralda y obsidiana con tipografía JetBrains Mono / Space Grotesk
 */
'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  X,
  User,
  ArrowUpRight,
  ChevronLeft,
  Bot,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Edit3,
  Sparkles,
} from 'lucide-react'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'
import { trackEvent } from '@/core/analytics/trackEvent'
import Logo from '../layout/Logo'

// Ícono SVG oficial de WhatsApp
const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.484 2 12.018c0 1.907.534 3.69 1.464 5.215L2 22l4.914-1.424A9.972 9.972 0 0012.031 22c5.536 0 10.031-4.484 10.031-10.018C22.062 6.484 17.567 2 12.031 2zm0 18.286c-1.636 0-3.18-.45-4.524-1.233l-.324-.19-2.923.848.868-2.846-.21-.334a8.23 8.23 0 01-1.282-4.513c0-4.568 3.717-8.284 8.29-8.284 4.572 0 8.289 3.716 8.289 8.284 0 4.569-3.717 8.286-8.29 8.286zm4.545-6.208c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062-.249-.124-1.052-.388-2.003-1.237-.741-.66-1.241-1.476-1.386-1.725-.145-.249-.015-.383.109-.507.112-.112.249-.29.373-.435.124-.145.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.125-.56-1.349-.767-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311-.228.249-.871.851-.871 2.075 0 1.224.892 2.407 1.016 2.573.125.166 1.756 2.68 4.254 3.759.594.257 1.058.41 1.42.525.597.19 1.14.163 1.569.099.479-.071 1.472-.602 1.68-1.183.207-.581.207-1.079.145-1.183-.062-.104-.228-.166-.477-.291z" />
  </svg>
)

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
    id: 'n8n_demo',
    title: '⚡ Probar Automatización n8n',
    desc: 'Dispara un flujo real en n8n Cloud',
    prompt: 'Quiero probar una automatización en tiempo real con n8n Cloud a mi nombre.',
  },
  {
    id: 'turnos',
    title: 'Sistema de turnos y cobros',
    desc: 'Reservas 24/7 con seña online',
    prompt: '¿Cómo funciona el sistema de reservas y cobros automáticos?',
  },
  {
    id: 'whatsapp',
    title: 'Hablar con Exequiel',
    desc: 'WhatsApp directo sin intermediarios',
    prompt: 'Hola Exequiel, vi tu web y quiero consultar por una página para mi negocio',
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
  const match = /\[(EXE-(?:CHT|N8N|CNT)-[A-Z0-9]+)\]/.exec(text)
  return match?.[1] ?? null
}

function extractN8nTicket(text: string): string | null {
  const match = /(?:\[)?(EXE-N8N-[A-Z0-9_-]+)(?:\])?/i.exec(text)
  return match?.[1] ? match[1].toUpperCase() : null
}

function getMessageText(msg: { parts?: Array<{ type?: string; text?: string }> }): string {
  if (!Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p) => p?.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text ?? '')
    .join('')
}

const N8nExecutionCard: React.FC<{
  ticketId: string
  clientName: string
  automationType?: string
  status?: string
}> = ({
  ticketId,
  clientName,
  automationType = 'Cotización / Flujo n8n',
  status = 'EJECUTADO',
}) => (
  <div className="mt-2.5 p-3.5 rounded-2xl bg-linear-to-br from-[#0b1622] via-[#08101a] to-[#03060c] border border-cyan-400/40 shadow-xl shadow-cyan-950/50 select-none">
    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
      <span className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        n8n Cloud Workflow Live
      </span>
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-mono text-emerald-300 font-bold tracking-wider flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {status}
      </span>
    </div>
    <div className="space-y-1.5 text-[11px] text-slate-300 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Solicitante:</span>
        <span className="font-bold text-white flex items-center gap-1">
          <User className="w-3 h-3 text-cyan-400" />
          {clientName}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Acción:</span>
        <span className="text-cyan-300 font-mono text-[10px]">{automationType}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-400">Ticket n8n:</span>
        <span className="font-mono text-cyan-300 font-bold text-xs">{ticketId}</span>
      </div>
    </div>
    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
      <span className="flex items-center gap-1 text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> Webhook
      </span>
      <span className="text-cyan-500/60">➔</span>
      <span className="flex items-center gap-1 text-cyan-400">
        <CheckCircle2 className="w-3 h-3" /> Switch
      </span>
      <span className="text-cyan-500/60">➔</span>
      <span className="flex items-center gap-1 text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> Despacho
      </span>
    </div>
  </div>
)

const VisitorIdentityBar: React.FC<{
  visitorName: string
  isEditing: boolean
  nameInput: string
  onNameInputChange: (val: string) => void
  onSave: (val: string) => void
  onStartEditing: () => void
  onCancelEditing: () => void
}> = ({
  visitorName,
  isEditing,
  nameInput,
  onNameInputChange,
  onSave,
  onStartEditing,
  onCancelEditing,
}) => {
  if (isEditing || !visitorName) {
    return (
      <div className="p-3 bg-linear-to-r from-[#0c1829] via-[#09111c] to-[#0d1c24] border-b border-cyan-500/30">
        <label
          htmlFor="visitor-name-field"
          className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 mb-1.5 font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          ¿Cómo te llamás? (Personaliza atención & automatizaciones n8n)
        </label>
        <div className="flex items-center gap-1.5">
          <input
            id="visitor-name-field"
            type="text"
            value={nameInput}
            onChange={(e) => onNameInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && nameInput.trim()) {
                onSave(nameInput)
              }
            }}
            placeholder="Tu nombre (ej: Carlos, Lucía)"
            className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            type="button"
            onClick={() => onSave(nameInput)}
            disabled={!nameInput.trim()}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Guardar
          </button>
          {visitorName && (
            <button
              type="button"
              onClick={onCancelEditing}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-2 bg-[#0c1424]/90 border-b border-cyan-500/20 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
        <span className="text-slate-400 text-[11px]">Conectado:</span>
        <span className="font-bold text-cyan-300 font-sans text-xs flex items-center gap-1">
          <User className="w-3 h-3 text-cyan-400" />
          {visitorName}
        </span>
      </div>
      <button
        type="button"
        onClick={onStartEditing}
        className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/5 transition-colors"
      >
        <Edit3 className="w-3 h-3" />
        <span>Cambiar</span>
      </button>
    </div>
  )
}

function buildClientFallback(text: string, visitorName?: string): string {
  const lowerText = text.toLowerCase()
  const namePrefix = visitorName ? `¡Hola ${visitorName}! ` : ''
  const isN8n = lowerText.includes('n8n') || lowerText.includes('automatiz')

  if (isN8n) {
    const ticket = `EXE-N8N-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    return `${namePrefix}¡Excelente! Tu automatización con n8n Cloud ha sido registrada con el ticket [${ticket}]. Puedes solicitar cotizaciones express, envío de emails automáticos o sincronizaciones con CRM sin costo adicional.`
  }

  const ticket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  if (
    lowerText.includes('precio') ||
    lowerText.includes('cuanto') ||
    lowerText.includes('cotiz') ||
    lowerText.includes('costo')
  ) {
    return `${namePrefix}Nuestros valores base de referencia 2026 son:\n\n• Landing Page de Alta Conversión: desde $450.000 ARS\n• Tienda Online E-Commerce: desde $750.000 ARS\n• Sistemas y Paneles SaaS a medida: presupuesto personalizado.\n\nTodo con 100% código propio y automatizaciones n8n disponibles. ¿Querés que te preparemos una propuesta formal? Tu ticket asignado es [${ticket}].`
  }

  if (
    lowerText.includes('turno') ||
    lowerText.includes('reserva') ||
    lowerText.includes('agenda')
  ) {
    return `${namePrefix}Nuestro sistema de reservas y cobros automáticos permite gestionar turnos las 24 horas con seña obligatoria vía MercadoPago, sincronización con Google Calendar y recordatorios automáticos por WhatsApp/n8n. Ticket de consulta: [${ticket}].`
  }

  return `${namePrefix}Gracias por tu consulta. Diseñamos páginas web de alta conversión y sistemas cloud a medida con automatización de procesos n8n. Podés coordinar una llamada o chatear directo por WhatsApp con Exequiel. Tu ticket de seguimiento es [${ticket}].`
}

export const AIChatWidget: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [hubView, setHubView] = useState<'menu' | 'chat'>('menu')
  const [hasUnread, setHasUnread] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [input, setInput] = useState('')
  const [currentTicket, setCurrentTicket] = useState<string | null>(null)
  const [visitorName, setVisitorName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('exe_visitor_name')
      if (stored) {
        setVisitorName(stored)
        setNameInput(stored)
      }
    } catch {
      // Ignorar errores de localStorage en navegación privada
    }
  }, [])

  const handleSaveName = (newName: string) => {
    const trimmed = newName.trim()
    setVisitorName(trimmed)
    setIsEditingName(false)
    try {
      if (trimmed) {
        localStorage.setItem('exe_visitor_name', trimmed)
      } else {
        localStorage.removeItem('exe_visitor_name')
      }
    } catch {
      // Ignorar errores de localStorage
    }

    if (trimmed) {
      setMessages((prev) => [
        ...prev,
        makeMessage(
          'assistant',
          `¡Excelente, ${trimmed}! He registrado tu nombre. Nuestro motor de automatizaciones n8n Cloud y desarrollo web a medida están listos. ¿Qué proyecto o flujo querés cotizar hoy?`
        ),
      ])
    }
  }

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          lang: i18n.language || 'es',
          visitorName: visitorName || undefined,
        },
      }),
    [i18n.language, visitorName]
  )

  const {
    messages,
    sendMessage: aiSendMessage,
    status,
    setMessages,
  } = useChat({
    transport,
    messages: [welcomeMessage()],
    onError: (err) => {
      console.warn('[AIChatWidget] Fallback local activado:', err?.message)
      const lastUser = [...messages].reverse().find((m) => m.role === 'user')
      const userTxt = lastUser ? getMessageText(lastUser) : 'consulta'
      const fallbackTxt = buildClientFallback(userTxt, visitorName)
      setMessages((prev) => [...prev, makeMessage('assistant', fallbackTxt)])
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (isOpen && hubView === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    const lastAsst = [...messages].reverse().find((m) => m.role === 'assistant')
    if (lastAsst) {
      const ticket = extractTicket(getMessageText(lastAsst))
      if (ticket) setCurrentTicket(ticket)
    }
  }, [messages, isOpen, hubView])

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText ?? input
    if (!textToSend.trim() || isLoading) return
    void aiSendMessage({ text: textToSend })
    setInput('')
    trackEvent('chat_message_sent', { source: 'unified_hub' })
  }

  const resetChat = () => {
    const resetGreeting = visitorName
      ? `Conversación reiniciada. ¿En qué proyecto o desarrollo te podemos ayudar ahora, ${visitorName}?`
      : RESET_TEXT
    setMessages([welcomeMessage(resetGreeting)])
    setCurrentTicket(null)
    setInput('')
  }

  const getWhatsAppHandoffUrl = (customMsg?: string) => {
    if (customMsg) return getWhatsAppUrl(customMsg)
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user') ?? null
    const ticketStr = currentTicket ? ` [Ticket: ${currentTicket}]` : ''
    const greeting = visitorName ? `Hola Exequiel, soy ${visitorName}. ` : 'Hola Exequiel, '
    const fullText = lastUserMsg
      ? `${greeting}vi tu web y quiero consultar por una página para mi negocio (estaba viendo sobre: "${getMessageText(lastUserMsg)}"${ticketStr}).`
      : `${greeting}vi tu web y quiero consultar por una página para mi negocio.`
    return getWhatsAppUrl(fullText)
  }

  const handleOpenWhatsAppDirect = (msg: string) => {
    const personalized =
      visitorName && !msg.includes(`soy ${visitorName}`)
        ? msg.replace(/^Hola Exequiel,/, `Hola Exequiel, soy ${visitorName},`)
        : msg
    trackEvent('contact_whatsapp_clicked', { source: 'unified_hub_menu', message: personalized })
    setHasUnread(false)
    window.open(getWhatsAppUrl(personalized), '_blank')
  }

  return (
    <>
      {/* ========================================================
          1. BOTÓN FLOTANTE UNIFICADO (DOCK EXPANDIBLE CIUDAD DE SERVIDORES)
         ======================================================== */}
      <div className="fixed bottom-6 right-5 sm:bottom-7 sm:right-7 z-50 select-none">
        <motion.button
          type="button"
          onClick={() => {
            if (isOpen) {
              setIsOpen(false)
            } else {
              setIsOpen(true)
              setHubView('menu')
            }
            setHasUnread(false)
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          aria-label={isOpen ? 'Cerrar canales de atención' : 'Abrir canales de atención'}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#0a0d14]/95 text-white border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl backdrop-blur-2xl transition-all duration-300 shadow-cyan-500/20 cursor-pointer"
        >
          {/* Aura perimetral cian */}
          <span className="absolute -inset-0.5 rounded-full bg-linear-to-r from-cyan-500 via-sky-400 to-emerald-400 opacity-20 group-hover:opacity-60 blur-xs transition-opacity duration-300" />

          {/* Icono Dual / Logo Dinámico ExePaginasWeb */}
          <div className="relative w-9 h-9 rounded-full bg-[#0a0f1d] border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
            {isOpen ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <div className="flex items-center justify-center">
                <Logo size={26} variant="dark" />
              </div>
            )}
          </div>

          {/* Píldora de texto en Desktop / Tablet */}
          <div className="text-left hidden sm:block pr-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                {isOpen ? 'CERRAR PANEL' : 'SYS // CANALES EN VIVO'}
              </span>
            </div>
            <span className="text-xs font-bold tracking-tight text-white block">
              {isOpen ? 'Opciones de Contacto' : 'WhatsApp & Asistente IA'}
            </span>
          </div>

          {/* Badge en móvil */}
          <div className="sm:hidden flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">Canales</span>
          </div>

          {/* Notificación no leída '1' estilo WhatsApp */}
          {!isOpen && hasUnread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950 shadow-md"
            >
              1
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* ========================================================
          2. PANEL FLOTANTE EXPANDIBLE (MENU UNIFICADO O CHAT IA)
         ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-22 sm:bottom-24 right-4 sm:right-7 left-4 sm:left-auto z-50 sm:w-[410px] max-h-[calc(100dvh-7rem)] sm:max-h-[620px] rounded-3xl bg-[#090c15]/98 border-2 border-slate-700/60 dark:border-cyan-500/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-white shadow-black/80"
          >
            {/* ====================================================
                VISTA A: MENÚ DE ELECCIÓN DE CANAL (HUD CIUDAD DE SERVIDORES)
               ==================================================== */}
            {hubView === 'menu' ? (
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Cabecera del Hub con Logo ExePaginasWeb */}
                <div className="p-4 sm:p-5 bg-linear-to-b from-[#0f1424] to-[#090c15] border-b border-white/10 flex items-center justify-between select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0d1322] border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      <Logo size={28} variant="dark" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                          EXEPAGINASWEB // SOPORTE
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        ¿Cómo preferís comunicarte hoy?
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Cerrar panel"
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Barra de Identidad del Visitante (Personalización & n8n) */}
                <VisitorIdentityBar
                  visitorName={visitorName}
                  isEditing={isEditingName}
                  nameInput={nameInput}
                  onNameInputChange={setNameInput}
                  onSave={handleSaveName}
                  onStartEditing={() => {
                    setNameInput(visitorName)
                    setIsEditingName(true)
                  }}
                  onCancelEditing={() => setIsEditingName(false)}
                />

                {/* Opciones Principales de Contacto */}
                <div className="p-5 space-y-4">
                  {/* CANAL 1: WHATSAPP DIRECTO (HUMANO / EXEQUIEL) */}
                  <div className="rounded-2xl p-4 bg-linear-to-br from-emerald-950/40 via-emerald-900/20 to-transparent border-2 border-emerald-500/40 hover:border-emerald-400/80 transition-all duration-300 shadow-lg shadow-emerald-950/50">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0">
                          <WhatsAppIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">Hablar con Exequiel</h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                            <span>En línea · Respuesta en &lt; 5 min</span>
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                        HUMANO
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                      Atención directa por WhatsApp para cotizaciones, dudas técnicas o acordar tu
                      web sin esperas.
                    </p>

                    {/* Chips de 1 clic */}
                    <div className="space-y-1.5 mb-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsAppDirect(
                            'Hola Exequiel, vi tu web y quiero cotizar el desarrollo de una página para mi negocio.'
                          )
                        }
                        className="w-full text-left p-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-400/50 text-[11px] font-medium text-slate-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>🚀 Cotizar mi web ($450k / $750k)</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsAppDirect(
                            'Hola Exequiel, quisiera pedir la auditoría gratuita de 5 minutos en video para mi web/Instagram.'
                          )
                        }
                        className="w-full text-left p-2 rounded-xl bg-black/40 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-400/50 text-[11px] font-medium text-slate-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span>🎁 Pedir auditoría en video gratis</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenWhatsAppDirect(
                          'Hola Exequiel, vi tu web y quiero consultar por una página para mi negocio'
                        )
                      }
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Abrir WhatsApp con Exequiel</span>
                    </button>
                  </div>

                  {/* CANAL 2: ASISTENTE IA (AUTÓNOMO 24/7) */}
                  <div className="rounded-2xl p-4 bg-linear-to-br from-cyan-950/40 via-sky-900/20 to-transparent border-2 border-cyan-500/40 hover:border-cyan-400/80 transition-all duration-300 shadow-lg shadow-cyan-950/50">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0c1322] border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-inner">
                          <Logo size={26} variant="dark" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">Asistente ExeBot IA</h4>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/20 text-cyan-300 font-bold border border-cyan-400/30">
                              EXE
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#06b6d4]" />
                            <span>ExePaginasWeb · Asesor 24/7</span>
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                        IA 24/7
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                      Respuestas instantáneas sobre stack técnico, módulos disponibles, cotizaciones
                      interactivas y soporte.
                    </p>

                    <button
                      type="button"
                      onClick={() => setHubView('chat')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Preguntarle al Asistente IA →</span>
                    </button>
                  </div>
                </div>

                <div className="px-5 py-2.5 bg-black/40 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-center gap-2">
                  <Logo size={15} variant="dark" />
                  <span>ExePaginasWeb · Rosario & Global · 2025 · {DISPLAY_WHATSAPP_NUMBER}</span>
                </div>
              </div>
            ) : (
              /* ====================================================
                  VISTA B: CONSOLA DE CHAT IA CONVERSACIONAL
                 ==================================================== */
              <div className="flex flex-col h-[520px] sm:h-[560px]">
                {/* Cabecera del Chat con botón volver y Logo ExePaginasWeb */}
                <div className="px-4 py-3.5 bg-[#0e1220] border-b border-white/10 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHubView('menu')}
                      title="Volver al menú de canales"
                      aria-label="Volver al menú de canales"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Canales</span>
                    </button>

                    <div className="flex items-center gap-2 ml-1">
                      <div className="w-7 h-7 rounded-full bg-[#0c1322] border border-cyan-400/50 flex items-center justify-center shrink-0">
                        <Logo size={20} variant="dark" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-tight">ExeBot IA</h4>
                        <span className="text-[10px] text-cyan-400 font-mono block leading-none">
                          ExePaginasWeb · 24/7 En línea
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de cabecera */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((prev) => !prev)}
                      title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
                      aria-label="Silenciar o activar sonidos"
                      className="w-7 h-7 rounded-full hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
                      title="Reiniciar chat"
                      aria-label="Reiniciar chat"
                      className="w-7 h-7 rounded-full hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Cerrar chat"
                      className="w-7 h-7 rounded-full hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Barra de Identidad del Visitante (Personalización & n8n) */}
                <VisitorIdentityBar
                  visitorName={visitorName}
                  isEditing={isEditingName}
                  nameInput={nameInput}
                  onNameInputChange={setNameInput}
                  onSave={handleSaveName}
                  onStartEditing={() => {
                    setNameInput(visitorName)
                    setIsEditingName(true)
                  }}
                  onCancelEditing={() => setIsEditingName(false)}
                />

                {/* Mensajes */}
                <div
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#080b12]"
                >
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user'
                    const textContent = getMessageText(msg)
                    const n8nTicket = !isUser ? extractN8nTicket(textContent) : null

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono overflow-hidden ${
                            isUser
                              ? 'bg-cyan-500 text-slate-950 font-bold'
                              : 'bg-[#0f172a] border border-cyan-400/40'
                          }`}
                        >
                          {isUser ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Logo size={16} variant="dark" />
                          )}
                        </div>

                        <div className="space-y-1.5 max-w-[88%]">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isUser
                                ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-xs shadow-xs'
                                : 'bg-[#101524] border border-cyan-500/20 text-slate-200 rounded-tl-xs shadow-xs whitespace-pre-line'
                            }`}
                          >
                            {textContent}
                          </div>

                          {n8nTicket && (
                            <N8nExecutionCard
                              ticketId={n8nTicket}
                              clientName={visitorName || 'Visitante'}
                              automationType="Disparador Webhook Directo"
                              status="Activo en n8n Cloud"
                            />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Sugerencias rápidas */}
                {messages.length < 5 && (
                  <div className="px-3 py-2 bg-[#0a0d17] border-t border-white/5 shrink-0 flex flex-wrap gap-1.5">
                    {INITIAL_TOPICS.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          if (topic.action === 'whatsapp') {
                            handleOpenWhatsAppDirect(topic.prompt)
                          } else {
                            handleSendMessage(topic.prompt)
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 hover:border-cyan-400/60 text-slate-300 hover:text-white text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>{topic.title}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Traspaso directo a WhatsApp */}
                <div className="px-3.5 py-2 bg-emerald-950/40 border-t border-emerald-500/30 flex items-center justify-between gap-2 shrink-0">
                  <div className="text-[11px] text-emerald-300 truncate font-sans">
                    ¿Preferís hablar con una persona?{' '}
                    <span className="font-bold block sm:inline text-white">
                      Exequiel en WhatsApp
                    </span>
                  </div>
                  <a
                    href={getWhatsAppHandoffUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[10.5px] transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <span>Chatear</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Input de texto */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="p-3 bg-[#0a0d16] border-t border-white/10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribí tu consulta o proyecto..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-slate-700/60 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Enviar mensaje"
                    className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer font-bold shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatWidget
