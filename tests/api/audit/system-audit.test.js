import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'svix'
import { NextRequest } from 'next/server'
import { POST as chatHandler } from '../../../app/api/chat/route'
import { POST as webhookHandler } from '../../../app/api/webhooks/resend/route'
import { POST as contactHandler } from '../../../app/api/contact/route'
import { contactAutoReply } from '../../../lib/email/templates.js'
import { sendEmail } from '../../../lib/email/send.js'

// Mock Supabase y sendEmail
const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ data: null, error: null }) })),
      })),
    })),
  },
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseInstance,
}))

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: mockSupabaseInstance,
  isSupabaseAdminConfigured: () => true,
}))

vi.mock('../../../lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_audit_999' }),
  ADMIN_EMAIL: 'Exemetal@hotmail.com',
}))

vi.mock('@/lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_audit_999' }),
  ADMIN_EMAIL: 'Exemetal@hotmail.com',
}))

vi.mock('@/lib/email/send', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_audit_999' }),
  ADMIN_EMAIL: 'Exemetal@hotmail.com',
}))

async function callRoute(handler, url, body, headers = {}) {
  const req = new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body ?? {}),
  })
  const res = await handler(req)
  let json = {}
  try {
    json = await res.json()
  } catch {
    // ignore non-json
  }
  return { status: res.status, json }
}

function buildChatMessages(...texts) {
  return texts.map((text, index) => ({
    id: `audit-msg-${index}`,
    role: 'user',
    parts: [{ type: 'text', text }],
  }))
}

function mockOpenAISSE(text) {
  const encoder = new TextEncoder()
  const chunks = [
    {
      id: 'chatcmpl-audit',
      object: 'chat.completion.chunk',
      created: 1,
      model: 'gpt-4o-mini',
      choices: [{ index: 0, delta: { role: 'assistant', content: '' }, finish_reason: null }],
    },
    {
      id: 'chatcmpl-audit',
      object: 'chat.completion.chunk',
      created: 1,
      model: 'gpt-4o-mini',
      choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
    },
    {
      id: 'chatcmpl-audit',
      object: 'chat.completion.chunk',
      created: 1,
      model: 'gpt-4o-mini',
      choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
    },
  ]
  const body = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/event-stream' }),
    body,
    json: async () => ({ choices: [{ message: { content: text } }] }),
  }
}

async function callChat(handler, messages) {
  const res = await handler(
    new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
  )
  const raw = await res.text()
  let reply = ''
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) continue
    const payload = trimmed.replace(/^data:\s*/, '')
    try {
      const chunk = JSON.parse(payload)
      if (chunk.type === 'text-delta' && typeof chunk.delta === 'string') reply += chunk.delta
    } catch {
      // ignora líneas auxiliares del stream
    }
  }
  return { status: res.status, provider: res.headers.get('X-AI-Provider'), reply }
}

describe('🔍 AUDITORÍA COMPLETA DEL SISTEMA: Chatbot, WhatsApp, Webhooks & Links', () => {
  const TEST_SECRET = 'whsec_MfValidSecretForTesting123='

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET
    process.env.RESEND_API_KEY = 're_test_audit_key_123'
    process.env.GROQ_API_KEY = 'gsk_test_audit_key_123'
    vi.clearAllMocks()
  })

  // 1. AUDITORÍA DE CHATBOT (/api/chat)
  describe('1. Auditoría de Chatbot e Inteligencia Artificial (/api/chat)', () => {
    it('debe rechazar solicitudes con esquema inválido (400)', async () => {
      const { status, json } = await callRoute(chatHandler, 'http://localhost:3000/api/chat', {})

      expect(status).toBe(400)
      expect(json.error).toContain('inválidos')
    })

    it('debe responder vía Vercel AI Gateway cuando AI_GATEWAY_API_KEY está configurada', async () => {
      const originalFetch = globalThis.fetch
      globalThis.fetch = vi.fn().mockImplementation((url) => {
        if (typeof url === 'string' && url.includes('ai-gateway.vercel.sh')) {
          return Promise.resolve(mockOpenAISSE('¡Hola! Respuesta desde Vercel AI Gateway.'))
        }
        return originalFetch(url)
      })

      process.env.AI_GATEWAY_API_KEY = 'vck_test_gateway_key'
      delete process.env.GROQ_API_KEY
      const result = await callChat(
        chatHandler,
        buildChatMessages('¿Cuánto cuesta una web institucional?')
      )

      globalThis.fetch = originalFetch
      delete process.env.AI_GATEWAY_API_KEY
      expect(result.status).toBe(200)
      expect(result.provider).toBe('vercel-ai-gateway')
      expect(result.reply).toContain('Vercel AI Gateway')
    })

    it('debe usar Groq Cloud cuando solo está configurada la clave de Groq', async () => {
      const originalFetch = globalThis.fetch
      globalThis.fetch = vi.fn().mockImplementation((url) => {
        if (typeof url === 'string' && url.includes('api.groq.com')) {
          return Promise.resolve(mockOpenAISSE('Respuesta fluida desde Groq Cloud Fallback.'))
        }
        return originalFetch(url)
      })

      delete process.env.AI_GATEWAY_API_KEY
      process.env.GROQ_API_KEY = 'gsk_test_groq_key'
      const result = await callChat(
        chatHandler,
        buildChatMessages('Hola, quiero consultar por una tienda online')
      )

      globalThis.fetch = originalFetch
      expect(result.status).toBe(200)
      expect(result.provider).toBe('groq')
      expect(result.reply).toContain('Groq Cloud Fallback')
    })

    it('debe responder con el motor local cuando no hay claves de IA configuradas', async () => {
      delete process.env.AI_GATEWAY_API_KEY
      delete process.env.GROQ_API_KEY
      delete process.env.GEMINI_API_KEY
      const result = await callChat(chatHandler, buildChatMessages('Hola'))

      expect(result.status).toBe(200)
      expect(result.reply).toContain('ExeSistemasWEB')
    })

    it('debe capturar emails en el chat, generar Ticket EXE-CHT y enviar correo de confirmación', async () => {
      delete process.env.AI_GATEWAY_API_KEY
      delete process.env.GROQ_API_KEY
      delete process.env.GEMINI_API_KEY
      const result = await callChat(
        chatHandler,
        buildChatMessages('Hola! Mi email es audit.test@example.com y necesito presupuesto')
      )

      expect(result.status).toBe(200)
      expect(sendEmail).toHaveBeenCalled()
    }, 15000)
  })

  // 2. AUDITORÍA DE LINKS DE WHATSAPP Y FORMATO DE TELÉFONO
  describe('2. Auditoría de Enlaces e Integración con WhatsApp', () => {
    it('debe contener el número de teléfono oficial +54 9 341 6874786 formateado y codificado', () => {
      const htmlEs = contactAutoReply({
        name: 'Audit',
        message: 'Test',
        ticketId: 'EXE-CNT-AUD01',
        lang: 'es',
      })
      const htmlEn = contactAutoReply({
        name: 'Audit',
        message: 'Test',
        ticketId: 'EXE-CNT-AUD01',
        lang: 'en',
      })

      const whatsappRegex = /https:\/\/wa\.me\/5493416874786\?text=/
      expect(htmlEs).toMatch(whatsappRegex)
      expect(htmlEn).toMatch(whatsappRegex)
      expect(htmlEs).toContain('EXE-CNT-AUD01')
      expect(htmlEn).toContain('EXE-CNT-AUD01')
    })
  })

  // 3. AUDITORÍA DE WEBHOOKS DE RESEND
  describe('3. Auditoría de Webhooks de Resend (/api/webhooks/resend)', () => {
    it('debe validar la firma Svix en /api/webhooks/resend y procesar todos los tipos de eventos de Resend', async () => {
      const wh = new Webhook(TEST_SECRET)
      const events = [
        'email.sent',
        'email.delivered',
        'email.bounced',
        'email.complained',
        'email.received',
      ]

      for (const type of events) {
        const payloadString = JSON.stringify({
          type,
          data: { to: 'audit@example.com', from: 'sender@example.com' },
        })
        const svixId = `msg_audit_${type.replace('.', '_')}`
        const timestamp = new Date()
        const signature = wh.sign(svixId, timestamp, payloadString)

        const { status, json } = await callRoute(
          webhookHandler,
          'http://localhost:3000/api/webhooks/resend',
          payloadString,
          {
            'svix-id': svixId,
            'svix-timestamp': `${Math.floor(timestamp.getTime() / 1000)}`,
            'svix-signature': signature,
          }
        )

        expect(status).toBe(200)
        expect(json.received).toBe(true)
      }
    })
  })

  // 4. AUDITORÍA DE FORMULARIO DE CONTACTO Y DETECCION DE IDIOMA
  describe('4. Auditoría del Formulario de Contacto (/api/contact)', () => {
    it('debe generar Ticket ID EXE-CNT y responder en Español cuando la consulta es en español', async () => {
      const { status, json } = await callRoute(
        contactHandler,
        'http://localhost:3000/api/contact',
        {
          name: 'Juan Perez',
          email: 'juan@example.com',
          message: 'Quiero cotizar un sistema de turnos',
        }
      )

      expect(status).toBe(200)
      expect(json.ok).toBe(true)
      expect(json.ticketId).toMatch(/^EXE-CNT-/)
      expect(json.lang).toBe('es')
    })

    it('debe responder en Inglés cuando la consulta es en inglés', async () => {
      const { status, json } = await callRoute(
        contactHandler,
        'http://localhost:3000/api/contact',
        {
          name: 'John Smith',
          email: 'john@example.com',
          message: 'Hello! I need a custom web platform quote',
        }
      )

      expect(status).toBe(200)
      expect(json.ok).toBe(true)
      expect(json.ticketId).toMatch(/^EXE-CNT-/)
      expect(json.lang).toBe('en')
    })
  })
})
