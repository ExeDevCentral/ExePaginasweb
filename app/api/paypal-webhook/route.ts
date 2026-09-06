import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseAdminConfigured, supabaseAdmin as db } from '@/lib/supabase/admin'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import { paymentConfirmation, paymentNotification } from '@/lib/email/templates.js'
import {
  claimWebhookEvent,
  markWebhookFailed,
  markWebhookProcessed,
} from '@/lib/server/webhookEvents'

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'

type PayPalPlan = { id: string; slug: string; nombre: string }
type PayPalCapture = {
  id?: string
  status?: string
  payer?: { email_address?: string; name?: { given_name?: string } }
  purchase_units?: PayPalPurchaseUnit[]
}
type PayPalPurchaseUnit = {
  custom_id?: string
  description?: string
  amount?: { value?: string; currency_code?: string }
  payments?: { captures?: PayPalCapture[] }
}
type PayPalResource = {
  id?: string
  amount?: { value?: string }
  custom_id?: string
  payer?: { email_address?: string; name?: { given_name?: string } }
  supplementary_data?: { related_ids?: { order_id?: string } }
}
type PayPalWebhookBody = {
  id: string
  event_type: string
  resource?: PayPalResource
}

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await resp.json()
  return data.access_token
}

async function getOrCreateCliente(email: string, fullName?: string): Promise<string | null> {
  if (!db) return null

  const { data: existentes } = await db
    .from('clientes')
    .select('id, nombre:full_name, email')
    .eq('email', email)
    .limit(1)

  if (existentes?.[0]) return existentes[0].id

  let id: string | null = null
  try {
    const { data: authUser } = await db.auth.admin.listUsers()
    const match = authUser?.users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase())
    id = match?.id || null
  } catch (e: unknown) {
    console.warn(
      '[paypal-webhook] No se pudo buscar en auth.users:',
      e instanceof Error ? e.message : 'Unknown auth error'
    )
  }

  if (!id) return null

  const { data: nuevo } = await db
    .from('clientes')
    .insert({ id, email, full_name: fullName || null })
    .select('id')
    .single()

  return nuevo?.id || id
}

async function getPlanBySlug(slug: string): Promise<PayPalPlan | null> {
  if (!db) return null

  const { data: planes } = await db
    .from('planes')
    .select('id, slug, nombre')
    .eq('slug', slug)
    .limit(1)

  return (planes?.[0] as PayPalPlan | undefined) || null
}

async function getOrCreateTenant(
  clienteId: string,
  email: string,
  plan: PayPalPlan | null
): Promise<string | null> {
  if (!db) return null

  const { data: existentes } = await db
    .from('tenants')
    .select('id')
    .eq('dueno_id', clienteId)
    .limit(1)

  if (existentes?.[0]) return existentes[0].id

  const baseSlug = (email || 'cliente')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
  const slug = `${baseSlug}-${clienteId.slice(0, 8)}`

  const { data: tenant, error: tenantError } = await db
    .from('tenants')
    .insert({
      slug,
      nombre: baseSlug || 'Mi Empresa',
      dueno_id: clienteId,
      estado: 'activo',
      plan_id: plan?.id || null,
      settings: { source: 'paypal-webhook' },
    })
    .select('id')
    .single()

  if (tenantError) console.error('[paypal-webhook] Error creating tenant:', tenantError)
  return tenant?.id || null
}

async function capturePayPalOrder(orderId: string, token: string): Promise<PayPalCapture | null> {
  const resp = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!resp.ok) {
    const err = await resp.text()
    console.error('[paypal-webhook] capture error:', resp.status, err)
    return null
  }

  return (await resp.json()) as PayPalCapture
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
    const paypalOrderId = resource.id
    const amount = resource.amount?.value
    console.log(`[paypal-webhook] Pago completado: ${paypalOrderId} - $${amount} USD`)
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
    const amount = resource.amount?.value
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

    const captured = await capturePayPalOrder(orderId, token)
    if (!captured || captured.status !== 'COMPLETED') {
      console.error('[paypal-webhook] capture failed or incomplete')
      return failProcessing('PayPal capture failed')
    }

    const purchaseUnit = captured.purchase_units?.[0]
    const customId = purchaseUnit?.custom_id || ''
    const [planSlug] = customId.split('|')
    const email = captured.payer?.email_address || customId.split('|')[1] || ''
    const tipoProyecto = customId.split('|')[2] || 'mantenimiento'
    const amount = purchaseUnit?.amount?.value
    const currency = purchaseUnit?.amount?.currency_code
    const payerName = captured.payer?.name?.given_name || ''
    const paypalOrderId = orderId
    const paypalCaptureId = purchaseUnit?.payments?.captures?.[0]?.id || captured.id

    if (
      !email ||
      !amount ||
      currency !== 'USD' ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      console.error('[paypal-webhook] missing email or amount')
      return failProcessing('PayPal payload is missing payment data')
    }

    const clienteId = await getOrCreateCliente(email, payerName)
    if (!clienteId) {
      console.error('[paypal-webhook] Could not get or create cliente')
      return failProcessing('Customer could not be resolved')
    }

    const plan = await getPlanBySlug(planSlug)
    if (!plan) return failProcessing('Unknown PayPal plan')
    const planNombre = plan?.nombre || purchaseUnit?.description || 'Plan'

    if (db) {
      const { data: pagoInsertado, error: pagoError } = await db
        .from('pagos')
        .insert({
          cliente_id: clienteId,
          monto: parseFloat(amount),
          moneda: 'USD',
          estado: 'aprobado',
          plan_nombre: planNombre,
          plan_slug: plan?.slug || planSlug || null,
          tipo_proyecto: tipoProyecto || 'mantenimiento',
          provider: 'paypal',
          paypal_order_id: paypalOrderId,
          paypal_capture_id: paypalCaptureId,
        })
        .select('id')
        .single()

      if (pagoError) console.error('[paypal-webhook] Error inserting pago:', pagoError)
      const pagoId = pagoInsertado?.id || null

      const { error: subError } = await db.from('suscripciones').insert({
        cliente_id: clienteId,
        plan_slug: plan?.slug || planSlug || 'mantenimiento-basico',
        estado: 'activa',
        fecha_inicio: new Date().toISOString(),
      })

      if (subError) console.error('[paypal-webhook] Error inserting suscripcion:', subError)

      const tenantId = await getOrCreateTenant(clienteId, email, plan)
      if (tenantId && pagoId) {
        try {
          const { data: invoiceResult, error: invoiceError } = await db.rpc(
            'create_invoice_from_payment',
            { p_pago_id: pagoId, p_tenant_id: tenantId }
          )
          if (invoiceError) console.error('[paypal-webhook] RPC error:', invoiceError)
          if (invoiceResult) console.log('[paypal-webhook] Invoice created:', invoiceResult)
        } catch (invoiceErr) {
          console.error('[paypal-webhook] Error creating invoice via RPC:', invoiceErr)
        }
      }
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://exepaginasweb.com'}/dashboard`

        await sendEmail({
          to: [email],
          subject: `Pago aprobado - ${planNombre}`,
          html: paymentConfirmation({
            name: payerName,
            plan: planNombre,
            amount,
            currency: 'USD',
            orderId: paypalOrderId,
            dashboardUrl,
          }),
        })

        await sendEmail({
          to: [ADMIN_EMAIL],
          subject: `Nueva venta! ${payerName || 'Un cliente'} compro ${planNombre}`,
          html: paymentNotification({
            name: payerName,
            email,
            plan: planNombre,
            slug: planSlug,
            amount,
            tipoProyecto,
            orderId: paypalOrderId,
          }),
        })
      } catch (e) {
        console.error('[paypal-webhook] Email error:', e)
      }
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
