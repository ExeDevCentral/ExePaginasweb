/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'
import ptBR from './locales/pt-BR.json'
import zhCN from './locales/zh-CN.json'
import { RTL_LANG_SET, normalizeSupportedLang } from './languageDetector'

export function syncHtmlLangAttributes(lng: string) {
  if (typeof document === 'undefined') return
  const normalized = normalizeSupportedLang(lng)
  document.documentElement.lang = normalized
  document.documentElement.dir = RTL_LANG_SET.has(normalized) ? 'rtl' : 'ltr'
}

if (!i18n.isInitialized) {
  if (typeof window !== 'undefined') {
    i18n.use(LanguageDetector)
  }

  i18n.use(initReactI18next).init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      ar: { translation: ar },
      'pt-BR': { translation: ptBR },
      'zh-CN': { translation: zhCN },
    },
    // Mantiene 'es' como base SSR determinística y sincroniza tras hidratar en cliente
    lng: 'es',
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt-BR', 'de', 'fr', 'ar', 'zh-CN'],
    detection: {
      order: ['querystring', 'localStorage', 'cookie', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'lang',
      lookupCookie: 'exe_lang',
      caches: ['localStorage', 'cookie'],
      convertDetectedLanguage: (lng: string) => normalizeSupportedLang(lng),
    },
    interpolation: { escapeValue: false },
  })

  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', (lng) => {
      syncHtmlLangAttributes(lng)
    })
    syncHtmlLangAttributes(i18n.language)
  }
}

export default i18n
