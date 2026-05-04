import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Zap, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const QUICK_REPLIES = [
  "💰 ¿Cuánto cuesta una landing?",
  "⏱️ ¿Cuánto tiempo tardan?",
  "⚡ ¿Qué tecnologías usan?",
  "📬 Quiero contactarlos"
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  type: 'bot',
content: "¡Hola! 👋 Soy el asistente de **ExeSistemasWEB**. Puedo ayudarte con info sobre presupuestos, tiempos de entrega y tecnologías. ¿En qué puedo asesorarte hoy?",
  timestamp: new Date()
}

const BotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useFocusTrap(isOpen)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const requestBotResponse = async (userMessage: string) => {
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          // Mapeamos el historial al formato estándar role/content para la API
          history: messages.slice(-6).map(m => ({
            role: m.type === 'bot' ? 'assistant' : 'user',
            content: m.content
          }))
        }),
      })

      const contentType = response.headers.get('Content-Type')
      
      // CASO A: Respuesta tipo Streaming (IA Activa)
      if (contentType?.includes('text/event-stream')) {
        if (!response.ok) {
          throw new Error(`Error del servidor durante el streaming: ${response.status}`)
        }
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No se pudo inicializar el lector de stream.')

        const decoder = new TextDecoder()
        let botContent = ''
        const botId = crypto.randomUUID()
        let partialLine = '' // Buffer para manejar fragmentos de JSON cortados

        // Añadimos mensaje vacío para ir llenándolo
        setMessages(prev => [...prev, {
          id: botId,
          type: 'bot',
          content: '',
          timestamp: new Date(),
        }])
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = (partialLine + chunk).split('\n')
          partialLine = lines.pop() || '' // Guardamos la última línea si está incompleta

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim()
              if (!dataStr || dataStr === '[DONE]') continue
              
              try {
                const json = JSON.parse(dataStr)
                const token = json.choices?.[0]?.delta?.content || ''
                if (token) {
                  botContent += token
                  // Actualizamos el mensaje en tiempo real
                  setMessages(prev => prev.map(msg => 
                    msg.id === botId ? { ...msg, content: botContent } : msg
                  ))
                }
              } catch (e) {
                console.warn("Fragmento de JSON incompleto, esperando más datos...");
              }
            }
          }
        }
      } 
      // CASO B: Respuesta JSON estándar (Modo Desarrollo / Fallback)
      else {
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          if (text.includes('<!DOCTYPE html>') || contentType?.includes('text/html')) {
            throw new Error('El servidor devolvió HTML (posible error 404/500 de Vite). Revisa que node api-dev-server.js esté corriendo.');
          }
          throw new Error('El servidor devolvió una respuesta no válida (No JSON).');
        }

        if (!response.ok) {
          throw new Error(data.error || `Error ${response.status}`);
        }

        const botMessage: Message = {
          id: crypto.randomUUID(),
          type: 'bot',
          content: data.reply ?? 'No pude generar una respuesta.',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])
      }

    } catch (err: any) {
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: `❌ **Error:** ${err.message || 'No pude conectar con el asistente.'} \n\nVerifica que el servidor de la API esté activo.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputValue('');
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    await requestBotResponse(text)
  }

  const handleSendMessage = async () => {
    await sendMessage(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-bg" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-bg" />
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            className="fixed bottom-4 right-0 sm:bottom-24 sm:right-6 z-40 w-full sm:w-[450px] h-[calc(100dvh-5rem)] sm:h-[600px] max-w-[100vw] flex flex-col bg-gradient-to-br from-primary-bg/95 to-primary-bg/90 backdrop-blur-md border border-accent-cyan/20 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border-b border-accent-cyan/20">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                  animate={isTyping ? { 
                    boxShadow: ["0_0_15px_rgba(0,255,255,0.4)", "0_0_25px_rgba(0,255,255,0.8)", "0_0_15px_rgba(0,255,255,0.4)"] 
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Bot className="w-5 h-5 text-primary-bg" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-primary-text">AI Assistant</h3>
                  <p className="text-sm text-primary-secondary">Online • Ready to help</p>
                </div>
                <motion.button 
                  onClick={clearHistory}
                  className="ml-2 p-2 hover:bg-white/10 rounded-lg text-primary-secondary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Reiniciar conversación"
                  aria-label="Reiniciar conversación"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                  <Zap className="w-4 h-4 text-accent-cyan" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-bg" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg'
                          : 'bg-primary-bg/50 border border-accent-cyan/20 text-primary-text'
                      }`}
                    >
                      <div className="text-sm sm:text-base max-w-none prose prose-invert selection:bg-accent-cyan/30">
                        <ReactMarkdown
                          components={{
                            p: ({...props}) => <p className="text-slate-100 mb-2 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({...props}) => <strong style={{ color: '#00d4ff', fontWeight: 'bold' }} {...props} />,
                            em: ({...props}) => <em style={{ color: '#ff00a0' }} {...props} />,
                            code: ({...props}) => <code className="bg-[#1e1e2e] text-accent-cyan px-1.5 py-0.5 rounded text-[0.9em]" {...props} />,
                            ul: ({...props}) => <ul className="text-slate-100 list-disc pl-5 my-2 space-y-1" {...props} />,
                            li: ({...props}) => <li className="text-slate-100" {...props} />,
                            a: ({...props}) => <a style={{ color: '#00d4ff', textDecoration: 'underline' }} {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-accent-magenta to-accent-yellow rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary-bg" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex gap-3 justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-bg" />
                  </div>
                  <div className="bg-primary-bg/50 border border-accent-cyan/20 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Botones de Respuesta Rápida */}
              <AnimatePresence mode="wait">
                {!isTyping && messages[messages.length - 1]?.type === 'bot' && (
                  <motion.div 
                    className="flex flex-wrap gap-2 pt-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  >
                    {QUICK_REPLIES.map((reply) => (
                      <motion.button
                        key={reply}
                        variants={itemVariants}
                        onClick={() => sendMessage(reply)}
                        className="text-xs px-3 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full text-accent-cyan hover:bg-accent-cyan/20 hover:border-accent-cyan transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-accent-cyan/20 bg-[#0f172a]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu consulta aquí..."
                  className="flex-1 px-5 py-3 text-base bg-[#1e293b] text-white border border-accent-cyan/30 rounded-full placeholder-slate-400 focus:outline-none focus:border-accent-cyan transition-all shadow-inner focus:ring-1 focus:ring-accent-cyan/50"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BotWidget
