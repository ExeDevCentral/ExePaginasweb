/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import {
  PAYPAL_API_BASE,
  capturePayPalOrder,
  fetchPayPalOrder,
  getPayPalAccessToken,
  processPayPalCapture,
  type PayPalCapturedOrder,
} from '@/lib/server/paypal'
import {
  claimWebhookEvent,
  markWebhookFailed,
  markWebhookProcessed,
} from '@/lib/server/webhookEvents'

type PayPalCaptureEventResource = {
  id?: string
  status?: string
  amount?: { value?: string; total?: string; currency_code?: string }
  custom_id?: string
  payer?: { email_address?: string; name?: { given_name?: string } }
  supplementary_data?: { related_ids?: { order_id?: string } }
}
type PayPalOrderEventResource = {
  id?: string
}
type PayPalWebhookBody = {
  id: string
  event_type: string
  resource?: PayPalCaptureEventResource & PayPalOrderEventResource
}

async function verifyWebhookSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.error('[paypal-webhook] PAYPAL_WEBHOOK_ID not set — REJECTING webhook for security')
    return false
  }

  try {
    const token = await getPayPalAccessToken()
    if (!token) return false

    const resp = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: req.headers.get('paypal-auth-algo'),
        cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'),
        transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'),
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody),
      }),
    })
    const result = await resp.json()
    return result.verification_status === 'SUCCESS'
  } catch (e) {
    console.error('[paypal-webhook] Verification error:', e)
    return false
  }
}

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!process.env.PAYPAL_WEBHOOK_ID) {
    console.error('[paypal-webhook] PAYPAL_WEBHOOK_ID not configured')
    return NextResponse.json(
      { error: 'Webhook verification is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  if (!isSupabaseAdminConfigured()) {
    console.error('[paypal-webhook] Supabase admin client is not configured')
    return NextResponse.json(
      { error: 'Payment processing is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  let rawBody = ''
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Body could not be read' }, { status: 400 })
  }

  let body: PayPalWebhookBody
  try {
    body = JSON.parse(rawBody) as PayPalWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  if (!body || typeof body.event_type !== 'string' || typeof body.id !== 'string') {
    return NextResponse.json({ error: 'Invalid webhook event' }, { status: 400 })
  }

  const verified = await verifyWebhookSignature(req, rawBody)
  if (!verified) {
    console.error('[paypal-webhook] Unverified webhook, rejecting')
    return NextResponse.json({ error: 'webhook verification failed' }, { status: 403 })
  }

  const eventType = body.event_type
  const eventId = body.id
  try {
    const claimed = await claimWebhookEvent('paypal', eventId, eventType, body)
    if (!claimed) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
  } catch (claimError) {
    console.error('[paypal-webhook] Failed to claim event:', claimError)
    return NextResponse.json({ error: 'Webhook storage unavailable' }, { status: 503 })
  }

  const failProcessing = async (message: string) => {
    await markWebhookFailed('paypal', eventId, new Error(message))
    return NextResponse.json({ error: message }, { status: 503 })
  }

  const resource = body.resource || {}
  console.log('[paypal-webhook] event:', eventType, '| id:', resource?.id)

  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id
    const amountValue = resource.amount?.value || resource.amount?.total
    const captured: PayPalCapturedOrder = {
      ...(orderId ? { id: orderId } : {}),
      status: 'COMPLETED',
      ...(resource.payer ? { payer: resource.payer } : {}),
      purchase_units: [
        {
          ...(resource.custom_id ? { custom_id: resource.custom_id } : {}),
          amount: amountValue
            ? { value: amountValue, currency_code: 'USD' }
            : { currency_code: 'USD' },
          payments: {
            captures: resource.id
              ? [{ id: resource.id, status: 'COMPLETED' }]
              : [{ status: 'COMPLETED' }],
          },
        },
      ],
    }
    console.log(`[paypal-webhook] Pago completado: ${orderId} - $${amountValue} USD`)

    const result = await processPayPalCapture(captured)
    if (!result.ok) {
      console.error('[paypal-webhook] capture.completed processing failed:', result.error)
      return failProcessing(result.error)
    }
  } else if (eventType === 'PAYMENT.CAPTURE.DENIED') {
    const paypalOrderId = resource.id
    const email = resource.payer?.email_address || resource.custom_id?.split('|')?.[1]
    console.error(`[paypal-webhook] Pago DENEGADO: ${paypalOrderId} - ${email}`)
    if (email && db) {
      const { data: clientes } = await db.from('clientes').select('id').eq('email', email).limit(1)
      if (clientes?.[0]) {
        await db.from('notificaciones').insert({
          cliente_id: clientes[0].id,
          mensaje: 'Tu pago por PayPal fue denegado. Revisá tu método de pago.',
          tipo: 'alerta',
        })
      }
    }
  } else if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
    const paypalCaptureId = resource.id
    const amount = resource.amount?.value || resource.amount?.total
    console.log(`[paypal-webhook] Reembolso: ${paypalCaptureId} - $${amount} USD`)
    if (db) {
      const { data: pagos } = await db
        .from('pagos')
        .select('cliente_id, plan_slug, paypal_order_id, paypal_capture_id')
        .eq('paypal_capture_id', paypalCaptureId)
        .limit(1)
      if (pagos?.[0]) {
        await db
          .from('pagos')
          .update({ estado: 'reembolsado' })
          .eq('paypal_capture_id', paypalCaptureId)
        const subscriptionUpdate = db
          .from('suscripciones')
          .update({ estado: 'cancelada', fecha_fin: new Date().toISOString() })
          .eq('cliente_id', pagos[0].cliente_id)
          .eq('estado', 'activa')
        if (pagos[0].plan_slug) subscriptionUpdate.eq('plan_slug', pagos[0].plan_slug)
        await subscriptionUpdate
      }
    }
  } else if (eventType === 'CHECKOUT.ORDER.APPROVED') {
    const orderId = resource.id
    if (!orderId) return failProcessing('PayPal order ID is missing')
    const token = await getPayPalAccessToken()
    if (!token) return failProcessing('PayPal credentials are not configured')

    const captureResult = await capturePayPalOrder(orderId, token)
    let captured: PayPalCapturedOrder | null = null

    if (captureResult.ok) {
      captured = captureResult.order
    } else if (captureResult.alreadyCaptured) {
      // Hosted buttons / cards capturan la orden antes de que llegue el webhook.
      captured = await fetchPayPalOrder(orderId, token)
      if (!captured?.id) return failProcessing('PayPal order could not be fetched')
    } else {
      console.error('[paypal-webhook] capture failed:', captureResult.status, captureResult.error)
      return failProcessing('PayPal capture failed')
    }

    if (captured.status !== 'COMPLETED') {
      console.error('[paypal-webhook] captured order not completed:', captured.status)
      return failProcessing('PayPal capture failed')
    }

    const result = await processPayPalCapture(captured)
    if (!result.ok) {
      console.error('[paypal-webhook] approved processing failed:', result.error)
      return failProcessing(result.error)
    }
  }

  try {
    await markWebhookProcessed('paypal', eventId)
  } catch (processError) {
    await markWebhookFailed('paypal', eventId, processError)
    return NextResponse.json(
      { error: 'Webhook processing could not be confirmed' },
      { status: 503 }
    )
  }

  return NextResponse.json({ ok: true })
}
