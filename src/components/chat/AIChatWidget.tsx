import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, X, MessageCircle, Sparkles, User, ExternalLink, RefreshCw } from 'lucide-react'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  ticketId?: string
}

const PRESET_TOPICS = [
  '💻 Cotizar Desarrollo Web',
  '📅 Sistema de Turnos / Reservas',
  '📊 Dashboard o SaaS a Medida',
  '💬 Hablar con un Humano por WhatsApp',
]

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '¡Hola! 👋 Soy el asistente IA de ExeSistemasWEB. ¿En qué proyecto o sistema web te puedo asesorar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMsgId = `usr-${Date.now()}`
    const newMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    if (!textToSend) setInput('')
    setIsLoading(true)

    // Build chat history for API
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al conectar con la IA')
      }

      const data = await response.json()
      const replyText = data.reply || 'Recibido. ¿Querés continuar conversando por WhatsApp?'

      // Check if ticket ID was returned or extracted
      const ticketMatch = replyText.match(/\[(EXE-CHT-[A-Z0-9]+)\]/)
      const ticket: string | null = ticketMatch && ticketMatch[1] ? ticketMatch[1] : null
      setCurrentTicket(ticket)

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketId: ticket || undefined,
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('[AIChatWidget] Error:', err)
      const fallbackMsg: Message = {
        id: `ast-err-${Date.now()}`,
        role: 'assistant',
        content:
          'Podemos ayudarte a cotizar tu proyecto de inmediato. Podés continuar directamente por WhatsApp con nuestro equipo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Get current chat context for WhatsApp prefilled link
  const getWhatsAppHandoffUrl = () => {
    const lastUserMsg =
      [...messages].reverse().find((m) => m.role === 'user')?.content || 'Consulta desde la web'
    const ticketStr = currentTicket ? ` [Ticket: ${currentTicket}]` : ''
    const fullText = `¡Hola ExePaginasWeb! Estaba consultando en el chat sobre: "${lastUserMsg}"${ticketStr}. Quisiera hablar con un especialista.`
    return getWhatsAppUrl(fullText)
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir asistente de IA"
        className="fixed bottom-6 right-24 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-accent-cyan via-accent-cyan to-accent-magenta text-white font-bold text-xs shadow-2xl shadow-accent-cyan/30 border border-white/20 backdrop-blur-xl cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-5 h-5 animate-pulse" />
          <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1" />
        </div>
        <span className="hidden sm:inline-block font-mono tracking-wider uppercase">
          AI Copilot
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </motion.button>

      {/* Chat Drawer / Popover Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[82vh] rounded-3xl bg-card/95 border border-border shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-muted/80 border-b border-border flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-magenta p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-accent-cyan" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-foreground tracking-tight">
                      Exe Copilot IA
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                      En vivo
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Responde al instante 24/7</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-muted hover:bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Body */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs scrollbar-thin"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isUser
                          ? 'bg-accent-cyan text-slate-950 font-bold'
                          : 'bg-muted border border-border text-accent-cyan'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 max-w-[80%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-accent-cyan text-slate-950 font-medium rounded-tr-none'
                            : 'bg-muted/90 border border-border text-foreground rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      <div
                        className={`text-[9px] text-muted-foreground font-mono px-1 ${
                          isUser ? 'text-right' : 'text-left'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent-cyan" />
                  </div>
                  <span>Generando respuesta...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct WhatsApp Handoff Banner */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 border-t border-emerald-500/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium truncate">
                <MessageCircle className="w-4 h-4 shrink-0 fill-emerald-500 text-slate-950" />
                <span className="truncate">WhatsApp {DISPLAY_WHATSAPP_NUMBER}</span>
              </div>
              <a
                href={getWhatsAppHandoffUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
              >
                <span>Continuar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Quick Preset Topics */}
            {messages.length < 4 && (
              <div className="px-4 py-2 bg-muted/40 border-t border-border flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {PRESET_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleSendMessage(topic)}
                    className="px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent-cyan text-[10px] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="p-3 bg-muted/80 border-t border-border flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje o correo..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-cyan/60 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensaje"
                className="w-9 h-9 rounded-xl bg-accent-cyan text-slate-950 font-bold flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatWidget
