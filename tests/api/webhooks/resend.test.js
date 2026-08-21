import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Webhook } from 'svix'
import { NextRequest } from 'next/server'
import { POST as handler } from '../../../app/api/webhooks/resend/route'

// Mock Supabase y sendEmail
const { mockSupabaseInstance } = vi.hoisted(() => ({
  mockSupabaseInstance: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseInstance,
}))

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: mockSupabaseInstance,
}))

vi.mock('../../../lib/email/send.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_123' }),
  ADMIN_EMAIL: 'admin@exepaginasweb.com',
}))

vi.mock('@/lib/email/send', () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: 'mock_send_123' }),
  ADMIN_EMAIL: 'admin@exepaginasweb.com',
}))

async function callResendWebhook(payload, headers = {}) {
  const bodyString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const req = new NextRequest('http://localhost:3000/api/webhooks/resend', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: bodyString,
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

describe('Resend Webhook Handler (app/api/webhooks/resend/route.ts)', () => {
  const TEST_SECRET = 'whsec_MfValidSecretForTesting123='

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = TEST_SECRET
    process.env.RESEND_API_KEY = 're_test_key_123'
    vi.clearAllMocks()
  })

  it('debe rechazar peticiones sin cabeceras Svix con status 400', async () => {
    const { status, json } = await callResendWebhook(JSON.stringify({ type: 'email.sent' }), {})

    expect(status).toBe(400)
    expect(json).toEqual({ error: 'Missing Svix signature headers' })
  })

  it('debe rechazar firmas Svix inválidas con status 400', async () => {
    const { status, json } = await callResendWebhook(JSON.stringify({ type: 'email.sent' }), {
      'svix-id': 'msg_123',
      'svix-timestamp': `${Math.floor(Date.now() / 1000)}`,
      'svix-signature': 'v1,invalid_signature_hash',
    })

    expect(status).toBe(400)
    expect(json.error).toContain('Webhook signature verification failed')
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

      const { status, json } = await callResendWebhook(payloadString, {
        'svix-id': svixId,
        'svix-timestamp': `${Math.floor(timestamp.getTime() / 1000)}`,
        'svix-signature': signature,
      })

      expect(status).toBe(200)
      expect(json.received).toBe(true)
      expect(json.type).toBe(type)
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
    const { detectLanguage } = await import('../../../app/api/contact/route')
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
