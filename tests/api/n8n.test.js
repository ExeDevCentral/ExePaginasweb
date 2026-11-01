/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Pruebas unitarias para el conector de automatizaciones n8n.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { dispatchN8nEvent } from '@/lib/server/n8n'

describe('n8n Webhook Dispatcher', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...originalEnv }
    delete process.env.N8N_WEBHOOK_URL
    delete process.env.N8N_WEBHOOK_SECRET
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('retorna no configurado y no lanza error cuando N8N_WEBHOOK_URL no existe', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const result = await dispatchN8nEvent({
      event: 'lead.contact',
      ticketId: 'EXE-CNT-TEST1',
      name: 'Tester',
      email: 'test@example.com',
    })

    expect(result).toEqual({ sent: false, reason: 'unconfigured' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('despacha el payload vía POST cuando N8N_WEBHOOK_URL está configurada', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/lead'
    process.env.N8N_WEBHOOK_SECRET = 'secret-token-123'

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const result = await dispatchN8nEvent({
      event: 'lead.contact',
      ticketId: 'EXE-CNT-TEST2',
      name: 'Juan Perez',
      email: 'juan@example.com',
      message: 'Quiero cotizar una web',
      lang: 'es',
    })

    expect(result).toEqual({ sent: true, status: 200 })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://n8n.example.com/webhook/lead')
    expect(options.method).toBe('POST')
    expect(options.headers['X-Webhook-Secret']).toBe('secret-token-123')
    expect(options.headers['Content-Type']).toBe('application/json')

    const sentBody = JSON.parse(options.body)
    expect(sentBody.event).toBe('lead.contact')
    expect(sentBody.ticketId).toBe('EXE-CNT-TEST2')
    expect(sentBody.email).toBe('juan@example.com')
    expect(sentBody.source).toBe('exepaginasweb')
    expect(sentBody.timestamp).toBeDefined()
  })

  it('maneja respuestas HTTP de error sin romper el flujo de la aplicación', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/lead'

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Internal Error', { status: 500 })
    )

    const result = await dispatchN8nEvent({
      event: 'lead.chat',
      ticketId: 'EXE-CHT-TEST3',
      email: 'chat@example.com',
    })

    expect(result.sent).toBe(false)
    expect(result.status).toBe(500)
    expect(result.reason).toBe('http_error')
  })

  it('maneja caídas de red o timeouts sin lanzar excepciones no controladas', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/lead'

    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network connection timeout'))

    const result = await dispatchN8nEvent({
      event: 'lead.contact',
      email: 'error@example.com',
    })

    expect(result.sent).toBe(false)
    expect(result.reason).toContain('Network connection timeout')
  })

  it('despacha automation.trigger con el nombre personalizado de la persona conectada', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/lead'
    process.env.N8N_WEBHOOK_SECRET = 'secret-token-123'

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const result = await dispatchN8nEvent({
      event: 'automation.trigger',
      ticketId: 'EXE-N8N-TEST9',
      name: 'Valeria Rossi',
      email: 'valeria@example.com',
      message: '[cotizacion_express] Solicito presupuesto para sistema web',
      metadata: {
        automationType: 'cotizacion_express',
        source: 'ai_assistant_tool',
      },
    })

    expect(result).toEqual({ sent: true, status: 200 })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://n8n.example.com/webhook/lead')
    const sentBody = JSON.parse(options.body)
    expect(sentBody.event).toBe('automation.trigger')
    expect(sentBody.name).toBe('Valeria Rossi')
    expect(sentBody.ticketId).toBe('EXE-N8N-TEST9')
    expect(sentBody.metadata.automationType).toBe('cotizacion_express')
  })
})

describe('POST /api/automation/n8n route handler', () => {
  it('GET devuelve una respuesta genérica sin llamar servicios externos', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { GET } = await import('../../app/api/automation/n8n/route')
    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('responde 503 si el servicio de rate limit no está disponible', async () => {
    const { NextRequest } = await import('next/server')
    vi.spyOn(await import('@/lib/server/rateLimit'), 'checkRateLimit').mockRejectedValueOnce(
      new Error('database unavailable')
    )
    const { POST } = await import('../../app/api/automation/n8n/route')
    const req = new NextRequest('http://localhost:3000/api/automation/n8n', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', automationType: 'demo_sistema' }),
      headers: { 'content-type': 'application/json' },
    })

    expect((await POST(req)).status).toBe(503)
  })

  it('rechaza payloads mayores al límite antes del parseo', async () => {
    vi.spyOn(await import('@/lib/server/rateLimit'), 'checkRateLimit').mockResolvedValueOnce({
      allowed: true,
      retryAfterSeconds: 60,
    })
    const { POST } = await import('../../app/api/automation/n8n/route')
    const { NextRequest } = await import('next/server')

    const req = new NextRequest('http://localhost:3000/api/automation/n8n', {
      method: 'POST',
      body: JSON.stringify({ name: 'x'.repeat(11 * 1024), automationType: 'cotizacion_express' }),
      headers: { 'content-type': 'application/json', 'content-length': String(11 * 1024) },
    })

    const res = await POST(req)
    expect(res.status).toBe(413)
  })

  it('procesa correctamente la solicitud con nombre y tipo de automatización', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example.com/webhook/lead'
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    )

    const { POST } = await import('../../app/api/automation/n8n/route')
    const { NextRequest } = await import('next/server')

    const req = new NextRequest('http://localhost:3000/api/automation/n8n', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Carlos Mendoza',
        email: 'carlos@example.com',
        automationType: 'auditoria_gratis',
        details: 'Auditoría para tienda online',
      }),
      headers: { 'content-type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.clientName).toBe('Carlos Mendoza')
    expect(json.automationType).toBe('auditoria_gratis')
    expect(json.ticketId).toMatch(/^EXE-N8N-[A-Z0-9]+$/)
    expect(json.dispatchedToN8n).toBe(true)
  })
})
