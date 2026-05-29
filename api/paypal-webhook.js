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
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
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

async function getOrCreateCliente(email, nombre) {
  const { data: existentes } = await supabase
    .from('clientes')
    .select('id, nombre, email')
    .eq('email', email)
    .limit(1)

  if (existentes?.[0]) return existentes[0].id

  const { data: nuevo } = await supabase
    .from('clientes')
    .insert({ email, nombre: nombre || null })
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

  console.log('[paypal-webhook] event:', body.event_type, '| id:', body.resource?.id)

  const eventType = body.event_type
  const resource = body.resource || {}

  if (eventType === 'CHECKOUT.ORDER.APPROVED') {
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
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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
      } catch (e) {
        console.error('[paypal-webhook] Email error:', e)
      }
    }
  }

  res.status(200).json({ ok: true })
}
