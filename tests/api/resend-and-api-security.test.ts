import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { checkRateLimitMock } = vi.hoisted(() => ({
  checkRateLimitMock: vi.fn(),
}))

vi.mock('@/lib/server/rateLimit', () => ({
  clientIp: () => '127.0.0.1',
  checkRateLimit: checkRateLimitMock,
}))

import {
  sendEmail,
  htmlToPlainText,
  sanitizeHeaderValue,
  formatSenderAddress,
} from '../../lib/email/send'
import {
  contactAutoReply,
  aiDiagnosticAutoReply,
  n8nAutomationReceipt,
  n8nAdminNotification,
  inboundEmailNotification,
  extractCleanEmail,
  extractDisplayName,
} from '../../lib/email/templates'
import { GET as getResendWebhook } from '../../app/api/webhooks/resend/route'
import { GET as getCheckAdmin } from '../../app/api/check-admin/route'
import { POST as postAutomationN8n } from '../../app/api/automation/n8n/route'
import { POST as postRegisterTransfer } from '../../app/api/register-transfer/route'
import { POST as postPaypalOrders } from '../../app/api/paypal/orders/route'

describe('Resend Email Engine & Templates Improvements', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.RESEND_API_KEY = 're_test_key_123'
    process.env.RESEND_FROM_EMAIL = 'Contacto@exepaginasweb.com'
  })

  it('sanitizeHeaderValue strips CR/LF and control characters to prevent header injection', () => {
    expect(sanitizeHeaderValue('Hola\r\nBcc: attacker@evil.com')).toBe(
      'Hola Bcc: attacker@evil.com'
    )
    expect(sanitizeHeaderValue('Asunto limpio')).toBe('Asunto limpio')
  })

  it('formatSenderAddress adds direct author display name when raw email is provided', () => {
    expect(formatSenderAddress('Contacto@exepaginasweb.com')).toBe(
      'Exequiel Echevarría · ExePaginasWeb <Contacto@exepaginasweb.com>'
    )
    expect(formatSenderAddress('Exe <ventas@exepaginasweb.com>')).toBe(
      'Exe <ventas@exepaginasweb.com>'
    )
  })

  it('htmlToPlainText generates a clean plain-text multipart fallback from HTML email', () => {
    const html = contactAutoReply({
      name: 'Martín',
      message: 'Necesito un e-commerce con pagos y stock.',
      ticketId: 'EXE-CNT-99A1B',
      lang: 'es',
    })
    const text = htmlToPlainText(html)
    expect(text).toContain('Martín')
    expect(text).toContain('EXE-CNT-99A1B')
    expect(text).toContain('Necesito un e-commerce con pagos y stock.')
    expect(text).not.toContain('<table')
    expect(text).not.toContain('<style')
  })

  it('sendEmail auto-populates text fallback, default reply_to, formatted from, and sanitized subject', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'email_123' }), { status: 200 }))

    await sendEmail({
      to: 'cliente@empresa.com',
      subject: 'Confirmación\r\nInyección',
      html: '<p>Hola <strong>Cliente</strong>, recibimos tu consulta.</p>',
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [, init] = fetchSpy.mock.calls[0]!
    const payload = JSON.parse(String(init?.body))

    expect(payload.from).toContain('<Contacto@exepaginasweb.com>')
    expect(payload.subject).toBe('Confirmación Inyección')
    expect(payload.text).toContain('Hola Cliente, recibimos tu consulta.')
    expect(payload.reply_to).toBeDefined()
    expect(payload.headers).toHaveProperty('X-Entity-Ref-ID')
  })

  it('n8nAdminNotification escapes malicious HTML payloads in name, email, phone and details', () => {
    const html = n8nAdminNotification({
      name: '<script>alert("xss")</script>',
      email: 'attacker"@evil.com<img src=x onerror=alert(1)>',
      phone: '+549341<svg onload=alert(1)>',
      automationType: 'cotizacion_express',
      details: '<iframe src="https://evil.com"></iframe>',
      ticketId: 'EXE-N8N-12345',
      dispatchedToN8n: false,
    })

    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<iframe')
    expect(html).not.toContain('<svg onload')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;iframe')
  })

  it('extractCleanEmail and extractDisplayName parse RFC-5322 formatted addresses safely', () => {
    expect(extractCleanEmail('Juan Pérez <juan.perez@empresa.com.ar>')).toBe(
      'juan.perez@empresa.com.ar'
    )
    expect(extractCleanEmail('simple@empresa.com')).toBe('simple@empresa.com')
    expect(extractDisplayName('Juan Pérez <juan.perez@empresa.com.ar>')).toBe('Juan Pérez')
    expect(extractDisplayName('juan.perez@empresa.com.ar')).toBe('juan.perez')
  })

  it('reply templates use 1px hairline styling and direct Exequiel Echevarría authorship', () => {
    const autoReply = contactAutoReply({
      name: 'Lucía',
      message: 'Consulta por sistema de turnos',
      ticketId: 'EXE-CNT-777',
      lang: 'es',
    })
    const diagReply = aiDiagnosticAutoReply({
      name: 'Lucía',
      message: 'Diagnóstico SaaS',
      ticketId: 'EXE-AI-777',
      projectType: 'Sistema de Turnos',
      total: '$650.000 ARS',
      lang: 'es',
    })
    const n8nReply = n8nAutomationReceipt({
      name: 'Lucía',
      email: 'lucia@test.com',
      automationType: 'cotizacion_express',
      details: 'Prueba',
      ticketId: 'EXE-N8N-777',
    })
    const inboundHtml = inboundEmailNotification({
      fromEmail: 'Lucía Gómez <lucia@test.com>',
      toEmail: 'Contacto@exepaginasweb.com',
      subject: 'Consulta comercial',
      text: 'Hola Exequiel',
      ticketId: 'EXE-CNT-888',
    })

    expect(autoReply).toContain('height:1px')
    expect(autoReply).toContain('Exequiel Echevarría')
    expect(diagReply).toContain('Exequiel Echevarría')
    expect(n8nReply).toContain('EXE-N8N-777')
    expect(inboundHtml).toContain('mailto:lucia@test.com')
  })
})

describe('API Endpoints Security Hardening', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 60 })
  })

  it('GET /api/webhooks/resend does not leak secretConfigured to unauthenticated callers', async () => {
    process.env.RESEND_WEBHOOK_SECRET = 'whsec_super_secret'
    const req = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'GET',
    })
    const res = await getResendWebhook(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).not.toHaveProperty('secretConfigured')
    expect(body).not.toHaveProperty('autoHeal')
  })

  it('GET /api/check-admin enforces rate limiting and blocks cross-site requests', async () => {
    const crossSiteReq = new NextRequest('http://localhost:3000/api/check-admin', {
      method: 'GET',
      headers: { 'sec-fetch-site': 'cross-site' },
    })
    const crossRes = await getCheckAdmin(crossSiteReq)
    expect(crossRes.status).toBe(403)

    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 30 })
    const rateLimitedReq = new NextRequest('http://localhost:3000/api/check-admin', {
      method: 'GET',
    })
    const rateRes = await getCheckAdmin(rateLimitedReq)
    expect(rateRes.status).toBe(429)
  })

  it('POST /api/automation/n8n blocks cross-site CSRF requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/automation/n8n', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' },
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
        automationType: 'cotizacion_express',
      }),
    })
    const res = await postAutomationN8n(req)
    expect(res.status).toBe(403)
  })

  it('POST /api/register-transfer blocks cross-site requests and oversized bodies', async () => {
    const crossReq = new NextRequest('http://localhost:3000/api/register-transfer', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' },
      body: JSON.stringify({}),
    })
    const crossRes = await postRegisterTransfer(crossReq)
    expect(crossRes.status).toBe(403)

    const hugeReq = new NextRequest('http://localhost:3000/api/register-transfer', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ padding: 'x'.repeat(15 * 1024) }),
    })
    const hugeRes = await postRegisterTransfer(hugeReq)
    expect(hugeRes.status).toBe(413)
  })

  it('POST /api/paypal/orders blocks cross-site requests and oversized bodies', async () => {
    const crossReq = new NextRequest('http://localhost:3000/api/paypal/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' },
      body: JSON.stringify({ planSlug: 'mantenimiento-basico' }),
    })
    const crossRes = await postPaypalOrders(crossReq)
    expect(crossRes.status).toBe(403)

    const hugeReq = new NextRequest('http://localhost:3000/api/paypal/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ planSlug: 'mantenimiento-basico', extra: 'x'.repeat(8 * 1024) }),
    })
    const hugeRes = await postPaypalOrders(hugeReq)
    expect(hugeRes.status).toBe(413)
  })
})
