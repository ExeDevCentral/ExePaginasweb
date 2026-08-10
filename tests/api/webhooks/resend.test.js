import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'svix'
import handler from '../../../api/webhooks/resend.js'

// Mock Supabase y sendEmail
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  }),
}))

vi.mock('../../../lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_123' }),
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
  }

  return { req, res }
}

describe('Resend Webhook Handler (api/webhooks/resend.js)', () => {
  const TEST_SECRET = 'whsec_MfValidSecretForTesting123='

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET
    process.env.RESEND_API_KEY = 're_test_key_123'
    vi.clearAllMocks()
  })

  it('debe rechazar métodos que no sean POST con status 405', async () => {
    const { req, res } = createMockReqRes({ method: 'GET' })
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.jsonData).toEqual({ error: 'Method Not Allowed' })
  })

  it('debe rechazar peticiones sin cabeceras Svix con status 400', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      body: JSON.stringify({ type: 'email.sent' }),
    })
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.jsonData).toEqual({ error: 'Missing Svix signature headers' })
  })

  it('debe rechazar firmas Svix inválidas con status 400', async () => {
    const { req, res } = createMockReqRes({
      method: 'POST',
      headers: {
        'svix-id': 'msg_123',
        'svix-timestamp': `${Math.floor(Date.now() / 1000)}`,
        'svix-signature': 'v1,invalid_signature_hash',
      },
      body: JSON.stringify({ type: 'email.sent' }),
    })
    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.jsonData.error).toContain('Webhook signature verification failed')
  })

  const resendEventTypes = [
    { type: 'email.sent', data: { id: 'msg_001', to: 'test@example.com' } },
    { type: 'email.delivered', data: { id: 'msg_002', to: 'test@example.com' } },
    { type: 'email.delivery_delayed', data: { id: 'msg_003', to: 'test@example.com' } },
    {
      type: 'email.bounced',
      data: { id: 'msg_004', to: 'bounced@example.com', bounce_type: 'Permanent' },
    },
    { type: 'email.complained', data: { id: 'msg_005', to: 'spam@example.com' } },
    { type: 'email.opened', data: { id: 'msg_006', to: 'test@example.com' } },
    {
      type: 'email.clicked',
      data: { id: 'msg_007', to: 'test@example.com', click: { link: 'https://exepaginasweb.com' } },
    },
    {
      type: 'email.received',
      data: { from: 'cliente@example.com', subject: 'Consulta de Servicios' },
    },
  ]

  resendEventTypes.forEach(({ type, data }) => {
    it(`debe verificar la firma y procesar con éxito el evento "${type}"`, async () => {
      const wh = new Webhook(TEST_SECRET)
      const payloadString = JSON.stringify({ type, data })
      const svixId = `msg_id_${type.replace('.', '_')}`
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

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.jsonData.received).toBe(true)
      expect(res.jsonData.type).toBe(type)
    })
  })

  it('debe generar correctamente la plantilla HTML de contactAutoReply con Ticket ID', async () => {
    const { contactAutoReply, contactNotification } =
      await import('../../../lib/email/templates.js')

    const htmlReply = contactAutoReply({
      name: 'Carlos Gomez',
      message: 'Necesito una web para mi empresa',
      ticketId: 'EXE-CNT-TEST1',
    })

    expect(htmlReply).toContain('EXE-CNT-TEST1')
    expect(htmlReply).toContain('Carlos Gomez')
    expect(htmlReply).toContain('Menos de 2 Horas')

    const htmlNotify = contactNotification({
      name: 'Carlos Gomez',
      email: 'carlos@example.com',
      message: 'Necesito una web para mi empresa',
      ticketId: 'EXE-CNT-TEST1',
    })

    expect(htmlNotify).toContain('EXE-CNT-TEST1')
    expect(htmlNotify).toContain('carlos@example.com')
  })

  it('debe detectar correctamente el idioma (Español vs Inglés) y generar la plantilla en Inglés', async () => {
    const { detectLanguage } = await import('../../../api/contact.js')
    const { contactAutoReply } = await import('../../../lib/email/templates.js')

    expect(detectLanguage('Hello, I need a website for my business', '')).toBe('en')
    expect(detectLanguage('Hi! Could you send me pricing details?', '')).toBe('en')
    expect(detectLanguage('Hola, necesito una tienda online para mi negocio', '')).toBe('es')
    expect(detectLanguage('Cual es el precio del servicio?', 'es-ES')).toBe('es')

    const htmlEnglishReply = contactAutoReply({
      name: 'John Doe',
      message: 'I need a custom SaaS platform',
      ticketId: 'EXE-CNT-EN01',
      lang: 'en',
    })

    expect(htmlEnglishReply).toContain('SUPPORT TICKET: EXE-CNT-EN01')
    expect(htmlEnglishReply).toContain('Hello John Doe! We received your message')
    expect(htmlEnglishReply).toContain('Less than 2 Hours')
    expect(htmlEnglishReply).toContain('Chat on WhatsApp Direct')
  })
})
