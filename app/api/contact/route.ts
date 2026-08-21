import { NextResponse, type NextRequest } from 'next/server'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import {
  contactNotification,
  contactAutoReply,
  aiDiagnosticAutoReply,
} from '@/lib/email/templates.js'

const RATE_LIMIT_WINDOW_MS = 3600_000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map<string, number[]>()

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

export function detectLanguage(text: string, clientLang?: string | null): 'en' | 'es' {
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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados mensajes. Intenta más tarde.' }, { status: 429 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { name, email, message, lang, locale, isDiagnostic, projectType, total } = body || {}
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  const clientLang = lang || locale || req.headers.get('accept-language')
  const detectedLang = detectLanguage(message, clientLang)
  const isAiDiag =
    Boolean(isDiagnostic) ||
    message.toLowerCase().includes('cotización') ||
    message.toLowerCase().includes('diagnóstico')
  const ticketPrefix = isAiDiag ? 'EXE-AI' : 'EXE-CNT'
  const ticketId = `${ticketPrefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`

  console.log(
    `[contact] [${ticketId}] [Lang: ${detectedLang}] [Diag: ${isAiDiag}] Mensaje de ${name} <${email}>: ${message.slice(0, 100)}...`
  )

  try {
    if (process.env.RESEND_API_KEY) {
      const clientHtmlTemplate = isAiDiag
        ? aiDiagnosticAutoReply({
            name,
            message,
            ticketId,
            projectType,
            total,
            lang: detectedLang,
          })
        : contactAutoReply({ name, message, ticketId, lang: detectedLang })

      const autoReplySubject = isAiDiag
        ? detectedLang === 'en'
          ? `🤖 AI Diagnostic Completed [Ticket: ${ticketId}] - ExeSistemasWEB`
          : `🤖 Tu Diagnóstico IA está listo [Ticket: ${ticketId}] - ExeSistemasWEB`
        : detectedLang === 'en'
          ? `✨ We received your message [Ticket: ${ticketId}] - ExeSistemasWEB`
          : `✨ Recibimos tu mensaje [Ticket: ${ticketId}] - ExeSistemasWEB`

      const emailTasks = [
        sendEmail({
          to: [ADMIN_EMAIL],
          subject: `[${ticketId}] ${isAiDiag ? '🤖 Nuevo Diagnóstico IA' : 'Nuevo contacto'} de ${name} <${email}>`,
          html: contactNotification({ name, email, message, ticketId }),
          replyTo: email,
        }),
        sendEmail({
          to: [email],
          subject: autoReplySubject,
          html: clientHtmlTemplate,
        }),
      ]

      const results = await Promise.allSettled(emailTasks)
      results.forEach((res, index) => {
        if (res.status === 'rejected') {
          console.error(
            `[contact] [${ticketId}] Error en envío de email ${index === 0 ? 'Admin' : 'Cliente'}:`,
            res.reason
          )
        } else {
          console.log(
            `[contact] [${ticketId}] Email ${index === 0 ? 'Admin' : 'Cliente'} enviado correctamente`
          )
        }
      })
    }

    const clientMsg =
      detectedLang === 'en'
        ? 'Message successfully received. We sent a confirmation to your email address.'
        : 'Mensaje recibido con éxito. Te enviamos una confirmación a tu correo electrónico.'

    return NextResponse.json({
      ok: true,
      ticketId,
      lang: detectedLang,
      message: clientMsg,
    })
  } catch (err) {
    console.error('[contact] Error procesando mensaje:', err)
    return NextResponse.json({
      ok: true,
      ticketId,
      lang: detectedLang,
      message: 'Mensaje recibido con éxito. Te contactaremos pronto.',
    })
  }
}
