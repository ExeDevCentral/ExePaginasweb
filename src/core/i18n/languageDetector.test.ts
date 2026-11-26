/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  SUPPORTED_LANGUAGES,
  detectClientLanguage,
  normalizeSupportedLang,
  persistLanguagePreference,
} from './languageDetector'

describe('i18n Language Detector & Normalizer', () => {
  const storageMap = new Map<string, string>()
  let cookieJar = ''
  let searchString = ''
  let navLanguages: readonly string[] = ['es-AR']

  beforeEach(() => {
    storageMap.clear()
    cookieJar = ''
    searchString = ''
    navLanguages = ['es-AR']

    vi.stubGlobal('window', {
      location: {
        get search() {
          return searchString
        },
      },
      localStorage: {
        getItem: (k: string) => storageMap.get(k) ?? null,
        setItem: (k: string, v: string) => {
          storageMap.set(k, v)
        },
      },
    })

    vi.stubGlobal('document', {
      get cookie() {
        return cookieJar
      },
      set cookie(val: string) {
        const pair = val.split(';')[0]?.trim()
        if (pair) cookieJar = pair
      },
    })

    vi.stubGlobal('navigator', {
      get languages() {
        return navLanguages
      },
      get language() {
        return navLanguages[0] ?? 'es'
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('soporta exactamente los 7 idiomas canónicos del sitio', () => {
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual([
      'es',
      'en',
      'pt-BR',
      'de',
      'fr',
      'ar',
      'zh-CN',
    ])
  })

  it('normaliza códigos BCP-47 regionales a los 7 idiomas soportados', () => {
    expect(normalizeSupportedLang('es-AR')).toBe('es')
    expect(normalizeSupportedLang('en-US')).toBe('en')
    expect(normalizeSupportedLang('pt-PT')).toBe('pt-BR')
    expect(normalizeSupportedLang('de_AT')).toBe('de')
    expect(normalizeSupportedLang('fr-CA')).toBe('fr')
    expect(normalizeSupportedLang('ar-SA')).toBe('ar')
    expect(normalizeSupportedLang('zh-Hans')).toBe('zh-CN')
    expect(normalizeSupportedLang('ja-JP')).toBe('es')
  })

  it('prioriza ?lang= sobre localStorage y navigator', () => {
    storageMap.set('lang', 'fr')
    searchString = '?lang=de'
    const detected = detectClientLanguage()
    expect(detected.lang).toBe('de')
    expect(detected.source).toBe('querystring')
  })

  it('persiste y recupera preferencia en localStorage y cookie', () => {
    persistLanguagePreference('en')
    expect(storageMap.get('lang')).toBe('en')
    expect(cookieJar).toContain('exe_lang=en')
    const detected = detectClientLanguage()
    expect(detected.lang).toBe('en')
    expect(detected.source).toBe('localStorage')
  })

  it('autodetecta desde navigator.languages cuando no hay preferencia guardada', () => {
    navLanguages = ['pt-PT', 'en-US']
    const detected = detectClientLanguage()
    expect(detected.lang).toBe('pt-BR')
    expect(detected.source).toBe('navigator')
  })
})
