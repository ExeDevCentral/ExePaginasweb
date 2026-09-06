import { describe, expect, it } from 'vitest'
import { isLocalDashboardPreview, sanitizeInternalPath } from './siteUrl'

describe('site URL security helpers', () => {
  it('accepts internal paths with query strings', () => {
    expect(sanitizeInternalPath('/dashboard?tab=invoices')).toBe('/dashboard?tab=invoices')
  })

  it('rejects external and protocol-relative redirects', () => {
    expect(sanitizeInternalPath('https://evil.example')).toBe('/dashboard')
    expect(sanitizeInternalPath('//evil.example/login')).toBe('/dashboard')
    expect(sanitizeInternalPath('/\\evil.example/login')).toBe('/dashboard')
  })

  it('allows dashboard preview only outside production', () => {
    const params = new URLSearchParams('demo=1')
    expect(isLocalDashboardPreview(params)).toBe(true)

    const env = process.env as { NODE_ENV?: string }
    const original = env.NODE_ENV
    env.NODE_ENV = 'production'
    expect(isLocalDashboardPreview(params)).toBe(false)
    if (original === undefined) delete env.NODE_ENV
    else env.NODE_ENV = original
  })
})
