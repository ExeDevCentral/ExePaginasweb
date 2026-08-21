import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as db } from '@/lib/supabase/admin'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email/send.js'
import { paymentConfirmation, paymentNotification } from '@/lib/email/templates.js'

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'

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
  } catch (e: any) {
    console.warn('[paypal-webhook] No se pudo buscar en auth.users:', e.message)
  }

  if (!id) return null

  const { data: nuevo } = await db
    .from('clientes')
    .insert({ id, email, full_name: fullName || null })
    .select('id')
    .single()

  return nuevo?.id || id
}

async function getPlanBySlug(slug: string): Promise<any> {
  if (!db) return null

  const { data: planes } = await db
    .from('planes')
    .select('id, slug, nombre')
    .eq('slug', slug)
    .limit(1)

  if (planes?.[0]) return planes[0]

  const { data: porNombre } = await db
    .from('planes')
    .select('id, slug, nombre')
    .ilike('nombre', `%${slug}%`)
    .limit(1)

  return porNombre?.[0] || null
}

async function getOrCreateTenant(
  clienteId: string,
  email: string,
  plan: any
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

async function capturePayPalOrder(orderId: string, token: string): Promise<any> {
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

  return resp.json()
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
  let rawBody = ''
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Body could not be read' }, { status: 400 })
  }

  let body: any
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: true })
  }

  // Only enforce signature if PAYPAL_WEBHOOK_ID is set in production
  if (process.env.PAYPAL_WEBHOOK_ID) {
    const verified = await verifyWebhookSignature(req, rawBody)
    if (!verified) {
      console.error('[paypal-webhook] Unverified webhook, rejecting')
      return NextResponse.json({ error: 'webhook verification failed' }, { status: 403 })
    }
  }

  const eventType = body.event_type
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
    const paypalOrderId = resource.id
    const amount = resource.amount?.value
    console.log(`[paypal-webhook] Reembolso: ${paypalOrderId} - $${amount} USD`)
    if (db) {
      const { data: pagos } = await db
        .from('pagos')
        .select('cliente_id')
        .eq('paypal_order_id', paypalOrderId)
        .limit(1)
      if (pagos?.[0]) {
        await db
          .from('pagos')
          .update({ estado: 'reembolsado' })
          .eq('paypal_order_id', paypalOrderId)
        await db
          .from('suscripciones')
          .update({ estado: 'cancelada', fecha_fin: new Date().toISOString() })
          .eq('cliente_id', pagos[0].cliente_id)
          .eq('estado', 'activa')
      }
    }
  } else if (eventType === 'CHECKOUT.ORDER.APPROVED') {
    const orderId = resource.id
    const token = await getPayPalAccessToken()
    if (!token) return NextResponse.json({ ok: true })

    const captured = await capturePayPalOrder(orderId, token)
    if (!captured || captured.status !== 'COMPLETED') {
      console.error('[paypal-webhook] capture failed or incomplete')
      return NextResponse.json({ ok: true })
    }

    const purchaseUnit = captured.purchase_units?.[0]
    const customId = purchaseUnit?.custom_id || ''
    const [planSlug] = customId.split('|')
    const email = captured.payer?.email_address || customId.split('|')[1] || ''
    const tipoProyecto = customId.split('|')[2] || 'mantenimiento'
    const amount = purchaseUnit?.amount?.value
    const payerName = captured.payer?.name?.given_name || ''
    const paypalOrderId = captured.id

    if (!email || !amount) {
      console.error('[paypal-webhook] missing email or amount')
      return NextResponse.json({ ok: true })
    }

    const clienteId = await getOrCreateCliente(email, payerName)
    if (!clienteId) {
      console.error('[paypal-webhook] Could not get or create cliente')
      return NextResponse.json({ ok: true })
    }

    const plan = await getPlanBySlug(planSlug)
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

  return NextResponse.json({ ok: true })
}
