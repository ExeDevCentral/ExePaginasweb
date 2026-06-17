import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

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

async function captureOrder(orderId, token) {
  const resp = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`PayPal capture error: ${resp.status} ${err}`)
  }
  return resp.json()
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { orderId } = req.body || {}
  if (!orderId) return res.status(400).json({ error: 'orderId is required' })

  try {
    const token = await getPayPalAccessToken()
    const captured = await captureOrder(orderId, token)

    if (captured.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment not completed', status: captured.status })
    }

    const purchaseUnit = captured.purchase_units?.[0]
    const customId = purchaseUnit?.custom_id || ''
    const [planSlug, email, tipoProyecto] = customId.split('|')
    const amount = purchaseUnit?.amount?.value
    const payerName = captured.payer?.name?.given_name || ''
    const paypalOrderId = captured.id

    if (!email || !amount) {
      return res.status(400).json({ error: 'Missing email or amount in order' })
    }

    const clienteId = await getOrCreateCliente(email, payerName)
    if (!clienteId) {
      return res.status(500).json({ error: 'Could not create client' })
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

    if (pagoError) console.error('[capture-paypal] Error inserting pago:', pagoError)

    const { error: subError } = await supabase.from('suscripciones').insert({
      cliente_id: clienteId,
      plan_slug: plan?.slug || planSlug || 'mantenimiento-basico',
      estado: 'activa',
      fecha_inicio: new Date().toISOString(),
    })

    if (subError) console.error('[capture-paypal] Error inserting suscripcion:', subError)

    return res.status(200).json({
      ok: true,
      orderId: paypalOrderId,
      amount,
      plan: planNombre,
    })
  } catch (err) {
    console.error('[capture-paypal] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
