import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Zap } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

const BotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI assistant. I can help you create projects, add components, and deploy your apps. Try typing `/help` to see available commands!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = (await response.json()) as { reply?: string }
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.reply ?? 'No pude generar una respuesta en este momento.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
    } catch {
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'No pude conectar con el asistente ahora mismo. Intenta nuevamente en unos segundos.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    await requestBotResponse(inputValue)
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
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-gradient-to-br from-primary-bg/95 to-primary-bg/90 backdrop-blur-md border border-accent-cyan/20 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border-b border-accent-cyan/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-bg" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-text">AI Assistant</h3>
                  <p className="text-sm text-primary-secondary">Online • Ready to help</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                  <Zap className="w-4 h-4 text-accent-cyan" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
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
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-primary-bg'
                          : 'bg-primary-bg/50 border border-accent-cyan/20 text-primary-text'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-accent-cyan/20">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or ask me anything..."
                  className="flex-1 px-4 py-2 bg-primary-bg/50 border border-accent-cyan/20 rounded-full text-primary-text placeholder-primary-secondary focus:outline-none focus:border-accent-cyan transition-colors"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
