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
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
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

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCjjsaKjRzgMTHvc-Ll_op2St8-OKJYqhk'
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  if (!apiKey) {
    requestLog.delete(ip) // allow retry
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server.' })
  }

  const { imageBase64, mimeType } = req.body

  if (!imageBase64 || !mimeType) {
    requestLog.delete(ip)
    return res.status(400).json({ error: 'Image is required.' })
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
                text: 'Eres un experto desarrollador frontend especializado en Tailwind CSS. Tu objetivo es convertir el boceto, dibujo o diseño subido en una pagina web funcional. Debes generar un UNICO archivo HTML que contenga todo: HTML5 semantico, clases de Tailwind CSS integradas via CDN, y cualquier CSS personalizado necesario dentro de etiquetas <style>. El diseno debe ser hermoso, moderno, responsive y coincidir lo mas posible con la imagen proporcionada. MUY IMPORTANTE: Responde UNICA Y EXCLUSIVAMENTE con el codigo HTML crudo. NO incluyas markdown, no incluyas bloques de codigo como ```html, simplemente empieza con <!DOCTYPE html> y termina con </html>. No des explicaciones.'
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: 'Genera el codigo HTML + Tailwind para este diseno. Asegurate de que funcione renderizandolo directamente en un iframe.'
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 8192
          }
        }),
      })

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        lastError = `Gemini error (${tryModel}): ${errorText}`
        continue
      }

      const data = await geminiResponse.json()
      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

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
