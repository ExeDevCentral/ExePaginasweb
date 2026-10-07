/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextResponse } from 'next/server'

export type SecurityCheckResult = {
  allowed: boolean
  errorResponse?: NextResponse
}

/**
 * Valida que la cabecera Content-Length no exceda el límite máximo permitido
 * para prevenir ataques de denegación de servicio por agotamiento de memoria (JSON bomb).
 */
export function validateContentLength(
  req: Request,
  maxBytes: number = 50 * 1024
): SecurityCheckResult {
  const header = req.headers.get('content-length')
  if (header) {
    const length = Number.parseInt(header, 10)
    if (!Number.isNaN(length) && length > maxBytes) {
      return {
        allowed: false,
        errorResponse: NextResponse.json(
          { error: 'El tamaño de la solicitud excede el límite permitido.' },
          { status: 413 }
        ),
      }
    }
  }
  return { allowed: true }
}

/**
 * Valida las cabeceras W3C Fetch Metadata (Sec-Fetch-Site).
 * Si la petición es iniciada desde un origen de terceros en el navegador ('cross-site'),
 * la rechaza para mitigar ataques CSRF y abusos de API.
 */
export function validateFetchMetadata(req: Request): SecurityCheckResult {
  const fetchSite = req.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') {
    return {
      allowed: false,
      errorResponse: NextResponse.json(
        { error: 'Origen de solicitud no autorizado.' },
        { status: 403 }
      ),
    }
  }
  return { allowed: true }
}

/**
 * Enmascara direcciones de correo electrónico para logging seguro (cumplimiento RGPD / PII).
 * Ejemplo: "exequiel@example.com" -> "ex***l@example.com"
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return '***'
  }
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'

  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`
}
