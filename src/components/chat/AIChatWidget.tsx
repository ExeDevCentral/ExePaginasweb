import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  X,
  MessageCircle,
  Sparkles,
  User,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../core/utils/whatsappUtils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  ticketId?: string
}

const INITIAL_TOPICS = [
  '💻 Cotizar Desarrollo Web',
  '📅 Sistema de Turnos / Reservas',
  '📊 Dashboard o SaaS a Medida',
  '💬 Hablar con un Humano por WhatsApp',
]

const playChimeSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.2)
  } catch {
    // Ignore audio restrictions if blocked
  }
}

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null)
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
  const lastMessageRef = useRef<{ text: string; time: number } | null>(null)
  const responseCacheRef = useRef<Map<string, string>>(new Map())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTicket(text)
    toast.success(`¡Ticket ${text} copiado al portapapeles!`)
    setTimeout(() => setCopiedTicket(null), 2000)
  }

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          '¡Conversación reiniciada! 👋 ¿En qué proyecto o sistema web te podemos asesorar ahora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setCurrentTicket(null)
    toast.info('Conversación reiniciada')
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const now = Date.now()
    const lowerText = text.toLowerCase()

    // 1. Protection against repeated spam messages from impatient users
    if (
      lastMessageRef.current &&
      lastMessageRef.current.text === lowerText &&
      now - lastMessageRef.current.time < 8000
    ) {
      const fastReplyMsg: Message = {
        id: `ast-fast-${now}`,
        role: 'assistant',
        content:
          '⚡ ¡Estoy aquí con vos! Ya tengo registrado tu mensaje anterior. Para atención prioritaria inmediata, podés hacer clic abajo en "Continuar por WhatsApp".',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, fastReplyMsg])
      if (!textToSend) setInput('')
      if (soundEnabled) playChimeSound()
      return
    }

    lastMessageRef.current = { text: lowerText, time: now }

    const userMsgId = `usr-${now}`
    const newMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    if (!textToSend) setInput('')

    // 2. Instant 0ms cache lookup for repeated queries
    const cachedResponse = responseCacheRef.current.get(lowerText)
    if (cachedResponse) {
      const assistantMsg: Message = {
        id: `ast-cache-${now}`,
        role: 'assistant',
        content: cachedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      if (soundEnabled) playChimeSound()
      return
    }

    setIsLoading(true)

    // Build chat history for API
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      let response: Response | null = null
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: historyPayload }),
        })
      } catch {
        // Fallback for dev mode if proxy is not listening
        response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: historyPayload }),
        })
      }

      if (!response || !response.ok) {
        throw new Error('No response from AI backend')
      }

      const data = await response.json()
      const replyText = data.reply || '¡Recibido! ¿En qué más podemos ayudarte?'
      responseCacheRef.current.set(lowerText, replyText)

      // Check if ticket ID was returned or extracted
      const ticketMatch = replyText.match(/\[(EXE-CHT-[A-Z0-9]+)\]/)
      const ticket: string | null = ticketMatch && ticketMatch[1] ? ticketMatch[1] : null
      if (ticket) setCurrentTicket(ticket)

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketId: ticket || undefined,
      }

      setMessages((prev) => [...prev, assistantMsg])
      if (soundEnabled) playChimeSound()
    } catch (err) {
      console.warn('[AIChatWidget] Backend no disponible, usando respuesta dinámica:', err)
      const lowerText = text.toLowerCase()
      let dynamicReply = ''

      if (
        lowerText.includes('abogad') ||
        lowerText.includes('abogada') ||
        lowerText.includes('legal') ||
        lowerText.includes('estudio') ||
        lowerText.includes('juridic')
      ) {
        const generatedTicket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setCurrentTicket(generatedTicket)
        dynamicReply = `¡Hola! ⚖️ Sí, por supuesto. Para estudios jurídicos y abogados desarrollamos páginas web institucionales de alto impacto, sistemas de agendamiento de consultas legales y recepción segura de documentación.\n\nPara enviarte una propuesta técnica a medida con el Ticket [${generatedTicket}], ¿nos dejas tu email aquí en el chat o prefieres hablar por WhatsApp con un especialista?`
      } else if (
        lowerText.includes('padel') ||
        lowerText.includes('pádel') ||
        lowerText.includes('cancha') ||
        lowerText.includes('deport') ||
        lowerText.includes('futbol') ||
        lowerText.includes('fútbol') ||
        lowerText.includes('gimnasio')
      ) {
        const generatedTicket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setCurrentTicket(generatedTicket)
        dynamicReply = `¡Excelente proyecto! 🎾 Para complejos de pádel o canchas deportivas, desarrollamos plataformas de reserva en tiempo real donde los jugadores eligen la cancha, la franja horaria y abonan la seña online, enviando notificaciones automáticas por WhatsApp.\n\nPara prepararte una propuesta técnica a medida bajo el Ticket [${generatedTicket}], ¿nos dejas tu email aquí en el chat o prefieres consultarnos directo por WhatsApp?`
      } else if (
        lowerText.includes('medic') ||
        lowerText.includes('salud') ||
        lowerText.includes('doct') ||
        lowerText.includes('clinic') ||
        lowerText.includes('dentist') ||
        lowerText.includes('psicolog')
      ) {
        const generatedTicket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setCurrentTicket(generatedTicket)
        dynamicReply = `¡Excelente! 🩺 Para clínicas, médicos y profesionales de la salud desarrollamos sitios web con agendamiento de turnos, notificaciones por email/WhatsApp y recordatorios a pacientes.\n\nPara armarte una propuesta con el Ticket [${generatedTicket}], ¿nos dejas tu email aquí en el chat o nos contactas por WhatsApp?`
      } else if (
        lowerText.includes('turno') ||
        lowerText.includes('reserva') ||
        lowerText.includes('cita')
      ) {
        dynamicReply =
          '¡Nos encanta ese tipo de soluciones! 📅 Desarrollamos sistemas de turnos y reservas en tiempo real con integración a WhatsApp, cobro de señas y notificaciones automáticas. ¿Te gustaría solicitarnos una propuesta a medida para tu negocio?'
      } else if (
        lowerText.includes('precio') ||
        lowerText.includes('cuanto') ||
        lowerText.includes('costo') ||
        lowerText.includes('cotiz')
      ) {
        const generatedTicket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setCurrentTicket(generatedTicket)
        dynamicReply = `¡Genial! Cada sistema web lo desarrollamos a la medida exacta de tus objetivos. Para prepararte un presupuesto detallado con el Ticket [${generatedTicket}], ¿nos dejas tu email por aquí o prefieres consultarnos directo por WhatsApp?`
      } else if (
        lowerText.includes('dashboard') ||
        lowerText.includes('saas') ||
        lowerText.includes('panel')
      ) {
        dynamicReply =
          '¡Espectacular! 📊 Diseñamos dashboards administrativos y plataformas SaaS avanzadas a medida con métricas en tiempo real, roles de usuario y reportes exportables. ¿Qué funcionalidades principales te gustaría incluir?'
      } else if (
        lowerText.trim() === 'hola' ||
        lowerText.trim() === 'buenas' ||
        lowerText.trim() === 'hey' ||
        text.length < 8
      ) {
        dynamicReply =
          '¡Hola! 👋 Qué gusto saludarte. Soy el asistente inteligente de ExeSistemasWEB. ¿En qué proyecto o sistema web te gustaría que te asesoremos hoy?'
      } else {
        const generatedTicket = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        setCurrentTicket(generatedTicket)
        dynamicReply = `¡Excelente idea de proyecto! 🚀 Desarrollamos sistemas y páginas web a medida adaptados a tu negocio. Para coordinar una propuesta técnica con el Ticket [${generatedTicket}], ¿nos dejas tu email aquí en el chat o prefieres escribirnos por WhatsApp?`
      }

      const ticketMatch = dynamicReply.match(/\[(EXE-CHT-[A-Z0-9]+)\]/)
      const ticketExtracted = ticketMatch ? ticketMatch[1] : undefined

      const fallbackMsg: Message = {
        id: `ast-dyn-${Date.now()}`,
        role: 'assistant',
        content: dynamicReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketId: ticketExtracted,
      }
      setMessages((prev) => [...prev, fallbackMsg])
      if (soundEnabled) playChimeSound()
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
      {/* SPECTACULAR AI COPILOT FLOATING BUTTON */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-24 z-50 group select-none"
      >
        {/* Ambient Pulsing Glow Aura */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-cyan via-purple-500 to-accent-magenta opacity-75 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse" />

        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Abrir AI Copilot"
          className="relative flex items-center gap-3 px-5 py-3 rounded-full bg-slate-950/90 text-white font-extrabold text-xs border border-accent-cyan/50 shadow-[0_10px_35px_rgba(6,182,212,0.45)] backdrop-blur-2xl overflow-hidden cursor-pointer transition-all duration-300"
        >
          {/* Holographic Sweep Beam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* AI Glowing Orb Container */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan via-purple-600 to-accent-magenta p-0.5 shadow-lg shadow-accent-cyan/40 shrink-0">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
              <Bot className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform duration-300" />
              <Sparkles
                className="w-2.5 h-2.5 text-amber-300 absolute -top-0.5 -right-0.5 animate-spin"
                style={{ animationDuration: '6s' }}
              />
            </div>
          </div>

          {/* Label & Status Pill */}
          <div className="flex flex-col text-left pr-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold font-mono tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 text-xs">
                AI COPILOT
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[9px] font-mono font-bold">
                PRO
              </span>
            </div>
            <span className="text-[9px] text-cyan-200/90 font-mono tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              24/7 EN VIVO
            </span>
          </div>

          {/* Interactive Badge Indicator */}
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
        </motion.button>
      </motion.div>

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
            <div className="px-5 py-3.5 bg-muted/80 border-b border-border flex items-center justify-between select-none">
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      En vivo
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Responde al instante 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
                  className="w-7 h-7 rounded-full hover:bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
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
                  title="Reiniciar conversación"
                  className="w-7 h-7 rounded-full hover:bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Body */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs scrollbar-thin"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                const extractedTicket =
                  msg.ticketId || msg.content.match(/\[(EXE-CHT-[A-Z0-9]+)\]/)?.[1]

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

                    <div className="space-y-1.5 max-w-[82%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-accent-cyan text-slate-950 font-medium rounded-tr-none'
                            : 'bg-muted/90 border border-border text-foreground rounded-tl-none shadow-sm whitespace-pre-line'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Interactive Ticket Copy Badge */}
                      {extractedTicket && !isUser && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(extractedTicket)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 text-[10px] font-mono font-bold transition-all cursor-pointer"
                          >
                            {copiedTicket === extractedTicket ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Ticket: {extractedTicket}</span>
                          </button>
                        </div>
                      )}

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
                  <span className="animate-pulse">Copilot pensando respuesta...</span>
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
            {messages.length < 5 && (
              <div className="px-4 py-2 bg-muted/40 border-t border-border flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {INITIAL_TOPICS.map((topic) => (
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
