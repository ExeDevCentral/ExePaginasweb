/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

const CHATBOT_ID = 'TGRKNv4moe3sA5IMOc4jV'

const ChatbaseWidget = () => {
  useEffect(() => {
    const init = () => {
      ;(window as any).chatbaseConfig = {
        chatbotId: CHATBOT_ID,
      }
      const script = document.createElement('script')
      script.src = 'https://www.chatbase.co/embed.min.js'
      script.id = CHATBOT_ID
      script.defer = true
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
