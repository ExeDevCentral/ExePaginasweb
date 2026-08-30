import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import { contactNotification, contactAutoReply } from '@/lib/email/templates.js'
import { detectLanguage } from '../contact/route'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10

const requestLog = new Map<string, number[]>()

const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1500),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(20)
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

function getDevFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase()
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) return item.response
  }
  return `Entiendo que preguntaste sobre: "${message}". Te asignamos atención rápida vía WhatsApp al +54 9 341 6874786 o por email.`
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.' },
      { status: 429 }
    )
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const validation = ChatRequestSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Datos de mensaje inválidos.', details: validation.error.flatten() },
      { status: 400 }
    )
  }

  const { message: userMessage, history: rawHistory } = validation.data
  const history = rawHistory || []

  // Capturar email si el usuario lo escribió en el chat
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
      ]).catch((err) => console.error('[chat] Error enviando emails desde chat:', err))
    }

    if (supabase) {
      supabase
        .from('leads')
        .insert({ email: capturedEmail, lead_type: 'chat', message: userMessage })
        .then(() => {})
    }
  }

  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  // --- TIER 1: Vercel AI Gateway (Universal Router: OpenAI, Claude, Llama) ---
  if (aiGatewayKey) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ]

      const gatewayResp = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${aiGatewayKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages,
          temperature: 0.6,
          max_tokens: 450,
        }),
      })

      if (gatewayResp.ok) {
        const gatewayData = await gatewayResp.json()
        const replyText = gatewayData.choices?.[0]?.message?.content
        if (replyText) {
          return NextResponse.json({ reply: replyText, provider: 'vercel-ai-gateway' })
        }
      } else {
        console.warn(
          `[chat] Vercel AI Gateway returned status ${gatewayResp.status} (credits/quota). Falling back to Tier 2...`
        )
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown gateway error'
      console.warn('[chat] Vercel AI Gateway request failed, cascading to fallback:', msg)
    }
  }

  // --- TIER 2: Google Gemini (Free / Direct) ---
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

        return NextResponse.json({ reply: replyText, provider: 'gemini' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown Gemini error'
      console.warn('[chat] Gemini error, cascading to next tier:', msg)
    }
  }

  // --- TIER 3: Groq Cloud (Free Llama 3.3 70B) ---
  if (groqKey) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ]

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
        }),
      })

      if (groqResp.ok) {
        const groqData = await groqResp.json()
        const replyText =
          groqData.choices?.[0]?.message?.content || getDevFallbackResponse(userMessage)
        return NextResponse.json({ reply: replyText, provider: 'groq' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown Groq error'
      console.warn('[chat] Groq error, cascading to local engine:', msg)
    }
  }

  // --- TIER 4: Motor Local Inteligente Exe (100% Sin Costo / Offline Safe) ---
  const fallbackReply = getDevFallbackResponse(userMessage)
  return NextResponse.json({ reply: fallbackReply, fallback: true, provider: 'local-knowledge' })
}
