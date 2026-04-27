const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 100 // Aumentado para pruebas locales

const requestLog = new Map()

// Respuestas de fallback para desarrollo cuando no hay GROQ_API_KEY
const DEV_FALLBACK_RESPONSES = [
  {
    keywords: ['hola', 'buenas', 'hey', 'saludos'],
    response: '¡Hola! 👋 Soy el asistente de ExepaginasWeb. Estoy aquí para ayudarte con tu proyecto web. ¿Necesitas una landing page, una tienda online o algo más personalizado?'
  },
  {
    keywords: ['precio', 'costo', 'cuanto', 'valor', 'presupuesto', 'tarifa'],
    response: '💰 Los precios varían según el proyecto. Una landing page profesional desde $200 USD, tiendas online desde $500 USD. ¿Querés que te prepare un presupuesto personalizado sin compromiso?'
  },
  {
    keywords: ['tiempo', 'demora', 'cuando', 'plazo', 'duracion', 'entrega'],
    response: '⏱️ Una landing page suele estar lista en 5-7 días hábiles. Proyectos más complejos como tiendas online pueden llevar 2-3 semanas. ¿Tenés alguna fecha límite en mente?'
  },
  {
    keywords: ['tecnologia', 'stack', 'react', 'next', 'wordpress', 'cms'],
    response: '⚡ Trabajamos con React, Next.js, TypeScript y TailwindCSS para máximo rendimiento. También hacemos WordPress si preferís un CMS. ¿Tenés alguna preferencia tecnológica?'
  },
  {
    keywords: ['contacto', 'email', 'whatsapp', 'llamar', 'hablar'],
    response: '📬 Podés contactarnos por email a Exemetal@hotmail.com o por WhatsApp al +54 9 341 6874786. También podés dejar tu mensaje en el formulario de contacto y te respondemos en minutos.'
  },
  {
    keywords: ['dominio', 'hosting', 'servidor', 'vercel', 'deploy'],
    response: '🚀 Incluimos deploy gratuito en Vercel o Netlify. Si necesitás dominio propio (.com, .com.ar), te ayudamos a configurarlo. El hosting en Vercel es gratis para proyectos estáticos.'
  },
  {
    keywords: ['seo', 'google', 'posicionamiento', 'buscador'],
    response: '🔍 Todos nuestros proyectos incluyen SEO básico: meta tags, sitemap, optimización de imágenes y velocidad. Para SEO avanzado ofrecemos planes mensuales de contenido y link building.'
  },
  {
    keywords: ['mantenimiento', 'soporte', 'actualizar', 'cambios'],
    response: '🛠️ Ofrecemos planes de mantenimiento mensual que incluyen actualizaciones, backups, cambios menores y soporte prioritario. Desde $50 USD/mes.'
  }
]

function getDevFallbackResponse(message) {
  const lowerMsg = message.toLowerCase()
  
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some(kw => lowerMsg.includes(kw))) {
      return item.response
    }
  }
  
  return `🤖 Entiendo que mencionaste: "${message}". Como estoy en modo desarrollo, te sugiero contactarnos directamente por WhatsApp al +54 9 341 6874786 o dejar tu consulta en el formulario de contacto. ¡Te respondemos en minutos!`
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const previous = requestLog.get(ip) ?? []
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent)
    return true
  }

  recent.push(now)
  requestLog.set(ip, recent)
  return false
}

function setCorsHeaders(res) {
  // En producción (Vercel) esto es necesario, en local (api-dev-server) lo hace el middleware cors()
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }

  const apiKey = process.env.GROQ_API_KEY
  const defaultModel = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile'

  // Asegurar que el cuerpo de la petición sea un objeto
  let body = req.body || {}
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch (e) { body = {} }
  }

  const { message, history = [] } = body
  const userMessage = typeof message === 'string' ? message.trim() : ''

  if (!userMessage && history.length === 0) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (userMessage.length > 1500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  // Fallback de desarrollo: si no hay API key, responder con respuestas locales
  if (!apiKey) {
    console.log('[chat] Modo desarrollo: sin GROQ_API_KEY, usando fallback local')
    const fallbackReply = getDevFallbackResponse(userMessage)
    return res.status(200).json({ reply: fallbackReply, fallback: true })
  }

  const modelsToTry = [...new Set([defaultModel, 'llama-3.3-70b-specdec', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'])]
  let lastError = null

  // Controlador para abortar la petición si el cliente desconecta
  const abortController = new AbortController()
  if (req.on) {
    req.on('close', () => {
      abortController.abort()
    })
  }

  for (const tryModel of modelsToTry) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: abortController.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: tryModel,
          messages: [
            {
              role: 'system',
              content: 'Eres el asistente oficial de ExepaginasWeb. Ofreces servicios de desarrollo web (Landings desde $200 USD, Tiendas desde $500 USD). Responde en español de Argentina/Latinoamérica, de forma profesional pero cercana. Usa Markdown para dar formato (negritas, listas).'
            },
            ...history.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.6,
          max_tokens: 400,
          stream: true
        }),
      })

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text()
        lastError = `Groq error (${tryModel}): ${errorText}`
        continue
      }

      // Si por algún motivo falló a mitad de un intento anterior y las cabeceras ya se enviaron,
      // no podemos intentar otro modelo.
      if (res.headersSent) {
        return res.end();
      }

      // Configuramos cabeceras para streaming
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const reader = groqResponse.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value) // Reenviamos los chunks directamente al cliente
      }
      return res.end()
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        console.log('[chat] Conexión abortada: Deteniendo generación para ahorrar tokens.');
        return;
      }
      lastError = err.message || `Unknown error with ${tryModel}`
    }
  }

  // Si todos los modelos fallan y no hemos enviado cabeceras (stream no empezó)
  if (res.headersSent) return res.end();

  console.log('[chat] Todos los modelos fallaron. Usando fallback local. Error:', lastError)
  const fallbackReply = getDevFallbackResponse(userMessage)
  return res.status(200).json({ reply: fallbackReply, fallback: true, error: lastError })
}
