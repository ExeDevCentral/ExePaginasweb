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
import { clientIp } from '@/lib/server/rateLimit'

export const dynamic = 'force-dynamic'

const EventPayloadSchema = z.object({
  event_name: z.string().min(1).max(100),
  properties: z.record(z.string(), z.unknown()).optional(),
  page_path: z.string().max(500).optional(),
  referrer: z.string().max(1000).optional(),
  session_id: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null)
    if (!rawBody) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 })
    }

    const parseResult = EventPayloadSchema.safeParse(rawBody)
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

    const userAgent = req.headers.get('user-agent') || 'unknown'
    const ip = clientIp(req)

    const payload = {
      event_name,
      properties: {
        ...(properties || {}),
        _ip_snippet: ip ? ip.slice(0, 10) + '...' : null,
      },
      page_path: page_path || null,
      referrer: referrer || null,
      user_agent: userAgent.slice(0, 500),
      session_id: session_id || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin.from('analytics_events').insert(payload)

    if (error) {
      console.warn('[Analytics Event Error]', error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
