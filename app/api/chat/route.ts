/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
  toUIMessageStream,
  convertToModelMessages,
  generateId,
  zodSchema,
  type UIMessage,
  type UIMessageChunk,
  type TextStreamPart,
} from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { isSupabaseAdminConfigured, supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import { contactNotification, contactAutoReply } from '@/lib/email/templates.js'
import { detectLanguage } from '../contact/route'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'

const ChatMessageSchema = z
  .object({
    id: z.string().min(1, { message: 'id requerido' }),
    role: z.string().min(1, { message: 'rol requerido' }),
    content: z.string().optional(),
    parts: z.array(z.object({ type: z.string().min(1) }).passthrough()).optional(),
  })
  .refine((msg) => msg.content !== undefined || msg.parts !== undefined, {
    message: 'cada mensaje debe incluir content o parts',
  })

const ChatRequestBodySchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(30),
  id: z.string().nullish(),
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

const FALLBACK_FALLBACK =
  '¡Entendido! Soy el asistente de ExeSistemasWEB. Para asesorarte mejor, anotá tu email en el chat o escribinos por WhatsApp al +54 9 341 6874786.'

function getDevFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase()
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) return item.response
  }
  return `Entiendo que preguntaste sobre: "${message}". Te asignamos atención rápida vía WhatsApp al +54 9 341 6874786 o por email.`
}

function getLastUserText(
  messages: Array<{ role?: string; content?: unknown; parts?: unknown }>
): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m?.role !== 'user') continue
    if (typeof m.content === 'string' && m.content) return m.content
    if (Array.isArray(m.parts)) {
      const text = m.parts
        .filter(
          (p: { type?: string; text?: string }) => p?.type === 'text' && typeof p.text === 'string'
        )
        .map((p: { text?: string }) => p.text)
        .join('')
      if (text) return text
    }
  }
  return ''
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

4. SEGUIMIENTO DE SOLICITUDES Y PEDIDO DE CORREO:
   - Cuando el visitante quiera cotizar, pedir una propuesta o presupuesto, nombrar un proyecto o tipo de sistema, dejar su email o hablar con un humano, OBLIGATORIAMENTE llamá a la herramienta "createTicket".
   - Usá el identificador devuelto por la herramienta en tu respuesta con el formato [EXE-CHT-XXXXX].
   - Si el usuario no dejó su email, pídeselo con entusiasmo: "Para enviarte la propuesta personalizada y dar seguimiento a la solicitud [EXE-CHT-XXXXX], ¿nos dejas tu email por aquí o prefieres consultarnos por WhatsApp?"
   - Si el usuario dejó su email, confírmale: "¡Genial! Recibimos tu solicitud y generamos el identificador [EXE-CHT-XXXXX]. Nuestro equipo revisará tu consulta."
`

const createTicketTool = {
  description:
    'Genera un identificador único de seguimiento de la solicitud (formato EXE-CHT-XXXXX) y la registra. Llamá SOLO cuando el visitante quiera cotizar, pedir una propuesta/presupuesto, nombrar un proyecto o tipo de sistema, dejar su email, o quiera hablar con un humano.',
  inputSchema: zodSchema(
    z.object({
      contactEmail: z
        .string()
        .email()
        .nullish()
        .describe('Email del visitante si lo escribió en el chat'),
      projectType: z
        .string()
        .nullish()
        .describe(
          'Tipo de proyecto: turnos/reservas, saas/dashboard, web/landing, ecommerce, salud, jurídico, deportivo/pádel'
        ),
    })
  ),
  execute: async ({
    contactEmail,
    projectType,
  }: {
    contactEmail?: string | null
    projectType?: string | null
  }) => {
    const ticketId = `EXE-CHT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    if (isSupabaseAdminConfigured()) {
      try {
        const { error: leadError } = await supabase.from('leads').insert({
          email: contactEmail ?? null,
          lead_type: 'chat',
          message: `[${ticketId}] ${projectType ?? 'solicitud sin tipo'} — registrado vía asistente IA`,
        })
        if (leadError) {
          console.error('[chat][createTicket] Error persistiendo la solicitud:', leadError)
        }
      } catch (persistError) {
        console.error('[chat][createTicket] No se pudo guardar la solicitud:', persistError)
      }
    } else {
      console.error(
        '[chat][createTicket] Supabase admin no está configurado; la solicitud no se persiste'
      )
    }

    return {
      ticketId,
      contactEmail: contactEmail ?? null,
      projectType: projectType ?? null,
    }
  },
}

function streamLocalFallback(text: string): Response {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = generateId()
      writer.write({ type: 'text-start', id })
      writer.write({ type: 'text-delta', id, delta: text })
      writer.write({ type: 'text-end', id })
      writer.write({ type: 'finish', finishReason: 'stop' })
    },
  })
  return createUIMessageStreamResponse({
    headers: { 'Cache-Control': 'no-cache, no-transform' },
    stream,
  })
}

type ChatTools = { createTicket: typeof createTicketTool }

type ProviderFactory = {
  name: string
  // El retorno real es StreamTextResult<ChatTools>; usamos una forma estructural
  // mínima para poder iterar la cadena sin fricción de genéricos.
  make: () => { stream: unknown }
}

type Winner = {
  name: string
  reader: ReadableStreamDefaultReader<UIMessageChunk>
  startChunk: UIMessageChunk | null
  firstChunk: UIMessageChunk
}

async function pickFirstProvider(factories: ProviderFactory[]): Promise<Winner | null> {
  for (const factory of factories) {
    try {
      const result = factory.make()
      const uiStream = toUIMessageStream({
        stream: result.stream as ReadableStream<TextStreamPart<ChatTools>>,
        tools: { createTicket: createTicketTool },
      })
      const reader = uiStream.getReader()

      // `toUIMessageStream` emite un chunk `start` local (sin red). El primer
      // chunk CON RED es el que valida que el proveedor aceptó la petición.
      // Un 402/429, falta de créditos o rechazo llega como chunk de tipo
      // `error` (no como excepción): lo tratamos como fallo del proveedor.
      let startChunk: UIMessageChunk | null = null
      let firstChunk: UIMessageChunk | null = null
      let failedWithError: boolean = false
      while (firstChunk === null && !failedWithError) {
        const { value, done } = await reader.read()
        if (done) break
        if (value.type === 'start') {
          startChunk = value
          continue
        }
        if (value.type === 'error') {
          failedWithError = true
          continue
        }
        firstChunk = value
      }

      if (!firstChunk) {
        reader.releaseLock()
        continue
      }
      return { name: factory.name, reader, startChunk, firstChunk }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[chat] ${factory.name} falló, cascada al siguiente proveedor:`, msg)
    }
  }
  return null
}

function buildStreamingResponse(winner: Winner): Response {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const { reader } = winner
      if (winner.startChunk) writer.write(winner.startChunk)
      let chunk: UIMessageChunk | undefined = winner.firstChunk
      while (chunk) {
        writer.write(chunk)
        const { value, done } = await reader.read()
        if (done) break
        chunk = value
      }
    },
  })
  return createUIMessageStreamResponse({
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'X-AI-Provider': winner.name,
    },
    stream,
  })
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(`chat:${clientIp(req)}`, 60, 10)
    if (!limit.allowed) {
      return Response.json(
        { error: 'Demasiadas solicitudes. Intente de nuevo en un minuto.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[chat] Rate limiter unavailable:', rateLimitError)
    return Response.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const validation = ChatRequestBodySchema.safeParse(body)
  if (!validation.success) {
    return Response.json(
      { error: 'Datos de mensaje inválidos.', details: validation.error.flatten() },
      { status: 400 }
    )
  }

  const messages = validation.data.messages as UIMessage[]
  const userMessage = getLastUserText(messages)

  // Capturar email si el usuario lo escribió en el chat (lógica determinística, antes del streaming)
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
      const emailResults = await Promise.allSettled([
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
      ])
      if (emailResults.some((result) => result.status === 'rejected')) {
        console.error('[chat] Error enviando emails desde chat:', emailResults)
      }
    }

    if (isSupabaseAdminConfigured()) {
      const { error: leadError } = await supabase
        .from('leads')
        .insert({ email: capturedEmail, lead_type: 'chat', message: userMessage })
      if (leadError) console.error('[chat] Error guardando lead:', leadError)
    } else {
      console.error('[chat] Supabase admin is not configured; lead was not persisted')
    }
  }

  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  // Convierte los mensajes UI a mensajes de modelo. Si la estructura es
  // inválida devolvemos 400 controlado (nunca un 500 no manejado).
  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>
  try {
    modelMessages = await convertToModelMessages(messages)
  } catch {
    return Response.json({ error: 'Estructura de mensajes inválida.' }, { status: 400 })
  }

  const commonSettings = {
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    temperature: 0.6,
    maxTokens: 450,
    tools: { createTicket: createTicketTool },
  }

  // Cadena de proveedores en orden de prioridad. `streamText` no lanza al
  // construir la respuesta: la petición real ocurre al consumir el stream.
  // Por eso seleccionamos el proveedor leyendo el PRIMER chunk del stream
  // (await real del upstream): si el proveedor responde 402/429, sin crédito o
  // rechaza la petición, el error aparece antes de emitir texto y cascamos al
  // siguiente proveedor sin entregar una respuesta fallida al cliente.
  const aiProviderChain: Array<ProviderFactory> = []
  if (aiGatewayKey) {
    aiProviderChain.push({
      name: 'vercel-ai-gateway',
      make: () => {
        const gateway = createOpenAICompatible({
          name: 'vercel-ai-gateway',
          baseURL: 'https://ai-gateway.vercel.sh/v1',
          apiKey: aiGatewayKey,
        })
        return streamText({ ...commonSettings, model: gateway('openai/gpt-4o-mini') })
      },
    })
  }
  if (geminiKey) {
    aiProviderChain.push({
      name: 'gemini',
      make: () => {
        const google = createGoogleGenerativeAI({ apiKey: geminiKey })
        return streamText({ ...commonSettings, model: google('gemini-2.5-flash') })
      },
    })
  }
  if (groqKey) {
    aiProviderChain.push({
      name: 'groq',
      make: () => {
        const groq = createGroq({ apiKey: groqKey })
        return streamText({ ...commonSettings, model: groq('llama-3.3-70b-versatile') })
      },
    })
  }

  if (aiProviderChain.length > 0) {
    const winner = await pickFirstProvider(aiProviderChain)
    if (winner) return buildStreamingResponse(winner)
    console.warn('[chat] Todos los proveedores de IA fallaron; usando el motor local')
  }

  // --- Motor Local Inteligente Exe (100% Sin Costo / Offline Safe) ---
  const fallbackReply = getDevFallbackResponse(userMessage || 'hola') || FALLBACK_FALLBACK
  return streamLocalFallback(fallbackReply)
}
