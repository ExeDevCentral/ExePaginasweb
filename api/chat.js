import { z } from 'zod'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10

const requestLog = new Map()

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1500),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .nullish(),
})

const DEV_FALLBACK_RESPONSES = [
  {
    keywords: ['hola', 'buenas', 'hey', 'saludos'],
    response:
      '¡Hola! Soy el asistente de ExeSistemasWEB. Te ayudo a automatizar las operaciones de tu negocio con sistemas web a medida.',
  },
  {
    keywords: ['precio', 'costo', 'cuanto', 'valor', 'presupuesto'],
    response:
      'Desarrollamos sistemas web y software a medida (reservas, dashboards, automatizacion). El costo depende del alcance. Queres solicitar una cotizacion?',
  },
  {
    keywords: ['contacto', 'whatsapp', 'hablar'],
    response:
      'Usa el formulario de contacto o el chat en esta pagina para comunicarte con nosotros.',
  },
]

function getDevFallbackResponse(message) {
  const lowerMsg = message.toLowerCase()
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) return item.response
  }
  return `Entiendo que preguntaste sobre: "${message}". Contactanos por WhatsApp al +54 9 341 6874786 para una respuesta inmediata.`
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
  const origin = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const SYSTEM_PROMPT =
  'Eres el asistente oficial de ExeSistemasWEB. Te especializas en sistemas web para automatizar operaciones de negocios locales (reservas, turnos, dashboards, gestion). No vendemos simples paginas web, hacemos software que optimiza procesos. Responde en espanol de Argentina/Latinoamerica, de forma profesional pero cercana. Responde en texto plano Markdown.'

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.' })
  }

  const validation = ChatRequestSchema.safeParse(req.body)
  if (!validation.success) {
    console.error('[chat] Error de validacion:', validation.error.format())
    return res
      .status(400)
      .json({ error: 'Datos de mensaje invalidos.', details: validation.error.format() })
  }

  const { message: userMessage, history: rawHistory } = validation.data
  const history = rawHistory || []

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    console.log('[chat] GROQ_API_KEY no configurada, usando fallback local')
    const fallbackReply = getDevFallbackResponse(userMessage)
    return res.status(200).json({ reply: fallbackReply, fallback: true })
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const abortController = new AbortController()
  res.on('close', () => abortController.abort())

  try {
    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.6,
        max_tokens: 400,
        stream: true,
      }),
      signal: abortController.signal,
    })

    if (!groqResp.ok) {
      const errText = await groqResp.text()
      console.error('[chat] Groq API error:', groqResp.status, errText)

      if (!res.headersSent) {
        const fallbackReply = getDevFallbackResponse(userMessage)
        return res.status(200).json({ reply: fallbackReply, fallback: true })
      }
      return
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const reader = groqResp.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content && !res.writableEnded) {
            res.write(`data: {"choices":[{"delta":{"content":${JSON.stringify(content)}}]}\n\n`)
          }
        } catch {
          // skip incomplete JSON fragments
        }
      }
    }

    if (!res.writableEnded) {
      res.write('data: [DONE]\n\n')
      res.end()
    }
  } catch (err) {
    if (err.name === 'AbortError') return
    console.error('[chat] Error:', err.message)

    if (!res.headersSent) {
      const fallbackReply = getDevFallbackResponse(userMessage)
      return res.status(200).json({ reply: fallbackReply, fallback: true, error: err.message })
    }

    if (!res.writableEnded) {
      res.write(
        `data: {"choices":[{"delta":{"content":"\n\nLo siento, ocurrio un error al procesar tu mensaje."}}]}\n\n`
      )
      res.write('data: [DONE]\n\n')
      res.end()
    }
  }
}
