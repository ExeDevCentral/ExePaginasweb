/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

const CHATBOT_ID = 'TGRKNv4moe3sA5IMOc4jV'

const ChatbaseWidget = () => {
  useEffect(() => {
    const win = window as any

    const init = () => {
      // Configuración única de Chatbase para evitar duplicación de botones
      win.chatbaseConfig = { chatbotId: CHATBOT_ID }

      if (!win.chatbase || win.chatbase('getState') !== 'initialized') {
        win.chatbase = (...args: any[]) => {
          if (!win.chatbase.q) win.chatbase.q = []
          win.chatbase.q.push(args)
        }
        win.chatbase = new Proxy(win.chatbase, {
          get(target: any, prop: string) {
            if (prop === 'q') return target.q
            return (...args: any[]) => target(prop, ...args)
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
