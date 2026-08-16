import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, ADMIN_EMAIL } from '../lib/email/send.js'
import { contactNotification, contactAutoReply } from '../lib/email/templates.js'

import { detectLanguage } from './contact.js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

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
    keywords: ['hola', 'buenas', 'hey', 'saludos', 'hello', 'hi'],
    response:
      '¡Hola! / Hello! Soy el asistente de ExeSistemasWEB. Te ayudo a automatizar las operaciones de tu negocio con software y sistemas web a medida.',
  },
  {
    keywords: [
      'precio',
      'costo',
      'cuanto',
      'valor',
      'presupuesto',
      'pricing',
      'price',
      'quote',
      'cost',
    ],
    response:
      'Desarrollamos sistemas web a medida (reservas, turnos, dashboards, saas). Tu consulta genera un ticket de atención prioritaria [EXE-CHT-INFO]. ¿Querés solicitar una cotización personalizada?',
  },
  {
    keywords: ['contacto', 'whatsapp', 'hablar', 'contact', 'support'],
    response:
      'Podés hablar directamente por WhatsApp al +54 9 341 6874786 o dejarnos tu email aquí en el chat para recibir una propuesta en menos de 2 horas.',
  },
]

function getDevFallbackResponse(message) {
  const lowerMsg = message.toLowerCase()
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) return item.response
  }
  return `Entiendo que preguntaste sobre: "${message}". Te asignamos atención rápida vía WhatsApp al +54 9 341 6874786 o por email.`
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

const SYSTEM_PROMPT = `
Eres el Copilot e Asistente Inteligente Oficial de ExeSistemasWEB / ExePaginasWeb (estudio premium de desarrollo de software y aplicaciones web a medida).

REGLAS DE TONO, EMPATÍA Y COMPORTAMIENTO:
1. EMPATÍA Y CALIDEZ HUMANA:
   - Responde siempre con entusiasmo, calidez y empatía ("¡Excelente idea!", "¡Nos encanta desarrollar ese tipo de soluciones!", "Por supuesto, es un proyecto genial..."). Muestra interés genuino en el negocio del usuario y valida sus ideas.
   - NUNCA des respuestas secas, robóticas o automáticas. Háblale de forma cercana y profesional.

2. CASOS DE USO Y RUBROS (ABOGADOS, PÁDEL, SALUD, SAAS, E-COMMERCE):
   - Abogados / Estudios Jurídicos: Desarrollamos portales web institucionales premium para abogados, agendamiento de consultas legales, recepción segura de casos y notificaciones automáticas.
   - Canchas de Pádel / Complejos Deportivos: Plataformas de reserva en tiempo real con elección de cancha, horario, cobro de seña online y notificaciones por WhatsApp.
   - Clínicas y Salud: Sistemas de turnos médicos, fichas de pacientes y recordatorios por email/SMS/WhatsApp.
   - Webs y Landing Pages Premium: Diseño exclusivo UI/UX a medida para cualquier industria (arquitectura, inmobiliarias, gastronomía, comercios).
   - Dashboards & SaaS: Paneles administrativos a medida, métricas en tiempo real, control de usuarios y facturación.

3. EXCLUSIVIDAD DE ÁMBITO:
   - Responde únicamente consultas relacionadas con desarrollo web, software a medida, cotizaciones e integraciones de ExeSistemasWEB.
   - Si el usuario pregunta cosas ajenas (recetas, noticias, deportes de TV), declina con amabilidad y calidez: "Como asistente de ExeSistemasWEB, me enfoco en ayudarte a impulsar tu negocio con software web a medida. ¿Te gustaría cotizar un sistema para tu proyecto?"

4. ASIGNACIÓN DE TICKETS Y PEDIDO DE CORREO:
   - Si el usuario no dejó su email, pídeselo con entusiasmo: "Para enviarte la propuesta personalizada y dar seguimiento al Ticket [EXE-CHT-XXXXX], ¿nos dejas tu email por aquí o prefieres consultarnos por WhatsApp?"
   - Si el usuario dejó su email, confírmale: "¡Genial! Registramos tu Ticket [EXE-CHT-XXXXX] y te enviamos la confirmación instantánea a tu correo. Un especialista te responderá en menos de 2 horas."
`

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
    console.error('[chat] Error de validación:', validation.error.format())
    return res
      .status(400)
      .json({ error: 'Datos de mensaje inválidos.', details: validation.error.format() })
  }

  const { message: userMessage, history: rawHistory } = validation.data
  const history = rawHistory || []

  // Capturar si el usuario escribió un email en el mensaje del chat
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const emailMatch = userMessage.match(emailRegex)
  if (emailMatch && emailMatch[0]) {
    const capturedEmail = emailMatch[0]
    const detectedLang = detectLanguage(userMessage, '')
    const ticketId = `EXE-CHT-${Date.now().toString(36).toUpperCase().slice(-5)}`
    console.log(
      `[chat] 📧 Email capturado en chat: ${capturedEmail} (Ticket: ${ticketId}, Lang: ${detectedLang})`
    )

    if (process.env.RESEND_API_KEY) {
      Promise.allSettled([
        sendEmail({
          to: [ADMIN_EMAIL],
          subject: `[${ticketId}] Consulta desde Chat WEB (${capturedEmail})`,
          html: contactNotification({
            name: 'Visitante Chat',
            email: capturedEmail,
            message: userMessage,
            ticketId,
          }),
          replyTo: capturedEmail,
        }),
        sendEmail({
          to: [capturedEmail],
          subject:
            detectedLang === 'en'
              ? `✨ We received your inquiry [Ticket: ${ticketId}] - ExeSistemasWEB`
              : `✨ Recibimos tu consulta del Chat [Ticket: ${ticketId}] - ExeSistemasWEB`,
          html: contactAutoReply({
            name: capturedEmail.split('@')[0],
            message: userMessage,
            ticketId,
            lang: detectedLang,
          }),
        }),
      ]).catch((err) => console.error('[chat] Error enviando emails automáticos desde chat:', err))
    }

    if (supabase) {
      supabase
        .from('leads')
        .insert({ email: capturedEmail, lead_type: 'chat', message: userMessage })
        .then(() => {})
    }
  }

  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  if (geminiKey) {
    try {
      const contents = [
        ...history.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ]

      const geminiResp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 400,
            },
          }),
        }
      )

      if (geminiResp.ok) {
        const geminiData = await geminiResp.json()
        const replyText =
          geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
          getDevFallbackResponse(userMessage)

        return res.status(200).json({ reply: replyText, provider: 'gemini' })
      } else {
        const errText = await geminiResp.text()
        console.error('[chat] Gemini API error:', geminiResp.status, errText)
      }
    } catch (err) {
      console.error('[chat] Gemini error:', err.message)
    }
  }

  if (!groqKey) {
    console.log('[chat] ni GEMINI_API_KEY ni GROQ_API_KEY configuradas, usando fallback local')
    const fallbackReply = getDevFallbackResponse(userMessage)
    return res.status(200).json({ reply: fallbackReply, fallback: true })
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const abortController = new AbortController()
  if (typeof res.on === 'function') {
    res.on('close', () => abortController.abort())
  }

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
