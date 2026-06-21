import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export const config = { api: { bodyParser: false } }

function buffer(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

function setCorsHeaders(res) {
  const origin = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://exepaginasweb.com'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const resp = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
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

async function getOrCreateCliente(email, fullName) {
  const { data: existentes } = await supabase
    .from('clientes')
    .select('id, nombre as full_name, email')
    .eq('email', email)
    .limit(1)

  if (existentes?.[0]) return existentes[0].id

  const { data: nuevo } = await supabase
    .from('clientes')
    .insert({ email, nombre: fullName || null })
    .select('id')
    .single()

  return nuevo?.id
}

async function getPlanBySlug(slug) {
  const { data: planes } = await supabase
    .from('planes')
    .select('slug, nombre')
    .eq('slug', slug)
    .limit(1)

  if (planes?.[0]) return planes[0]

  const { data: porNombre } = await supabase
    .from('planes')
    .select('slug, nombre')
    .ilike('nombre', `%${slug}%`)
    .limit(1)

  return porNombre?.[0] || null
}

async function capturePayPalOrder(orderId, token) {
  const resp = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
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

async function verifyWebhookSignature(req, rawBody) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) return true

  try {
    const token = await getPayPalAccessToken()
    const resp = await fetch('https://api-m.paypal.com/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: req.headers['paypal-auth-algo'],
        cert_url: req.headers['paypal-cert-url'],
        transmission_id: req.headers['paypal-transmission-id'],
        transmission_sig: req.headers['paypal-transmission-sig'],
        transmission_time: req.headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(rawBody.toString()),
      }),
    })
    const result = await resp.json()
    if (result.verification_status !== 'SUCCESS') {
      console.error('[paypal-webhook] Signature verification FAILED:', result.verification_status)
      return false
    }
    return true
  } catch (e) {
    console.error('[paypal-webhook] Verification error:', e)
    return false
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const raw = await buffer(req)
  let body
  try {
    body = JSON.parse(raw.toString())
  } catch {
    return res.status(200).json({ ok: true })
  }

  const verified = await verifyWebhookSignature(req, raw)
  if (!verified) {
    console.error('[paypal-webhook] Unverified webhook, rejecting')
    return res.status(403).json({ error: 'webhook verification failed' })
  }

  console.log('[paypal-webhook] event:', body.event_type, '| id:', body.resource?.id)

  const eventType = body.event_type
  const resource = body.resource || {}

  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const paypalOrderId = resource.id
    const amount = resource.amount?.value
    const email = resource.payer?.email_address || resource.custom_id?.split('|')?.[1]
    console.log(`[paypal-webhook] Pago completado: ${paypalOrderId} - $${amount} USD`)
  } else if (eventType === 'PAYMENT.CAPTURE.DENIED') {
    const paypalOrderId = resource.id
    const email = resource.payer?.email_address || resource.custom_id?.split('|')?.[1]
    console.error(`[paypal-webhook] Pago DENEGADO: ${paypalOrderId} - ${email}`)
    if (email) {
      const { data: clientes } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', email)
        .limit(1)
      if (clientes?.[0]) {
        await supabase.from('notificaciones').insert({
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
    const { data: pagos } = await supabase
      .from('pagos')
      .select('cliente_id')
      .eq('paypal_order_id', paypalOrderId)
      .limit(1)
    if (pagos?.[0]) {
      await supabase
        .from('pagos')
        .update({ estado: 'reembolsado' })
        .eq('paypal_order_id', paypalOrderId)
      await supabase
        .from('suscripciones')
        .update({ estado: 'cancelada', fecha_fin: new Date().toISOString() })
        .eq('cliente_id', pagos[0].cliente_id)
        .eq('estado', 'activa')
    }
  } else if (eventType === 'CHECKOUT.ORDER.APPROVED') {
    const orderId = resource.id
    const token = await getPayPalAccessToken()
    const captured = await capturePayPalOrder(orderId, token)

    if (!captured || captured.status !== 'COMPLETED') {
      console.error('[paypal-webhook] capture failed or incomplete')
      return res.status(200).json({ ok: true })
    }

    const purchaseUnit = captured.purchase_units?.[0]
    const customId = purchaseUnit?.custom_id || ''
    const [planSlug, email, tipoProyecto] = customId.split('|')
    const amount = purchaseUnit?.amount?.value
    const payerName = captured.payer?.name?.given_name || ''
    const paypalOrderId = captured.id

    if (!email || !amount) {
      console.error('[paypal-webhook] missing email or amount')
      return res.status(200).json({ ok: true })
    }

    const clienteId = await getOrCreateCliente(email, payerName)
    if (!clienteId) {
      console.error('[paypal-webhook] Could not get or create cliente')
      return res.status(200).json({ ok: true })
    }

    const plan = await getPlanBySlug(planSlug)
    const planNombre = plan?.nombre || purchaseUnit?.description || 'Plan'

    const { error: pagoError } = await supabase.from('pagos').insert({
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

    if (pagoError) console.error('[paypal-webhook] Error inserting pago:', pagoError)

    const { error: subError } = await supabase.from('suscripciones').insert({
      cliente_id: clienteId,
      plan_slug: plan?.slug || planSlug || 'mantenimiento-basico',
      estado: 'activa',
      fecha_inicio: new Date().toISOString(),
    })

    if (subError) console.error('[paypal-webhook] Error inserting suscripcion:', subError)

    if (process.env.RESEND_API_KEY) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

        // 1. Email de confirmación para el cliente
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: `✅ Pago aprobado - ${planNombre}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <h1 style="color:#00d4ff;">¡Pago aprobado!</h1>
              <p>Hola <strong>${payerName || ''}</strong>,</p>
              <p>Tu pago por <strong>${planNombre}</strong> fue procesado correctamente via PayPal.</p>
              <p style="font-size:24px;font-weight:bold;">$${amount} USD</p>
              <p>Ya podés acceder a tu plan desde tu panel.</p>
              <a href="${process.env.VITE_SITE_URL || 'https://exepaginasweb.com'}/dashboard"
                 style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#00d4ff,#ff00ff);color:#000;text-decoration:none;border-radius:12px;font-weight:bold;margin-top:16px;">
                Ir al Dashboard
              </a>
            </div>`,
          }),
        })

        // 2. Email de notificación para el administrador
        const adminEmail = 'exemetal@hotmail.com'
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [adminEmail],
            subject: `🚨 ¡Nueva venta! ${payerName || 'Un cliente'} compró ${planNombre}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:12px;">
              <h1 style="color:#ff00ff;margin-bottom:20px;">¡Nueva suscripción recibida! 🚀</h1>
              <p>Se ha registrado una nueva venta a través de PayPal:</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">Cliente:</td><td style="padding:10px;border-bottom:1px solid #eee;">${payerName || 'N/A'}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">Email:</td><td style="padding:10px;border-bottom:1px solid #eee;">${email}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">Plan:</td><td style="padding:10px;border-bottom:1px solid #eee;">${planNombre} (${planSlug})</td></tr>
                <tr><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">Proyecto:</td><td style="padding:10px;border-bottom:1px solid #eee;">${tipoProyecto || 'mantenimiento'}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">Monto Pagado:</td><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#22c55e;">$${amount} USD</td></tr>
                <tr><td style="padding:10px;font-weight:bold;border-bottom:1px solid #eee;">ID Orden PayPal:</td><td style="padding:10px;border-bottom:1px solid #eee;font-family:monospace;font-size:12px;">${paypalOrderId}</td></tr>
              </table>
              <p style="margin-top:20px;">Los datos ya fueron guardados en la base de datos de Supabase y el plan del cliente se encuentra activo.</p>
            </div>`,
          }),
        })
      } catch (e) {
        console.error('[paypal-webhook] Email error:', e)
      }
    }
  }

  res.status(200).json({ ok: true })
}
