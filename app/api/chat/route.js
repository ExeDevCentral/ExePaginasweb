function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
}
function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
}

import { z } from 'zod'
import {
  streamText,
  createUIMessageStream,
  createUIMessageStreamResponse,
  toUIMessageStream,
  convertToModelMessages,
  generateId,
} from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { isSupabaseAdminConfigured, supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { sendEmail, syncContactToAudience, ADMIN_EMAIL } from '../../../lib/email/send.js'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import { contactNotification, contactAutoReply } from '@/lib/email/templates.js'
import { detectLanguage } from '@/lib/server/language'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { validateContentLength, validateFetchMetadata } from '@/lib/server/requestSecurity'
import { AiService } from '@/core/ai/aiService'
import { SupabaseAiAuditRepository } from '@/core/infra/ai/SupabaseAiAuditRepository'
import { SupabaseAiContextProvider } from '@/core/infra/ai/SupabaseAiContextProvider'
import { buildExecutableTools } from '@/core/infra/ai/buildExecutableTools'
import { resolveAiUserContext } from '@/core/infra/ai/resolveAiUserContext'

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
  visitorName: z.string().max(100).nullish(),
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

function getDevFallbackResponse(message, visitorName) {
  const lowerMsg = message.toLowerCase()
  const greeting = visitorName ? `¡Hola ${visitorName}! ` : '¡Hola! '
  for (const item of DEV_FALLBACK_RESPONSES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) {
      return item.keywords.some((kw) =>
        ['hola', 'buenas', 'hey', 'saludos', 'hello', 'hi'].includes(kw)
      )
        ? `${greeting}Soy el asistente de ExeSistemasWEB. Te ayudo a automatizar las operaciones de tu negocio con software y sistemas web a medida.`
        : item.response
    }
  }
  return `${greeting}Entiendo que preguntaste sobre: "${message}". Te asignamos atención rápida vía WhatsApp al +54 9 341 6874786 o por email.`
}

function getLastUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (_optionalChain([m, 'optionalAccess', (_) => _.role]) !== 'user') continue
    if (typeof m.content === 'string' && m.content) return m.content
    if (Array.isArray(m.parts)) {
      const text = m.parts
        .filter(
          (p) =>
            _optionalChain([p, 'optionalAccess', (_2) => _2.type]) === 'text' &&
            typeof p.text === 'string'
        )
        .map((p) => p.text)
        .join('')
      if (text) return text
    }
  }
  return ''
}

function streamLocalFallback(text) {
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

async function pickFirstProvider(factories, tools) {
  for (const factory of factories) {
    try {
      const result = factory.make()
      const uiStream = toUIMessageStream({
        stream: result.stream,
        tools: tools,
      })
      const reader = uiStream.getReader()

      let startChunk = null
      let firstChunk = null
      let failedWithError = false
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[chat] ${factory.name} falló, cascada al siguiente proveedor:`, msg)
    }
  }
  return null
}

function buildStreamingResponse(winner) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const { reader } = winner
      if (winner.startChunk) writer.write(winner.startChunk)
      let chunk = winner.firstChunk
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

export async function POST(req) {
  const fetchMeta = validateFetchMetadata(req)
  if (!fetchMeta.allowed && fetchMeta.errorResponse) {
    return fetchMeta.errorResponse
  }

  const lengthCheck = validateContentLength(req, 100 * 1024)
  if (!lengthCheck.allowed && lengthCheck.errorResponse) {
    return lengthCheck.errorResponse
  }

  const startedAt = performance.now()

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

  let body = null
  try {
    body = await req.json()
  } catch (e) {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const validation = ChatRequestBodySchema.safeParse(body)
  if (!validation.success) {
    return Response.json(
      { error: 'Datos de mensaje inválidos.', details: validation.error.flatten() },
      { status: 400 }
    )
  }

  const messages = validation.data.messages
  const userMessage = getLastUserText(messages)
  const conversationId = _nullishCoalesce(validation.data.id, () => null)
  const visitorName =
    _optionalChain([
      validation,
      'access',
      (_3) => _3.data,
      'access',
      (_4) => _4.visitorName,
      'optionalAccess',
      (_5) => _5.trim,
      'call',
      (_6) => _6(),
    ]) || null

  const userContext = await resolveAiUserContext(req)
  const auditRepo = new SupabaseAiAuditRepository()
  const contextProvider = new SupabaseAiContextProvider()
  const aiService = new AiService({ audit: auditRepo, context: contextProvider })

  let preparedRun
  try {
    preparedRun = await aiService.prepareRun({ userContext, conversationId })
  } catch (usageError) {
    const msg = usageError instanceof Error ? usageError.message : 'Límite de uso alcanzado.'
    return Response.json({ error: msg }, { status: 429 })
  }

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
      // Sincronizar lead capturado desde el chat con la audiencia de Resend
      void syncContactToAudience({
        email: capturedEmail,
        firstName: capturedEmail.split('@')[0],
      }).catch((err) => {
        console.warn('[chat] No se pudo sincronizar lead con Resend Audience:', err)
      })

      // Despachar evento a n8n en segundo plano si N8N_WEBHOOK_URL está configurado
      void dispatchN8nEvent({
        event: 'lead.chat',
        ticketId,
        name: visitorName || capturedEmail.split('@')[0],
        email: capturedEmail,
        message: userMessage,
        lang: detectedLang,
        metadata: {
          conversationId,
          visitorName,
        },
      })

      const emailResults = await Promise.allSettled([
        sendEmail({
          to: [ADMIN_EMAIL],
          subject: `[${ticketId}] Consulta desde Chat WEB (${capturedEmail})`,
          html: contactNotification({
            name: visitorName || 'Visitante Chat',
            email: capturedEmail,
            message: userMessage,
            ticketId,
          }),
          replyTo: capturedEmail,
          tags: [
            { name: 'category', value: 'chat_lead_admin' },
            { name: 'ticket_id', value: ticketId },
          ],
        }),
        sendEmail({
          to: [capturedEmail],
          subject:
            detectedLang === 'en'
              ? `✨ We received your inquiry [Ticket: ${ticketId}] - ExeSistemasWEB`
              : `✨ Recibimos tu consulta del Chat [Ticket: ${ticketId}] - ExeSistemasWEB`,
          html: contactAutoReply({
            name: visitorName || capturedEmail.split('@')[0],
            message: userMessage,
            ticketId,
            lang: detectedLang,
          }),
          tags: [
            { name: 'category', value: 'chat_lead_client' },
            { name: 'ticket_id', value: ticketId },
            { name: 'lang', value: detectedLang },
          ],
        }),
      ])
      if (emailResults.some((result) => result.status === 'rejected')) {
        console.error('[chat] Error enviando emails desde chat:', emailResults)
      }
    }

    if (isSupabaseAdminConfigured()) {
      const { error: leadError } = await supabase.from('leads').insert({
        email: capturedEmail,
        lead_type: 'chat',
        message: userMessage,
        name: visitorName || undefined,
      })
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
  let modelMessages
  try {
    modelMessages = await convertToModelMessages(messages)
  } catch (e2) {
    return Response.json({ error: 'Estructura de mensajes inválida.' }, { status: 400 })
  }

  const activeRunId = await aiService
    .createRunRecord(preparedRun, {
      model: 'pending',
      provider: 'pending',
      status: 'failed',
    })
    .then((created) => created.runId)
    .catch((recordError) => {
      console.warn('[chat] No se pudo crear el registro de run de IA:', recordError)
      return preparedRun.runId
    })

  const tools = buildExecutableTools({
    userContext,
    audit: auditRepo,
    runId: activeRunId,
    conversationId,
  })

  const commonSettings = {
    system: visitorName
      ? `${preparedRun.systemPrompt}\n\nNombre del usuario/visitante conectado: "${visitorName}". Salúdalo o dirígete a él de manera personalizada.`
      : preparedRun.systemPrompt,
    messages: modelMessages,
    temperature: 0.6,
    maxTokens: 450,
    tools: tools,
  }

  // Cadena de proveedores en orden de prioridad. `streamText` no lanza al
  // construir la respuesta: la petición real ocurre al consumir el stream.
  // Por eso seleccionamos el proveedor leyendo el PRIMER chunk del stream
  // (await real del upstream): si el proveedor responde 402/429, sin crédito o
  // rechaza la petición, el error aparece antes de emitir texto y cascamos al
  // siguiente proveedor sin entregar una respuesta fallida al cliente.
  const aiProviderChain = []
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

  const finalizeRun = (opts) => {
    const latencyMs = Math.round(performance.now() - startedAt)
    aiService
      .completeRun(activeRunId, {
        status: _nullishCoalesce(opts.status, () => 'completed'),
        latencyMs,
        inputTokens: _nullishCoalesce(opts.inputTokens, () => 0),
        outputTokens: _nullishCoalesce(opts.outputTokens, () => 0),
        model: opts.model,
        error: _nullishCoalesce(opts.error, () => null),
      })
      .catch((recordError) => {
        console.warn('[chat] No se pudo registrar el run de IA:', recordError)
      })
  }

  if (aiProviderChain.length > 0) {
    const factories = aiProviderChain
    const winner = await pickFirstProvider(factories, tools)
    if (winner) {
      finalizeRun({
        model: winner.name === 'gemini' ? 'gemini-2.5-flash' : 'openai/gpt-4o-mini',
        provider: winner.name,
      })
      return buildStreamingResponse(winner)
    }
    console.warn('[chat] Todos los proveedores de IA fallaron; usando el motor local')
  }

  // --- Motor Local Inteligente Exe (100% Sin Costo / Offline Safe) ---
  const fallbackReply =
    getDevFallbackResponse(userMessage || 'hola', visitorName) || FALLBACK_FALLBACK
  finalizeRun({ model: 'local-fallback', provider: 'local' })
  return streamLocalFallback(fallbackReply)
}
