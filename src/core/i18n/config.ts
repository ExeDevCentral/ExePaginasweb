import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'
import ptBR from './locales/pt-BR.json'
import zhCN from './locales/zh-CN.json'

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem('lang') || 'es'
    } catch {
      return 'es'
    }
  }
  return 'es'
}

if (!i18n.isInitialized) {
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
    lng: getInitialLang(),
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
  })

  const RTL_LANGS = new Set(['ar'])
  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', (lng) => {
      document.documentElement.dir = RTL_LANGS.has(lng) ? 'rtl' : 'ltr'
    })
    document.documentElement.dir = RTL_LANGS.has(i18n.language) ? 'rtl' : 'ltr'
  }
}

export default i18n
