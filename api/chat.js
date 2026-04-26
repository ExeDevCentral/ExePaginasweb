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

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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
  const model = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile'

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable. Check your .env file.' })
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 1500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  const modelsToTry = [model, 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768']
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

  return res.status(502).json({ error: lastError || 'All models failed.' })
}

