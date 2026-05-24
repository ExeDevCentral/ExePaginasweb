const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000
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
  if (previous && now - previous < RATE_LIMIT_WINDOW_MS) return true
  requestLog.set(ip, now)
  return false
}

function setCorsHeaders(res) {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
  },
}

const SYSTEM_PROMPT = 'Eres un experto desarrollador frontend especializado en Tailwind CSS. Tu objetivo es convertir el boceto, dibujo o diseno subido en una pagina web funcional. Debes generar un UNICO archivo HTML que contenga todo: HTML5 semantico, clases de Tailwind CSS integradas via CDN, y cualquier CSS personalizado necesario dentro de etiquetas <style>. El diseno debe ser hermoso, moderno, responsive y coincidir lo mas posible con la imagen proporcionada. MUY IMPORTANTE: Responde UNICA Y EXCLUSIVAMENTE con el codigo HTML crudo. NO incluyas markdown, no incluyas bloques de codigo como ```html, simplemente empieza con <!DOCTYPE html> y termina con </html>. No des explicaciones.'

const VISION_MODELS = [
  'llama-3.2-11b-vision-preview',
  'llama-3.2-90b-vision-preview',
]

async function callGroqDirect(model, systemPrompt, messages, apiKey) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    let parsedError = errText
    try {
      const errJson = JSON.parse(errText)
      parsedError = errJson.error?.message || errText
    } catch {}
    throw new Error(parsedError)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export default async function handler(req, res) {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Ya has utilizado tu prueba gratuita de generacion web con IA.' })
  }

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    requestLog.delete(ip)
    return res.status(500).json({ error: 'Se necesita GROQ_API_KEY para generar codigo desde imagenes.' })
  }

  const body = req.body || {}
  const { imageBase64, mimeType } = body

  if (!imageBase64 || !mimeType) {
    requestLog.delete(ip)
    return res.status(400).json({ error: 'Image is required.' })
  }

  const dataUrl = `data:${mimeType};base64,${imageBase64}`
  let lastError = null

  for (const tryModel of VISION_MODELS) {
    try {
      const reply = await callGroqDirect(tryModel, SYSTEM_PROMPT, [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Genera el codigo HTML + Tailwind para este diseno.' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ], groqKey)

      let code = reply.trim()
      if (code.startsWith('```html')) code = code.slice(7)
      else if (code.startsWith('```')) code = code.slice(3)
      if (code.endsWith('```')) code = code.slice(0, -3)
      code = code.trim()

      if (!code) {
        lastError = `Model ${tryModel} returned empty.`
        continue
      }

      return res.status(200).json({ code })
    } catch (err) {
      lastError = err.message || `Unknown error with ${tryModel}`
    }
  }

  requestLog.delete(ip)
  const friendlyMessage = lastError?.includes('not found')
    ? 'El modelo de vision no esta disponible.'
    : lastError?.includes('rate_limit')
      ? 'Limite de solicitudes alcanzado. Intenta en unos minutos.'
      : lastError?.includes('API key')
        ? 'La API key de Groq no es valida.'
        : lastError || 'Todos los modelos fallaron.'
  return res.status(500).json({ error: friendlyMessage })
}
