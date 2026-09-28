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
})
