import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { insertMock, fromMock, checkRateLimitMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  fromMock: vi.fn(),
  checkRateLimitMock: vi.fn(),
}))

vi.mock('@/lib/supabase/admin', () => ({
  isSupabaseAdminConfigured: () => true,
  supabaseAdmin: { from: fromMock },
}))
vi.mock('@/lib/server/rateLimit', () => ({
  clientIp: () => '127.0.0.1',
  checkRateLimit: checkRateLimitMock,
}))

import { POST } from '../../app/api/analytics/event/route'

function request(body: string, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost:3000/api/analytics/event', {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

describe('POST /api/analytics/event', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSeconds: 60 })
    insertMock.mockResolvedValue({ error: null })
    fromMock.mockReturnValue({ insert: insertMock })
  })

  it('rate-limits and does not write when the limiter denies an event', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 12 })
    const response = await POST(request(JSON.stringify({ event_name: 'click' })))
    expect(response.status).toBe(429)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('fails closed if the limiter is unavailable', async () => {
    checkRateLimitMock.mockRejectedValueOnce(new Error('db unavailable'))
    const response = await POST(request(JSON.stringify({ event_name: 'click' })))
    expect(response.status).toBe(503)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('rejects an oversized body', async () => {
    const response = await POST(
      request(JSON.stringify({ event_name: 'click', properties: { payload: 'x'.repeat(9000) } }))
    )
    expect(response.status).toBe(413)
  })

  it('stores only safe event fields and discards user-agent and full referrer', async () => {
    const response = await POST(
      request(
        JSON.stringify({
          event_name: 'click',
          properties: { source: 'hero', count: 1 },
          page_path: '/precios',
          referrer: 'https://referrer.example/path?email=user@example.com',
          session_id: 'sid_123',
        }),
        { 'user-agent': 'browser fingerprint' }
      )
    )
    expect(response.status).toBe(201)
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        properties: { source: 'hero', count: 1 },
        page_path: '/precios',
        referrer: 'https://referrer.example',
        user_agent: null,
      })
    )
  })
})
