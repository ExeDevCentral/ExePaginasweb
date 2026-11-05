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
  if (header !== null && (!/^\d+$/.test(header) || Number(header) > maxBytes)) {
    return {
      allowed: false,
      errorResponse: NextResponse.json(
        { error: 'El tamaño de la solicitud excede el límite permitido.' },
        { status: 413 }
      ),
    }
  }
  return { allowed: true }
}

export async function readJsonBody(
  req: Request,
  maxBytes: number = 50 * 1024
): Promise<{ body?: unknown; errorResponse?: NextResponse }> {
  const contentLength = validateContentLength(req, maxBytes)
  if (!contentLength.allowed && contentLength.errorResponse) {
    return { errorResponse: contentLength.errorResponse }
  }
  if (!req.body) {
    return { errorResponse: NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }
  }

  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let bytesRead = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytesRead += value.byteLength
      if (bytesRead > maxBytes) {
        await reader.cancel()
        return {
          errorResponse: NextResponse.json(
            { error: 'El tamaño de la solicitud excede el límite permitido.' },
            { status: 413 }
          ),
        }
      }
      chunks.push(value)
    }

    const payload = new Uint8Array(bytesRead)
    let offset = 0
    for (const chunk of chunks) {
      payload.set(chunk, offset)
      offset += chunk.byteLength
    }
    return { body: JSON.parse(new TextDecoder().decode(payload)) as unknown }
  } catch {
    return { errorResponse: NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }
  } finally {
    reader.releaseLock()
  }
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
