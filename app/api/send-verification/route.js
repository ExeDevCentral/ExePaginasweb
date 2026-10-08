function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/send'
import { emailVerification } from '@/lib/email/templates.js'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'

const SendVerificationSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).nullish(),
  verificationUrl: z.string().max(1000).nullish(),
  token: z.string().max(255).nullish(),
})

function sanitizeUrl(targetUrl) {
  const defaultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'}/dashboard`
  if (!targetUrl || typeof targetUrl !== 'string') return defaultUrl

  try {
    const parsed = new URL(targetUrl)
    const allowedHosts = ['exepaginasweb.com', 'www.exepaginasweb.com']
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const isLocalDevelopment = process.env.NODE_ENV !== 'production' && isLocalHost

    if (parsed.protocol !== 'https:' && !isLocalDevelopment) return defaultUrl

    if (isLocalDevelopment) allowedHosts.push(parsed.hostname)
    if (process.env.SITE_URL) {
      try {
        allowedHosts.push(new URL(process.env.SITE_URL).hostname)
      } catch (e) {
        // ignore
      }
    }

    if (allowedHosts.includes(parsed.hostname)) {
      return parsed.toString()
    }
  } catch (e2) {
    // fallback
  }
  return defaultUrl
}

function hasInternalAuthorization(req) {
  const expected = process.env.VERIFICATION_API_KEY
  const provided =
    req.headers.get('x-internal-verification-key') ||
    _optionalChain([
      req,
      'access',
      (_) => _.headers,
      'access',
      (_2) => _2.get,
      'call',
      (_3) => _3('authorization'),
      'optionalAccess',
      (_4) => _4.match,
      'call',
      (_5) => _5(/^Bearer\s+(.+)$/i),
      'optionalAccess',
      (_6) => _6[1],
    ])

  if (!expected || !provided) return false

  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)
  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  )
}

export const dynamic = 'force-dynamic'

export async function POST(req) {
  if (!hasInternalAuthorization(req)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const limit = await checkRateLimit(`send-verification:${clientIp(req)}`, 3600, 5)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[verification-email] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body = null
  try {
    body = await req.json()
  } catch (e3) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parseResult = SendVerificationSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: 'El email del destinatario es obligatorio o inválido.',
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    )
  }

  const { email, name, verificationUrl, token } = parseResult.data

  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[verification-email] RESEND_API_KEY no configurada')
      return NextResponse.json(
        { error: 'Servicio de email no configurado en el servidor.' },
        { status: 503 }
      )
    }

    const safeUrl = sanitizeUrl(verificationUrl)
    const html = emailVerification({
      name: name || undefined,
      verificationUrl: safeUrl,
      token: token || undefined,
    })

    const result = await sendEmail({
      to: [email],
      subject: '🔒 Confirma tu cuenta de correo electrónico — ExeSistemasWEB',
      html,
      tags: [{ name: 'category', value: 'auth_verification' }],
    })

    return NextResponse.json({
      ok: true,
      message: 'Email de verificación enviado exitosamente.',
      data: result,
    })
  } catch (err) {
    console.error('[verification-email] Error al enviar email de verificación:', err)
    return NextResponse.json(
      {
        error: 'Error al enviar el email de verificación.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
