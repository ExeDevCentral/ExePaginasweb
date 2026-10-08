function _nullishCoalesce(lhs, rhsFn) {
  if (lhs != null) {
    return lhs
  } else {
    return rhsFn()
  }
} /**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail, syncContactToAudience, ADMIN_EMAIL } from '../../../lib/email/send.js'
import { dispatchN8nEvent } from '@/lib/server/n8n'
import {
  contactNotification,
  contactAutoReply,
  aiDiagnosticAutoReply,
} from '@/lib/email/templates.js'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import {
  validateContentLength,
  validateFetchMetadata,
  maskEmail,
} from '@/lib/server/requestSecurity'

import { detectLanguage } from '@/lib/server/language'

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().trim().email('Email inválido').max(255),
  message: z.string().trim().min(1, 'El mensaje es requerido').max(5000, 'Mensaje demasiado largo'),
  lang: z.string().max(10).nullish(),
  locale: z.string().max(10).nullish(),
  isDiagnostic: z.boolean().nullish(),
  projectType: z.string().max(100).nullish(),
  total: z.union([z.number(), z.string()]).nullish(),
})

export async function POST(req) {
  const fetchMeta = validateFetchMetadata(req)
  if (!fetchMeta.allowed && fetchMeta.errorResponse) {
    return fetchMeta.errorResponse
  }

  const lengthCheck = validateContentLength(req, 50 * 1024)
  if (!lengthCheck.allowed && lengthCheck.errorResponse) {
    return lengthCheck.errorResponse
  }

  try {
    const limit = await checkRateLimit(`contact:${clientIp(req)}`, 3600, 5)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Demasiados mensajes. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }
  } catch (rateLimitError) {
    console.error('[contact] Rate limiter unavailable:', rateLimitError)
    return NextResponse.json({ error: 'Servicio temporalmente no disponible.' }, { status: 503 })
  }

  let body = null
  try {
    body = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parseResult = ContactSchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Faltan campos requeridos o son inválidos.', details: parseResult.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, message, lang, locale, isDiagnostic, projectType, total } = parseResult.data

  const clientLang = lang || locale || req.headers.get('accept-language')
  const detectedLang = detectLanguage(message, clientLang)
  const isAiDiag =
    Boolean(isDiagnostic) ||
    message.toLowerCase().includes('cotización') ||
    message.toLowerCase().includes('diagnóstico')
  const ticketPrefix = isAiDiag ? 'EXE-AI' : 'EXE-CNT'
  const ticketId = `${ticketPrefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`

  console.log(
    `[contact] [${ticketId}] [Lang: ${detectedLang}] [Diag: ${isAiDiag}] Mensaje de ${name} <${maskEmail(email)}> (${message.length} chars)`
  )

  try {
    if (process.env.RESEND_API_KEY) {
      const clientHtmlTemplate = isAiDiag
        ? aiDiagnosticAutoReply({
            name,
            message,
            ticketId,
            projectType: projectType || undefined,
            total: _nullishCoalesce(total, () => undefined),
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
          tags: [
            { name: 'category', value: isAiDiag ? 'ai_diagnostic_admin' : 'contact_admin' },
            { name: 'ticket_id', value: ticketId },
          ],
        }),
        sendEmail({
          to: [email],
          subject: autoReplySubject,
          html: clientHtmlTemplate,
          tags: [
            { name: 'category', value: isAiDiag ? 'ai_diagnostic_client' : 'contact_client' },
            { name: 'ticket_id', value: ticketId },
            { name: 'lang', value: detectedLang },
          ],
        }),
      ]

      // Sincronizar lead con audiencia de Resend en segundo plano
      void syncContactToAudience({
        email,
        firstName: name,
      }).catch((err) => {
        console.warn(`[contact] No se pudo sincronizar con Resend Audience:`, err)
      })

      // Despachar evento a n8n en segundo plano si N8N_WEBHOOK_URL está configurado
      void dispatchN8nEvent({
        event: 'lead.contact',
        ticketId,
        name,
        email,
        message,
        lang: detectedLang,
        metadata: {
          projectType: parseResult.data.projectType,
          total: parseResult.data.total,
          isDiagnostic: Boolean(parseResult.data.isDiagnostic),
        },
      })

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
