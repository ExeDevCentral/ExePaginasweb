import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'svix'

// Mock Supabase y sendEmail
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}))

vi.mock('../../../lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_audit_999' }),
  ADMIN_EMAIL: 'Exemetal@hotmail.com',
}))

function createMockReqRes({ method = 'POST', headers = {}, body = '' }) {
  const req = {
    method,
    headers,
    body,
    rawBody: typeof body === 'string' ? body : JSON.stringify(body),
    on: vi.fn((event, callback) => {
      if (event === 'data') {
        callback(Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)))
      }
      if (event === 'end') {
        callback()
      }
    }),
  }

  const res = {
    statusCode: 200,
    headers: {},
    setHeader: vi.fn((key, value) => {
      res.headers[key] = value
    }),
    status: vi.fn((code) => {
      res.statusCode = code
      return res
    }),
    json: vi.fn((data) => {
      res.jsonData = data
      return res
    }),
    write: vi.fn(),
    end: vi.fn(),
  }

  return { req, res }
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
      const chatHandler = (await import('../../../api/chat.js')).default
      const { req, res } = createMockReqRes({ method: 'POST', body: {} })
      await chatHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.jsonData.error).toContain('inválidos')
    })

    it('debe capturar emails en el chat, generar Ticket EXE-CHT y enviar correo de confirmación', async () => {
      const chatHandler = (await import('../../../api/chat.js')).default
      const { sendEmail } = await import('../../../lib/email/send.js')
      const { req, res } = createMockReqRes({
        method: 'POST',
        body: { message: 'Hola! Mi email es audit.test@example.com y necesito presupuesto' },
      })

      await chatHandler(req, res)
      expect(sendEmail).toHaveBeenCalled()
    })
  })

  // 2. AUDITORÍA DE LINKS DE WHATSAPP Y FORMATO DE TELÉFONO
  describe('2. Auditoría de Enlaces e Integración con WhatsApp', () => {
    it('debe contener el número de teléfono oficial +54 9 341 6874786 formateado y codificado', async () => {
      const { contactAutoReply } = await import('../../../lib/email/templates.js')
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
      const webhookHandler = (await import('../../../api/webhooks/resend.js')).default
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

        const { req, res } = createMockReqRes({
          method: 'POST',
          headers: {
            'svix-id': svixId,
            'svix-timestamp': `${Math.floor(timestamp.getTime() / 1000)}`,
            'svix-signature': signature,
          },
          body: payloadString,
        })

        await webhookHandler(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.jsonData.received).toBe(true)
      }
    })
  })

  // 4. AUDITORÍA DE FORMULARIO DE CONTACTO Y DETECCION DE IDIOMA
  describe('4. Auditoría del Formulario de Contacto (/api/contact)', () => {
    it('debe generar Ticket ID EXE-CNT y responder en Español cuando la consulta es en español', async () => {
      const contactHandler = (await import('../../../api/contact.js')).default
      const { req, res } = createMockReqRes({
        method: 'POST',
        body: {
          name: 'Juan Perez',
          email: 'juan@example.com',
          message: 'Quiero cotizar un sistema de turnos',
        },
      })

      await contactHandler(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.jsonData.ok).toBe(true)
      expect(res.jsonData.ticketId).toMatch(/^EXE-CNT-/)
      expect(res.jsonData.lang).toBe('es')
    })

    it('debe responder en Inglés cuando la consulta es en inglés', async () => {
      const contactHandler = (await import('../../../api/contact.js')).default
      const { req, res } = createMockReqRes({
        method: 'POST',
        body: {
          name: 'John Smith',
          email: 'john@example.com',
          message: 'Hello! I need a custom web platform quote',
        },
      })

      await contactHandler(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.jsonData.ok).toBe(true)
      expect(res.jsonData.ticketId).toMatch(/^EXE-CNT-/)
      expect(res.jsonData.lang).toBe('en')
    })
  })
})
