/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Autodetector y normalizador de idioma compatible con i18next-browser-languagedetector.
 * Prioridad: ?lang= (URL) -> localStorage('lang') -> cookie('exe_lang') -> navigator.languages -> 'es'.
 */

export type SupportedLang = 'es' | 'en' | 'pt-BR' | 'de' | 'fr' | 'ar' | 'zh-CN'

export interface LanguageOption {
  code: SupportedLang
  short: string
  nativeName: string
  isRtl?: boolean
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'es', short: 'ES', nativeName: 'Español' },
  { code: 'en', short: 'EN', nativeName: 'English' },
  { code: 'pt-BR', short: 'PT', nativeName: 'Português (BR)' },
  { code: 'de', short: 'DE', nativeName: 'Deutsch' },
  { code: 'fr', short: 'FR', nativeName: 'Français' },
  { code: 'ar', short: 'AR', nativeName: 'العربية', isRtl: true },
  { code: 'zh-CN', short: 'ZH', nativeName: '简体中文' },
] as const

export const RTL_LANG_SET = new Set<SupportedLang>(['ar'])

/**
 * Normaliza cualquier tag BCP-47 (ej. "en-GB", "es-AR", "pt", "zh-Hans", "ar-SA")
 * a uno de los 7 idiomas soportados por ExePaginasWeb.
 */
export function normalizeSupportedLang(raw: string | null | undefined): SupportedLang {
  if (!raw) return 'es'
  const cleaned = raw.trim().replace('_', '-').toLowerCase()
  const exact = SUPPORTED_LANGUAGES.find((item) => item.code.toLowerCase() === cleaned)
  if (exact) return exact.code

  const prefix = cleaned.split('-')[0]
  switch (prefix) {
    case 'es':
      return 'es'
    case 'en':
      return 'en'
    case 'pt':
      return 'pt-BR'
    case 'de':
      return 'de'
    case 'fr':
      return 'fr'
    case 'ar':
      return 'ar'
    case 'zh':
      return 'zh-CN'
    default:
      return 'es'
  }
}

function readCookieValue(name: string): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null
  const prefix = `${name}=`
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }
  return null
}

export type DetectionSource = 'querystring' | 'localStorage' | 'cookie' | 'navigator' | 'fallback'

export interface LanguageDetectionResult {
  lang: SupportedLang
  source: DetectionSource
}

/**
 * Detecta el idioma preferido del visitante sin bloquear SSR.
 */
export function detectClientLanguage(): LanguageDetectionResult {
  if (typeof window === 'undefined') {
    return { lang: 'es', source: 'fallback' }
  }

  try {
    const params = new URLSearchParams(window.location.search)
    const queryLang = params.get('lang')
    if (queryLang) {
      return { lang: normalizeSupportedLang(queryLang), source: 'querystring' }
    }
  } catch {
    // safe fallback
  }

  try {
    const stored = window.localStorage.getItem('lang')
    if (stored) {
      return { lang: normalizeSupportedLang(stored), source: 'localStorage' }
    }
  } catch {
    // safe fallback
  }

  try {
    const cookieLang = readCookieValue('exe_lang')
    if (cookieLang) {
      return { lang: normalizeSupportedLang(cookieLang), source: 'cookie' }
    }
  } catch {
    // safe fallback
  }

  try {
    const browserList =
      Array.isArray(navigator.languages) && navigator.languages.length > 0
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : []

    for (const candidate of browserList) {
      const prefix = candidate.trim().toLowerCase().split(/[-_]/)[0]
      if (prefix && ['es', 'en', 'pt', 'de', 'fr', 'ar', 'zh'].includes(prefix)) {
        return { lang: normalizeSupportedLang(candidate), source: 'navigator' }
      }
    }
  } catch {
    // safe fallback
  }

  return { lang: 'es', source: 'fallback' }
}

/**
 * Persiste la elección manual de idioma en localStorage y cookie para futuras visitas.
 */
export function persistLanguagePreference(lang: SupportedLang): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem('lang', lang)
  } catch {
    // safe fallback
  }
  try {
    document.cookie = `exe_lang=${encodeURIComponent(lang)}; path=/; max-age=31536000; SameSite=Lax`
  } catch {
    // safe fallback
  }
}
