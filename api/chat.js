const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 20

const requestLog = new Map()

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' })
  }

  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY on server.' })
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 1500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente para una landing de servicios web. Responde en espanol claro, breve y orientado a conversion.',
          },
          { role: 'user', content: message },
        ],
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      return res.status(502).json({ error: `Groq error: ${errorText}` })
    }

    const data = await groqResponse.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return res.status(502).json({ error: 'Model returned an empty response.' })
    }

    return res.status(200).json({ reply })
  } catch {
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
}
