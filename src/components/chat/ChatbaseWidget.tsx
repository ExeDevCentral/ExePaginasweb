/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

const CHATBOT_ID = 'TGRKNv4moe3sA5IMOc4jV'

const ChatbaseWidget = () => {
  useEffect(() => {
    const init = () => {
      if (!(window as any).chatbase || (window as any).chatbase('getState') !== 'initialized') {
        ;(window as any).chatbase = (...args: any[]) => {
          if (!(window as any).chatbase.q) {
            ;(window as any).chatbase.q = []
          }
          ;(window as any).chatbase.q.push(args)
        }
        ;(window as any).chatbase = new Proxy((window as any).chatbase, {
          get(target: any, prop: string) {
            if (prop === 'q') return target.q
            return (...args: any[]) => target(prop, ...args)
          },
        })
      }
      const script = document.createElement('script')
      script.src = 'https://www.chatbase.co/embed.min.js'
      script.id = CHATBOT_ID
      script.setAttribute('domain', 'www.chatbase.co')
      document.body.appendChild(script)
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
