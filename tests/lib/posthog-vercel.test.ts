import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('PostHog + Vercel native integration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it('next.config.mjs configures skipTrailingSlashRedirect, /ingest rewrites and Speed Insights CSP', async () => {
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com/'
    const { default: nextConfig } = await import('../../next.config.mjs')

    expect(nextConfig.skipTrailingSlashRedirect).toBe(true)

    const rewrites = await nextConfig.rewrites()
    expect(rewrites).toEqual([
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ])

    const headers = await nextConfig.headers()
    const rootHeaders = headers.find((h) => h.source === '/(.*)')?.headers ?? []
    const csp = rootHeaders.find((h) => h.key === 'Content-Security-Policy')?.value ?? ''
    expect(csp).toContain('https://vitals.vercel-insights.com')
    expect(csp).toContain('https://va.vercel-scripts.com')
  })

  it('runInBackground delegates to @vercel/functions waitUntil without throwing', async () => {
    const waitUntilMock = vi.fn()
    vi.doMock('@vercel/functions', () => ({
      waitUntil: waitUntilMock,
      metric: vi.fn(),
    }))

    const { runInBackground } = await import('@/lib/posthog/server')
    runInBackground(Promise.resolve('ok'))

    expect(waitUntilMock).toHaveBeenCalledTimes(1)
  })

  it('captureServerEvent captures via posthog-node and schedules shutdown in waitUntil', async () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test_key'
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED = 'true'

    const captureMock = vi.fn()
    const shutdownMock = vi.fn().mockResolvedValue(undefined)
    const waitUntilMock = vi.fn()

    vi.doMock('@vercel/functions', () => ({
      waitUntil: waitUntilMock,
      metric: vi.fn(),
    }))
    vi.doMock('posthog-node', () => ({
      PostHog: class {
        capture = captureMock
        shutdown = shutdownMock
      },
    }))

    const { captureServerEvent } = await import('@/lib/posthog/server')
    captureServerEvent({
      distinctId: 'user_123',
      event: 'contact_lead_submitted',
      properties: { ticketId: 'EXE-CNT-1' },
    })

    expect(captureMock).toHaveBeenCalledWith({
      distinctId: 'user_123',
      event: 'contact_lead_submitted',
      properties: { ticketId: 'EXE-CNT-1' },
    })
    expect(waitUntilMock).toHaveBeenCalledTimes(1)

    await waitUntilMock.mock.calls[0]?.[0]
    expect(shutdownMock).toHaveBeenCalledTimes(1)
  })
})
