import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/send'
import { emailVerification } from '@/lib/email/templates.js'

const RATE_LIMIT_WINDOW_MS = 3_600_000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map<string, number[]>()

const SendVerificationSchema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).nullish(),
  verificationUrl: z.string().max(1000).nullish(),
  token: z.string().max(255).nullish(),
})

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const previous = requestLog.get(ip) ?? []
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent)
    return true
  }
  recent.push(now)
  requestLog.set(ip, recent)
  return false
}

function sanitizeUrl(targetUrl?: string | null): string {
  const defaultUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'}/dashboard`
  if (!targetUrl || typeof targetUrl !== 'string') return defaultUrl

  try {
    const parsed = new URL(targetUrl)
    const allowedHosts = ['exepaginasweb.com', 'www.exepaginasweb.com', 'localhost', '127.0.0.1']
    if (process.env.SITE_URL) {
      try {
        allowedHosts.push(new URL(process.env.SITE_URL).hostname)
      } catch {
        // ignore
      }
    }

    if (allowedHosts.includes(parsed.hostname)) {
      return parsed.toString()
    }
  } catch {
    // fallback
  }
  return defaultUrl
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta más tarde.' },
      { status: 429 }
    )
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
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
    })

    return NextResponse.json({
      ok: true,
      message: 'Email de verificación enviado exitosamente.',
      data: result,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[verification-email] Error al enviar email de verificación:', err)
    return NextResponse.json(
      {
        error: 'Error al enviar el email de verificación.',
        details: msg,
      },
      { status: 500 }
    )
  }
}
