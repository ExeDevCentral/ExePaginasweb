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
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import {
  PAYPAL_API_BASE,
  capturePayPalOrder,
  fetchPayPalOrder,
  getPayPalAccessToken,
  processPayPalCapture,
} from '@/lib/server/paypal'
import {
  claimWebhookEvent,
  markWebhookFailed,
  markWebhookProcessed,
} from '@/lib/server/webhookEvents'

async function verifyWebhookSignature(req, rawBody) {
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

async function findPagoByPaypalIds(captureId, orderId) {
  if (!db || (!captureId && !orderId)) return null

  const cols = 'id, cliente_id, plan_slug'
  if (captureId) {
    const { data: porCapture } = await db
      .from('pagos')
      .select(cols)
      .eq('paypal_capture_id', captureId)
      .limit(1)
    if (
      _optionalChain([porCapture, 'optionalAccess', (_) => _[0], 'optionalAccess', (_2) => _2.id])
    )
      return porCapture[0]
  }
  if (orderId) {
    const { data: porOrden } = await db
      .from('pagos')
      .select(cols)
      .eq('paypal_order_id', orderId)
      .limit(1)
    if (
      _optionalChain([porOrden, 'optionalAccess', (_3) => _3[0], 'optionalAccess', (_4) => _4.id])
    )
      return porOrden[0]
  }
  return null
}

async function cancelSuscripcionActiva(clienteId, planSlug) {
  if (!db || !clienteId) return
  const update = db
    .from('suscripciones')
    .update({ estado: 'cancelada', fecha_fin: new Date().toISOString() })
    .eq('cliente_id', clienteId)
    .eq('estado', 'activa')
  if (planSlug) update.eq('plan_slug', planSlug)
  await update
}

export const dynamic = 'force-dynamic'

export async function POST(req) {
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
  } catch (e2) {
    return NextResponse.json({ error: 'Body could not be read' }, { status: 400 })
  }

  let body
  try {
    body = JSON.parse(rawBody)
  } catch (e3) {
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

  const failProcessing = async (message) => {
    await markWebhookFailed('paypal', eventId, new Error(message))
    return NextResponse.json({ error: message }, { status: 503 })
  }

  const resource = body.resource || {}
  console.log(
    '[paypal-webhook] event:',
    eventType,
    '| id:',
    _optionalChain([resource, 'optionalAccess', (_5) => _5.id])
  )

  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId =
      _optionalChain([
        resource,
        'access',
        (_6) => _6.supplementary_data,
        'optionalAccess',
        (_7) => _7.related_ids,
        'optionalAccess',
        (_8) => _8.order_id,
      ]) || resource.id
    const amountValue = _optionalChain([
      resource,
      'access',
      (_9) => _9.amount,
      'optionalAccess',
      (_10) => _10.value,
    ])
    if (!amountValue) {
      console.error('[paypal-webhook] capture.completed missing amount:', orderId)
      return failProcessing('PayPal capture is missing amount')
    }
    const captured = {
      ...(orderId ? { id: orderId } : {}),
      status: 'COMPLETED',
      ...(resource.payer ? { payer: resource.payer } : {}),
      purchase_units: [
        {
          ...(resource.custom_id ? { custom_id: resource.custom_id } : {}),
          amount: { value: amountValue, currency_code: 'USD' },
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
    const captureId = resource.id
    const orderId = _optionalChain([
      resource,
      'access',
      (_11) => _11.supplementary_data,
      'optionalAccess',
      (_12) => _12.related_ids,
      'optionalAccess',
      (_13) => _13.order_id,
    ])
    const email =
      _optionalChain([
        resource,
        'access',
        (_14) => _14.payer,
        'optionalAccess',
        (_15) => _15.email_address,
      ]) ||
      _optionalChain([
        resource,
        'access',
        (_16) => _16.custom_id,
        'optionalAccess',
        (_17) => _17.split,
        'call',
        (_18) => _18('|'),
        'optionalAccess',
        (_19) => _19[1],
      ])
    console.error(`[paypal-webhook] Pago DENEGADO: ${captureId || orderId} - ${email}`)
    if (db) {
      if (email) {
        const { data: clientes } = await db
          .from('clientes')
          .select('id')
          .eq('email', email)
          .limit(1)
        if (_optionalChain([clientes, 'optionalAccess', (_20) => _20[0]])) {
          await db.from('notificaciones').insert({
            cliente_id: clientes[0].id,
            mensaje: 'Tu pago por PayPal fue denegado. Revisá tu método de pago.',
            tipo: 'alerta',
          })
        }
      }
      const pago = await findPagoByPaypalIds(captureId, orderId)
      if (pago) {
        await db.from('pagos').update({ estado: 'rechazado' }).eq('id', pago.id)
        await cancelSuscripcionActiva(pago.cliente_id, pago.plan_slug)
      } else {
        console.warn('[paypal-webhook] DENIED: no matching payment found for', captureId || orderId)
      }
    }
  } else if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
    const captureId = resource.id
    const orderId = _optionalChain([
      resource,
      'access',
      (_21) => _21.supplementary_data,
      'optionalAccess',
      (_22) => _22.related_ids,
      'optionalAccess',
      (_23) => _23.order_id,
    ])
    const amount = _optionalChain([
      resource,
      'access',
      (_24) => _24.amount,
      'optionalAccess',
      (_25) => _25.value,
    ])
    console.log(`[paypal-webhook] Reembolso: ${captureId || orderId} - $${amount} USD`)
    if (db) {
      const pago = await findPagoByPaypalIds(captureId, orderId)
      if (pago) {
        await db.from('pagos').update({ estado: 'reembolsado' }).eq('id', pago.id)
        await cancelSuscripcionActiva(pago.cliente_id, pago.plan_slug)
      } else {
        console.warn(
          '[paypal-webhook] REFUNDED: no matching payment found for',
          captureId || orderId
        )
      }
    }
  } else if (eventType === 'CHECKOUT.ORDER.APPROVED') {
    const orderId = resource.id
    if (!orderId) return failProcessing('PayPal order ID is missing')
    const token = await getPayPalAccessToken()
    if (!token) return failProcessing('PayPal credentials are not configured')

    const captureResult = await capturePayPalOrder(orderId, token)
    let captured = null

    if (captureResult.ok) {
      captured = captureResult.order
    } else if (captureResult.alreadyCaptured) {
      // Hosted buttons / cards capturan la orden antes de que llegue el webhook.
      captured = await fetchPayPalOrder(orderId, token)
      if (!_optionalChain([captured, 'optionalAccess', (_26) => _26.id]))
        return failProcessing('PayPal order could not be fetched')
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
