/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Unit tests for Argentina Engineering Desk business hours (Mon–Fri, 08:00–18:00 ART).
 */
import { describe, expect, it } from 'vitest'
import { getArgentinaDeskStatus, normalizeV2Lang } from './v2-i18n'

describe('V2 Argentina Desk Hours (Mon–Fri 08:00–18:00 ART)', () => {
  it('returns OPEN on a Wednesday at 14:30 ART (17:30 UTC)', () => {
    const wedAfternoon = new Date('2026-11-18T17:30:00Z')
    const status = getArgentinaDeskStatus(wedAfternoon)
    expect(status.isOpen).toBe(true)
    expect(status.hourArt).toBe(14)
  })

  it('returns CLOSED on a weekday before 08:00 ART (07:59 ART = 10:59 UTC)', () => {
    const earlyMorning = new Date('2026-11-18T10:59:00Z')
    expect(getArgentinaDeskStatus(earlyMorning).isOpen).toBe(false)
  })

  it('returns CLOSED on a weekday at 18:00 ART (21:00 UTC)', () => {
    const evening = new Date('2026-11-18T21:00:00Z')
    expect(getArgentinaDeskStatus(evening).isOpen).toBe(false)
  })

  it('returns CLOSED on Saturday even at midday ART (12:00 ART = 15:00 UTC)', () => {
    const saturdayNoon = new Date('2026-11-21T15:00:00Z')
    expect(getArgentinaDeskStatus(saturdayNoon).isOpen).toBe(false)
  })

  it('normalizes all 7 supported languages correctly', () => {
    expect(normalizeV2Lang('pt-BR')).toBe('pt-BR')
    expect(normalizeV2Lang('zh-CN')).toBe('zh-CN')
    expect(normalizeV2Lang('ar')).toBe('ar')
    expect(normalizeV2Lang('en-US')).toBe('en')
    expect(normalizeV2Lang('unknown')).toBe('es')
  })
})
