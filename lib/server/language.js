/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */

export function detectLanguage(text, clientLang) {
  if (clientLang && typeof clientLang === 'string') {
    const normalized = clientLang.toLowerCase().trim()
    if (normalized.startsWith('en')) return 'en'
    if (normalized.startsWith('es')) return 'es'
  }
  if (!text || typeof text !== 'string') return 'es'
  const englishPattern =
    /\b(hello|hi|dear|thanks|thank|please|website|project|build|pricing|price|quote|business|inquiry|looking|would like|can you|how much)\b/i
  return englishPattern.test(text) ? 'en' : 'es'
}
