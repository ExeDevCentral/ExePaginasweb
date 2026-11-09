/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 *
 * Endpoint de analítica gratuita en Supabase para registrar eventos de conversión
 * (Clicks en WhatsApp, Formulario, Precios, Apertura de Chat, Demos).
 */
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { isSupabaseAdminConfigured, supabaseAdmin } from '@/lib/supabase/admin'
import { checkRateLimit, clientIp } from '@/lib/server/rateLimit'
import { readJsonBody, validateFetchMetadata } from '@/lib/server/requestSecurity'

export const dynamic = 'force-dynamic'

const EventPayloadSchema = z.object({
  event_name: z.string().min(1).max(100),
  properties: z
    .record(z.string().max(64), z.union([z.string().max(256), z.number(), z.boolean(), z.null()]))
    .optional(),
  page_path: z.string().max(500).optional(),
  referrer: z.string().max(1000).optional(),
  session_id: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const fetchMeta = validateFetchMetadata(req)
    if (!fetchMeta.allowed && fetchMeta.errorResponse) {
      return fetchMeta.errorResponse
    }

    try {
      const limit = await checkRateLimit(`analytics:${clientIp(req)}`, 60, 60)
      if (!limit.allowed) {
        return NextResponse.json(
          { ok: false, error: 'Too many events' },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
        )
      }
    } catch {
      return NextResponse.json({ ok: false, error: 'Temporarily unavailable' }, { status: 503 })
    }

    const bodyResult = await readJsonBody(req, 8 * 1024)
    if (bodyResult.errorResponse) return bodyResult.errorResponse

    const parseResult = EventPayloadSchema.safeParse(bodyResult.body)
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: 'Validation failed', details: parseResult.error.format() },
        { status: 422 }
      )
    }

    const { event_name, properties, page_path, referrer, session_id } = parseResult.data

    // Si Supabase Admin no está configurado, respondemos OK para no romper la UX
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json({ ok: true, stored: false, reason: 'supabase_not_configured' })
    }

    const safePath = page_path?.startsWith('/') && !page_path.startsWith('//') ? page_path : null
    const safeReferrer = (() => {
      if (!referrer) return null
      try {
        const parsed = new URL(referrer)
        return parsed.protocol === 'https:' ? parsed.origin : null
      } catch {
        return null
      }
    })()

    const payload = {
      event_name,
      properties: properties || {},
      page_path: safePath,
      referrer: safeReferrer,
      user_agent: null,
      session_id: session_id || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin.from('analytics_events').insert(payload)

    if (error) {
      console.warn('[Analytics Event Error]', error.message)
      return NextResponse.json(
        { ok: false, error: 'Unable to store analytics event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 201 })
  } catch (err: unknown) {
    console.error('[analytics/event] Request processing failed:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
