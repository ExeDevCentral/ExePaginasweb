/**
 * i18next typed resources - fuente única: es.json (canónico).
 * Las keys se validan en compile-time; evitar defaults inline en t().
 */
import 'i18next'
import type es from '../core/i18n/locales/es.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof es
    }
  }
}
