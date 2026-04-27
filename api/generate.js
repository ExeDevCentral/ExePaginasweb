const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
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
  const previous = requestLog.get(ip)

  if (previous && now - previous < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  requestLog.set(ip, now)
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
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
    return res.status(429).json({ error: 'Ya has utilizado tu prueba gratuita de generacion web con IA.' })
  }

  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview'

  if (!apiKey) {
    requestLog.delete(ip) // allow retry
    return res.status(500).json({ error: 'Missing GROQ_API_KEY environment variable. Check your .env file.' })
  }

  const body = req.body || {}
  const { imageBase64, mimeType } = body

  if (!imageBase64 || !mimeType) {
    requestLog.delete(ip)
    return res.status(400).json({ error: 'Image is required.' })
  }

  const modelsToTry = [model, 'meta-llama/llama-4-scout-17b-16e-instruct']
  let lastError = null

  for (const tryModel of modelsToTry) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 segundos de timeout

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
              content: 'Eres un experto desarrollador frontend especializado en Tailwind CSS. Tu objetivo es convertir el boceto, dibujo o diseño subido en una pagina web funcional. Debes generar un UNICO archivo HTML que contenga todo: HTML5 semantico, clases de Tailwind CSS integradas via CDN, y cualquier CSS personalizado necesario dentro de etiquetas <style>. El diseno debe ser hermoso, moderno, responsive y coincidir lo mas posible con la imagen proporcionada. MUY IMPORTANTE: Responde UNICA Y EXCLUSIVAMENTE con el codigo HTML crudo. NO incluyas markdown, no incluyas bloques de codigo como ```html, simplemente empieza con <!DOCTYPE html> y termina con </html>. No des explicaciones.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Genera el codigo HTML + Tailwind para este diseno. Asegurate de que funcione renderizandolo directamente en un iframe.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          temperature: 0.2,
          max_tokens: 4096
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text()
        lastError = `Groq error (${tryModel}): ${errorText}`
        continue
      }

      const data = await groqResponse.json()
      let reply = data?.choices?.[0]?.message?.content?.trim() || ''

      // Clean markdown if AI still includes it despite prompt
      if (reply.startsWith('```html')) {
        reply = reply.slice(7)
      } else if (reply.startsWith('```')) {
        reply = reply.slice(3)
      }
      if (reply.endsWith('```')) {
        reply = reply.slice(0, -3)
      }
      reply = reply.trim()

      if (!reply) {
        lastError = `Model ${tryModel} returned an empty response.`
        continue
      }

      return res.status(200).json({ code: reply })
    } catch (err) {
      lastError = err.message || `Unknown error with ${tryModel}`
    }
  }

  requestLog.delete(ip)
  return res.status(500).json({ error: lastError || 'All models failed.' })
}
