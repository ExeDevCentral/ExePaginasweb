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

  console.log('[mp-webhook] event:', body.action || body.type, '| id:', body.data?.id)

  const paymentId = body.data?.id || req.query.id
  if (!paymentId) return res.status(200).json({ ok: true })

  try {
    const mpResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    })
    if (!mpResp.ok) {
      console.error('[mp-webhook] Error fetching payment:', mpResp.status)
      return res.status(200).json({ ok: true })
    }

    const payment = await mpResp.json()
    console.log('[mp-webhook] payment status:', payment.status)

    if (payment.status !== 'approved') return res.status(200).json({ ok: true })

    const email = payment.payer?.email
    const monto = payment.transaction_amount
    const mpPaymentId = String(payment.id)
    const externalRef = payment.external_reference || ''
    const planSlug = externalRef.split('|')[0] || payment.metadata?.plan_slug || ''
    const payerName = payment.payer?.first_name || payment.payer?.last_name || ''

    if (!email) {
      console.error('[mp-webhook] No payer email')
      return res.status(200).json({ ok: true })
    }

    const clienteId = await getOrCreateCliente(email, payerName)
    if (!clienteId) {
      console.error('[mp-webhook] Could not get or create cliente')
      return res.status(200).json({ ok: true })
    }

    const plan = await getPlanBySlug(planSlug)
    const planNombre = plan?.nombre || payment.description || 'Plan'

    const { error: pagoError } = await supabase.from('pagos').insert({
      cliente_id: clienteId,
      monto,
      moneda: payment.currency_id || 'ARS',
      estado: 'aprobado',
      mp_payment_id: mpPaymentId,
      plan_nombre: planNombre,
      plan_slug: plan?.slug || planSlug || null,
    })

    if (pagoError) console.error('[mp-webhook] Error inserting pago:', pagoError)

    const { error: subError } = await supabase.from('suscripciones').insert({
      cliente_id: clienteId,
      plan_slug: plan?.slug || planSlug || 'mantenimiento-basico',
      estado: 'activa',
      fecha_inicio: new Date().toISOString(),
    })

    if (subError) console.error('[mp-webhook] Error inserting suscripcion:', subError)

    // Notificación email
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
              <p>Tu pago por <strong>${planNombre}</strong> fue procesado correctamente.</p>
              <p style="font-size:24px;font-weight:bold;">$${monto} ${payment.currency_id || 'ARS'}</p>
              <p>Ya podés acceder a tu plan desde tu panel.</p>
              <a href="${process.env.VITE_SITE_URL || 'https://exepaginasweb.com'}/dashboard"
                 style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#00d4ff,#ff00ff);color:#000;text-decoration:none;border-radius:12px;font-weight:bold;margin-top:16px;">
                Ir al Dashboard
              </a>
            </div>`,
          }),
        })
      } catch (e) {
        console.error('[mp-webhook] Email error:', e)
      }
    }
  } catch (err) {
    console.error('[mp-webhook] Error:', err)
  }

  res.status(200).json({ ok: true })
}
