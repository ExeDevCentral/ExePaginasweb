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

  const message = (body && typeof body.message === 'string') ? body.message.trim() : ''

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 1500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  // Fallback de desarrollo: si no hay API key, responder con respuestas locales
  if (!apiKey) {
    console.log('[chat] Modo desarrollo: sin GROQ_API_KEY, usando fallback local')
    const fallbackReply = getDevFallbackResponse(message)
    return res.status(200).json({ reply: fallbackReply, fallback: true })
  }

  const modelsToTry = [...new Set([defaultModel, 'llama-3.3-70b-specdec', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'])]
  let lastError = null

  for (const tryModel of modelsToTry) {
    try {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: tryModel,
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente para una landing de servicios web. Responde en español claro, breve y orientado a conversión.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.6,
          max_tokens: 400
        }),
      })

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text()
        lastError = `Groq error (${tryModel}): ${errorText}`
        continue
      }

      const data = await groqResponse.json()
      const reply = data?.choices?.[0]?.message?.content?.trim()

      if (!reply) {
        lastError = `Model ${tryModel} returned an empty response.`
        continue
      }

      return res.status(200).json({ reply })
    } catch (err) {
      lastError = err.message || `Unknown error with ${tryModel}`
    }
  }

  // Si todos los modelos fallan, usar fallback de desarrollo como último recurso
  console.log('[chat] Todos los modelos fallaron. Usando fallback local. Error:', lastError)
  const fallbackReply = getDevFallbackResponse(message)
  return res.status(200).json({ reply: fallbackReply, fallback: true, error: lastError })
}
