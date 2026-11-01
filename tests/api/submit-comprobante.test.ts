import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }))
vi.mock('@/lib/server/rateLimit', () => ({
  checkRateLimit: rateLimitMock,
  clientIp: () => '127.0.0.1',
}))

import { POST } from '../../app/api/submit-comprobante/route'

function makeRequest(body = '{}') {
  return new NextRequest('http://localhost:3000/api/submit-comprobante', {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/json', authorization: 'Bearer invalid' },
  })
}

describe('POST /api/submit-comprobante', () => {
  beforeEach(() => vi.clearAllMocks())

  it('fails closed if the rate limit service fails', async () => {
    rateLimitMock.mockRejectedValueOnce(new Error('database unavailable'))
    const response = await POST(makeRequest())
    expect(response.status).toBe(503)
  })

  it('rejects oversized payloads', async () => {
    rateLimitMock.mockResolvedValueOnce({ allowed: true, retryAfterSeconds: 3600 })
    const response = await POST(makeRequest(JSON.stringify({ notas: 'x'.repeat(12 * 1024) })))
    expect(response.status).toBe(413)
  })
})
