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

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCjjsaKjRzgMTHvc-Ll_op2St8-OKJYqhk'
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server.' })
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.length > 1500) {
    return res.status(400).json({ error: 'Message is too long.' })
  }

  const modelsToTry = [model, 'gemini-2.0-flash', 'gemini-1.5-flash']
  let lastError = null

  for (const tryModel of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${tryModel}:generateContent?key=${apiKey}`
      const geminiResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Eres un asistente para una landing de servicios web. Responde en espanol claro, breve y orientado a conversion.'
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 400
          }
        }),
      })

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        lastError = `Gemini error (${tryModel}): ${errorText}`
        continue
      }

      const data = await geminiResponse.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

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
