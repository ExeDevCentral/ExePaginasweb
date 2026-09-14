/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { useEffect } from 'react'

const CHATBOT_ID = 'TGRKNv4moe3sA5IMOc4jV'

interface ChatbaseApi {
  q: unknown[][]
  (method: string, ...args: unknown[]): unknown
}

type ChatbaseWindow = Window & {
  chatbaseConfig?: { chatbotId: string }
  chatbase?: ChatbaseApi
}

const ChatbaseWidget = () => {
  useEffect(() => {
    const win = window as unknown as ChatbaseWindow

    const init = () => {
      // Configuración única de Chatbase para evitar duplicación de botones
      win.chatbaseConfig = { chatbotId: CHATBOT_ID }

      if (!win.chatbase || win.chatbase('getState') !== 'initialized') {
        win.chatbase = ((...args: unknown[]) => {
          if (!win.chatbase) win.chatbase = {} as ChatbaseApi
          if (!win.chatbase.q) win.chatbase.q = []
          win.chatbase.q.push(args)
        }) as ChatbaseApi
        const base = win.chatbase
        win.chatbase = new Proxy(base, {
          get(target: ChatbaseApi, prop: string) {
            if (prop === 'q') return target.q
            return (...args: unknown[]) => target(prop, ...args)
          },
        })
      }

      if (!document.getElementById(CHATBOT_ID)) {
        const script = document.createElement('script')
        script.src = 'https://www.chatbase.co/embed.min.js'
        script.id = CHATBOT_ID
        script.async = true
        document.body.appendChild(script)
      }
    }

    if (document.readyState === 'complete') {
      init()
    } else {
      window.addEventListener('load', init)
    }
  }, [])

  return null
}

export default ChatbaseWidget
