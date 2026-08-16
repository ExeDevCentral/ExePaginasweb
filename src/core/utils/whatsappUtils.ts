export const OFFICIAL_WHATSAPP_NUMBER = '5493416874786'
export const DISPLAY_WHATSAPP_NUMBER = '+54 9 341 6874786'

/**
 * Generates a direct WhatsApp link that bypasses wa.me intermediate landing pages
 * and opens WhatsApp Web / Mobile app directly with the prefilled message.
 */
export function getWhatsAppUrl(
  customMessage: string = '¡Hola ExePaginasWeb! Me contacto desde la web.'
): string {
  return `https://api.whatsapp.com/send?phone=${OFFICIAL_WHATSAPP_NUMBER}&text=${encodeURIComponent(customMessage)}`
}
